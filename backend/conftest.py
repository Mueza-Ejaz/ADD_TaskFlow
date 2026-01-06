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

# Import models to ensure they are registered with SQLModel.metadata
from backend.src.models.user import User
from backend.src.models.task import Task
from backend.src.main import app

# Use settings.TEST_DATABASE_URL which is sqlite:///:memory:
test_engine = create_engine(settings.TEST_DATABASE_URL, connect_args={"check_same_thread": False})

@pytest.fixture(name="database_setup", scope="session", autouse=True)
def database_setup_fixture():
    """
    Creates and drops tables for the entire test session.
    Runs once per test session.
    """
    SQLModel.metadata.create_all(test_engine)
    yield
    SQLModel.metadata.drop_all(test_engine)

@pytest.fixture(name="session")
def session_fixture(database_setup):
    """
    Provides a new session with a transaction for each test function.
    Rolls back the transaction after the test to ensure a clean state.
    """
    connection = test_engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(name="client")
async def client_fixture(session: Session):
    """
    Provides an AsyncClient for API requests and overrides dependencies.
    """
    def get_session_override():
        yield session

    app.dependency_overrides[get_session] = get_session_override
    
    # Override rate_limit_dependency for testing
    from backend.src.api.v1.endpoints.auth import rate_limit_dependency
    app.dependency_overrides[rate_limit_dependency] = lambda: None # Simply return None to bypass
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()
