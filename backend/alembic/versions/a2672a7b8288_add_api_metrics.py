"""add_api_metrics

Revision ID: a2672a7b8288
Revises: 001_initial_schema
Create Date: 2026-06-25 11:38:53.961860

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a2672a7b8288'
down_revision = '001_initial_schema'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Safe context block for Postgres Enums (Ensures all custom types exist)
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE traffic_source_type_enum ADD VALUE IF NOT EXISTS 'LOAD_BALANCER'")
        op.execute("ALTER TYPE traffic_source_type_enum ADD VALUE IF NOT EXISTS 'OPENAPI_SPEC'")

    # 2. Idempotent column additions using raw SQL (Bypasses DuplicateColumn errors)
    op.execute("ALTER TABLE apis ADD COLUMN IF NOT EXISTS average_response_time_ms FLOAT DEFAULT '100.0' NOT NULL")
    op.execute("ALTER TABLE apis ADD COLUMN IF NOT EXISTS error_rate_percent FLOAT DEFAULT '0.0' NOT NULL")

    # 3. Run structural changes and type castings
    op.alter_column('alerts', 'alert_type',
               existing_type=sa.VARCHAR(length=30),
               type_=sa.Enum('ZOMBIE_RESURRECTION', 'SHADOW_DISCOVERED', 'SECURITY_VIOLATION', name='alert_type_enum'),
               existing_nullable=False,
               postgresql_using='alert_type::alert_type_enum')
               
    op.alter_column('api_security_posture', 'severity',
               existing_type=sa.VARCHAR(length=20),
               type_=sa.Enum('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', name='severity_level_enum'),
               existing_nullable=False,
               postgresql_using='severity::severity_level_enum')
               
    op.alter_column('apis', 'current_status',
               existing_type=sa.VARCHAR(length=20),
               type_=sa.Enum('ACTIVE', 'DEPRECATED', 'ZOMBIE', 'SHADOW', name='api_status_enum'),
               existing_nullable=False,
               postgresql_using='current_status::api_status_enum')
               
    op.alter_column('traffic_sources', 'source_type',
               existing_type=sa.VARCHAR(length=20),
               type_=sa.Enum('GATEWAY', 'VPC_FLOW', 'LOAD_BALANCER', 'OPENAPI_SPEC', name='traffic_source_type_enum'),
               existing_nullable=False,
               postgresql_using='source_type::traffic_source_type_enum')


def downgrade() -> None:
    op.alter_column('traffic_sources', 'source_type',
               existing_type=sa.Enum('GATEWAY', 'VPC_FLOW', 'LOAD_BALANCER', 'OPENAPI_SPEC', name='traffic_source_type_enum'),
               type_=sa.VARCHAR(length=20),
               existing_nullable=False,
               postgresql_using='source_type::varchar')
    op.alter_column('apis', 'current_status',
               existing_type=sa.Enum('ACTIVE', 'DEPRECATED', 'ZOMBIE', 'SHADOW', name='api_status_enum'),
               type_=sa.VARCHAR(length=20),
               existing_nullable=False,
               postgresql_using='current_status::varchar')
    op.drop_column('apis', 'error_rate_percent')
    op.drop_column('apis', 'average_response_time_ms')
    op.alter_column('api_security_posture', 'severity',
               existing_type=sa.Enum('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', name='severity_level_enum'),
               type_=sa.VARCHAR(length=20),
               existing_nullable=False,
               postgresql_using='severity::varchar')
    op.alter_column('alerts', 'alert_type',
               existing_type=sa.Enum('ZOMBIE_RESURRECTION', 'SHADOW_DISCOVERED', 'SECURITY_VIOLATION', name='alert_type_enum'),
               type_=sa.VARCHAR(length=30),
               existing_nullable=False,
               postgresql_using='alert_type::varchar')
