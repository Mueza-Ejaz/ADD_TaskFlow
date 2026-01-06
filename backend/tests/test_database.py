from sqlmodel import Session, SQLModel, create_engine
import pytest
from sqlalchemy import text
from backend.src.database import create_db_and_tables, test_connection, get_session, engine as db_engine
from backend.src.config import settings
import os
from unittest.mock import patch, MagicMock


@pytest.mark.asyncio
async def test_db_session(session: Session):
    assert session is not None


def test_create_db_and_tables(tmp_path, monkeypatch):
    db_file = tmp_path / "test.db"
    test_db_url = f"sqlite:///{db_file}"

    monkeypatch.setattr(settings, "DATABASE_URL", test_db_url)

    test_engine = create_engine(settings.DATABASE_URL, echo=True, connect_args={"check_same_thread": False})
    # Temporarily patch the global engine used by create_db_and_tables
    monkeypatch.setattr("backend.src.database.engine", test_engine)
    SQLModel.metadata.create_all(test_engine)

    create_db_and_tables()

    assert db_file.exists()
    assert db_file.is_file()




def test_test_connection_failure(monkeypatch):
    # Simulate a database connection error by patching engine.connect
    with patch('backend.src.database.engine.connect') as mock_connect:
        mock_connect.side_effect = Exception("Simulated connection error")
        # Test failed connection
        assert test_connection() is False


