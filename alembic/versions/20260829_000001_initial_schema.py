"""Initial schema

Revision ID: 20260829_000001
Revises: 
Create Date: 2026-08-29 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geography


revision = "20260829_000001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis")

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("phone_number", sa.String(), nullable=True),
        sa.Column("password_hash", sa.String(), nullable=True),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.CheckConstraint("role IN ('customer', 'worker', 'admin')", name="ck_users_role"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("token_hash", sa.String(), nullable=False),
        sa.Column("family_id", sa.String(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("replaced_by_token_hash", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("token_hash", name="uq_refresh_tokens_token_hash"),
    )
    op.create_index(op.f("ix_refresh_tokens_family_id"), "refresh_tokens", ["family_id"], unique=False)
    op.create_index(op.f("ix_refresh_tokens_id"), "refresh_tokens", ["id"], unique=False)
    op.create_index(op.f("ix_refresh_tokens_user_id"), "refresh_tokens", ["user_id"], unique=False)

    op.create_table(
        "customer_profiles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", name="uq_customer_profiles_user_id"),
    )
    op.create_index(op.f("ix_customer_profiles_id"), "customer_profiles", ["id"], unique=False)

    op.create_table(
        "worker_profiles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("skills", sa.ARRAY(sa.String()), nullable=True),
        sa.Column("experience_years", sa.Integer(), nullable=True),
        sa.Column("rating", sa.Float(), nullable=True, server_default="0.0"),
        sa.Column("verification_status", sa.String(), nullable=True, server_default="pending"),
        sa.Column(
            "current_location",
            Geography(geometry_type="POINT", srid=4326, spatial_index=True),
            nullable=True,
        ),
        sa.CheckConstraint(
            "verification_status IN ('pending', 'approved', 'rejected')",
            name="worker_profiles_verification_status_check",
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", name="uq_worker_profiles_user_id"),
    )
    op.create_index(op.f("ix_worker_profiles_id"), "worker_profiles", ["id"], unique=False)

    op.create_table(
        "addresses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("street", sa.String(), nullable=True),
        sa.Column("city", sa.String(), nullable=True),
        sa.Column("state", sa.String(), nullable=True),
        sa.Column("postal_code", sa.String(), nullable=True),
        sa.Column(
            "coordinates",
            Geography(geometry_type="POINT", srid=4326, spatial_index=True),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_addresses_id"), "addresses", ["id"], unique=False)

    op.create_table(
        "service_categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("icon_name", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name", name="uq_service_categories_name"),
    )
    op.create_index(op.f("ix_service_categories_id"), "service_categories", ["id"], unique=False)


def downgrade() -> None:
    op.drop_table("service_categories")
    op.drop_table("addresses")
    op.drop_table("worker_profiles")
    op.drop_table("customer_profiles")
    op.drop_table("refresh_tokens")
    op.drop_table("users")
    op.execute("DROP EXTENSION IF EXISTS postgis")
