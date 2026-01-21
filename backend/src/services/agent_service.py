"""
Agent Service for managing AI Agent interactions
Handles conversation history loading, agent initialization, and response processing
Uses Google Gemini model with native Function Calling and Rate Limit Handling
"""

import os
import json
import time
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlmodel import Session

import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

from google.generativeai import GenerativeModel
import google.generativeai as genai

from ..models.conversation import Conversation
from ..models.message import Message, MessageRole
from ..schemas.chat import ChatRequest, ChatResponse, ChatMessage
from .mcp_tools import (
    add_task, list_tasks, update_task, complete_task, delete_task,
    AddTaskParams, ListTasksParams, UpdateTaskParams, CompleteTaskParams, DeleteTaskParams
)
from .chat_service import ChatService
from ..config import settings


class AgentService:
    def __init__(self, db_session: Session):
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")

        genai.configure(api_key=api_key)
        
        # Tools for Gemini - with enhanced descriptions for better context understanding
        def tool_add_task(user_id: str, title: str, description: str = ""):
            """Creates a new task for the current user. The user_id is automatically provided by the system, so the user does not need to specify it. Parameters: title (required), description (optional)."""
            return "Pending"

        def tool_list_tasks(user_id: str, status: str = None):
            """Lists all tasks for the current user. The user_id is automatically provided by the system, so the user does not need to specify it. Parameters: status (optional) - filter tasks by status (e.g., 'pending', 'completed')."""
            return "Pending"

        def tool_update_task(user_id: str, task_id: int = None, title: str = None, description: str = None, status: str = None):
            """Updates an existing task for the current user. The user_id is automatically provided by the system, so the user does not need to specify it. Parameters: task_id (optional) OR (title and status must be provided together to find and update the task by title). If user wants to update status only, they can say 'mark task [title] as [status]' and the system will find the task by title and update its status. Common statuses: 'pending', 'in progress', 'completed'. Status values are automatically normalized to match system expectations (e.g., 'in progress' becomes 'in-progress'). If updating by ID, only one of title, description, or status is required."""
            return "Pending"

        def tool_complete_task(user_id: str, task_id: int):
            """Marks a task as completed for the current user. The user_id is automatically provided by the system, so the user does not need to specify it. Parameters: task_id (required)."""
            return "Pending"

        def tool_delete_task(user_id: str, task_id: int = None, title: str = None):
            """Deletes a task for the current user. The user_id is automatically provided by the system, so the user does not need to specify it. Parameters: task_id (optional) OR title (optional) - either the task ID or exact/partial title to identify the task to delete. If user says 'delete task smoking with description', the title would be 'smoking with description'. Priority is given to task_id if both are provided."""
            return "Pending"

        self.gemini_tools = [tool_add_task, tool_list_tasks, tool_update_task, tool_complete_task, tool_delete_task]
        
        # Using gemini-2.5-flash as it's highly stable and widely available across all regions/keys
        self.model = GenerativeModel('gemini-2.5-flash', tools=self.gemini_tools)
        self.db_session = db_session
        self.chat_service = ChatService(db_session)

        self.tool_map = {
            "tool_add_task": {"func": add_task, "schema": AddTaskParams},
            "tool_list_tasks": {"func": list_tasks, "schema": ListTasksParams},
            "tool_update_task": {"func": update_task, "schema": UpdateTaskParams},
            "tool_complete_task": {"func": complete_task, "schema": CompleteTaskParams},
            "tool_delete_task": {"func": delete_task, "schema": DeleteTaskParams},
        }

    def _load_conversation_history(self, conversation_id: Optional[int], user_id: str) -> List[Dict[str, Any]]:
        conversation = self.chat_service.get_or_create_conversation(conversation_id, user_id)
        
        # Load only the last 10 messages to avoid token limit (TPM)
        all_history = self.chat_service.load_full_conversation_history(conversation.id)
        recent_history = all_history[-10:] if len(all_history) > 10 else all_history

        history = []
        for msg in recent_history:
            role = "user" if msg["role"] == "user" else "model"
            history.append({"role": role, "parts": [msg["content"]]})

        return history, conversation.id

    def _save_message(self, conversation_id: int, user_id: str, role: MessageRole, content: str, tool_calls: Optional[str] = None):
        return self.chat_service.save_message(conversation_id, user_id, role, content, tool_calls)

    def chat(self, chat_request: ChatRequest) -> ChatResponse:
        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                history, conversation_id = self._load_conversation_history(chat_request.conversation_id, chat_request.user_id)
                chat_session = self.model.start_chat(history=history)
                
                response = chat_session.send_message(chat_request.message)
                tool_calls_executed = []
                
                function_call_parts = [part for part in response.parts if part.function_call]
                
                if function_call_parts:
                    tool_responses = []
                    for part in function_call_parts:
                        fc = part.function_call
                        tool_name = fc.name
                        args = dict(fc.args)
                        args["user_id"] = chat_request.user_id
                        
                        if tool_name in self.tool_map:
                            tool_def = self.tool_map[tool_name]
                            params = tool_def["schema"](**args)
                            result = tool_def["func"](params, self.db_session)

                            tool_calls_executed.append({
                                "name": tool_name.replace("tool_", ""),
                                "arguments": args,
                                "result": result
                            })

                            # Format the response for this specific tool call
                            tool_responses.append(genai.protos.Part(
                                function_response=genai.protos.FunctionResponse(
                                    name=tool_name,
                                    response={"content": str(result)}
                                )
                            ))

                    if tool_responses:
                        # Send all tool results back in a single message
                        time.sleep(1)
                        response = chat_session.send_message(
                            genai.protos.Content(
                                parts=tool_responses
                            )
                        )
                
                final_text = response.text
                self._save_message(conversation_id, chat_request.user_id, MessageRole.USER, chat_request.message, 
                                 json.dumps(tool_calls_executed) if tool_calls_executed else None)
                self._save_message(conversation_id, chat_request.user_id, MessageRole.ASSISTANT, final_text)

                return ChatResponse(
                    conversation_id=conversation_id,
                    message=ChatMessage(role=MessageRole.ASSISTANT, content=final_text),
                    tool_calls_executed=tool_calls_executed,
                    success=True,
                    metadata={"has_tool_calls": len(tool_calls_executed) > 0}
                )

            except Exception as e:
                # Handle Rate Limit (429) specifically
                if "429" in str(e) and attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 5 # Exponential backoff: 5s, 10s
                    print(f"Rate limit hit (429), waiting {wait_time}s and retrying...")
                    time.sleep(wait_time)
                    continue

                # Handle quota exceeded errors specifically
                error_str = str(e).lower()
                if "quota" in error_str and "exceeded" in error_str:
                    print(f"Quota exceeded error: {e}")
                    return ChatResponse(
                        conversation_id=chat_request.conversation_id or 0,
                        message=ChatMessage(role=MessageRole.ASSISTANT, content="We've reached the API quota limit. Please check your API key and billing settings, or contact the administrator to update the API key."),
                        success=False,
                        error_message="Quota exceeded - please update your API key or check billing"
                    )

                print(f"Chat error: {e}")
                # Check if it's a model not found error and suggest alternatives
                error_msg = str(e)
                if "models/gemini-" in error_msg or "404" in error_msg:
                    suggestion = "Model not found. Please check your API key and available models (using gemini-2.5-flash)."
                    error_msg = f"{error_msg} ({suggestion})"
                elif "quota" in error_msg.lower():
                    suggestion = "API quota exceeded. Please check your billing settings or update your API key."
                    error_msg = f"{error_msg} ({suggestion})"

                return ChatResponse(
                    conversation_id=chat_request.conversation_id or 0,
                    message=ChatMessage(role=MessageRole.ASSISTANT, content=f"I'm a bit overwhelmed right now. Please try again in 30 seconds. (Error: {error_msg})"),
                    success=False,
                    error_message=str(e)
                )
