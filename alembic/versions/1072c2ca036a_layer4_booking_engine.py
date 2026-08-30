"""layer4_booking_engine

Revision ID: 1072c2ca036a
Revises: 20260829_000001
Create Date: 2026-08-30 23:54:01.900900

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geography
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '1072c2ca036a'
down_revision: Union[str, None] = '20260829_000001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Service Requests
    op.create_table(
        "service_requests",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("customer_id", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("location", Geography(geometry_type="POINT", srid=4326, spatial_index=True), nullable=False),
        sa.Column("address_id", sa.Integer(), nullable=True),
        sa.Column("status", sa.String(), nullable=False, server_default="open"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.CheckConstraint("status IN ('open', 'matched', 'cancelled', 'expired')", name="service_requests_status_check"),
        sa.ForeignKeyConstraint(["address_id"], ["addresses.id"]),
        sa.ForeignKeyConstraint(["category_id"], ["service_categories.id"]),
        sa.ForeignKeyConstraint(["customer_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id")
    )
    op.create_index(op.f("ix_service_requests_id"), "service_requests", ["id"], unique=False)

    # Bookings
    op.create_table(
        "bookings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("service_request_id", sa.Integer(), nullable=False),
        sa.Column("customer_id", sa.Integer(), nullable=False),
        sa.Column("worker_id", sa.Integer(), nullable=True),
        sa.Column("status", sa.String(), nullable=False, server_default="REQUESTED"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("price_estimate_min", sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column("price_estimate_max", sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column("requested_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("accepted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("arrived_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("cancelled_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("cancellation_reason", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.CheckConstraint(
            "status IN ('REQUESTED', 'ACCEPTED', 'WORKER_ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'PAYMENT_PENDING', 'PAID', 'RATED', 'CANCELLED', 'DISPUTED')",
            name="bookings_status_check",
        ),
        sa.ForeignKeyConstraint(["customer_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["service_request_id"], ["service_requests.id"]),
        sa.ForeignKeyConstraint(["worker_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("service_request_id", name="uq_bookings_service_request_id")
    )
    op.create_index(op.f("ix_bookings_id"), "bookings", ["id"], unique=False)
    op.create_index(op.f("ix_bookings_status"), "bookings", ["status"], unique=False)
    op.create_index(op.f("ix_bookings_customer_id"), "bookings", ["customer_id"], unique=False)
    op.create_index(op.f("ix_bookings_worker_id"), "bookings", ["worker_id"], unique=False)

    # Booking Status History
    op.create_table(
        "booking_status_history",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("booking_id", sa.Integer(), nullable=False),
        sa.Column("from_status", sa.String(), nullable=False),
        sa.Column("to_status", sa.String(), nullable=False),
        sa.Column("changed_by_user_id", sa.Integer(), nullable=True),
        sa.Column("changed_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"]),
        sa.ForeignKeyConstraint(["changed_by_user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id")
    )
    op.create_index(op.f("ix_booking_status_history_id"), "booking_status_history", ["id"], unique=False)

    # Idempotency Keys
    op.create_table(
        "idempotency_keys",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("key", sa.String(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("endpoint", sa.String(), nullable=False),
        sa.Column("request_hash", sa.String(), nullable=False),
        sa.Column("response_body", sa.Text().with_variant(postgresql.JSONB(astext_type=sa.Text()), 'postgresql'), nullable=True),
        sa.Column("status_code", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("key", "user_id", "endpoint", name="uq_idempotency_keys_key_user_endpoint")
    )
    op.create_index(op.f("ix_idempotency_keys_id"), "idempotency_keys", ["id"], unique=False)
    op.create_index(op.f("ix_idempotency_keys_key"), "idempotency_keys", ["key"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_idempotency_keys_key"), table_name="idempotency_keys")
    op.drop_index(op.f("ix_idempotency_keys_id"), table_name="idempotency_keys")
    op.drop_table("idempotency_keys")
    
    op.drop_index(op.f("ix_booking_status_history_id"), table_name="booking_status_history")
    op.drop_table("booking_status_history")
    
    op.drop_index(op.f("ix_bookings_worker_id"), table_name="bookings")
    op.drop_index(op.f("ix_bookings_customer_id"), table_name="bookings")
    op.drop_index(op.f("ix_bookings_status"), table_name="bookings")
    op.drop_index(op.f("ix_bookings_id"), table_name="bookings")
    op.drop_table("bookings")
    
    op.drop_index(op.f("ix_service_requests_id"), table_name="service_requests")
    op.drop_table("service_requests")
