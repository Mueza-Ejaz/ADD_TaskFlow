from sqlmodel import SQLModel, create_engine, Session
from .config import settings
from sqlmodel.sql.expression import Select, SelectOfScalar

# Suppress warning for SQLModel's Select being a generic type
# See: https://sqlmodel.tiangolo.com/tutorial/where/#sqlmodel-select-and-selectofscalar
# for why this is needed for Python 3.9+
SelectOfScalar.inherit_cache = True
Select.inherit_cache = True


engine = create_engine(settings.DATABASE_URL, echo=True)

def create_db_and_tables():
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