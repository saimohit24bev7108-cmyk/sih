"""
Comprehensive Layer 3 Database Foundation & Verification Test Suite for FixFlow Backend
"""
import sys
import unittest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Set up test database with SQLite in-memory
from app.db.session import Base, get_db
from app.main import app
from app.models.user import User
from app.models.token import RefreshToken
from app.models.customer_profile import CustomerProfile
from app.models.worker_profile import WorkerProfile
from app.models.address import Address
from app.models.service_category import ServiceCategory
from app.models.service_request import ServiceRequest
from app.core.security import get_password_hash, create_access_token
from app.db.seed import SERVICE_CATEGORIES

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


import httpx
import json
import sqlite3
sqlite3.register_adapter(list, json.dumps)
from sqlalchemy.ext.compiler import compiles

from sqlalchemy.dialects.postgresql import ARRAY
from geoalchemy2 import Geography
import geoalchemy2.admin.dialects.sqlite as geo_sqlite

geo_sqlite.after_create = lambda *args, **kwargs: None
geo_sqlite.before_drop = lambda *args, **kwargs: None
geo_sqlite.before_create = lambda *args, **kwargs: None
geo_sqlite.after_drop = lambda *args, **kwargs: None


@compiles(ARRAY, "sqlite")
def compile_array_sqlite(element, compiler, **kw):
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


from starlette.testclient import TestClient
app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)






