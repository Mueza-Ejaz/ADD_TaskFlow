from src.database import test_connection

def test_db_connection():
    # This test will only pass if the DATABASE_URL in .env is correctly configured
    # and the database is accessible.
    assert test_connection() is True
