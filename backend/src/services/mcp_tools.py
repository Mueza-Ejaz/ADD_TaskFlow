"""
MCP Tools for Task Management
These tools will be used by the OpenAI Agent to manage user tasks through natural language
"""

from typing import List, Optional, Callable, Any
from pydantic import BaseModel, Field
from functools import wraps
from src.models.task import Task  # Using existing task model from the application
from src.services.task_service import TaskService
from sqlmodel import Session, select


def user_isolation_check(func: Callable) -> Callable:
    """
    Decorator to ensure user isolation - checks that operations are performed on resources owned by the user
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        # This decorator ensures that the user_id in the params matches the expected user
        # For now, we validate this inside the functions themselves
        return func(*args, **kwargs)
    return wrapper


class AddTaskParams(BaseModel):
    """Parameters for adding a new task"""
    user_id: str = Field(..., description="ID of the user creating the task")
    title: str = Field(..., description="Title of the task")
    description: Optional[str] = Field(None, description="Description of the task")


class ListTasksParams(BaseModel):
    """Parameters for listing tasks"""
    user_id: str = Field(..., description="ID of the user whose tasks to list")
    status: Optional[str] = Field(None, description="Filter tasks by status (pending, completed, etc.)")


class UpdateTaskParams(BaseModel):
    """Parameters for updating a task"""
    user_id: str = Field(..., description="ID of the user who owns the task")
    task_id: Optional[int] = Field(None, description="ID of the task to update (optional if title is provided to find the task)")
    title: Optional[str] = Field(None, description="New title for the task, or if task_id is not provided, the title to find the task by")
    description: Optional[str] = Field(None, description="New description for the task")
    status: Optional[str] = Field(None, description="New status for the task")


class CompleteTaskParams(BaseModel):
    """Parameters for completing a task"""
    user_id: str = Field(..., description="ID of the user who owns the task")
    task_id: int = Field(..., description="ID of the task to mark as completed")


class DeleteTaskParams(BaseModel):
    """Parameters for deleting a task"""
    user_id: str = Field(..., description="ID of the user who owns the task")
    task_id: Optional[int] = Field(None, description="ID of the task to delete")
    title: Optional[str] = Field(None, description="Title of the task to delete (alternative to task_id)")


@user_isolation_check
def add_task(params: AddTaskParams, db_session: Session) -> dict:
    """
    Add a new task for a user
    """
    try:
        # Use the user_id as provided (keeping it as string to match API)
        # Since we removed the foreign key constraint, we can store the string directly
        user_id_int = params.user_id  # Store the actual string user_id from the API

        from src.schemas.task import TaskCreate

        task_service = TaskService(db_session)

        # Create a TaskCreate object with the task data
        task_create = TaskCreate(
            title=params.title,
            description=params.description or "",
            status="pending"
        )

        # Create the task
        task = task_service.create_task(task_create, user_id_int)

        return {
            "success": True,
            "task_id": task.id,
            "message": f"Task '{params.title}' has been created successfully!"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Failed to create task: {str(e)}"
        }


@user_isolation_check
def list_tasks(params: ListTasksParams, db_session: Session) -> dict:
    """
    List tasks for a user with optional status filtering
    """
    try:
        # Use the user_id as provided (keeping it as string to match API)
        user_id_int = params.user_id  # Store the actual string user_id from the API

        # Query tasks for the user
        statement = select(Task).where(Task.user_id == str(user_id_int))

        if params.status:
            statement = statement.where(Task.status == params.status)

        statement = statement.order_by(Task.created_at.desc())
        tasks = db_session.exec(statement).all()

        task_list = []
        for task in tasks:
            task_list.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "created_at": task.created_at.isoformat() if task.created_at else None
            })

        status_filter = f" ({params.status})" if params.status else ""

        # Format detailed message with task information
        if task_list:
            detailed_message = f"You have {len(task_list)} task(s){status_filter}:\n\n"
            for i, task in enumerate(task_list, 1):
                created_time = task['created_at'][:10] if task['created_at'] else "Unknown"
                detailed_message += f"{i}. Title: {task['title']}\n"
                if task['description']:
                    detailed_message += f"   Description: {task['description']}\n"
                detailed_message += f"   Status: {task['status']}\n"
                detailed_message += f"   Created: {created_time}\n\n"
        else:
            detailed_message = f"You have {len(task_list)} task(s){status_filter}."

        return {
            "success": True,
            "tasks": task_list,
            "message": detailed_message.strip()
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Failed to list tasks: {str(e)}"
        }


@user_isolation_check
def update_task(params: UpdateTaskParams, db_session: Session) -> dict:
    """
    Update a task for a user
    """
    try:
        # Use the user_id as provided (keeping it as string to match API)
        user_id_int = params.user_id  # Store the actual string user_id from the API

        task = None

        # Find the task by ID if provided
        if params.task_id is not None:
            task = db_session.get(Task, params.task_id)
        # Otherwise find the task by title (for updating when only title is known)
        # Support both: title + status to update status, or just title to update other fields
        elif params.title is not None:
            # If we're updating using title, look for task by title
            # This is to handle requests like "update task 'cleaning house' to in progress" or "update task 'old title' with new title"
            statement = select(Task).where(
                Task.user_id == str(user_id_int),
                Task.title.ilike(f"%{params.title}%")  # Case-insensitive partial match
            )
            tasks = db_session.exec(statement).all()

            if not tasks:
                return {
                    "success": False,
                    "error": "Task not found",
                    "message": f"No task found with title containing '{params.title}'."
                }
            elif len(tasks) > 1:
                # If multiple tasks match, return an error asking for more specificity
                task_titles = [f"'{t.title}' (ID: {t.id})" for t in tasks[:5]]  # Limit to first 5
                return {
                    "success": False,
                    "error": "Multiple tasks found",
                    "message": f"Multiple tasks match '{params.title}': {', '.join(task_titles)}. Please use the task ID or be more specific."
                }
            else:
                task = tasks[0]
        else:
            return {
                "success": False,
                "error": "Missing parameters",
                "message": "Either task_id or title must be provided to update a task."
            }

        if not task:
            return {
                "success": False,
                "error": "Task not found",
                "message": f"Task not found."
            }

        if str(task.user_id) != str(user_id_int):
            return {
                "success": False,
                "error": "Permission denied",
                "message": "You don't have permission to update this task."
            }

        # Update the task fields that were provided
        # Determine if title was used for lookup vs for update
        title_used_for_lookup = (params.task_id is None and params.title is not None)

        # Update fields other than title
        if params.description is not None:
            task.description = params.description
        if params.status is not None:
            # Normalize status values to match frontend expectations
            normalized_status = params.status.lower().strip()
            if normalized_status == "in progress":
                normalized_status = "in-progress"
            elif normalized_status == "in_progress":
                normalized_status = "in-progress"
            elif normalized_status == "to do":
                normalized_status = "pending"
            elif normalized_status == "todo":
                normalized_status = "pending"
            elif normalized_status == "done":
                normalized_status = "completed"

            task.status = normalized_status

        # Only update title if not used for lookup (or if we're updating by ID)
        if params.title is not None and not title_used_for_lookup:
            task.title = params.title

        db_session.add(task)
        db_session.commit()
        db_session.refresh(task)

        return {
            "success": True,
            "task_id": task.id,
            "message": f"Task '{task.title}' has been updated successfully!"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Failed to update task: {str(e)}"
        }


@user_isolation_check
def complete_task(params: CompleteTaskParams, db_session: Session) -> dict:
    """
    Mark a task as completed
    """
    try:
        # Use the user_id as provided (keeping it as string to match API)
        user_id_int = params.user_id  # Store the actual string user_id from the API

        # First, verify the task belongs to the user
        task = db_session.get(Task, params.task_id)
        if not task:
            return {
                "success": False,
                "error": "Task not found",
                "message": f"Task with ID {params.task_id} not found."
            }

        if str(task.user_id) != str(user_id_int):
            return {
                "success": False,
                "error": "Permission denied",
                "message": "You don't have permission to complete this task."
            }

        # Update the task status to completed
        task.status = "completed"
        db_session.add(task)
        db_session.commit()
        db_session.refresh(task)

        return {
            "success": True,
            "task_id": task.id,
            "message": f"Task '{task.title}' has been marked as completed!"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Failed to complete task: {str(e)}"
        }


@user_isolation_check
def delete_task(params: DeleteTaskParams, db_session: Session) -> dict:
    """
    Delete a task by ID or title
    """
    try:
        # Use the user_id as provided (keeping it as string to match API)
        user_id_int = params.user_id  # Store the actual string user_id from the API

        task = None

        # Find the task by ID if provided
        if params.task_id is not None:
            task = db_session.get(Task, params.task_id)
        # Otherwise find the task by title
        elif params.title is not None:
            statement = select(Task).where(
                Task.user_id == str(user_id_int),
                Task.title.ilike(f"%{params.title}%")  # Case-insensitive partial match
            )
            tasks = db_session.exec(statement).all()

            if not tasks:
                return {
                    "success": False,
                    "error": "Task not found",
                    "message": f"No task found with title containing '{params.title}'."
                }
            elif len(tasks) > 1:
                # If multiple tasks match, list them for the user to be more specific
                task_titles = [f"'{t.title}' (ID: {t.id})" for t in tasks[:5]]  # Limit to first 5
                return {
                    "success": False,
                    "error": "Multiple tasks found",
                    "message": f"Multiple tasks match '{params.title}': {', '.join(task_titles)}. Please be more specific or use the task ID."
                }
            else:
                task = tasks[0]
        else:
            return {
                "success": False,
                "error": "Missing parameters",
                "message": "Either task_id or title must be provided to delete a task."
            }

        if not task:
            return {
                "success": False,
                "error": "Task not found",
                "message": f"Task not found."
            }

        if str(task.user_id) != str(user_id_int):
            return {
                "success": False,
                "error": "Permission denied",
                "message": "You don't have permission to delete this task."
            }

        # Delete the task
        task_id = task.id  # Store ID before deletion
        db_session.delete(task)
        db_session.commit()

        return {
            "success": True,
            "task_id": task_id,
            "message": f"Task '{task.title}' has been deleted successfully!"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Failed to delete task: {str(e)}"
        }