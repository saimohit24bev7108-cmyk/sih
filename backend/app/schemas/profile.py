from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr


class CustomerProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    name: str | None = None


class CustomerProfilePatch(BaseModel):
    name: str | None = None


class WorkerProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    name: str | None = None
    skills: list[str] | None = None
    experience_years: int | None = None
    rating: float | None = None
    verification_status: str | None = None
    current_location: str | None = None


class WorkerProfilePatch(BaseModel):
    name: str | None = None
    skills: list[str] | None = None
    experience_years: int | None = None
    current_location: str | None = None


class UserMeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    phone_number: str | None = None
    role: str
    is_active: bool
    customer_profile: CustomerProfileResponse | None = None
    worker_profile: WorkerProfileResponse | None = None


class UserMePatch(BaseModel):
    email: EmailStr | None = None
    phone_number: str | None = None


class ServiceCategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None = None
    icon_name: str | None = None


class WorkerSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    name: str | None = None
    skills: list[str] | None = None
    experience_years: int | None = None
    rating: float | None = None
    verification_status: str | None = None


class AdminVerifyRequest(BaseModel):
    status: Literal["approved", "rejected"]
