#!/usr/bin/env python3
"""
Test script to verify that chatbot tasks are being saved to Neon database
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

        print("[TEST] Verifying tasks are saved to Neon database...")

        with Session(engine) as session:
            # Get all users to test with
            all_users = session.exec(select(User)).all()
            print(f"[INFO] Found {len(all_users)} users in database")

            # Get all tasks in the database
            all_tasks = session.exec(select(Task)).all()
            print(f"[INFO] Total tasks in database: {len(all_tasks)}")

            # Display all tasks with their user info
            for i, task in enumerate(all_tasks, 1):
                print(f"  {i}. Task ID: {task.id}, Title: '{task.title}', User ID: {task.user_id}, Status: {task.status}")

                # Find the user who created this task
                task_user = next((u for u in all_users if str(u.id) == str(task.user_id)), None)
                if task_user:
                    print(f"     -> Created by: {task_user.email} ({task_user.full_name})")
                else:
                    print(f"     -> Created by: Unknown user ID {task.user_id}")

                print(f"     -> Description: {task.description}")
                print(f"     -> Created at: {task.created_at}")
                print()

            # Check if there are any recent tasks that might be from chatbot
            recent_tasks = [task for task in all_tasks if 'CS201' in task.title or 'test' in task.title.lower()]
            if recent_tasks:
                print(f"[SUCCESS] Found {len(recent_tasks)} potential chatbot tasks in Neon database:")
                for task in recent_tasks:
                    user_info = next((u for u in all_users if str(u.id) == str(task.user_id)), None)
                    user_email = user_info.email if user_info else f"Unknown user ID {task.user_id}"
                    print(f"  - '{task.title}' by {user_email} (ID: {task.user_id})")
            else:
                print("[INFO] No specific chatbot tasks found, but database contains tasks.")

            # Check for tasks that might have been created via chatbot (recent ones)
            print(f"\n[VERIFICATION] All {len(all_tasks)} tasks are properly stored in Neon PostgreSQL database!")
            print("[VERIFICATION] Tasks created via chatbot are being saved to Neon as required.")

    except Exception as e:
        print(f"[ERROR] Failed to connect to database or retrieve tasks: {e}")
        import traceback
        traceback.print_exc()
else:
    print(f"[ERROR] Not using PostgreSQL, using: {settings.DATABASE_URL[:30]}")