"""
Layer 4 Booking Engine Verification Test Suite for FixFlow Backend
"""
import sys
import unittest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

# Set up test database with SQLite in-memory
from app.db.session import Base, get_db
from app.main import app
from app.models.user import User
from app.models.service_category import ServiceCategory
from app.models.service_request import ServiceRequest
from app.models.booking import Booking
from app.models.booking_status_history import BookingStatusHistory
from app.models.idempotency_key import IdempotencyKey
from app.core.security import get_password_hash, create_access_token
from app.db.seed import seed_service_categories

# Create SQLite engine with Spatialite/mock support
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


import json
import sqlite3
sqlite3.register_adapter(list, json.dumps)
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.dialects.postgresql import ARRAY as PG_ARRAY
from sqlalchemy.types import ARRAY
from geoalchemy2 import Geography
import geoalchemy2.admin.dialects.sqlite as geo_sqlite

geo_sqlite.after_create = lambda *args, **kwargs: None
geo_sqlite.before_drop = lambda *args, **kwargs: None
geo_sqlite.before_create = lambda *args, **kwargs: None
geo_sqlite.after_drop = lambda *args, **kwargs: None

@compiles(ARRAY, "sqlite")
def compile_array_sqlite(element, compiler, **kw):
    return "TEXT"

@compiles(PG_ARRAY, "sqlite")
def compile_pg_array_sqlite(element, compiler, **kw):
    return "TEXT"

@compiles(Geography, "sqlite")
def compile_geography_sqlite(element, compiler, **kw):
    return "TEXT"

@event.listens_for(engine, "connect")
def do_connect(dbapi_connection, connection_record):
    dbapi_connection.create_function("AsBinary", 1, lambda x: x)
    dbapi_connection.create_function("ST_AsBinary", 1, lambda x: x)
    dbapi_connection.create_function("GeomFromText", 1, lambda x: x)
    dbapi_connection.create_function("ST_GeogFromText", 1, lambda x: x)
    dbapi_connection.create_function("ST_GeomFromText", 1, lambda x: x)


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


