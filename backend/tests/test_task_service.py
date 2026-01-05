import pytest
from unittest.mock import MagicMock
from sqlmodel import Session
from datetime import datetime, timedelta

from backend.src.models.task import Task
from backend.src.schemas.task import TaskCreate, TaskUpdate
from backend.src.services.task_service import TaskService


@pytest.fixture
def mock_session():
    return MagicMock(spec=Session)


@pytest.fixture
def task_service(mock_session):
    return TaskService(session=mock_session)


@pytest.fixture
def sample_task():
    return Task(
        id=1,
        title="Test Task",
        description="A sample task",
        user_id=1,
        completed=False,
        priority=2,
        due_date=datetime.utcnow() + timedelta(days=7),
        status="pending",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )


def test_create_task(task_service, mock_session):
    task_create = TaskCreate(title="New Task", description="New task description", priority=1)
    user_id = 1
    
    mock_session.add.return_value = None
    mock_session.commit.return_value = None
    mock_session.refresh.side_effect = lambda x: setattr(x, 'id', 1)  # Simulate ID generation

    task = task_service.create_task(task_create, user_id)

    assert task.title == "New Task"
    assert task.user_id == user_id
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once_with(task)


def test_get_task_by_id(task_service, mock_session, sample_task):
    mock_session.get.return_value = sample_task
    
    retrieved_task = task_service.get_task_by_id(task_id=1, user_id=1)
    
    assert retrieved_task == sample_task
    mock_session.get.assert_called_once_with(Task, 1)


def test_get_task_by_id_not_found(task_service, mock_session):
    mock_session.get.return_value = None
    
    retrieved_task = task_service.get_task_by_id(task_id=999, user_id=1)
    
    assert retrieved_task is None
    mock_session.get.assert_called_once_with(Task, 999)


def test_get_task_by_id_wrong_user(task_service, mock_session, sample_task):
    mock_session.get.return_value = sample_task
    
    retrieved_task = task_service.get_task_by_id(task_id=1, user_id=2)
    
    assert retrieved_task is None
    mock_session.get.assert_called_once_with(Task, 1)


def test_get_user_tasks(task_service, mock_session, sample_task):
    mock_session.exec.return_value.all.return_value = [sample_task]
    
    tasks = task_service.get_user_tasks(user_id=1)
    
    assert len(tasks) == 1
    assert tasks[0] == sample_task
    mock_session.exec.assert_called_once()


def test_update_task(task_service, mock_session, sample_task):
    mock_session.get.return_value = sample_task
    task_update = TaskUpdate(title="Updated Title", completed=True)
    
    updated_task = task_service.update_task(task_id=1, task_update=task_update, user_id=1)
    
    assert updated_task.title == "Updated Title"
    assert updated_task.completed is True
    assert updated_task.user_id == 1  # User ID should not change
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()
    mock_session.refresh.assert_called_once_with(sample_task)


def test_update_task_not_found(task_service, mock_session):
    mock_session.get.return_value = None
    task_update = TaskUpdate(title="Updated Title")
    
    updated_task = task_service.update_task(task_id=999, task_update=task_update, user_id=1)
    
    assert updated_task is None
    mock_session.get.assert_called_once_with(Task, 999)


def test_update_task_wrong_user(task_service, mock_session, sample_task):
    mock_session.get.return_value = sample_task
    task_update = TaskUpdate(title="Updated Title")
    
    updated_task = task_service.update_task(task_id=1, task_update=task_update, user_id=2)
    
    assert updated_task is None
    mock_session.get.assert_called_once_with(Task, 1)


def test_delete_task(task_service, mock_session, sample_task):
    mock_session.get.return_value = sample_task
    
    deleted = task_service.delete_task(task_id=1, user_id=1)
    
    assert deleted is True
    mock_session.delete.assert_called_once_with(sample_task)
    mock_session.commit.assert_called_once()


def test_delete_task_not_found(task_service, mock_session):
    mock_session.get.return_value = None
    
    deleted = task_service.delete_task(task_id=999, user_id=1)
    
    assert deleted is False
    mock_session.delete.assert_not_called()
    mock_session.commit.assert_not_called()


def test_delete_task_wrong_user(task_service, mock_session, sample_task):
    mock_session.get.return_value = sample_task
    
    deleted = task_service.delete_task(task_id=1, user_id=2)
    
    assert deleted is False
    mock_session.delete.assert_not_called()
    mock_session.commit.assert_not_called()
