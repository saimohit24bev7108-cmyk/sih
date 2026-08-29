from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.sql import func

from app.db.session import Base


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Store only a hash of the token, never the raw value.
    token_hash = Column(String, unique=True, nullable=False, index=True)

    # Shared across every token in a rotation chain — used to revoke the
    # whole family at once if a reused/stale token is ever presented.
    family_id = Column(String, nullable=False, index=True)

    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked = Column(Boolean, default=False, nullable=False)
    replaced_by_token_hash = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
