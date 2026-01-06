from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from src.database import get_session
from src.models.task import Task
from src.models.user import User # Import User model to define relationship
from src.api.deps import get_current_user
from src.schemas.task import TaskCreate, TaskRead, TaskUpdate
from src.services.task_service import TaskService

def get_task_service(session: Session = Depends(get_session)) -> TaskService:
    return TaskService(session)

task_router = APIRouter(prefix="/tasks", tags=["Tasks"])

@task_router.post("/", response_model=TaskRead)
async def create_task(
    task_create: TaskCreate,
    current_user: User = Depends(get_current_user),
    task_service: TaskService = Depends(get_task_service)
):
    task = task_service.create_task(task_create, current_user.id)
    return task

@task_router.get("/", response_model=List[TaskRead])
async def read_tasks(
    current_user: User = Depends(get_current_user),
    task_service: TaskService = Depends(get_task_service),
    status: Optional[str] = None,
    priority: Optional[int] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = None,
):
    tasks = task_service.get_user_tasks(
        user_id=current_user.id,
        status=status,
        priority=priority,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    )
    return tasks

@task_router.get("/{task_id}", response_model=TaskRead)
async def read_task_by_id(
    task_id: int,
    current_user: User = Depends(get_current_user),
    task_service: TaskService = Depends(get_task_service)
):
    task = task_service.get_task_by_id(task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@task_router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    task_service: TaskService = Depends(get_task_service)
):
    task = task_service.update_task(task_id, task_update, current_user.id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or not owned by user")
    return task

@task_router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    task_service: TaskService = Depends(get_task_service)
):
    success = task_service.delete_task(task_id, current_user.id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or not owned by user")
    return

@task_router.patch("/{task_id}/complete", response_model=TaskRead)
async def complete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    task_service: TaskService = Depends(get_task_service)
):
    task_update = TaskUpdate(completed=True, status="completed")
    task = task_service.update_task(task_id, task_update, current_user.id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or not owned by user")
    return task