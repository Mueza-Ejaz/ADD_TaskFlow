#!/usr/bin/env python3
"""
Test script to verify Neon PostgreSQL connection and task creation
"""

import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Load environment variables explicitly and ensure they're set in the current process
script_dir = Path(__file__).parent / "backend"
dotenv_path = script_dir / ".env"

try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=dotenv_path)
    print("[OK] .env file loaded with dotenv")
except ImportError:
    print("[WARN] dotenv not available, relying on Pydantic to load .env")
except Exception as e:
    print(f"[WARN] Error loading .env with dotenv: {e}")

# If dotenv didn't load the DATABASE_URL, manually read and set it
if not os.getenv("DATABASE_URL"):
    print("[INFO] Attempting manual .env loading...")
    try:
        with open(dotenv_path, 'r', encoding='utf-8-sig') as f:
            for line in f:
                line = line.strip()
                if line.startswith('DATABASE_URL='):
                    # Extract the value, handling quotes
                    value = line.split('=', 1)[1].strip()
                    if value.startswith('"') and value.endswith('"'):
                        value = value[1:-1]  # Remove surrounding quotes
                    elif value.startswith("'") and value.endswith("'"):
                        value = value[1:-1]  # Remove surrounding quotes
                    os.environ['DATABASE_URL'] = value
                    print(f"[OK] Manually set DATABASE_URL: {value[:50]}...")
                    break
    except Exception as e:
        print(f"[ERROR] Could not manually load .env: {e}")

# Import settings after loading environment
from backend.src.config import settings
print(f"[CONFIG] DATABASE_URL: {settings.DATABASE_URL[:50]}...")

# Check if using PostgreSQL
if "postgresql" in settings.DATABASE_URL.lower():
    print("[OK] Using PostgreSQL database (likely Neon)")

    # Test database connection and create a sample task
    try:
        from backend.src.database import engine
        from backend.src.models.task import Task
        from backend.src.models.user import User
        from sqlmodel import Session, select

        print("[TEST] Testing database connection...")

        with Session(engine) as session:
            # Check if we can connect and query
            result = session.exec(select(Task)).all()
            print(f"[OK] Successfully connected to database. Found {len(result)} existing tasks")

            # Try to create a test user if one doesn't exist
            test_users = session.exec(select(User)).all()
            if test_users:
                user_id = str(test_users[0].id)  # Use existing user
                print(f"[INFO] Using existing user ID: {user_id}")
            else:
                # Create a test user
                from backend.src.auth.password import hash_password
                test_user = User(
                    email="test@example.com",
                    hashed_password=hash_password("testpassword123"),
                    full_name="Test User"
                )
                session.add(test_user)
                session.commit()
                session.refresh(test_user)
                user_id = str(test_user.id)
                print(f"[INFO] Created test user with ID: {user_id}")

            # Create a test task
            from datetime import datetime
            test_task = Task(
                user_id=user_id,
                title="FINAL VERIFICATION: Neon Data Save - Wednesday 21 Jan 2026",
                description="This task proves that the database connection fix is working and saving to Neon.",
                status="pending",
                created_at=datetime.utcnow()
            )

            session.add(test_task)
            session.commit()
            session.refresh(test_task)

            print(f"[SUCCESS] Test task created successfully with ID: {test_task.id}")
            print(f"[SUCCESS] Task saved to Neon PostgreSQL database!")
            print(f"[VERIFICATION] Task title: {test_task.title}")
            print(f"[VERIFICATION] Task user_id: {test_task.user_id}")
            print(f"[VERIFICATION] Database URL contains 'neon': {'neon' in settings.DATABASE_URL.lower()}")

    except Exception as e:
        print(f"[ERROR] Failed to connect to database or create task: {e}")
        import traceback
        traceback.print_exc()
else:
    print(f"[ERROR] Not using PostgreSQL, using: {settings.DATABASE_URL[:30]}")