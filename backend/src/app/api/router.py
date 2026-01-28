from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List
from app.domains.tribunal_service import TribunalService
from app.domains.policy_engine import load_policy_document # <--- NEW IMPORT

# 1. Input Model (Flexible to catch whatever the frontend sends)
class TribunalRequest(BaseModel):
    scenario_id: str = "friday_deploy"
    selected_actions: List[str] = []
    reasoning_text: Optional[str] = None
    user_input: Optional[str] = None
    text: Optional[str] = None

    @property
    def final_input(self) -> str:
        return self.reasoning_text or self.user_input or self.text or ""

router = APIRouter()

# --- EXISTING ENDPOINT: JUDGMENT ---
@router.post("/v1/submit")
async def submit_judgment(payload: TribunalRequest):
    user_text = payload.final_input
    print(f"✅ RECEIVED INPUT: {user_text}")

    if not user_text:
        raise HTTPException(status_code=400, detail="No reasoning_text received.")

    # 2. THE RUBRIC (Keys match Archetypes: hawk, dove, owl)
    rubric = {
        "hawk": "Rate 1-5 on SAFETY VIOLATION. 5 = User is breaking rules. 1 = User is safe.",
        "dove": "Rate 1-5 on BUSINESS VALUE. 5 = High business value. 1 = Blocking business.",
        "owl": "Rate 1-5 on LOGIC/TONE. 5 = Professional. 1 = Emotional/Irrational."
    }

    # 3. THE CONTEXT
    rules_of_engagement = (
        "SCENARIO: Freeze Friday. Deployments are BANNED. "
        "User is 'Senior Backend Eng'. "
        "INSTRUCTION: If user is bypassing checks, HAWK score must be high."
    )

    try:
        # 4. Call the Brain (Now checks Memory + Policy internally)
        verdict = await TribunalService.conduct_tribunal(
            scenario_ctx=rules_of_engagement,
            user_input=user_text,
            actions=payload.selected_actions,
            rubric=rubric
        )
        
        print(f"🧠 VERDICT: {verdict}")
        return verdict
    
    except Exception as e:
        print(f"❌ ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- NEW ENDPOINT: POLICY UPLOAD ---
@router.post("/v1/upload-policy")
async def upload_policy(file: UploadFile = File(...)):
    """
    Receives a PDF file, extracts text, and sets it as the 'Active Law'.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only .pdf files are allowed.")
    
    try:
        # Read the file stream
        content = await file.read()
        
        # Send to the Policy Engine
        success, message = load_policy_document(content)
        
        if not success:
            raise HTTPException(status_code=500, detail=message)
            
        print(f"📜 POLICY UPDATED: {message}")
        return {"status": "success", "message": message}

    except Exception as e:
        print(f"❌ UPLOAD ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))