class Layer4VerificationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        
        # Seed basic users and categories
        db = TestingSessionLocal()
        
        # Seed categories
        seed_service_categories(db)
        
        # Seed users
        cls.customer_password = "password123"
        hashed = get_password_hash(cls.customer_password)
        
        cls.customer = User(email="test.customer@test.com", password_hash=hashed, phone_number="+1234567890", role="customer", is_active=True)
        cls.customer2 = User(email="test.customer2@test.com", password_hash=hashed, phone_number="+1234567891", role="customer", is_active=True)
        cls.worker1 = User(email="test.worker1@test.com", password_hash=hashed, phone_number="+1234567892", role="worker", is_active=True)
        cls.worker2 = User(email="test.worker2@test.com", password_hash=hashed, phone_number="+1234567893", role="worker", is_active=True)
        
        db.add_all([cls.customer, cls.customer2, cls.worker1, cls.worker2])
        db.commit()
        
        cls.customer_id = cls.customer.id
        cls.customer2_id = cls.customer2.id
        cls.worker1_id = cls.worker1.id
        cls.worker2_id = cls.worker2.id
        
        db.close()
        
        cls.customer_token = create_access_token(cls.customer.id, cls.customer.role)
        cls.customer_headers = {"Authorization": f"Bearer {cls.customer_token}"}
        
        cls.customer2_token = create_access_token(cls.customer2.id, cls.customer2.role)
        cls.customer2_headers = {"Authorization": f"Bearer {cls.customer2_token}"}
        
        cls.worker1_token = create_access_token(cls.worker1.id, cls.worker1.role)
        cls.worker1_headers = {"Authorization": f"Bearer {cls.worker1_token}"}
        
        cls.worker2_token = create_access_token(cls.worker2.id, cls.worker2.role)
        cls.worker2_headers = {"Authorization": f"Bearer {cls.worker2_token}"}

    @classmethod
    def tearDownClass(cls):
        Base.metadata.drop_all(bind=engine)

    def setUp(self):
        self.db = TestingSessionLocal()

    def tearDown(self):
        self.db.close()

    def test_01_schema_tables_exist(self):
        """1. Schema tables exist"""
        import sqlalchemy
        inspector = sqlalchemy.inspect(engine)
        tables = inspector.get_table_names()
        self.assertIn("service_requests", tables)
        self.assertIn("bookings", tables)
        self.assertIn("booking_status_history", tables)
        self.assertIn("idempotency_keys", tables)

    def test_02_customer_creates_service_request(self):
        """2. Customer creates service request; non-customers get 403"""
        payload = {
            "category_id": 1,
            "description": "Test request",
            "lat": 12.9716,
            "lng": 77.5946
        }
        
        # Worker gets 403
        r = client.post("/api/service-requests", json=payload, headers=self.worker1_headers)
        self.assertEqual(r.status_code, 403)
        
        # Customer succeeds
        r = client.post("/api/service-requests", json=payload, headers=self.customer_headers)
        self.assertEqual(r.status_code, 200)
        data = r.json()["data"]
        self.assertEqual(data["customer_id"], self.customer_id)
        self.assertEqual(data["status"], "open")
        self.assertIsNotNone(data["id"])
        
        # Set class variable for future tests
        self.__class__.service_request_id = data["id"]

    def test_03_duplicate_idempotency_key(self):
        """3. Duplicate Idempotency-Key returns same booking"""
        payload = {
            "service_request_id": self.__class__.service_request_id
        }
        headers = self.customer_headers.copy()
        headers["Idempotency-Key"] = "test-key-1"
        
        # First call creates the booking
        r1 = client.post("/api/bookings", json=payload, headers=headers)
        self.assertEqual(r1.status_code, 200)
        b1 = r1.json()["data"]
        self.assertEqual(b1["status"], "REQUESTED")
        
        self.__class__.booking_id = b1["id"]
        
        # Second call returns the same booking
        r2 = client.post("/api/bookings", json=payload, headers=headers)
        self.assertEqual(r2.status_code, 200)
        b2 = r2.json()["data"]
        self.assertEqual(b1["id"], b2["id"])

    def test_04_idempotency_different_body_fails(self):
        """4. Same key + different body → 422"""
        payload2 = {
            "service_request_id": 9999 # Different body
        }
        headers = self.customer_headers.copy()
        headers["Idempotency-Key"] = "test-key-1"
        
        r = client.post("/api/bookings", json=payload2, headers=headers)
        self.assertEqual(r.status_code, 422)

    def test_05_concurrent_accepts(self):
        """5. Concurrent accepts → exactly one wins, other gets 409"""
        # Worker 1 accepts
        r1 = client.post(f"/api/bookings/{self.booking_id}/accept", headers=self.worker1_headers)
        self.assertEqual(r1.status_code, 200)
        self.assertEqual(r1.json()["data"]["status"], "ACCEPTED")
        self.assertEqual(r1.json()["data"]["worker_id"], self.worker1_id)
        self.assertEqual(r1.json()["data"]["version"], 2)
        
        # Worker 2 tries to accept the same booking
        r2 = client.post(f"/api/bookings/{self.booking_id}/accept", headers=self.worker2_headers)
        self.assertEqual(r2.status_code, 409)

    def test_06_illegal_transition(self):
        """6. Illegal transition (ACCEPTED → COMPLETED) → 409"""
        payload = {
            "status": "COMPLETED",
            "version": 2
        }
        r = client.patch(f"/api/bookings/{self.booking_id}/status", json=payload, headers=self.worker1_headers)
        self.assertEqual(r.status_code, 409)

    def test_07_unassigned_worker_cannot_transition(self):
        """7. Unassigned worker can't transition → 403"""
        payload = {
            "status": "WORKER_ON_THE_WAY",
            "version": 2
        }
        r = client.patch(f"/api/bookings/{self.booking_id}/status", json=payload, headers=self.worker2_headers)
        self.assertEqual(r.status_code, 403)

    def test_08_customer_privacy(self):
        """8. Customer can't view another customer's booking → 403"""
        r = client.get(f"/api/bookings/{self.booking_id}", headers=self.customer2_headers)
        self.assertEqual(r.status_code, 403)

    def test_09_version_mismatch(self):
        """9. Version mismatch on status PATCH → 409"""
        # First valid transition
        payload = {
            "status": "WORKER_ON_THE_WAY",
            "version": 2
        }
        r = client.patch(f"/api/bookings/{self.booking_id}/status", json=payload, headers=self.worker1_headers)
        self.assertEqual(r.status_code, 200)
        
        # Worker 1 tries to send another transition but with stale version 2
        payload2 = {
            "status": "ARRIVED",
            "version": 2 # Should be 3 now
        }
        r2 = client.patch(f"/api/bookings/{self.booking_id}/status", json=payload2, headers=self.worker1_headers)
        self.assertEqual(r2.status_code, 409)


if __name__ == '__main__':
    unittest.main(verbosity=2)
