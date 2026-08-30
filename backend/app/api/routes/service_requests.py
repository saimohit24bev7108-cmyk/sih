from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_customer
from app.core.responses import ApiResponse
from app.db.session import get_db
from app.models.service_request import ServiceRequest
from app.models.user import User
from app.schemas.service_request import ServiceRequestCreate, ServiceRequestResponse


router = APIRouter(prefix="/api/service-requests", tags=["service_requests"])


@router.post("", response_model=ApiResponse[ServiceRequestResponse])
def create_service_request(
    payload: ServiceRequestCreate,
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    # Location comes as Geography(POINT), so we format it
    location_wkt = f"POINT({payload.lng} {payload.lat})"

    new_request = ServiceRequest(
        customer_id=current_user.id,
        category_id=payload.category_id,
        description=payload.description,
        location=location_wkt,
        address_id=payload.address_id,
        status="open",
    )
    
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    response_data = ServiceRequestResponse.model_validate(new_request)
    return ApiResponse(success=True, message="Service request created", data=response_data)


@router.get("", response_model=ApiResponse[List[ServiceRequestResponse]])
def list_service_requests(
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    requests = db.query(ServiceRequest).filter(ServiceRequest.customer_id == current_user.id).all()
    payload = [ServiceRequestResponse.model_validate(req) for req in requests]
    return ApiResponse(success=True, message="Service requests retrieved", data=payload)


@router.get("/{request_id}", response_model=ApiResponse[ServiceRequestResponse])
def get_service_request(
    request_id: int,
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    service_request = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    
    if not service_request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service request not found")
        
    if service_request.customer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    return ApiResponse(
        success=True,
        message="Service request details",
        data=ServiceRequestResponse.model_validate(service_request)
    )
