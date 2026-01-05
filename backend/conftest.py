# backend/conftest.py
import sys
import os
import pytest
from sqlmodel import Session, SQLModel, create_engine
from httpx import AsyncClient
from backend.src.main import app
from backend.src.database import get_session
from backend.src.config import settings

# Get the path to the 'backend' directory
backend_dir = os.path.abspath(os.path.dirname(__file__))

# Add the 'src' directory within 'backend' to the Python path
sys.path.insert(0, os.path.join(backend_dir, 'src'))

# Add the 'backend' directory itself to the Python path
sys.path.insert(0, backend_dir)

# Add the project root to the Python path (one level up from backend)
project_root = os.path.abspath(os.path.join(backend_dir, '..'))
sys.path.insert(0, project_root)

from backend.src.models.user import User
from backend.src.models.task import Task
from backend.src.main import app

# Setup a test database session for each function-scoped test
@pytest.fixture(name="session")
def session_fixture():
    # Use an in-memory SQLite database for testing
    # This ensures a clean database for each test function
    engine = create_engine("sqlite:///:memory:")
    
    # Drop all tables and then create all tables before each test function
    # This ensures a clean state
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        yield session
    
    # Drop all tables after each test function
    SQLModel.metadata.drop_all(engine)
    engine.dispose()

# Setup a test client for API requests
@pytest.fixture(name="client")
async def client_fixture(session: Session):
    def get_session_override():
        yield session

    app.dependency_overrides[get_session] = get_session_override
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()
