from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ServiceRequestCreate(BaseModel):
    category_id: int
    description: Optional[str] = None
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    address_id: Optional[int] = None


class ServiceRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_id: int
    category_id: int
    description: Optional[str] = None
    address_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime
    # Note: location is Geography type, usually excluded or serialized separately if needed