class Layer3VerificationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)

    @classmethod
    def tearDownClass(cls):
        Base.metadata.drop_all(bind=engine)

    def setUp(self):
        self.db = TestingSessionLocal()

    def tearDown(self):
        self.db.close()

    # ──────────────────────────────────────────────────────────────────────────
    # 1. TEST SCHEMA & MODELS
    # ──────────────────────────────────────────────────────────────────────────
    def test_01_schema_tables_created(self):
        """Confirm all 7 foundation tables are created successfully."""
        tables = Base.metadata.tables.keys()
        expected = [
            "users",
            "refresh_tokens",
            "customer_profiles",
            "worker_profiles",
            "addresses",
            "service_categories",
            "service_requests",
        ]
        for t in expected:
            self.assertIn(t, tables, f"Table '{t}' missing from metadata")
        print(" [PASS] Step 1: All 7 foundation tables verified in schema metadata.")

    # ──────────────────────────────────────────────────────────────────────────
    # 2. TEST SEED SCRIPT IDEMPOTENCY
    # ──────────────────────────────────────────────────────────────────────────
    def test_02_seed_idempotency(self):
        """Test that running the seed logic twice does not create duplicate entries."""
        db = self.db

        def run_seed():
            # Seed categories
            for cat_data in SERVICE_CATEGORIES:
                cat = db.query(ServiceCategory).filter(ServiceCategory.id == cat_data["id"]).first()
                if not cat:
                    cat = ServiceCategory(
                        id=cat_data["id"],
                        name=cat_data["name"],
                        icon=cat_data["icon"],
                        description=cat_data["description"],
                        base_rate_min=cat_data["base_rate_min"],
                        base_rate_max=cat_data["base_rate_max"],
                        is_active=True,
                    )
                    db.add(cat)
                else:
                    cat.name = cat_data["name"]
                    cat.icon = cat_data["icon"]
                    cat.description = cat_data["description"]
                    cat.base_rate_min = cat_data["base_rate_min"]
                    cat.base_rate_max = cat_data["base_rate_max"]
            db.commit()

            # Seed Admin
            admin = db.query(User).filter(User.email == "admin@gigcoop.in").first()
            if not admin:
                admin = User(
                    name="Admin User",
                    email="admin@gigcoop.in",
                    phone_number="9000000000",
                    password_hash=get_password_hash("password123"),
                    role="admin",
                    is_active=True,
                )
                db.add(admin)
            else:
                admin.password_hash = get_password_hash("password123")
            db.commit()

            # Seed Customer
            cust = db.query(User).filter(User.email == "customer@fixflow.local").first()
            if not cust:
                cust = User(
                    name="Customer Demo",
                    email="customer@fixflow.local",
                    phone_number="+910000000000",
                    password_hash=get_password_hash("FixFlow2026!"),
                    role="customer",
                    is_active=True,
                )
                db.add(cust)
                db.commit()
                db.refresh(cust)

            cp = db.query(CustomerProfile).filter(CustomerProfile.user_id == cust.id).first()
            if not cp:
                cp = CustomerProfile(
                    user_id=cust.id,
                    preferred_language="en",
                    bio="Primary demo customer account.",
                )
                db.add(cp)
            db.commit()

            # Seed Worker
            worker = db.query(User).filter(User.email == "suresh@worker.com").first()
            if not worker:
                worker = User(
                    name="Suresh Kumar",
                    email="suresh@worker.com",
                    phone_number="9988776655",
                    password_hash=get_password_hash("password123"),
                    role="worker",
                    is_active=True,
                )
                db.add(worker)
                db.commit()
                db.refresh(worker)

            wp = db.query(WorkerProfile).filter(WorkerProfile.user_id == worker.id).first()
            if not wp:
                wp = WorkerProfile(
                    user_id=worker.id,
                    service_type="plumbing",
                    secondary_services=["appliance_repair"],
                    hourly_rate=350.0,
                    experience_years=8,
                    status="approved",
                    is_verified=True,
                    is_available=True,
                    rating=4.8,
                    rating_count=31,
                    total_jobs=156,
                    cooperative_shares=15,
                    joined_cooperative=True,
                    location_name="Hyderabad, Telangana",
                    bio="Expert plumber with 8 years experience.",
                )
                db.add(wp)
            db.commit()

            # Seed Pending Worker
            pworker = db.query(User).filter(User.email == "pending.worker@fixflow.local").first()
            if not pworker:
                pworker = User(
                    name="Pending Worker Demo",
                    email="pending.worker@fixflow.local",
                    phone_number="9988776658",
                    password_hash=get_password_hash("password123"),
                    role="worker",
                    is_active=True,
                )
                db.add(pworker)
                db.commit()
                db.refresh(pworker)

            pwp = db.query(WorkerProfile).filter(WorkerProfile.user_id == pworker.id).first()
            if not pwp:
                pwp = WorkerProfile(
                    user_id=pworker.id,
                    service_type="plumbing",
                    secondary_services=[],
                    hourly_rate=300.0,
                    experience_years=2,
                    status="pending",
                    is_verified=False,
                    is_available=True,
                    rating=0.0,
                    rating_count=0,
                    total_jobs=0,
                    location_name="Madhapur, Hyderabad",
                    bio="Awaiting admin verification.",
                )
                db.add(pwp)
            db.commit()

        # Run 1
        run_seed()
        count_cat_1 = db.query(ServiceCategory).count()
        count_user_1 = db.query(User).count()
        count_cp_1 = db.query(CustomerProfile).count()
        count_wp_1 = db.query(WorkerProfile).count()

        # Run 2
        run_seed()
        count_cat_2 = db.query(ServiceCategory).count()
        count_user_2 = db.query(User).count()
        count_cp_2 = db.query(CustomerProfile).count()
        count_wp_2 = db.query(WorkerProfile).count()

        self.assertEqual(count_cat_1, count_cat_2, "Service categories duplicated!")
        self.assertEqual(count_user_1, count_user_2, "Users duplicated!")
        self.assertEqual(count_cp_1, count_cp_2, "Customer profiles duplicated!")
        self.assertEqual(count_wp_1, count_wp_2, "Worker profiles duplicated!")
        self.assertEqual(count_cat_1, 8, "Expected 8 service categories")
        self.assertEqual(count_user_1, 4, "Expected 4 users (admin, customer, worker, pending_worker)")

        print(f" [PASS] Step 2: Seed idempotency confirmed (Categories: {count_cat_1}, Users: {count_user_1}, Profiles: {count_cp_1}+{count_wp_1}).")

    # ──────────────────────────────────────────────────────────────────────────
    # 3. TEST AUTH LOGIN WITH BCRYPT HASH
    # ──────────────────────────────────────────────────────────────────────────
    def test_03_auth_login_worker(self):
        """Verify worker login using real bcrypt hash."""
        response = client.post(
            "/api/auth/login",
            json={"email": "suresh@worker.com", "password": "password123"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("access_token", data["data"])
        self.assertEqual(data["data"]["user"]["role"], "worker")
        print(" [PASS] Step 3: Demo worker login succeeded with real bcrypt hash.")

    def test_04_auth_login_admin(self):
        """Verify admin login."""
        response = client.post(
            "/api/auth/login",
            json={"email": "admin@gigcoop.in", "password": "password123"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["data"]["user"]["role"], "admin")
        print(" [PASS] Step 4: Admin login succeeded.")

    def test_05_auth_login_customer(self):
        """Verify customer login."""
        response = client.post(
            "/api/auth/login",
            json={"email": "customer@fixflow.local", "password": "FixFlow2026!"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["data"]["user"]["role"], "customer")
        print(" [PASS] Step 5: Customer login succeeded.")

    # ──────────────────────────────────────────────────────────────────────────
    # 4. TEST USER CRUD APIS
    # ──────────────────────────────────────────────────────────────────────────
    def test_06_user_me_get_and_patch(self):
        """Test GET /api/users/me and PATCH /api/users/me with persistence."""
        user = self.db.query(User).filter(User.email == "customer@fixflow.local").first()
        token = create_access_token({"sub": str(user.id), "role": user.role})
        headers = {"Authorization": f"Bearer {token}"}

        # GET /api/users/me
        get_res = client.get("/api/users/me", headers=headers)
        self.assertEqual(get_res.status_code, 200)
        self.assertEqual(get_res.json()["data"]["name"], "Customer Demo")

        # PATCH /api/users/me
        patch_res = client.patch(
            "/api/users/me",
            headers=headers,
            json={"name": "Customer Demo Updated", "phone_number": "+919999999999"},
        )
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["data"]["name"], "Customer Demo Updated")

        # Confirm Persistence with subsequent GET
        get_res2 = client.get("/api/users/me", headers=headers)
        self.assertEqual(get_res2.status_code, 200)
        self.assertEqual(get_res2.json()["data"]["name"], "Customer Demo Updated")
        self.assertEqual(get_res2.json()["data"]["phone_number"], "+919999999999")
        print(" [PASS] Step 6: GET & PATCH /api/users/me verified with verified persistence.")

    # ──────────────────────────────────────────────────────────────────────────
    # 5. TEST CUSTOMER PROFILE CRUD APIS & ROLE RESTRICTION
    # ──────────────────────────────────────────────────────────────────────────
    def test_07_customer_profile_get_and_patch(self):
        """Test GET & PATCH /api/customer/profile."""
        user = self.db.query(User).filter(User.email == "customer@fixflow.local").first()
        token = create_access_token({"sub": str(user.id), "role": user.role})
        headers = {"Authorization": f"Bearer {token}"}

        # GET
        res = client.get("/api/customer/profile", headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["data"]["preferred_language"], "en")

        # PATCH
        patch_res = client.patch(
            "/api/customer/profile",
            headers=headers,
            json={"preferred_language": "hi", "bio": "Updated customer bio"},
        )
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["data"]["preferred_language"], "hi")

        # Confirm persistence
        res2 = client.get("/api/customer/profile", headers=headers)
        self.assertEqual(res2.json()["data"]["preferred_language"], "hi")
        self.assertEqual(res2.json()["data"]["bio"], "Updated customer bio")
        print(" [PASS] Step 7: GET & PATCH /api/customer/profile verified.")

    def test_08_customer_profile_forbidden_for_worker(self):
        """Test that worker cannot access customer profile route (RBAC)."""
        worker = self.db.query(User).filter(User.email == "suresh@worker.com").first()
        token = create_access_token({"sub": str(worker.id), "role": worker.role})
        headers = {"Authorization": f"Bearer {token}"}

        res = client.get("/api/customer/profile", headers=headers)
        self.assertEqual(res.status_code, 403)
        print(" [PASS] Step 8: RBAC Customer profile correctly forbidden for worker.")

    # ──────────────────────────────────────────────────────────────────────────
    # 6. TEST WORKER PROFILE CRUD APIS & ROLE RESTRICTION
    # ──────────────────────────────────────────────────────────────────────────
    def test_09_worker_profile_get_and_patch(self):
        """Test GET /api/worker/profile and PATCH /api/workers/me."""
        worker = self.db.query(User).filter(User.email == "suresh@worker.com").first()
        token = create_access_token({"sub": str(worker.id), "role": worker.role})
        headers = {"Authorization": f"Bearer {token}"}

        # GET
        res = client.get("/api/worker/profile", headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["data"]["service_type"], "plumbing")

        # PATCH /api/workers/me
        patch_res = client.patch(
            "/api/workers/me",
            headers=headers,
            json={"hourly_rate": 450.0, "experience_years": 9, "bio": "Master Plumber & Pipefitter"},
        )
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["data"]["hourly_rate"], 450.0)

        # Confirm persistence
        res2 = client.get("/api/worker/profile", headers=headers)
        self.assertEqual(res2.json()["data"]["hourly_rate"], 450.0)
        self.assertEqual(res2.json()["data"]["experience_years"], 9)
        self.assertEqual(res2.json()["data"]["bio"], "Master Plumber & Pipefitter")
        print(" [PASS] Step 9: GET /api/worker/profile & PATCH /api/workers/me verified.")

    def test_10_worker_profile_forbidden_for_customer(self):
        """Test that customer cannot access worker profile route (RBAC)."""
        cust = self.db.query(User).filter(User.email == "customer@fixflow.local").first()
        token = create_access_token({"sub": str(cust.id), "role": cust.role})
        headers = {"Authorization": f"Bearer {token}"}

        res = client.get("/api/worker/profile", headers=headers)
        self.assertEqual(res.status_code, 403)
        print(" [PASS] Step 10: RBAC Worker profile correctly forbidden for customer.")

    # ──────────────────────────────────────────────────────────────────────────
    # 7. TEST SERVICE CATEGORIES API
    # ──────────────────────────────────────────────────────────────────────────
    def test_11_service_categories_list(self):
        """Test GET /api/services/categories returns real DB categories."""
        res = client.get("/api/services/categories")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertGreaterEqual(len(data["data"]), 8)
        ids = [cat["id"] for cat in data["data"]]
        self.assertIn("plumbing", ids)
        self.assertIn("electrical", ids)
        self.assertIn("cleaning", ids)
        print(f" [PASS] Step 11: GET /api/services/categories returned {len(data['data'])} categories from DB.")

    # ──────────────────────────────────────────────────────────────────────────
    # 8. TEST WORKER DATA APIS
    # ──────────────────────────────────────────────────────────────────────────
    def test_12_workers_list_and_detail(self):
        """Test GET /api/workers and GET /api/workers/{id}."""
        cust = self.db.query(User).filter(User.email == "customer@fixflow.local").first()
        token = create_access_token({"sub": str(cust.id), "role": cust.role})
        headers = {"Authorization": f"Bearer {token}"}

        # List approved workers
        res = client.get("/api/workers", headers=headers)
        self.assertEqual(res.status_code, 200)
        workers = res.json()["data"]
        self.assertGreaterEqual(len(workers), 1)

        # Worker detail
        worker_id = workers[0]["id"]
        detail_res = client.get(f"/api/workers/{worker_id}", headers=headers)
        self.assertEqual(detail_res.status_code, 200)
        self.assertEqual(detail_res.json()["data"]["id"], worker_id)
        print(f" [PASS] Step 12: GET /api/workers and GET /api/workers/{worker_id} verified.")

    # ──────────────────────────────────────────────────────────────────────────
    # 9. TEST ADMIN VERIFICATION APIS
    # ──────────────────────────────────────────────────────────────────────────
    def test_13_admin_pending_workers_and_verify(self):
        """Test GET /api/admin/workers/pending and PATCH /api/admin/workers/{id}/verify."""
        admin = self.db.query(User).filter(User.email == "admin@gigcoop.in").first()
        token = create_access_token({"sub": str(admin.id), "role": admin.role})
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Fetch pending workers
        pending_res = client.get("/api/admin/workers/pending", headers=headers)
        self.assertEqual(pending_res.status_code, 200)
        pending_list = pending_res.json()["data"]
        self.assertGreaterEqual(len(pending_list), 1)
        pending_worker = pending_list[0]
        self.assertEqual(pending_worker["status"], "pending")

        # 2. Verify (approve) worker
        verify_res = client.patch(
            f"/api/admin/workers/{pending_worker['id']}/verify",
            headers=headers,
            json={"status": "approved"},
        )
        self.assertEqual(verify_res.status_code, 200)
        self.assertEqual(verify_res.json()["data"]["status"], "approved")
        self.assertTrue(verify_res.json()["data"]["is_verified"])

        # 3. Confirm worker now appears in public approved workers list
        workers_res = client.get("/api/workers", headers=headers)
        approved_ids = [w["id"] for w in workers_res.json()["data"]]
        self.assertIn(pending_worker["id"], approved_ids)
        print(f" [PASS] Step 13: Admin worker verification (pending -> approved) verified with real-time list update.")

    def test_14_admin_endpoints_forbidden_for_non_admin(self):
        """Test non-admin cannot access admin verification APIs."""
        cust = self.db.query(User).filter(User.email == "customer@fixflow.local").first()
        token = create_access_token({"sub": str(cust.id), "role": cust.role})
        headers = {"Authorization": f"Bearer {token}"}

        res = client.get("/api/admin/workers/pending", headers=headers)
        self.assertEqual(res.status_code, 403)
        print(" [PASS] Step 14: RBAC Admin endpoints correctly forbidden for non-admin users.")

    def test_15_health_check_endpoint(self):
        """Test GET /api/health returns standard ApiResponse envelope."""
        res = client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["data"]["database"], "connected")
        print(" [PASS] Step 15: GET /api/health returned healthy status.")

    def test_16_admin_verify_worker_reject(self):
        """Test admin can reject a pending worker."""
        admin = self.db.query(User).filter(User.email == "admin@gigcoop.in").first()
        token = create_access_token({"sub": str(admin.id), "role": admin.role})
        headers = {"Authorization": f"Bearer {token}"}

        # Create another pending worker
        new_worker_user = User(
            name="Reject Test Worker",
            email="reject.worker@fixflow.local",
            phone_number="9988776699",
            password_hash=get_password_hash("password123"),
            role="worker",
            is_active=True,
        )
        self.db.add(new_worker_user)
        self.db.commit()
        self.db.refresh(new_worker_user)

        new_profile = WorkerProfile(
            user_id=new_worker_user.id,
            service_type="electrical",
            hourly_rate=400.0,
            experience_years=3,
            status="pending",
            is_verified=False,
            is_available=True,
            bio="Worker to test rejection flow.",
        )
        self.db.add(new_profile)
        self.db.commit()
        self.db.refresh(new_profile)

        # Reject worker
        res = client.patch(
            f"/api/admin/workers/{new_profile.id}/verify",
            headers=headers,
            json={"status": "rejected"},
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["data"]["status"], "rejected")
        self.assertFalse(res.json()["data"]["is_verified"])
        print(" [PASS] Step 16: Admin worker rejection verified.")

    def test_17_standardized_error_response_format(self):
        """Test unauthenticated request returns standardized ApiResponse envelope."""
        res = client.get("/api/users/me")
        self.assertEqual(res.status_code, 401)
        data = res.json()
        self.assertFalse(data["success"])
        self.assertIn("error", data)
        self.assertEqual(data["message"], "Authentication token is required")
        print(" [PASS] Step 17: Standardized ApiResponse error envelope verified on 401.")


if __name__ == "__main__":
    unittest.main(verbosity=2)

