# Data Model: AI Chatbot Backend

## Entities

### Conversation
Represents a chat session between a user and the AI.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Yes | Primary Key, Auto-increment |
| `user_id` | String | Yes | Foreign Key -> `users.id` |
| `created_at` | DateTime | Yes | UTC Timestamp |
| `updated_at` | DateTime | Yes | UTC Timestamp |

### Message
Represents an individual turn in a conversation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Yes | Primary Key, Auto-increment |
| `user_id` | String | Yes | Foreign Key -> `users.id` (Partition key) |
| `conversation_id` | Integer | Yes | Foreign Key -> `conversation.id` |
| `role` | Enum | Yes | 'user', 'assistant' |
| `content` | Text | Yes | The message text |
| `tool_calls` | JSON | No | Metadata about tools used (JSONB) |
| `created_at` | DateTime | Yes | UTC Timestamp |

## Relationships

- **User** (1) <-> (N) **Conversation**
- **Conversation** (1) <-> (N) **Message**
- **User** (1) <-> (N) **Message** (Direct link for efficient per-user queries)

## SQLModel Definitions

```python
from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column, Enum
import enum

class MessageRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"

class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    messages: List["Message"] = Relationship(back_populates="conversation")

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True, nullable=False)
    conversation_id: int = Field(foreign_key="conversation.id", index=True, nullable=False)
    role: MessageRole = Field(sa_column=Column(Enum(MessageRole)))
    content: str = Field(nullable=False)
    tool_calls: Optional[str] = Field(default=None) # JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    conversation: Conversation = Relationship(back_populates="messages")
```
