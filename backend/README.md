# FixFlow Backend Setup

## Local database setup

From the project root:

```bash
docker compose up -d
```

This starts the PostgreSQL + PostGIS container defined in the project root Docker Compose file.

## Apply the schema

From the project root, run:

```bash
$env:PYTHONPATH = "backend"
python -m alembic -c alembic.ini upgrade head
```

On Unix/macOS shells, use:

```bash
PYTHONPATH=backend python -m alembic -c alembic.ini upgrade head
```

## Seed demo data

```bash
$env:PYTHONPATH = "backend"
python -c "from app.db.seed import seed_all; seed_all()"
```

The seed script creates the demo worker account with the credentials below:

- Email: demo.worker@fixflow.com
- Password: DemoWorker@123

This account is idempotent; running the seed again will not create duplicate service categories or duplicate worker records.

## Rollback

```bash
$env:PYTHONPATH = "backend"
python -m alembic -c alembic.ini downgrade base
```

## Notes

- The app expects PostgreSQL/PostGIS to be running before the Alembic migration is applied.
- The migration includes the PostGIS extension and geography-based location columns required by the worker and address models.
