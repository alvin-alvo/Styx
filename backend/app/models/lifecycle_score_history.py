from datetime import datetime
import uuid
from sqlalchemy import Column, Float, String, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import Base

class LifecycleScoreHistory(Base):
    __tablename__ = "lifecycle_score_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    api_id = Column(UUID(as_uuid=True), ForeignKey("apis.id", ondelete="CASCADE"), nullable=False, index=True)
    zombie_score = Column(Float, nullable=False)
    classification = Column(String(20), nullable=False)
    recorded_at = Column(DateTime(timezone=True), nullable=False, index=True, default=datetime.utcnow)
    is_backfilled = Column(Boolean, nullable=False, server_default='false', default=False)

    api = relationship("API")
