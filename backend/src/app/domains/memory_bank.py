# The "Black Box" of past failures
# In a real app, this would be a Vector Database (Pinecone/ChromaDB).

PAST_INCIDENTS = [
    {
        "id": "INC-2024-001",
        "name": "The 'Black Friday' Ledger Corruption",
        "trigger": "Bypassing QA to rush a hotfix",
        "outcome": "$4.2M Transaction Reversal",
        "keywords": ["bypass", "rush", "hotfix", "production", "friday"]
    },
    {
        "id": "INC-2023-089",
        "name": "The API Key Exposure Incident",
        "trigger": "Hardcoding credentials in deployment script",
        "outcome": "SEC Audit & Fine",
        "keywords": ["key", "cred", "secret", "env", "hardcode"]
    },
    {
        "id": "INC-2025-012",
        "name": "The 'Silent Fail' Data Loss",
        "trigger": "Ignoring unit test failures",
        "outcome": "72 Hours of Data Irrecoverable",
        "keywords": ["test", "ignore", "fail", "unit", "coverage"]
    }
]

def find_relevant_precedent(user_input: str):
    """
    A simple semantic search. 
    If the user's input matches keywords from a past disaster, return it.
    """
    user_input = user_input.lower()
    
    for incident in PAST_INCIDENTS:
        # Check if any keyword matches
        matches = [k for k in incident["keywords"] if k in user_input]
        if len(matches) >= 1:
            return incident
            
    return None