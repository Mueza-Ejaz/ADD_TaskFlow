#!/usr/bin/env python3
"""
Test script to check database configuration and connectivity
"""

import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Load environment variables explicitly
try:
    from dotenv import load_dotenv
    load_dotenv(verbose=True)
    print("[OK] .env file loaded with dotenv")
except ImportError:
    print("[WARN] dotenv not available, relying on Pydantic to load .env")
except Exception as e:
    print(f"[WARN] Error loading .env with dotenv: {e}")

print(f"Current working directory: {os.getcwd()}")
print(f"Backend directory: {backend_dir}")

# Check if .env file exists
env_file = backend_dir / ".env"
if env_file.exists():
    print(f"[OK] .env file exists: {env_file}")
    # Read file with handling for BOM
    with open(env_file, 'r', encoding='utf-8-sig') as f:
        content = f.read()
        print(f"  .env file contains DATABASE_URL: {'DATABASE_URL=' in content}")
else:
    print(f"[ERROR] .env file does not exist: {env_file}")

# Check environment variables
print(f"\nEnvironment variables:")
print(f"DATABASE_URL in os.environ: {os.getenv('DATABASE_URL', 'NOT SET')}")

# Import settings and check
try:
    from backend.src.config import settings
    print(f"\nSettings from Pydantic:")
    print(f"settings.DATABASE_URL: {repr(settings.DATABASE_URL)}")

    # Check if it's using the default
    if settings.DATABASE_URL == "sqlite:///taskflow.db":
        print("[WARN] Using default SQLite database instead of Neon PostgreSQL!")
    else:
        print("[OK] Using configured database (likely Neon PostgreSQL)")

except Exception as e:
    print(f"[ERROR] Error importing settings: {e}")

# Test database connection if using PostgreSQL
try:
    from backend.src.config import settings

    if "postgresql" in settings.DATABASE_URL.lower():
        print(f"\nTesting PostgreSQL connection...")
        from backend.src.database import test_connection
        success = test_connection()
        if success:
            print("[OK] PostgreSQL connection successful!")
        else:
            print("[ERROR] PostgreSQL connection failed!")
    else:
        print(f"\nUsing SQLite database, no remote connection to test")

except Exception as e:
    print(f"[ERROR] Error testing database connection: {e}")