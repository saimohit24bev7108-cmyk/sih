from sqlalchemy import Column, Integer, String

from app.db.session import Base


class ServiceCategory(Base):
    __tablename__ = "service_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    icon_name = Column(String, nullable=True)
