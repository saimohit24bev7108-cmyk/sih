from geoalchemy2 import Geography
from sqlalchemy import CheckConstraint, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


class ServiceRequest(Base):
    __tablename__ = "service_requests"
    __table_args__ = (
        CheckConstraint(
            "status IN ('open', 'matched', 'cancelled', 'expired')",
            name="service_requests_status_check",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("service_categories.id"), nullable=False)
    description = Column(Text, nullable=True)
    location = Column(
        Geography(geometry_type="POINT", srid=4326, spatial_index=True),
        nullable=False,
    )
    address_id = Column(Integer, ForeignKey("addresses.id"), nullable=True)
    status = Column(String, default="open", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    customer = relationship("User", foreign_keys=[customer_id])
    category = relationship("ServiceCategory")
    address = relationship("Address")
    booking = relationship("Booking", back_populates="service_request", uselist=False)
