"""add_score_history

Revision ID: 002
Revises: 001_initial_schema
Create Date: 2026-06-30 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002'
down_revision = 'a2672a7b8288'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table('lifecycle_score_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('api_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('zombie_score', sa.Float(), nullable=False),
        sa.Column('classification', sa.String(length=20), nullable=False),
        sa.Column('recorded_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_backfilled', sa.Boolean(), server_default='false', nullable=False),
        sa.ForeignKeyConstraint(['api_id'], ['apis.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_lifecycle_score_history_api_id'), 'lifecycle_score_history', ['api_id'], unique=False)
    op.create_index(op.f('ix_lifecycle_score_history_recorded_at'), 'lifecycle_score_history', ['recorded_at'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_lifecycle_score_history_recorded_at'), table_name='lifecycle_score_history')
    op.drop_index(op.f('ix_lifecycle_score_history_api_id'), table_name='lifecycle_score_history')
    op.drop_table('lifecycle_score_history')
