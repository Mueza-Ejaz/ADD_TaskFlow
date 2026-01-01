from fastapi import FastAPI
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi.middleware.cors import CORSMiddleware # Import CORSMiddleware
from .config import settings # Import settings
from .api.v1.health import health_router # Import health_router

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # Startup event
    print("FastAPI application starting up...")
    yield
    # Shutdown event
    print("FastAPI application shutting down.")

app = FastAPI(
    title="ADD_TaskFlow-App API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","), # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods
    allow_headers=["*"], # Allow all headers
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to ADD_TaskFlow-App API"}

# Include routers
app.include_router(health_router, prefix="/api/v1")