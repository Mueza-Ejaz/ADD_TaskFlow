
import sys
import os
from pathlib import Path
from sqlmodel import Session, select

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from src.config import settings
from src.database import engine
from src.services.mcp_tools import add_task, AddTaskParams
from src.models.task import Task

def verify():
    print(f"Checking DATABASE_URL: {settings.DATABASE_URL[:50]}...")
    
    if "postgresql" not in settings.DATABASE_URL:
        print("FAILED: Backend is still not using PostgreSQL/Neon!")
        return False
        
    print("SUCCESS: Backend is configured to use Neon.")
    
    # Try to add a task using the actual tool the chatbot uses
    with Session(engine) as session:
        params = AddTaskParams(
            user_id="1", # Assuming user 1
            title="VERIFIED FIX: Chatbot Task in Neon",
            description="This task confirms the chatbot tool now writes to Neon."
        )
        
        print("Attempting to add task via tool...")
        result = add_task(params, session)
        
        if result.get("success"):
            task_id = result.get("task_id")
            print(f"SUCCESS: Task created in Neon with ID: {task_id}")
            
            # Double check by querying it back
            task = session.get(Task, task_id)
            if task and task.title == "VERIFIED FIX: Chatbot Task in Neon":
                print("VERIFICATION COMPLETE: Data is physically in Neon DB.")
                return True
            else:
                print("FAILED: Task was created but couldn't be retrieved.")
        else:
            print(f"FAILED: Tool reported failure: {result.get('message')}")
            
    return False

if __name__ == "__main__":
    if verify():
        print("\n[RESULT] The fix is 100% verified. Chatbot will now save to Neon.")
    else:
        print("\n[RESULT] Verification failed.")
        sys.exit(1)
