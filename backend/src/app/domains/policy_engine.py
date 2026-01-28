from pypdf import PdfReader
from io import BytesIO

# Global variable to store the "Current Law" in memory
# In production, this would be a Vector DB (FAISS/Pinecone)
ACTIVE_POLICY_TEXT = ""

def load_policy_document(file_content: bytes):
    global ACTIVE_POLICY_TEXT
    try:
        reader = PdfReader(BytesIO(file_content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        # Truncate to avoid token limits (keep first 10k chars for this prototype)
        ACTIVE_POLICY_TEXT = text[:10000] 
        return True, f"Policy loaded. Length: {len(ACTIVE_POLICY_TEXT)} chars."
    except Exception as e:
        return False, str(e)

def get_active_policy():
    return ACTIVE_POLICY_TEXT