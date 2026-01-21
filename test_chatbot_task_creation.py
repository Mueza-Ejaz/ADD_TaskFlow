#!/usr/bin/env python3
"""
Test script to simulate chatbot task creation and verify it's saved to Neon
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

    try:
        from backend.src.database import engine
        from backend.src.models.task import Task
        from backend.src.models.user import User
        from sqlmodel import Session, select
        from backend.src.services.mcp_tools import add_task, AddTaskParams

        print("[TEST] Simulating chatbot task creation...")

        with Session(engine) as db_session:
            # Find a user to create task for (using the first user)
            user = db_session.exec(select(User)).first()

            if user:
                print(f"[INFO] Using user: {user.email} (ID: {user.id})")

                # Simulate chatbot task creation using the MCP tools
                task_params = AddTaskParams(
                    user_id=str(user.id),  # Using the actual user ID from database
                    title="VERIFIED: Chatbot Task Creation Test",
                    description="This task was created via the chatbot simulation to verify functionality."
                )

                result = add_task(task_params, db_session)

                print(f"[RESULT] Task creation result: {result}")

                if result.get("success"):
                    print(f"[SUCCESS] Chatbot task created successfully!")
                    print(f"  - Task ID: {result.get('task_id')}")
                    print(f"  - Message: {result.get('message')}")

                    # Verify the task was saved to the database
                    created_task = db_session.get(Task, result.get('task_id'))
                    if created_task:
                        print(f"[VERIFICATION] Task found in database!")
                        print(f"  - Title: {created_task.title}")
                        print(f"  - Description: {created_task.description}")
                        print(f"  - User ID: {created_task.user_id}")
                        print(f"  - Status: {created_task.status}")
                        print(f"  - Created at: {created_task.created_at}")
                    else:
                        print(f"[ERROR] Task was not saved to database!")
                else:
                    print(f"[ERROR] Task creation failed: {result.get('message')}")
            else:
                print(f"[ERROR] No users found in database to create task for")

            # Also show the most recent tasks to confirm they're in Neon
            print(f"\n[INFO] Fetching recent tasks from Neon database...")
            recent_tasks = db_session.exec(select(Task).order_by(Task.created_at.desc()).limit(5)).all()
            print(f"[SUCCESS] Found {len(recent_tasks)} recent tasks in Neon database:")
            for i, task in enumerate(recent_tasks, 1):
                print(f"  {i}. '{task.title}' (ID: {task.id}, User: {task.user_id}, Status: {task.status})")

    except Exception as e:
        print(f"[ERROR] Failed to test chatbot task creation: {e}")
        import traceback
        traceback.print_exc()
else:
    print(f"[ERROR] Not using PostgreSQL, using: {settings.DATABASE_URL[:30]}")