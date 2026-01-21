#!/usr/bin/env python3
"""
Test script to verify user authentication and create user if needed
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
        from backend.src.models.user import User
        from backend.src.models.task import Task
        from sqlmodel import Session, select
        from backend.src.auth.password import hash_password
        import hashlib

        print("[TEST] Checking for user 'muezaejaz@gmail.com'...")

        with Session(engine) as session:
            # Check if user exists
            user = session.exec(select(User).where(User.email == "muezaejaz@gmail.com")).first()

            if user:
                print(f"[SUCCESS] User 'muezaejaz@gmail.com' found with ID: {user.id}")
                print(f"  Full name: {user.full_name}")
                print(f"  Created: {user.created_at}")
            else:
                print(f"[INFO] User 'muezaejaz@gmail.com' not found. Creating user...")

                # Create the user with a default password
                # For security, we'll use a default password that the user can change later
                default_password = "DefaultPass123!"  # Strong default password
                hashed_pw = hash_password(default_password)

                new_user = User(
                    email="muezaejaz@gmail.com",
                    hashed_password=hashed_pw,
                    full_name="Mueza Ejaz"
                )

                session.add(new_user)
                session.commit()
                session.refresh(new_user)

                print(f"[SUCCESS] Created user 'muezaejaz@gmail.com' with ID: {new_user.id}")
                print(f"  Please login with email: muezaejaz@gmail.com")
                print(f"  And password: DefaultPass123!")
                print(f"  Remember to change your password after first login!")

            # Also check if there are any existing users
            all_users = session.exec(select(User)).all()
            print(f"[INFO] Total users in database: {len(all_users)}")
            for u in all_users:
                print(f"  - ID: {u.id}, Email: {u.email}, Name: {u.full_name}")

    except Exception as e:
        print(f"[ERROR] Failed to connect to database or manage users: {e}")
        import traceback
        traceback.print_exc()
else:
    print(f"[ERROR] Not using PostgreSQL, using: {settings.DATABASE_URL[:30]}")