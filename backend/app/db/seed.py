from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.service_category import ServiceCategory
from app.models.user import User
from app.models.worker_profile import WorkerProfile
from app.models.service_request import ServiceRequest
from app.models.booking import Booking
from app.models.address import Address


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
    dummy_email = "demo.worker@fixflow.com"
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


def seed_layer4_demo(db: Session) -> None:
    # Get a customer and a worker
    # In the demo setup from DEV_SETUP, customer@fixflow.local and suresh@worker.com are the ones.
    customer = db.query(User).filter_by(email="customer@fixflow.local").first()
    worker = db.query(User).filter_by(email="demo.worker@fixflow.com").first()
    category = db.query(ServiceCategory).filter_by(name="Plumbing").first()

    if customer and worker and category:
        # Create an address for the customer if they don't have one
        address = db.query(Address).filter_by(user_id=customer.id).first()
        if not address:
            address = Address(
                user_id=customer.id,
                street="123 Demo Street",
                city="Bengaluru",
                state="Karnataka",
                postal_code="560001",
                coordinates="POINT(77.5946 12.9716)"
            )
            db.add(address)
            db.commit()
            db.refresh(address)

        # Create a service request if one doesn't exist
        sr = db.query(ServiceRequest).filter_by(customer_id=customer.id, category_id=category.id).first()
        if not sr:
            sr = ServiceRequest(
                customer_id=customer.id,
                category_id=category.id,
                description="Leaking pipe in the kitchen",
                location="POINT(77.5946 12.9716)",
                address_id=address.id,
                status="matched"
            )
            db.add(sr)
            db.commit()
            db.refresh(sr)

            # Create an accepted booking for this service request
            booking = Booking(
                service_request_id=sr.id,
                customer_id=customer.id,
                worker_id=worker.id,
                status="ACCEPTED",
                version=1
            )
            db.add(booking)
            db.commit()


def seed_all() -> None:
    db = SessionLocal()
    try:
        seed_service_categories(db)
        seed_worker_demo(db)
        seed_layer4_demo(db)
    finally:
        db.close()


if __name__ == "__main__":
    seed_all()
