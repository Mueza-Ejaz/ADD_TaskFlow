from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from pathlib import Path
from dotenv import load_dotenv

# Calculate path to backend/.env
# This file is in backend/src/config.py
# .env is in backend/.env
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BACKEND_DIR / ".env"

# Explicitly load .env file
load_dotenv(ENV_FILE, encoding="utf-8-sig")

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///taskflow.db"  # Default, overridden by .env
    # Add TEST_DATABASE_URL for pytest
    TEST_DATABASE_URL: str = "sqlite:///:memory:" # In-memory SQLite for testing
    JWT_SECRET_KEY: str = "your-very-secret-key-change-in-production-32chars" # Renamed from JWT_SECRET
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001"
    GEMINI_API_KEY: str = ""  # Keep for Gemini API
    OPENAI_API_KEY: str = ""  # Keep for potential fallback

    model_config = SettingsConfigDict(env_file=[".env", str(ENV_FILE)], extra="ignore")

settings = Settings()
