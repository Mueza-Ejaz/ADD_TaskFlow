
import sys
import os
import asyncio
from sqlmodel import Session, select

sys.path.append(os.path.join(os.getcwd(), 'backend'))

# Monkeypatch Model to ensure we don't hit 404 on the model name
import google.generativeai as genai
original_init = genai.GenerativeModel
def mocked_model(model_name, *args, **kwargs):
    if "2.5" in model_name:
        print(f"Overriding {model_name} -> gemini-1.5-flash")
        model_name = "gemini-1.5-flash"
    return original_init(model_name, *args, **kwargs)
genai.GenerativeModel = mocked_model

from src.database import engine
from src.services.official_agent_service import OfficialAgentService
from src.schemas.chat import ChatRequest
from src.models.task import Task
from src.config import settings

def verify():
    print(f"Active DB URL: {settings.DATABASE_URL[:50]}...")
    if "sqlite" in settings.DATABASE_URL:
        print("FAIL: Config is still loading SQLite!")
        return False

    print("Initializing OfficialAgentService...")
    with Session(engine) as session:
        try:
            service = OfficialAgentService(session)
            
            task_title = "AGENT_DIRECT_TEST_NEON"
            print(f"Sending chat request to add task: {task_title}")
            
            req = ChatRequest(
                user_id="1",
                message=f"Add a task named '{task_title}'",
                conversation_id=None
            )
            
            resp = service.chat(req)
            print("Chatbot Response:", resp.message.content)
            
            # Check DB
            task = session.exec(select(Task).where(Task.title == task_title)).first()
            if task:
                print(f"SUCCESS: Found task {task.id} in DB!")
                return True
            else:
                 print("FAILED: Task not found in DB.")
                 return False
        except Exception as e:
            print(f"Service Error: {e}")
            return False

if __name__ == "__main__":
    if verify():
        print("VERIFICATION SUCCESSFUL")
    else:
        print("VERIFICATION FAILED")
