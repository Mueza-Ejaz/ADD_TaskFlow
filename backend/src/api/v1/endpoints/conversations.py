from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from src.database import get_session
from src.models.conversation import Conversation
from src.api.deps import get_current_user
from src.models.user import User

router = APIRouter(tags=["conversations"])

@router.get("/", response_model=List[dict])
async def get_user_conversations(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get all conversations for the authenticated user
    """
    # Query conversations for the user
    statement = select(Conversation).where(Conversation.user_id == str(current_user.id))
    results = session.exec(statement)
    conversations = results.all()

    # Convert to dict format for response
    conversations_list = []
    for conv in conversations:
        conversations_list.append({
            "id": conv.id,
            "title": getattr(conv, 'title', f"Conversation {conv.id}"),
            "user_id": conv.user_id,
            "created_at": conv.created_at,
            "updated_at": conv.updated_at
        })

    return conversations_list

@router.get("/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific conversation with all its messages
    """
    # Convert conversation_id to int for database lookup
    try:
        conv_id = int(conversation_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Fetch conversation
    conversation = session.get(Conversation, conv_id)
    if not conversation or str(conversation.user_id) != str(current_user.id):
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Prepare response with messages
    # Sort messages by creation time
    sorted_messages = sorted(conversation.messages, key=lambda m: m.created_at)
    
    messages_list = []
    for msg in sorted_messages:
        messages_list.append({
            "id": msg.id,
            "role": msg.role,
            "content": msg.content,
            "created_at": msg.created_at,
            "tool_calls": msg.tool_calls
        })

    return {
        "id": conversation.id,
        "title": getattr(conversation, 'title', f"Conversation {conversation.id}"),
        "user_id": conversation.user_id,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "messages": messages_list
    }

@router.delete("/{conversation_id}", status_code=204)
async def delete_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific conversation
    """
    # Convert conversation_id to int for database lookup
    try:
        conv_id = int(conversation_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Fetch conversation
    conversation = session.get(Conversation, conv_id)
    if not conversation or str(conversation.user_id) != str(current_user.id):
        raise HTTPException(status_code=404, detail="Conversation not found")

    session.delete(conversation)
    session.commit()
    return None
