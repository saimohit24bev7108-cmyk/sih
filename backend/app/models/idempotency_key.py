from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import TypeDecorator

from app.db.session import Base

# A simple fallback for SQLite if we are in testing, otherwise use JSONB or Text
class JSONorText(TypeDecorator):
    impl = Text
    cache_ok = True
    
    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(JSONB())
        else:
            return dialect.type_descriptor(Text())

class IdempotencyKey(Base):
    __tablename__ = "idempotency_keys"
    __table_args__ = (
        UniqueConstraint("key", "user_id", "endpoint", name="uq_idempotency_keys_key_user_endpoint"),
    )

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    endpoint = Column(String, nullable=False)
    request_hash = Column(String, nullable=False)
    response_body = Column(JSONorText, nullable=True)
    status_code = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
