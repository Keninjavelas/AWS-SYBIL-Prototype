import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.core.database import Base

# --- DOMAIN: SIMULATION ---
class Scenario(Base):
    __tablename__ = "scenarios"
    
    scenario_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    context_brief = Column(Text, nullable=False)
    # Stores: {"logs": "...", "slack": "..."}
    artifacts = Column(JSONB, nullable=False) 
    # Stores: [{"id": "A", "text": "Rollback", "type": "SAFE"}, ...]
    action_palette = Column(JSONB, nullable=False) 

# --- DOMAIN: GOVERNANCE ---
class Rubric(Base):
    __tablename__ = "rubrics"
    
    rubric_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id = Column(UUID(as_uuid=True), nullable=False)
    version = Column(String, default="v1.0")
    
    # Stores: {"risk": {"1": "...", "5": "..."}, "communication": {...}}
    criteria_map = Column(JSONB, nullable=False) 

# --- DOMAIN: TRIBUNAL (RESULTS) ---
class Submission(Base):
    __tablename__ = "submissions"
    
    submission_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id = Column(UUID(as_uuid=True), nullable=False)
    
    # Input
    selected_actions = Column(JSONB, nullable=False)
    reasoning_text = Column(Text)
    
    # Output (The Grades)
    hawk_result = Column(JSONB)
    dove_result = Column(JSONB)
    owl_result = Column(JSONB)
    
    final_score = Column(Integer)
    variance_score = Column(Integer)
    status = Column(String, default="PENDING") # PENDING, SCORED, FLAGGED
    
    created_at = Column(DateTime, default=datetime.utcnow)