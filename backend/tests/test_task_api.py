import pytest
from httpx import AsyncClient
from sqlmodel import Session


@pytest.mark.asyncio
async def test_create_task_unauthorized(client: AsyncClient):
    response = await client.post("/api/v1/tasks/", json={
        "title": "Test Task",
        "description": "This is a test task.",
        "priority": 1,
        "due_date": "2026-01-12T10:00:00Z"
    })
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


@pytest.mark.asyncio
async def test_get_tasks_unauthorized(client: AsyncClient):
    response = await client.get("/api/v1/tasks/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

@pytest.mark.asyncio
async def test_create_and_get_tasks(client: AsyncClient, session: Session):
    # 1. Register a test user
    user_data = {"email": "testuser@example.com", "password": "testpassword"}
    register_response = await client.post("/api/v1/auth/register", json=user_data)
    assert register_response.status_code == 200
    user_id = register_response.json()["id"]

    # 2. Login to get a token
    login_response = await client.post("/api/v1/auth/login", json=user_data)
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Create some tasks for the user
    task1_data = {
        "title": "User Task 1",
        "description": "Description for user task 1",
        "priority": 1,
        "status": "pending",
        "due_date": "2026-01-15T10:00:00Z"
    }
    create_response_1 = await client.post("/api/v1/tasks/", json=task1_data, headers=headers)
    assert create_response_1.status_code == 200
    assert create_response_1.json()["title"] == "User Task 1"

    task2_data = {
        "title": "User Task 2",
        "description": "Description for user task 2",
        "priority": 3,
        "status": "in_progress",
        "due_date": "2026-01-20T12:00:00Z"
    }
    create_response_2 = await client.post("/api/v1/tasks/", json=task2_data, headers=headers)
    assert create_response_2.status_code == 200
    assert create_response_2.json()["title"] == "User Task 2"

    # 4. Get tasks for the authenticated user
    get_response = await client.get("/api/v1/tasks/", headers=headers)
    assert get_response.status_code == 200
    tasks = get_response.json()


    # 4. Update one of the tasks
    updated_task_data = {
        "title": "User Task 1 Updated",
        "description": "Updated description for user task 1",
        "priority": 2,
        "status": "done",
        "due_date": "2026-01-16T11:00:00Z"
    }
    update_response = await client.put(f"/api/v1/tasks/{create_response_1.json()['id']}", json=updated_task_data, headers=headers)
    assert update_response.status_code == 200
    updated_task = update_response.json()
    assert updated_task["title"] == updated_task_data["title"]
    assert updated_task["description"] == updated_task_data["description"]
    assert updated_task["priority"] == updated_task_data["priority"]
    assert updated_task["status"] == updated_task_data["status"]
    assert updated_task["due_date"] == updated_task_data["due_date"]
    assert updated_task["id"] == create_response_1.json()['id']
    assert updated_task["user_id"] == user_id

    # 5. Try to update a task that does not exist
    non_existent_task_id = 9999
    update_non_existent_response = await client.put(f"/api/v1/tasks/{non_existent_task_id}", json=updated_task_data, headers=headers)
    assert update_non_existent_response.status_code == 404
    assert "Task not found" in update_non_existent_response.json()["detail"]

    # 6. Register a second user and try to update the first user's task
    user2_data = {"email": "testuser2@example.com", "password": "testpassword2"}
    register_response_2 = await client.post("/api/v1/auth/register", json=user2_data)
    assert register_response_2.status_code == 200

    login_response_2 = await client.post("/api/v1/auth/login", json=user2_data)
    assert login_response_2.status_code == 200
    token_2 = login_response_2.json()["access_token"]
    headers_2 = {"Authorization": f"Bearer {token_2}"}

    update_other_user_task_response = await client.put(f"/api/v1/tasks/{create_response_1.json()['id']}", json=updated_task_data, headers=headers_2)
    assert update_other_user_task_response.status_code == 404
    assert "Task not found or not owned by user" in update_other_user_task_response.json()["detail"]

@pytest.mark.asyncio
async def test_update_task_unauthorized(client: AsyncClient):
    # Attempt to update a task without authentication
    response = await client.put("/api/v1/tasks/1", json={
        "title": "Unauthorized Update",
        "description": "Should not work",
        "priority": 1
    })
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

