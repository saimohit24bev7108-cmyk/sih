from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class BookingCreate(BaseModel):
    service_request_id: int
    worker_id: Optional[int] = None


class BookingStatusUpdate(BaseModel):
    status: str
    version: int


class BookingCancelRequest(BaseModel):
    cancellation_reason: str
    version: int


class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    service_request_id: int
    customer_id: int
    worker_id: Optional[int] = None
    status: str
    version: int
    price_estimate_min: Optional[float] = None
    price_estimate_max: Optional[float] = None
    requested_at: Optional[datetime] = None
    accepted_at: Optional[datetime] = None
    arrived_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    cancellation_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class BookingStatusHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    booking_id: int
    from_status: str
    to_status: str
    changed_by_user_id: Optional[int] = None
    changed_at: datetime
