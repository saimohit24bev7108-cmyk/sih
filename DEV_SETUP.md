# Developer Setup & Database Initialization Guide

This document details the exact sequence required to initialize, migrate, seed, and verify the FixFlow Layer 4 backend database.

## 1. Automated Initialization Commands

```bash
# Step 1: Start PostgreSQL + PostGIS 15 container in background
docker compose up -d

# Step 2: Apply the full Layer 4 database migration
alembic upgrade head

# Step 3: Seed initial service categories, admin, customer, and workers (idempotent)
python -m app.db.seed
```

## 2. Alembic Migration Commands

```bash
# View current database revision
alembic current

# Check pending migrations vs database head
alembic heads

# Rollback entire schema cleanly to empty database
alembic downgrade base

# Re-run migration to head
alembic upgrade head
```

## 3. Running Automated Verification Suite

```bash
python test_layer3_verification.py
python test_layer4_verification.py
```
These scripts run automated tests verifying schema tables, seed idempotency, authentication with real bcrypt hashes, role-restricted profile CRUD, category listing, worker list/detail/self-update, admin verification workflow, service request creation, idempotency locking, booking creation, and state-machine enforced status transitions.
