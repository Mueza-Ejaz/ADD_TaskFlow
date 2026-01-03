from sqlmodel import SQLModel, create_engine, Session
from .config import settings
from sqlmodel.sql.expression import Select, SelectOfScalar
import os

# Suppress warning for SQLModel's Select being a generic type
# See: https://sqlmodel.tiangolo.com/tutorial/where/#sqlmodel-select-and-selectofscalar
# for why this is needed for Python 3.9+
SelectOfScalar.inherit_cache = True
Select.inherit_cache = True


# Configure engine for SQLite with proper settings
connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
engine = create_engine(settings.DATABASE_URL, echo=True, connect_args=connect_args)

def create_db_and_tables():
    # Create directory if it doesn't exist
    db_path = settings.DATABASE_URL.replace("sqlite:///", "")
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

def test_connection():
    try:
        with engine.connect() as connection:
            connection.execute(SQLModel.text("SELECT 1")) # Use SQLModel.text for raw SQL
        print("Database connection successful!")
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False