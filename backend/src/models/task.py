from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True) # Changed from str to int, added index
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: Optional[int] = Field(default=None, ge=1, le=3) # Example: 1 for High, 2 for Medium, 3 for Low
    due_date: Optional[datetime] = Field(default=None)
    status: str = Field(default="pending") # Example: "pending", "in-progress", "completed"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    __table_args__ = {"extend_existing": True}
