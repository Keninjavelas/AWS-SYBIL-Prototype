from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from uuid import UUID

class ActionSelection(BaseModel):
    action_id: str
    order: int

class SubmissionCreate(BaseModel):
    scenario_id: UUID
    selected_actions: List[ActionSelection]
    reasoning_text: str

class GradingResult(BaseModel):
    submission_id: UUID
    final_score: int
    variance: float
    status: str
    details: Dict[str, Any] # Contains the Hawk/Dove/Owl breakdown