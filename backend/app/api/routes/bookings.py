from typing import List

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.api.deps import get_current_user, require_customer, require_worker
from app.core.booking_state_machine import validate_transition
from app.core.idempotency import get_or_create_idempotent_response
from app.core.responses import ApiResponse
from app.db.session import get_db
from app.models.booking import Booking
from app.models.booking_status_history import BookingStatusHistory
from app.models.user import User
from app.schemas.booking import (
    BookingCancelRequest,
    BookingCreate,
    BookingResponse,
    BookingStatusUpdate,
)


router = APIRouter(prefix="/api/bookings", tags=["bookings"])


def _add_status_history(db: Session, booking_id: int, from_status: str, to_status: str, user_id: int):
    history = BookingStatusHistory(
        booking_id=booking_id,
        from_status=from_status,
        to_status=to_status,
        changed_by_user_id=user_id
    )
    db.add(history)


@router.post("", response_model=ApiResponse[BookingResponse])
def create_booking(
    payload: BookingCreate,
    request: Request,
    idempotency_key: str | None = Header(None, alias="Idempotency-Key"),
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    def _create_booking_handler():
        # Check if booking already exists for this request
        existing_booking = db.query(Booking).filter(Booking.service_request_id == payload.service_request_id).first()
        if existing_booking:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Booking already exists for this request")
            
        new_booking = Booking(
            service_request_id=payload.service_request_id,
            customer_id=current_user.id,
            worker_id=payload.worker_id,
            status="REQUESTED",
            version=1
        )
        db.add(new_booking)
        db.flush()
        
        _add_status_history(db, new_booking.id, "NONE", "REQUESTED", current_user.id)
        
        db.commit()
        db.refresh(new_booking)
        return ApiResponse(success=True, message="Booking created", data=BookingResponse.model_validate(new_booking))

    if idempotency_key:
        return get_or_create_idempotent_response(
            db=db,
            key=idempotency_key,
            user_id=current_user.id,
            endpoint="POST /api/bookings",
            request_body=payload.model_dump(),
            handler_fn=_create_booking_handler
        )
    else:
        return _create_booking_handler()


@router.get("", response_model=ApiResponse[List[BookingResponse]])
def list_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == "customer":
        bookings = db.query(Booking).filter(Booking.customer_id == current_user.id).all()
    elif current_user.role == "worker":
        bookings = db.query(Booking).filter(
            or_(Booking.worker_id == current_user.id, Booking.worker_id == None)
        ).all()
    else:
        bookings = []
        
    payload = [BookingResponse.model_validate(b) for b in bookings]
    return ApiResponse(success=True, message="Bookings retrieved", data=payload)


@router.get("/{booking_id}", response_model=ApiResponse[BookingResponse])
def get_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        
    if current_user.role not in ["admin"] and booking.customer_id != current_user.id and booking.worker_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    return ApiResponse(success=True, message="Booking details", data=BookingResponse.model_validate(booking))


@router.post("/{booking_id}/accept", response_model=ApiResponse[BookingResponse])
def accept_booking(
    booking_id: int,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db),
):
    try:
        # SELECT ... FOR UPDATE
        # Note: SQLite does not fully support row-level locks like postgres, but we implement the logic
        booking = db.query(Booking).with_for_update().filter(Booking.id == booking_id).first()
        
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
            
        if booking.status != "REQUESTED" or booking.worker_id is not None:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Booking is no longer available")
            
        # Validate transition structurally
        validate_transition(booking.status, "ACCEPTED", current_user.role)
        
        from_status = booking.status
        booking.worker_id = current_user.id
        booking.status = "ACCEPTED"
        booking.version += 1
        booking.accepted_at = db.execute(db.query(Booking).statement.with_only_columns(Booking.updated_at).subquery().select()).scalar() # Simplified in next lines
        
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        booking.accepted_at = now
        
        _add_status_history(db, booking.id, from_status, "ACCEPTED", current_user.id)
        
        db.commit()
        db.refresh(booking)
        
        return ApiResponse(success=True, message="Booking accepted", data=BookingResponse.model_validate(booking))
    except Exception as e:
        db.rollback()
        raise e


@router.post("/{booking_id}/reject", response_model=ApiResponse[dict])
def reject_booking(
    booking_id: int,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        
    if booking.status != "REQUESTED":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Can only reject requested bookings")
        
    # Log rejection (e.g., in a separate table or worker metrics) without changing booking status
    # For now, we just return success
    return ApiResponse(success=True, message="Booking rejected by worker", data={"booking_id": booking_id})


@router.patch("/{booking_id}/status", response_model=ApiResponse[BookingResponse])
def update_booking_status(
    booking_id: int,
    payload: BookingStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        
    if current_user.role == "customer" and booking.customer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    if current_user.role == "worker" and booking.worker_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Optimistic locking
    if booking.version != payload.version:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Booking version mismatch")
        
    validate_transition(booking.status, payload.status, current_user.role)
    
    from_status = booking.status
    booking.status = payload.status
    booking.version += 1
    
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    
    if payload.status == "WORKER_ON_THE_WAY":
        pass
    elif payload.status == "ARRIVED":
        booking.arrived_at = now
    elif payload.status == "IN_PROGRESS":
        booking.started_at = now
    elif payload.status == "COMPLETED":
        booking.completed_at = now

    _add_status_history(db, booking.id, from_status, payload.status, current_user.id)
    
    db.commit()
    db.refresh(booking)
    
    return ApiResponse(success=True, message="Booking status updated", data=BookingResponse.model_validate(booking))


@router.post("/{booking_id}/cancel", response_model=ApiResponse[BookingResponse])
def cancel_booking(
    booking_id: int,
    payload: BookingCancelRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        
    if current_user.role == "customer" and booking.customer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    if current_user.role == "worker" and booking.worker_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    # Optimistic locking
    if booking.version != payload.version:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Booking version mismatch")

    validate_transition(booking.status, "CANCELLED", current_user.role)
    
    from_status = booking.status
    booking.status = "CANCELLED"
    booking.cancellation_reason = payload.cancellation_reason
    booking.version += 1
    
    from datetime import datetime, timezone
    booking.cancelled_at = datetime.now(timezone.utc)
    
    _add_status_history(db, booking.id, from_status, "CANCELLED", current_user.id)
    
    db.commit()
    db.refresh(booking)
    
    return ApiResponse(success=True, message="Booking cancelled", data=BookingResponse.model_validate(booking))
