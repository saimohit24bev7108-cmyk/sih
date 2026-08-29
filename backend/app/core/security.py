import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, password_hash: Optional[str]) -> bool:
    """Safely handles OTP-only users whose password_hash is None."""
    if not password_hash:
        return False
    return pwd_context.verify(plain_password, password_hash)


def create_access_token(user_id: int, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "role": role, "type": "access", "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])


def create_refresh_token() -> str:
    """Opaque, high-entropy refresh token (not a JWT) — the raw value sent to the client."""
    return secrets.token_urlsafe(48)


def hash_token(token: str) -> str:
    """One-way hash of a refresh token before it's stored in the DB, so a DB leak
    doesn't expose usable refresh tokens directly."""
    return hashlib.sha256(token.encode()).hexdigest()
