from geoalchemy2 import Geography
from sqlalchemy import Column, ForeignKey, Integer, String

from app.db.session import Base


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    street = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    coordinates = Column(
        Geography(geometry_type="POINT", srid=4326, spatial_index=True),
        nullable=True,
    )
