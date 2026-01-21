from fastapi import FastAPI, Request, Response # Added Request, Response
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware # Added BaseHTTPMiddleware
from src.config import settings
from src.api.v1.health import health_router
from src.api.v1.endpoints.auth import auth_router
from src.api.v1.endpoints.tasks import task_router
from src.api.v1.endpoints.conversations import router as conversation_router  # Conversations API router
from src.api.chat import router as chat_router  # Legacy Chat API router
from src.api.official_chat import router as official_chat_router  # Official Chat API router
from src.database import create_db_and_tables

# Custom Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Skip security headers for documentation endpoints
        if request.url.path in ["/docs", "/redoc"] or request.url.path.startswith("/openapi.json"):
            return response

        # HSTS Header
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        # CSP Header (example - adjust as needed for your frontend resources)
        response.headers["Content-Security-Policy"] = "default-src 'self'; style-src 'self' 'unsafe-inline';"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # Startup event
    print("FastAPI application starting up...")
    print(f"[APP] Active DATABASE_URL: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL}")
    create_db_and_tables() # Call to create database tables
    yield
    # Shutdown event
    print("FastAPI application shutting down.")

app = FastAPI(
    title="TaskFlow API",
    version="1.0.0",
    lifespan=lifespan,
    debug=True
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Security Headers Middleware
# app.add_middleware(SecurityHeadersMiddleware) # Commented out to fix HSTS issues on localhost

@app.get("/")
async def read_root():
    return {"message": "Welcome to TaskFlow API"}

# Include routers
app.include_router(health_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(task_router, prefix="/api/v1")
app.include_router(conversation_router, prefix="/api/v1/conversations")  # Conversations API router
app.include_router(chat_router)  # Legacy Chat API router
app.include_router(official_chat_router)  # Official Chat API router with OpenAI Agents SDK