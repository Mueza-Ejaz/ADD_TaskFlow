from sqlmodel import SQLModel, create_engine, Session
from .config import settings
from sqlmodel.sql.expression import Select, SelectOfScalar
import os

# Import models to register them with SQLModel metadata
from .models.conversation import Conversation
from .models.message import Message
from .models.task import Task

# Suppress warning for SQLModel's Select being a generic type
# See: https://sqlmodel.tiangolo.com/tutorial/where/#sqlmodel-select-and-selectofscalar
# for why this is needed for Python 3.9+
SelectOfScalar.inherit_cache = True
Select.inherit_cache = True


# Configure engine for SQLite with proper settings
connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}

# Log the database we are connecting to (masked for security)
db_url_log = settings.DATABASE_URL
if "@" in db_url_log:
    # Mask password in postgresql://user:pass@host...
    prefix = db_url_log.split("@")[0]
    suffix = db_url_log.split("@")[1]
    masked_prefix = prefix.split(":")[0] + ":******"
    print(f"[DB] Connecting to Database: {masked_prefix}@{suffix}")
else:
    print(f"[DB] Connecting to Database: {db_url_log}")

engine = create_engine(settings.DATABASE_URL, echo=True, connect_args=connect_args)

def create_db_and_tables():
    # Create directory if it doesn't exist
    if "sqlite:///" in settings.DATABASE_URL:
        db_path = settings.DATABASE_URL.replace("sqlite:///", "")
        # Handle relative paths properly
        db_dir = os.path.dirname(os.path.abspath(db_path)) if os.path.dirname(db_path) else os.getcwd()
        os.makedirs(db_dir, exist_ok=True)

    # Create all tables based on models
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