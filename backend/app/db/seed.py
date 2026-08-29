from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.service_category import ServiceCategory
from app.models.user import User
from app.models.worker_profile import WorkerProfile


def seed_service_categories(db: Session) -> None:
    categories = [
        ServiceCategory(name="Electrical", description="Wiring, repairs, and installations", icon_name="zap"),
        ServiceCategory(name="Plumbing", description="Leak fixes and pipe maintenance", icon_name="droplet"),
        ServiceCategory(name="Painting", description="Interior and exterior painting", icon_name="paintbrush"),
        ServiceCategory(name="Carpentry", description="Furniture and woodwork repair", icon_name="hammer"),
        ServiceCategory(name="Cleaning", description="Home and office cleaning", icon_name="sparkles"),
        ServiceCategory(name="Appliances Repair", description="Appliance servicing and repair", icon_name="settings"),
    ]

    for category in categories:
        existing = db.query(ServiceCategory).filter_by(name=category.name).first()
        if existing is None:
            db.add(category)

    db.commit()


def seed_worker_demo(db: Session) -> None:
    dummy_email = "demo.worker@fixflow.local"
    user = db.query(User).filter_by(email=dummy_email).first()

    if user is None:
        user = User(
            email=dummy_email,
            phone_number="+919876543210",
            password_hash=get_password_hash("DemoWorker@123"),
            role="worker",
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.password_hash = get_password_hash("DemoWorker@123")
        db.add(user)

    profile = db.query(WorkerProfile).filter_by(user_id=user.id).first()
    if profile is None:
        profile = WorkerProfile(
            user_id=user.id,
            name="Demo Worker",
            skills=["Electrical", "Plumbing"],
            experience_years=4,
            rating=4.8,
            verification_status="approved",
            current_location="POINT(77.5946 12.9716)",
        )
        db.add(profile)

    db.commit()


def seed_all() -> None:
    db = SessionLocal()
    try:
        seed_service_categories(db)
        seed_worker_demo(db)
    finally:
        db.close()


if __name__ == "__main__":
    seed_all()
