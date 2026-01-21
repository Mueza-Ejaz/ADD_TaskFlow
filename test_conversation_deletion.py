#!/usr/bin/env python3
"""
Test script to verify that conversation deletion is working properly
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
        from backend.src.models.conversation import Conversation
        from backend.src.models.user import User
        from sqlmodel import Session, select

        print("[TEST] Verifying conversation deletion functionality...")

        with Session(engine) as session:
            # Get all users to test with
            all_users = session.exec(select(User)).all()
            print(f"[INFO] Found {len(all_users)} users in database")

            # Get all conversations in the database
            all_conversations = session.exec(select(Conversation)).all()
            print(f"[INFO] Total conversations in database: {len(all_conversations)}")

            # Display all conversations with their user info
            for i, conv in enumerate(all_conversations, 1):
                print(f"  {i}. Conv ID: {conv.id}, User ID: {conv.user_id}, Created: {conv.created_at}")

                # Find the user who created this conversation
                conv_user = next((u for u in all_users if str(u.id) == str(conv.user_id)), None)
                if conv_user:
                    print(f"     -> Created by: {conv_user.email} ({conv_user.full_name})")
                else:
                    print(f"     -> Created by: Unknown user ID {conv.user_id}")
                print()

            # Test deleting a conversation (if any exist)
            if all_conversations:
                # Take the oldest conversation to avoid conflicts
                conversation_to_delete = all_conversations[0]
                conversation_id = conversation_to_delete.id
                print(f"[TEST] Attempting to delete conversation ID: {conversation_id}")

                # Get the conversation before deletion
                existing_conv = session.get(Conversation, conversation_id)
                if existing_conv:
                    print(f"[INFO] Found conversation to delete: ID {existing_conv.id}, User ID: {existing_conv.user_id}")

                    # Delete the conversation
                    session.delete(existing_conv)
                    session.commit()
                    print(f"[SUCCESS] Conversation {conversation_id} deleted successfully!")

                    # Verify it's gone
                    remaining_conv = session.get(Conversation, conversation_id)
                    if remaining_conv is None:
                        print(f"[VERIFICATION] Conversation {conversation_id} confirmed as deleted from database!")
                    else:
                        print(f"[ERROR] Conversation {conversation_id} still exists in database!")
                else:
                    print(f"[ERROR] Could not find conversation {conversation_id} to delete")
            else:
                print("[INFO] No conversations found to test deletion with")

            # Show remaining conversations
            remaining_conversations = session.exec(select(Conversation)).all()
            print(f"\n[INFO] Remaining conversations after test: {len(remaining_conversations)}")

    except Exception as e:
        print(f"[ERROR] Failed to connect to database or test conversation deletion: {e}")
        import traceback
        traceback.print_exc()
else:
    print(f"[ERROR] Not using PostgreSQL, using: {settings.DATABASE_URL[:30]}")