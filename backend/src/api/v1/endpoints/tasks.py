from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ....database import get_session
from ....models.task import Task
from ....models.user import User # Import User model to define relationship
from ...deps import get_current_user

# Define TaskCreate, TaskRead, TaskUpdate models based on Task
class TaskCreate(Task):
    # For creation, id, created_at, updated_at are optional. user_id will be set by current_user.
    # Exclude these fields from being provided by the client during creation
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    user_id: Optional[int] = None # Will be set by dependency


class TaskRead(Task):
    pass

class TaskUpdate(Task):
    # For update, all fields are optional
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    created_at: Optional[datetime] = None # Exclude from update payload
    updated_at: Optional[datetime] = None # Exclude from update payload
    user_id: Optional[int] = None # Cannot change user_id via update

task_router = APIRouter(prefix="/tasks", tags=["Tasks"])

@task_router.post("/", response_model=TaskRead)
async def create_task(
    task: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    db_task = Task.model_validate(task, update={"user_id": current_user.id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@task_router.get("/", response_model=List[TaskRead])
async def read_tasks(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    tasks = session.exec(select(Task).where(Task.user_id == current_user.id)).all()
    return tasks

@task_router.get("/{task_id}", response_model=TaskRead)
async def read_task_by_id(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == current_user.id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@task_router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == current_user.id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    task_data = task_update.model_dump(exclude_unset=True)
    task.sqlmodel_update(task_data)
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@task_router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == current_user.id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    session.delete(task)
    session.commit()
    return

@task_router.patch("/{task_id}/complete", response_model=TaskRead)
async def complete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    task = session.exec(select(Task).where(Task.id == task_id, Task.user_id == current_user.id)).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    task.completed = True
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
