from typing import Literal

from pydantic import BaseModel, EmailStr, field_validator


class LoginRequest(BaseModel):
    email: EmailStr | None = None
    phone_number: str | None = None
    password: str
    role: Literal["customer", "worker", "admin"] | None = None

    @field_validator("phone_number")
    @classmethod
    def normalize_phone(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return value.strip()


class RegisterRequest(BaseModel):
    name: str | None = None
    email: EmailStr
    phone_number: str
    password: str
    role: Literal["customer", "worker"]

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return value


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class OtpSendRequest(BaseModel):
    phone_number: str
    purpose: Literal["login", "register", "password_reset"] = "login"


class OtpVerifyRequest(BaseModel):
    phone_number: str
    code: str
    purpose: Literal["login", "register", "password_reset"] = "login"
    role: Literal["customer", "worker"] | None = None
    email: EmailStr | None = None
    name: str | None = None
    password: str | None = None

    @field_validator("password")
    @classmethod
    def validate_optional_password(cls, value: str | None) -> str | None:
        if value is None:
            return None
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return value


class PasswordForgotRequest(BaseModel):
    email: EmailStr | None = None
    phone_number: str | None = None


class PasswordResetRequest(BaseModel):
    email: EmailStr | None = None
    phone_number: str | None = None
    code: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return value
