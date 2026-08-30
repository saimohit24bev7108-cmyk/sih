# FixFlow Backend - Layer 3 Database Foundation

Production-ready FastAPI + PostgreSQL/PostGIS backend foundation for **FixFlow** (SIH26089).

---

## 🚀 Quickstart & Database Initialization Flow

### 1. Prerequisites
- Python 3.10+
- Docker & Docker Compose (or PostgreSQL 15+ with PostGIS 3.3+)

### 2. Environment Setup
```bash
# Copy example environment file
cp .env.example .env

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Database Initialization Flow
Run these exact commands to spin up PostgreSQL/PostGIS and apply the schema:

```bash
# 1. Start PostgreSQL with PostGIS extension enabled
docker compose up -d

# 2. Run Alembic initial database foundation migration
alembic upgrade head

# 3. Seed initial service categories, admin, customer, and worker accounts
python -m app.db.seed
```

### 4. Start the Application
```bash
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation: `http://localhost:8000/docs`

---

## 🔑 Demo Login Credentials

All demo accounts are pre-seeded with real bcrypt password hashes:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gigcoop.in` | `password123` | Platform admin with worker verification privileges |
| **Customer** | `customer@fixflow.local` | `FixFlow2026!` | Standard customer account with pre-set address |
| **Customer** | `priya@example.com` | `password123` | Customer with profile in Madhapur |
| **Worker (Approved)** | `suresh@worker.com` | `password123` | Approved Plumbing specialist (Rating: 4.8) |
| **Worker (Approved)** | `ajay@worker.com` | `password123` | Approved Electrical specialist (Rating: 4.9) |
| **Worker (Approved)** | `sunita@worker.com` | `password123` | Approved Cleaning specialist (Rating: 4.7) |
| **Worker (Pending)** | `pending.worker@fixflow.local` | `password123` | Pending verification worker |

---

## 🛡️ API Endpoints & Role Matrix

| Method | Endpoint | Description | Required Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Email + password login | Public |
| `POST` | `/api/auth/refresh` | Token rotation & session refresh | Public (valid refresh token) |
| `POST` | `/api/auth/otp/send` | Send OTP SMS code | Public |
| `POST` | `/api/auth/otp/verify` | Verify OTP code & authenticate | Public |
| `GET` | `/api/health` | Service & DB health check | Public |
| `GET` | `/api/services/categories` | List active service categories from DB | Public |
| `GET` | `/api/users/me` | Fetch authenticated user profile | Any Authenticated |
| `PATCH` | `/api/users/me` | Update name, phone, avatar | Any Authenticated |
| `GET` | `/api/customer/profile` | Get customer profile & bio | `customer` |
| `PATCH` | `/api/customer/profile` | Update customer language & bio | `customer` |
| `GET` | `/api/worker/profile` | Get worker's own full profile | `worker` |
| `PATCH` | `/api/worker/profile` | Self-update rate, experience, availability | `worker` |
| `PATCH` | `/api/workers/me` | Alias for self-updating worker profile | `worker` |
| `GET` | `/api/workers` | List all approved workers | Any Authenticated |
| `GET` | `/api/workers/{id}` | Get worker details by ID | Any Authenticated |
| `GET` | `/api/admin/workers/pending` | List pending worker profiles | `admin` |
| `PATCH` | `/api/admin/workers/{id}/verify` | Approve or reject worker application | `admin` |
| `POST` | `/api/service-requests` | Create service request with PostGIS POINT | `customer` |
| `GET` | `/api/service-requests` | List customer's service requests | `customer` |

---

## 🧪 Database Migration Verification

```bash
# Check current migration revision
alembic current

# Revert full schema to base
alembic downgrade base

# Re-apply full schema to head
alembic upgrade head

# Run automated verification test suite
python test_layer3_verification.py
```
