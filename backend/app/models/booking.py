from sqlalchemy import CheckConstraint, Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        CheckConstraint(
            "status IN ('REQUESTED', 'ACCEPTED', 'WORKER_ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'PAYMENT_PENDING', 'PAID', 'RATED', 'CANCELLED', 'DISPUTED')",
            name="bookings_status_check",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    service_request_id = Column(Integer, ForeignKey("service_requests.id"), unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    status = Column(String, default="REQUESTED", nullable=False)
    version = Column(Integer, default=0, nullable=False)  # Optimistic lock column
    
    price_estimate_min = Column(Numeric(10, 2), nullable=True)
    price_estimate_max = Column(Numeric(10, 2), nullable=True)
    
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    arrived_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    
    cancellation_reason = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    service_request = relationship("ServiceRequest", back_populates="booking")
    customer = relationship("User", foreign_keys=[customer_id])
    worker = relationship("User", foreign_keys=[worker_id])
    history = relationship("BookingStatusHistory", back_populates="booking", cascade="all, delete-orphan")
