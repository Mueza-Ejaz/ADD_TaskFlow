from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    DATABASE_URL: str = f"sqlite:///{os.path.join(os.path.dirname(os.path.dirname(__file__)), 'taskflow.db')}"
    # Add TEST_DATABASE_URL for pytest
    TEST_DATABASE_URL: str = "sqlite:///:memory:" # In-memory SQLite for testing
    JWT_SECRET_KEY: str = "your-very-secret-key-change-in-production-32chars" # Renamed from JWT_SECRET
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
