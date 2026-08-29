import hashlib
import logging
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.responses import ApiResponse
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    hash_token,
    verify_password,
)
from app.db.session import get_db
from app.models.customer_profile import CustomerProfile
from app.models.token import RefreshToken
from app.models.user import User
from app.models.worker_profile import WorkerProfile
from app.schemas.auth import (
    LoginRequest,
    OtpSendRequest,
    OtpVerifyRequest,
    PasswordForgotRequest,
    PasswordResetRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])
logger = logging.getLogger(__name__)

OTP_EXPIRY_MINUTES = 5
OTP_RESEND_SECONDS = 30
OTP_MAX_SENDS_PER_HOUR = 5
OTP_MAX_VERIFY_ATTEMPTS = 5

_otp_store: Dict[str, Dict[str, Any]] = {}
_otp_send_history: Dict[str, list[datetime]] = {}


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def _hash_value(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _generate_otp() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def _serialize_user(user: User) -> Dict[str, Any]:
    return {
        "id": user.id,
        "email": user.email,
        "phone_number": user.phone_number,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


def _auth_payload(user: User) -> Dict[str, Any]:
    tokens = _issue_token_pair(db=None, user=user)
    payload = tokens.model_dump()
    payload["user"] = _serialize_user(user)
    return payload


def _issue_token_pair(db: Optional[Session], user: User, family_id: Optional[str] = None) -> TokenResponse:
    access_token = create_access_token(user.id, user.role)
    raw_refresh = create_refresh_token()
    family = family_id or str(uuid.uuid4())

    if db is not None:
        record = RefreshToken(
            user_id=user.id,
            token_hash=hash_token(raw_refresh),
            family_id=family,
            expires_at=_now_utc() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        db.add(record)
        db.commit()

    return TokenResponse(access_token=access_token, refresh_token=raw_refresh)


def _find_user_for_login(db: Session, payload: LoginRequest) -> Optional[User]:
    if payload.email and payload.phone_number:
        user = (
            db.query(User)
            .filter(or_(User.email == payload.email, User.phone_number == payload.phone_number))
            .first()
        )
        return user
    if payload.email:
        return db.query(User).filter(User.email == payload.email).first()
    if payload.phone_number:
        return db.query(User).filter(User.phone_number == payload.phone_number).first()
    return None


def _ensure_role_matches(user: User, requested_role: Optional[str], login_context: str) -> None:
    if requested_role is None:
        return
    if user.role != requested_role:
        logger.warning(
            "ROLE_MISMATCH user_id=%s context=%s stored_role=%s requested_role=%s",
            user.id,
            login_context,
            user.role,
            requested_role,
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )


def _create_user_and_profile(db: Session, payload: RegisterRequest) -> User:
    existing = (
        db.query(User)
        .filter(or_(User.email == payload.email, User.phone_number == payload.phone_number))
        .first()
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email or phone already exists",
        )

    user = User(
        email=str(payload.email),
        phone_number=payload.phone_number.strip(),
        password_hash=get_password_hash(payload.password),
        role=payload.role,
        is_active=True,
    )
    db.add(user)
    db.flush()

    if payload.role == "customer":
        customer_profile = CustomerProfile(user_id=user.id, name=payload.name or payload.email)
        db.add(customer_profile)
    elif payload.role == "worker":
        worker_profile = WorkerProfile(
            user_id=user.id,
            name=payload.name or payload.email,
            skills=[],
            verification_status="pending",
        )
        db.add(worker_profile)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Public registration is only allowed for customer or worker roles",
        )

    db.commit()
    db.refresh(user)
    return user


def _verify_otp_value(phone_number: str, code: str) -> Optional[str]:
    record = _otp_store.get(phone_number)
    if record is None:
        return None

    now = _now_utc()
    expires_at = record.get("expires_at")
    if not isinstance(expires_at, datetime) or expires_at < now:
        _otp_store.pop(phone_number, None)
        return None

    if record.get("attempts", 0) >= OTP_MAX_VERIFY_ATTEMPTS:
        _otp_store.pop(phone_number, None)
        return None

    if record["otp_hash"] != _hash_value(code):
        record["attempts"] = int(record.get("attempts", 0)) + 1
        if record["attempts"] >= OTP_MAX_VERIFY_ATTEMPTS:
            _otp_store.pop(phone_number, None)
        return None

    _otp_store.pop(phone_number, None)
    return phone_number


def _send_otp_for_phone(phone_number: str, purpose: str) -> str:
    now = _now_utc()
    history = _otp_send_history.get(phone_number, [])
    history = [timestamp for timestamp in history if now - timestamp < timedelta(hours=1)]
    if len(history) >= OTP_MAX_SENDS_PER_HOUR:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many OTP requests. Please wait before retrying.",
        )
    if history and (now - history[-1]).total_seconds() < OTP_RESEND_SECONDS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Please wait before requesting another OTP.",
        )

    code = _generate_otp()
    _otp_store[phone_number] = {
        "otp_hash": _hash_value(code),
        "expires_at": now + timedelta(minutes=OTP_EXPIRY_MINUTES),
        "attempts": 0,
        "purpose": purpose,
    }
    _otp_send_history[phone_number] = history + [now]

    logger.info("OTP_SENT phone=%s purpose=%s code=%s", phone_number, purpose, code)
    return code


@router.post("/register", response_model=ApiResponse[dict])
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if payload.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin registration is not allowed",
        )

    user = _create_user_and_profile(db, payload)
    payload_for_response = _issue_token_pair(db, user).model_dump()
    payload_for_response["user"] = _serialize_user(user)
    return ApiResponse(success=True, message="Registration successful", data=payload_for_response)


