from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


class BookingStatusHistory(Base):
    __tablename__ = "booking_status_history"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    from_status = Column(String, nullable=False)
    to_status = Column(String, nullable=False)
    changed_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    changed_at = Column(DateTime(timezone=True), server_default=func.now())

    booking = relationship("Booking", back_populates="history")
    changed_by = relationship("User")
