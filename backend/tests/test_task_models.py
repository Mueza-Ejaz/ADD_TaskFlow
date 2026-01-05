import pytest
from datetime import datetime, timedelta
from backend.src.models.task import Task
from backend.src.schemas.task import TaskCreate, TaskUpdate, TaskRead


def test_create_task_model():
    task = Task(title="Test Task", user_id=1)
    assert task.title == "Test Task"
    assert task.user_id == 1
    assert task.completed is False
    assert task.status == "pending"
    assert task.priority is None
    assert task.due_date is None
    assert isinstance(task.created_at, datetime)
    assert isinstance(task.updated_at, datetime)


def test_create_task_model_with_all_fields():
    due_date = datetime.utcnow() + timedelta(days=1)
    task = Task(
        title="Full Task",
        description="A task with all fields",
        completed=True,
        priority=1,
        due_date=due_date,
        status="completed",
        user_id=1
    )
    assert task.title == "Full Task"
    assert task.description == "A task with all fields"
    assert task.completed is True
    assert task.priority == 1
    assert task.due_date == due_date
    assert task.status == "completed"
    assert task.user_id == 1


def test_task_create_schema():
    task_create = TaskCreate(title="Schema Task", description="Description")
    assert task_create.title == "Schema Task"
    assert task_create.description == "Description"
    assert task_create.completed is False
    assert task_create.status == "pending"
    assert task_create.priority is None
    assert task_create.due_date is None


def test_task_update_schema():
    task_update = TaskUpdate(title="Updated Title", completed=True, priority=2)
    assert task_update.title == "Updated Title"
    assert task_update.completed is True
    assert task_update.priority == 2
    assert task_update.description is None # Ensure unset fields are None

    task_update_partial = TaskUpdate(status="in-progress")
    assert task_update_partial.status == "in-progress"
    assert task_update_partial.title is None
    assert task_update_partial.completed is None


def test_task_read_schema():
    now = datetime.utcnow()
    task_read = TaskRead(
        id=1,
        user_id=1,
        title="Read Task",
        description="Read Desc",
        completed=False,
        priority=3,
        due_date=now,
        status="pending",
        created_at=now,
        updated_at=now
    )
    assert task_read.id == 1
    assert task_read.user_id == 1
    assert task_read.title == "Read Task"
    assert task_read.description == "Read Desc"
    assert task_read.completed is False
    assert task_read.priority == 3
    assert task_read.due_date == now
    assert task_read.status == "pending"
    assert task_read.created_at == now
    assert task_read.updated_at == now
