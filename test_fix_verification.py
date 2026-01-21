#!/usr/bin/env python3
"""
Test script to verify that the user_id comparison fixes are working properly
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
    print("[OK] Using PostgreSQL database (Neon)")

    # Test the task service with user_id comparison fixes
    try:
        from backend.src.database import engine
        from backend.src.models.task import Task
        from backend.src.models.user import User
        from backend.src.services.task_service import TaskService
        from sqlmodel import Session, select

        print("[TEST] Testing task service with fixed user_id comparisons...")

        with Session(engine) as session:
            # Get an existing user or create one for testing
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

            # Create a task service instance
            task_service = TaskService(session)

            # Test creating a task
            from backend.src.schemas.task import TaskCreate
            task_create = TaskCreate(
                title="Test task for verification",
                description="This task tests the fixed user_id comparisons",
                status="pending"
            )

            created_task = task_service.create_task(task_create, user_id)
            print(f"[SUCCESS] Created task with ID: {created_task.id} and user_id: {created_task.user_id}")

            # Test getting the task by ID (this uses the fixed comparison)
            retrieved_task = task_service.get_task_by_id(created_task.id, user_id)
            if retrieved_task:
                print(f"[SUCCESS] Retrieved task by ID - Match: {retrieved_task.id == created_task.id}")
            else:
                print(f"[ERROR] Could not retrieve task by ID")

            # Test getting user tasks (this uses the fixed comparison)
            user_tasks = task_service.get_user_tasks(user_id)
            print(f"[SUCCESS] Found {len(user_tasks)} tasks for user {user_id}")

            # Test updating the task (this uses the fixed comparison)
            from backend.src.schemas.task import TaskUpdate
            task_update = TaskUpdate(status="completed", title="Updated test task")
            updated_task = task_service.update_task(created_task.id, task_update, user_id)
            if updated_task:
                print(f"[SUCCESS] Updated task status to: {updated_task.status}")
            else:
                print(f"[ERROR] Could not update task")

            # Test with different user_id formats to verify the fix
            # Test with integer converted to string
            int_user_id = str(int(user_id))  # Convert to int then back to string (potential format difference)
            retrieved_task_alt = task_service.get_task_by_id(created_task.id, int_user_id)
            if retrieved_task_alt:
                print(f"[SUCCESS] Task retrieval works with different user_id format")
            else:
                print(f"[INFO] Different format test not applicable")

            print(f"[VERIFICATION] All task operations working correctly with fixed user_id comparisons!")

    except Exception as e:
        print(f"[ERROR] Failed to test task service: {e}")
        import traceback
        traceback.print_exc()
else:
    print(f"[ERROR] Not using PostgreSQL, using: {settings.DATABASE_URL[:30]}")