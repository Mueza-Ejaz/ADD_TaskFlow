#!/usr/bin/env python3
"""Script to test database connection and check if tables exist"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from src.database import test_connection, engine
from src.models.task import Task
from src.models.conversation import Conversation
from src.models.message import Message
from sqlmodel import select, Session

def check_tables_exist():
    """Check if tables exist and have data"""
    try:
        # Test the connection first
        print("Testing database connection...")
        connection_ok = test_connection()

        if not connection_ok:
            print("[ERROR] Database connection failed!")
            return

        print("[SUCCESS] Database connection successful!")

        # Check if tables exist by trying to query them
        with Session(engine) as session:
            # Check tasks
            try:
                tasks = session.exec(select(Task)).all()
                print(f"[SUCCESS] Tasks table exists, found {len(tasks)} tasks")
                for task in tasks[-5:]:  # Show last 5 tasks
                    print(f"   - Task {task.id}: {task.title} (User: {task.user_id})")
            except Exception as e:
                print(f"[ERROR] Error querying tasks table: {e}")

            # Check conversations
            try:
                conversations = session.exec(select(Conversation)).all()
                print(f"[SUCCESS] Conversations table exists, found {len(conversations)} conversations")
            except Exception as e:
                print(f"[ERROR] Error querying conversations table: {e}")

            # Check messages
            try:
                messages = session.exec(select(Message)).all()
                print(f"[SUCCESS] Messages table exists, found {len(messages)} messages")
            except Exception as e:
                print(f"[ERROR] Error querying messages table: {e}")

    except Exception as e:
        print(f"[ERROR] Error during database check: {e}")

if __name__ == "__main__":
    check_tables_exist()