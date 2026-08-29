import uuid
from datetime import datetime, timedelta, timezone
from typing import Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.responses import ApiResponse
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_token,
    verify_password,
)
from app.db.session import get_db
from app.models.token import RefreshToken
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    OtpSendRequest,
    OtpVerifyRequest,
    RefreshRequest,
    TokenResponse,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# In-memory OTP store — mocked for MVP only. Replace with a real store
# (Redis/DB with expiry) before any real SMS provider is wired in.
_otp_store: Dict[str, str] = {}


def _issue_token_pair(db: Session, user: User, family_id: Optional[str] = None) -> TokenResponse:
    access_token = create_access_token(user.id, user.role)
    raw_refresh = create_refresh_token()
    family = family_id or str(uuid.uuid4())

    record = RefreshToken(
        user_id=user.id,
        token_hash=hash_token(raw_refresh),
        family_id=family,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(record)
    db.commit()

    return TokenResponse(access_token=access_token, refresh_token=raw_refresh)


@router.post("/login", response_model=ApiResponse[TokenResponse])
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")

    tokens = _issue_token_pair(db, user)
    return ApiResponse(success=True, message="Login successful", data=tokens)


@router.post("/refresh", response_model=ApiResponse[TokenResponse])
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    incoming_hash = hash_token(payload.refresh_token)
    record = db.query(RefreshToken).filter(RefreshToken.token_hash == incoming_hash).first()

    if record is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if record.revoked:
        # Reuse of an already-rotated token — treat the whole family as compromised.
        db.query(RefreshToken).filter(RefreshToken.family_id == record.family_id).update(
            {"revoked": True}
        )
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token reuse detected — session revoked, please log in again",
        )

    if record.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    user = db.query(User).filter(User.id == record.user_id).first()
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    # Rotate: revoke the presented token, issue a new one in the same family.
    access_token = create_access_token(user.id, user.role)
    raw_refresh = create_refresh_token()
    new_hash = hash_token(raw_refresh)

    record.revoked = True
    record.replaced_by_token_hash = new_hash

    new_record = RefreshToken(
        user_id=user.id,
        token_hash=new_hash,
        family_id=record.family_id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(new_record)
    db.commit()

    tokens = TokenResponse(access_token=access_token, refresh_token=raw_refresh)
    return ApiResponse(success=True, message="Token refreshed", data=tokens)


@router.post("/otp/send", response_model=ApiResponse[dict])
def send_otp(payload: OtpSendRequest):
    # Mocked: always issues the same fixed code and "pretends" to send an SMS.
    code = "123456"
    _otp_store[payload.phone_number] = code
    return ApiResponse(
        success=True,
        message="OTP sent (mocked)",
        data={"phone_number": payload.phone_number},
    )


@router.post("/otp/verify", response_model=ApiResponse[TokenResponse])
def verify_otp(payload: OtpVerifyRequest, db: Session = Depends(get_db)):
    expected_code = _otp_store.get(payload.phone_number)
    if expected_code is None or expected_code != payload.code:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired OTP")

    user = db.query(User).filter(User.phone_number == payload.phone_number).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found for this phone number",
        )

    del _otp_store[payload.phone_number]
    tokens = _issue_token_pair(db, user)
    return ApiResponse(success=True, message="OTP verified", data=tokens)
