from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class OtpSendRequest(BaseModel):
    phone_number: str


class OtpVerifyRequest(BaseModel):
    phone_number: str
    code: str
