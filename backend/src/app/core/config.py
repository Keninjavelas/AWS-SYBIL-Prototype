from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "S.Y.B.I.L."
    ENVIRONMENT: str = "LOCAL"

    # CRITICAL FIX: Added '+aiosqlite' to the protocol
    DATABASE_URL: Optional[str] = "sqlite+aiosqlite:///./sybil.db"
    
    GOOGLE_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    
    # Ollama Bridge
    OLLAMA_HOST: str = "http://host.docker.internal:11434"

    class Config:
        env_file = ".env"

settings = Settings()