from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_admin, require_customer, require_worker
from app.core.responses import ApiResponse
from app.db.session import get_db
from app.models.customer_profile import CustomerProfile
from app.models.service_category import ServiceCategory
from app.models.user import User
from app.models.worker_profile import WorkerProfile
from app.schemas.profile import (
    AdminVerifyRequest,
    CustomerProfilePatch,
    CustomerProfileResponse,
    ServiceCategoryResponse,
    UserMePatch,
    UserMeResponse,
    WorkerProfilePatch,
    WorkerProfileResponse,
    WorkerSummaryResponse,
)

router = APIRouter(prefix="/api", tags=["profiles"])


@router.get("/users/me", response_model=ApiResponse[UserMeResponse])
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_user = db.query(User).filter(User.id == current_user.id).first()
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    profile_payload = UserMeResponse(
        id=db_user.id,
        email=db_user.email,
        phone_number=db_user.phone_number,
        role=db_user.role,
        is_active=db_user.is_active,
        customer_profile=(
            CustomerProfileResponse.model_validate(db_user.customer_profile)
            if db_user.customer_profile is not None
            else None
        ),
        worker_profile=(
            WorkerProfileResponse.model_validate(db_user.worker_profile)
            if db_user.worker_profile is not None
            else None
        ),
    )
    return ApiResponse(success=True, message="Current user profile", data=profile_payload)


@router.patch("/users/me", response_model=ApiResponse[UserMeResponse])
def patch_current_user_profile(
    payload: UserMePatch,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.email is not None and payload.email != current_user.email:
        existing = db.query(User).filter(User.email == str(payload.email)).first()
        if existing is not None and existing.id != current_user.id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use")
        current_user.email = str(payload.email)

    if payload.phone_number is not None and payload.phone_number != current_user.phone_number:
        existing = db.query(User).filter(User.phone_number == payload.phone_number).first()
        if existing is not None and existing.id != current_user.id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone number already in use")
        current_user.phone_number = payload.phone_number

    db.commit()
    db.refresh(current_user)
    return get_current_user_profile(current_user=current_user, db=db)


@router.get("/customer/profile", response_model=ApiResponse[CustomerProfileResponse])
def get_customer_profile(
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    profile = db.query(CustomerProfile).filter(CustomerProfile.user_id == current_user.id).first()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer profile not found")
    return ApiResponse(success=True, message="Customer profile", data=CustomerProfileResponse.model_validate(profile))


@router.patch("/customer/profile", response_model=ApiResponse[CustomerProfileResponse])
def patch_customer_profile(
    payload: CustomerProfilePatch,
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    profile = db.query(CustomerProfile).filter(CustomerProfile.user_id == current_user.id).first()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer profile not found")

    if payload.name is not None:
        profile.name = payload.name

    db.commit()
    db.refresh(profile)
    return ApiResponse(success=True, message="Customer profile updated", data=CustomerProfileResponse.model_validate(profile))


@router.get("/worker/profile", response_model=ApiResponse[WorkerProfileResponse])
def get_worker_profile(
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db),
):
    profile = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Worker profile not found")
    return ApiResponse(success=True, message="Worker profile", data=WorkerProfileResponse.model_validate(profile))


@router.patch("/worker/profile", response_model=ApiResponse[WorkerProfileResponse])
def patch_worker_profile(
    payload: WorkerProfilePatch,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db),
):
    profile = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Worker profile not found")

    if payload.name is not None:
        profile.name = payload.name
    if payload.skills is not None:
        profile.skills = payload.skills
    if payload.experience_years is not None:
        profile.experience_years = payload.experience_years
    if payload.current_location is not None:
        profile.current_location = payload.current_location

    db.commit()
    db.refresh(profile)
    return ApiResponse(success=True, message="Worker profile updated", data=WorkerProfileResponse.model_validate(profile))


@router.get("/services/categories", response_model=ApiResponse[list[ServiceCategoryResponse]])
def get_service_categories(db: Session = Depends(get_db)):
    categories = db.query(ServiceCategory).order_by(ServiceCategory.id.asc()).all()
    payload = [ServiceCategoryResponse.model_validate(category) for category in categories]
    return ApiResponse(success=True, message="Service categories", data=payload)


@router.get("/workers", response_model=ApiResponse[list[WorkerSummaryResponse]])
def list_workers(db: Session = Depends(get_db)):
    workers = db.query(WorkerProfile).order_by(WorkerProfile.id.asc()).all()
    payload = [WorkerSummaryResponse.model_validate(worker) for worker in workers]
    return ApiResponse(success=True, message="Workers", data=payload)


@router.get("/workers/{worker_id}", response_model=ApiResponse[WorkerSummaryResponse])
def get_worker_by_id(worker_id: int, db: Session = Depends(get_db)):
    profile = db.query(WorkerProfile).filter(WorkerProfile.id == worker_id).first()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Worker not found")
    return ApiResponse(success=True, message="Worker details", data=WorkerSummaryResponse.model_validate(profile))


@router.patch("/workers/me", response_model=ApiResponse[WorkerProfileResponse])
def patch_own_worker_profile(
    payload: WorkerProfilePatch,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db),
):
    return patch_worker_profile(payload=payload, current_user=current_user, db=db)


@router.get("/admin/workers/pending", response_model=ApiResponse[list[WorkerSummaryResponse]])
def list_pending_workers(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    workers = db.query(WorkerProfile).filter(WorkerProfile.verification_status == "pending").all()
    payload = [WorkerSummaryResponse.model_validate(worker) for worker in workers]
    return ApiResponse(success=True, message="Pending workers", data=payload)


@router.patch("/admin/workers/{worker_id}/verify", response_model=ApiResponse[WorkerSummaryResponse])
def verify_worker(
    worker_id: int,
    payload: AdminVerifyRequest,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    profile = db.query(WorkerProfile).filter(WorkerProfile.id == worker_id).first()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Worker not found")

    profile.verification_status = payload.status
    db.commit()
    db.refresh(profile)
    return ApiResponse(success=True, message="Worker verification status updated", data=WorkerSummaryResponse.model_validate(profile))