@router.post("/login", response_model=ApiResponse[dict])
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    if not payload.email and not payload.phone_number:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or phone number is required",
        )

    user = _find_user_for_login(db, payload)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if user.password_hash is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    _ensure_role_matches(user, payload.role, "password_login")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")

    auth_payload = _issue_token_pair(db, user).model_dump()
    auth_payload["user"] = _serialize_user(user)
    return ApiResponse(success=True, message="Login successful", data=auth_payload)


@router.post("/refresh", response_model=ApiResponse[dict])
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    incoming_hash = hash_token(payload.refresh_token)
    record = db.query(RefreshToken).filter(RefreshToken.token_hash == incoming_hash).first()

    if record is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if record.revoked:
        db.query(RefreshToken).filter(RefreshToken.family_id == record.family_id).update({"revoked": True})
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token reuse detected — session revoked, please log in again",
        )

    if record.expires_at < _now_utc():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    user = db.query(User).filter(User.id == record.user_id).first()
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    access_token = create_access_token(user.id, user.role)
    raw_refresh = create_refresh_token()
    new_hash = hash_token(raw_refresh)

    record.revoked = True
    record.replaced_by_token_hash = new_hash

    new_record = RefreshToken(
        user_id=user.id,
        token_hash=new_hash,
        family_id=record.family_id,
        expires_at=_now_utc() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(new_record)
    db.commit()

    tokens = TokenResponse(access_token=access_token, refresh_token=raw_refresh)
    return ApiResponse(success=True, message="Token refreshed", data=tokens.model_dump())


@router.post("/logout", response_model=ApiResponse[dict])
def logout(payload: RefreshRequest, db: Session = Depends(get_db)):
    incoming_hash = hash_token(payload.refresh_token)
    record = db.query(RefreshToken).filter(RefreshToken.token_hash == incoming_hash).first()
    if record is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    db.query(RefreshToken).filter(RefreshToken.family_id == record.family_id).update({"revoked": True})
    db.commit()
    return ApiResponse(success=True, message="Logged out successfully", data={"revoked": True})


@router.post("/otp/send", response_model=ApiResponse[dict])
def send_otp(payload: OtpSendRequest):
    code = _send_otp_for_phone(payload.phone_number.strip(), payload.purpose)
    return ApiResponse(
        success=True,
        message="OTP sent. For development, this response includes the code placeholder until SMS integration is added.",
        data={
            "phone_number": payload.phone_number.strip(),
            "purpose": payload.purpose,
            "code": code,
            "expires_in_seconds": OTP_EXPIRY_MINUTES * 60,
            "dev_only": True,
        },
    )


@router.post("/otp/verify", response_model=ApiResponse[dict])
def verify_otp(payload: OtpVerifyRequest, db: Session = Depends(get_db)):
    if _verify_otp_value(payload.phone_number.strip(), payload.code) is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired OTP")

    user = db.query(User).filter(User.phone_number == payload.phone_number.strip()).first()

    if payload.purpose == "register":
        if user is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this phone number already exists",
            )
        if payload.email is None or payload.password is None or payload.role is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email, password, and role are required for registration",
            )
        new_user = _create_user_and_profile(
            db,
            RegisterRequest(
                name=payload.name or payload.email,
                email=payload.email,
                phone_number=payload.phone_number,
                password=payload.password,
                role=payload.role,
            ),
        )
        auth_payload = _issue_token_pair(db, new_user).model_dump()
        auth_payload["user"] = _serialize_user(new_user)
        return ApiResponse(success=True, message="OTP verified and registration complete", data=auth_payload)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found for this phone number",
        )

    _ensure_role_matches(user, payload.role, "otp_login")

    auth_payload = _issue_token_pair(db, user).model_dump()
    auth_payload["user"] = _serialize_user(user)
    return ApiResponse(success=True, message="OTP verified", data=auth_payload)


@router.post("/password/forgot", response_model=ApiResponse[dict])
def password_forgot(payload: PasswordForgotRequest):
    if payload.phone_number:
        code = _send_otp_for_phone(payload.phone_number.strip(), "password_reset")
        return ApiResponse(
            success=True,
            message="Password reset OTP sent. For development, this response includes the code placeholder until SMS integration is added.",
            data={"phone_number": payload.phone_number.strip(), "code": code, "dev_only": True},
        )

    if payload.email:
        return ApiResponse(
            success=True,
            message="Password reset via email is not implemented yet. Use the phone-number OTP flow for now.",
            data={"email": str(payload.email), "status": "placeholder"},
        )

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Phone number or email is required",
    )


@router.post("/password/reset", response_model=ApiResponse[dict])
def password_reset(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    if not payload.phone_number and not payload.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number or email is required",
        )

    user: Optional[User] = None
    phone_number = payload.phone_number.strip() if payload.phone_number else None
    if phone_number:
        user = db.query(User).filter(User.phone_number == phone_number).first()
    elif payload.email:
        user = db.query(User).filter(User.email == str(payload.email)).first()
        phone_number = user.phone_number if user else None

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found for this email or phone number",
        )

    if phone_number is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account does not have a phone number on file for OTP-based reset",
        )

    if _verify_otp_value(phone_number, payload.code) is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired OTP")

    user.password_hash = get_password_hash(payload.new_password)
    db.query(RefreshToken).filter(RefreshToken.user_id == user.id).update({"revoked": True})
    db.commit()

    return ApiResponse(
        success=True,
        message="Password reset successful. All refresh tokens for this account have been revoked.",
        data={"user_id": user.id},
    )
