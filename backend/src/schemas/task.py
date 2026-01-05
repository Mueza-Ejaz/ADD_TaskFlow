from typing import Optional
from datetime import datetime

from pydantic import Field, EmailStr
from sqlmodel import SQLModel


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: Optional[int] = Field(default=None, ge=1, le=3)
    due_date: Optional[datetime] = Field(default=None)
    status: str = Field(default="pending")


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = Field(default=None)
    priority: Optional[int] = Field(default=None, ge=1, le=3)
    due_date: Optional[datetime] = Field(default=None)
    status: Optional[str] = Field(default=None)


class TaskRead(TaskBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
