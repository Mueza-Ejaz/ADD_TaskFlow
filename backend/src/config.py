from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@host:port/dbname"
    JWT_SECRET: str = "supersecretjwtkey" # Change this in production
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
