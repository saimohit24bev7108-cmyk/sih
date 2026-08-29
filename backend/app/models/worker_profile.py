from geoalchemy2 import Geography
from sqlalchemy import ARRAY, CheckConstraint, Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class WorkerProfile(Base):
    __tablename__ = "worker_profiles"
    __table_args__ = (
        CheckConstraint(
            "verification_status IN ('pending', 'approved', 'rejected')",
            name="worker_profiles_verification_status_check",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String, nullable=True)
    skills = Column(ARRAY(String), nullable=True)
    experience_years = Column(Integer, nullable=True)
    rating = Column(Float, default=0.0)
    verification_status = Column(String, default="pending")
    current_location = Column(
        Geography(geometry_type="POINT", srid=4326, spatial_index=True),
        nullable=True,
    )

    user = relationship("User", back_populates="worker_profile")
