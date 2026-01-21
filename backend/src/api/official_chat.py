"""
Official Chat API endpoint for the AI Chatbot Backend using OpenAI Agents SDK
Handles user chat requests and processes them through the Official Agent Service with MCP tools
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from ..database import get_session
from ..services.official_agent_service import OfficialAgentService
from ..schemas.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/api/official", tags=["official-chat"])

@router.post("/{user_id}/chat", response_model=ChatResponse)
async def official_chat_endpoint(
    user_id: str,
    chat_request: ChatRequest,
    db_session: Session = Depends(get_session)
):
    """
    Official chat endpoint that processes user messages through the OpenAI Agent with MCP tools

    Args:
        user_id: The ID of the user making the request
        chat_request: The chat message and context
        db_session: Database session dependency

    Returns:
        ChatResponse: The AI's response with conversation context
    """
    # Ensure the user_id in the path matches the one in the request
    if user_id != chat_request.user_id:
        raise HTTPException(
            status_code=400,
            detail="User ID in path must match user ID in request body"
        )

    try:
        # Initialize the official agent service with the database session
        agent_service = OfficialAgentService(db_session)

        # Process the chat request
        response = agent_service.chat(chat_request)

        return response

    except ValueError as e:
        # Handle validation errors (e.g., invalid conversation ID)
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Handle any other errors
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")