import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

# Change to the backend directory to load .env properly
os.chdir(backend_path)

# Load environment variables explicitly
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("Loaded .env file")
except ImportError:
    print("dotenv not available, continuing...")

# Now import the settings
from src.config import settings

print("Current working directory:", os.getcwd())
print("DATABASE_URL from settings:", repr(settings.DATABASE_URL))
print("DATABASE_URL from environment:", repr(os.getenv('DATABASE_URL')))

# Test the database connection
from src.database import test_connection
print("Testing database connection...")
try:
    test_connection()
except Exception as e:
    print(f"Connection test failed: {e}")