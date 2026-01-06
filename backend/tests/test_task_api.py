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
    from backend.src.models.user import User
    from backend.src.auth.password import hash_password

    # 1. Create a test user directly in the database
    user_email = "testuser@example.com"
    hashed_password = hash_password("strongpassword")
    user = User(email=user_email, hashed_password=hashed_password, full_name="Test User")
    session.add(user)
    session.commit()
    session.refresh(user)
    user_id = user.id

    # 2. Login to get a token
    login_response = await client.post("/api/v1/auth/login", json={"email": user_email, "password": "strongpassword"})
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

    # 5. Assert that the response contains the tasks belonging to that user
    assert len(tasks) == 2
    assert any(task["title"] == "User Task 1" for task in tasks)
    assert any(task["title"] == "User Task 2" for task in tasks)
    for task in tasks:
        assert task["user_id"] == user_id


@pytest.mark.asyncio
async def test_update_task(client: AsyncClient, session: Session):
    # 1. Register a test user
    user_data = {"email": "updateuser@example.com", "password": "strongpassword"}
    await client.post("/api/v1/auth/signup", json=user_data)
    login_response = await client.post("/api/v1/auth/login", json=user_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create a task for the user
    task_data = {
        "title": "Task to Update",
        "description": "This is a task that will be updated.",
        "priority": 1,
        "status": "pending",
        "due_date": "2026-01-15T10:00:00Z"
    }
    create_response = await client.post("/api/v1/tasks/", json=task_data, headers=headers)
    assert create_response.status_code == 200
    task_id = create_response.json()["id"]

    # 3. Update the task
    updated_task_data = {
        "title": "Updated Task Title",
        "description": "The description has been updated.",
        "priority": 2,
        "status": "in_progress",
        "due_date": "2026-01-20T12:00:00" # Removed 'Z'
    }
    update_response = await client.put(f"/api/v1/tasks/{task_id}", json=updated_task_data, headers=headers)
    assert update_response.status_code == 200
    updated_task = update_response.json()
    assert updated_task["title"] == updated_task_data["title"]
    assert updated_task["description"] == updated_task_data["description"]
    assert updated_task["priority"] == updated_task_data["priority"]
    assert updated_task["status"] == updated_task_data["status"]
    assert updated_task["due_date"] == updated_task_data["due_date"]
    assert updated_task["id"] == task_id
    assert updated_task["user_id"] == create_response.json()["user_id"]

    # 4. Try to update a non-existent task
    non_existent_task_id = 9999
    non_existent_update_response = await client.put(f"/api/v1/tasks/{non_existent_task_id}", json=updated_task_data, headers=headers)
    assert non_existent_update_response.status_code == 404
    assert "Task not found" in non_existent_update_response.json()["detail"]

    # 5. Register a second user and try to update the first user's task
    user2_data = {"email": "updateuser2@example.com", "password": "strongpassword"}
    await client.post("/api/v1/auth/signup", json=user2_data)
    login_response_2 = await client.post("/api/v1/auth/login", json=user2_data)
    token_2 = login_response_2.json()["access_token"]
    headers_2 = {"Authorization": f"Bearer {token_2}"}

    other_user_update_response = await client.put(f"/api/v1/tasks/{task_id}", json=updated_task_data, headers=headers_2)
    assert other_user_update_response.status_code == 404
    assert "Task not found or not owned by user" in other_user_update_response.json()["detail"]

@pytest.mark.asyncio
async def test_update_task_unauthorized(client: AsyncClient):
    response = await client.put("/api/v1/tasks/1", json={"title": "Unauthorized Update"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

@pytest.mark.asyncio
async def test_complete_task(client: AsyncClient, session: Session):
    # 1. Register and login a user
    user_data = {"email": "completeuser@example.com", "password": "strongpassword"}
    await client.post("/api/v1/auth/signup", json=user_data)
    login_response = await client.post("/api/v1/auth/login", json=user_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create a task for the user
    task_data = {
        "title": "Task to complete",
        "description": "This task will be completed.",
        "priority": 1,
        "status": "pending",
        "due_date": "2026-01-25T10:00:00Z"
    }
    create_response = await client.post("/api/v1/tasks/", json=task_data, headers=headers)
    assert create_response.status_code == 200
    task_id = create_response.json()["id"]

    # 3. Complete the task
    complete_response = await client.patch(f"/api/v1/tasks/{task_id}/complete", headers=headers)
    assert complete_response.status_code == 200
    completed_task = complete_response.json()
    assert completed_task["id"] == task_id
    assert completed_task["status"] == "completed"
    assert completed_task["completed"] is True # Assuming 'completed' field is also updated

    # 4. Verify the task is indeed completed by fetching it
    get_response = await client.get(f"/api/v1/tasks/{task_id}", headers=headers)
    assert get_response.status_code == 200
    fetched_task = get_response.json()
    assert fetched_task["status"] == "completed"
    assert fetched_task["completed"] is True

    # 5. Try to complete a non-existent task
    non_existent_task_id = 9999
    non_existent_complete_response = await client.patch(f"/api/v1/tasks/{non_existent_task_id}/complete", headers=headers)
    assert non_existent_complete_response.status_code == 404
    assert "Task not found" in non_existent_complete_response.json()["detail"]

    # 6. Register a second user and try to complete the first user's task
    user2_data = {"email": "completeuser2@example.com", "password": "strongpassword"}
    await client.post("/api/v1/auth/signup", json=user2_data)
    login_response_2 = await client.post("/api/v1/auth/login", json=user2_data)
    token_2 = login_response_2.json()["access_token"]
    headers_2 = {"Authorization": f"Bearer {token_2}"}

    other_user_complete_response = await client.patch(f"/api/v1/tasks/{task_id}/complete", headers=headers_2)
    assert other_user_complete_response.status_code == 404
    assert "Task not found or not owned by user" in other_user_complete_response.json()["detail"]


@pytest.mark.asyncio
async def test_filter_tasks(client: AsyncClient, session: Session):
    user_data = {"email": "filteruser@example.com", "password": "strongpassword"}
    await client.post("/api/v1/auth/signup", json=user_data)
    login_response = await client.post("/api/v1/auth/login", json=user_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create tasks with different statuses and priorities
    await client.post("/api/v1/tasks/", json={"title": "Task Filter 1", "status": "todo", "priority": 1, "due_date": "2026-01-01T10:00:00Z"}, headers=headers)
    await client.post("/api/v1/tasks/", json={"title": "Task Filter 2", "status": "in_progress", "priority": 2, "due_date": "2026-01-02T10:00:00Z"}, headers=headers)
    await client.post("/api/v1/tasks/", json={"title": "Task Filter 3", "status": "done", "priority": 1, "due_date": "2026-01-03T10:00:00Z"}, headers=headers)

    # Test filter by status
    response = await client.get("/api/v1/tasks/?status=todo", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 1
    assert tasks[0]["title"] == "Task Filter 1"

    # Test filter by priority
    response = await client.get("/api/v1/tasks/?priority=1", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 2
    assert any(t["title"] == "Task Filter 1" for t in tasks)
    assert any(t["title"] == "Task Filter 3" for t in tasks)

@pytest.mark.asyncio
async def test_sort_tasks(client: AsyncClient, session: Session):
    user_data = {"email": "sortuser@example.com", "password": "strongpassword"}
    await client.post("/api/v1/auth/signup", json=user_data)
    login_response = await client.post("/api/v1/auth/login", json=user_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    await client.post("/api/v1/tasks/", json={"title": "Task C", "status": "todo", "priority": 3, "due_date": "2026-01-03T10:00:00Z"}, headers=headers)
    await client.post("/api/v1/tasks/", json={"title": "Task A", "status": "todo", "priority": 1, "due_date": "2026-01-01T10:00:00Z"}, headers=headers)
    await client.post("/api/v1/tasks/", json={"title": "Task B", "status": "todo", "priority": 2, "due_date": "2026-01-02T10:00:00Z"}, headers=headers)

    # Sort by title ascending
    response = await client.get("/api/v1/tasks/?sort_by=title&sort_order=asc", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 3
    assert tasks[0]["title"] == "Task A"
    assert tasks[1]["title"] == "Task B"
    assert tasks[2]["title"] == "Task C"

    # Sort by priority descending
    response = await client.get("/api/v1/tasks/?sort_by=priority&sort_order=desc", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 3
    assert tasks[0]["title"] == "Task C"
    assert tasks[1]["title"] == "Task B"
    assert tasks[2]["title"] == "Task A"

@pytest.mark.asyncio
async def test_search_tasks(client: AsyncClient, session: Session):
    user_data = {"email": "searchuser@example.com", "password": "strongpassword"}
    await client.post("/api/v1/auth/signup", json=user_data)
    login_response = await client.post("/api/v1/auth/login", json=user_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    await client.post("/api/v1/tasks/", json={"title": "Important Meeting", "description": "Discuss project details", "status": "todo", "priority": 1, "due_date": "2026-01-01T10:00:00Z"}, headers=headers)
    await client.post("/api/v1/tasks/", json={"title": "Grocery Shopping", "description": "Buy milk and bread", "status": "todo", "priority": 2, "due_date": "2026-01-02T10:00:00Z"}, headers=headers)
    await client.post("/api/v1/tasks/", json={"title": "Project Review", "description": "Review final project", "status": "done", "priority": 1, "due_date": "2026-01-03T10:00:00Z"}, headers=headers)

    # Search by title
    response = await client.get("/api/v1/tasks/?search=Meeting", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 1
    assert tasks[0]["title"] == "Important Meeting"

    # Search by description
    response = await client.get("/api/v1/tasks/?search=milk", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 1
    assert tasks[0]["title"] == "Grocery Shopping"

    # Case-insensitive search
    response = await client.get("/api/v1/tasks/?search=project", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 2
    assert any(t["title"] == "Important Meeting" for t in tasks)
    assert any(t["title"] == "Project Review" for t in tasks)

@pytest.mark.asyncio
async def test_combined_filter_sort_search(client: AsyncClient, session: Session):
    user_data = {"email": "combineduser@example.com", "password": "strongpassword"}
    await client.post("/api/v1/auth/signup", json=user_data)
    login_response = await client.post("/api/v1/auth/login", json=user_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create several tasks
    await client.post("/api/v1/tasks/", json={"title": "Urgent Project A", "description": "Alpha phase review", "status": "in_progress", "priority": 1, "due_date": "2026-01-05T10:00:00Z"}, headers=headers)
    await client.post("/api/v1/tasks/", json={"title": "Bug Fix B", "description": "Fix critical bug in module B", "status": "todo", "priority": 1, "due_date": "2026-01-06T10:00:00Z"}, headers=headers)
    await client.post("/api/v1/tasks/", json={"title": "Meeting C", "description": "Discuss Project Alpha", "status": "in_progress", "priority": 2, "due_date": "2026-01-07T10:00:00Z"}, headers=headers)
    await client.post("/api/v1/tasks/", json={"title": "Feature D", "description": "Develop new feature for Beta", "status": "todo", "priority": 2, "due_date": "2026-01-08T10:00:00Z"}, headers=headers)

    # Filter by status "in_progress", search "project", sort by priority descending
    response = await client.get("/api/v1/tasks/?status=in_progress&search=project&sort_by=priority&sort_order=desc", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 2
    assert tasks[0]["title"] == "Meeting C" # Priority 2
    assert tasks[1]["title"] == "Urgent Project A" # Priority 1 (after filter, sort order applied)
    assert tasks[0]["status"] == "in_progress"
    assert tasks[1]["status"] == "in_progress"
@pytest.mark.asyncio
async def test_delete_task(client: AsyncClient, session: Session):
    # 1. Register and login a user
    user_data = {"email": "deleteuser@example.com", "password": "strongpassword"}
    await client.post("/api/v1/auth/signup", json=user_data)
    login_response = await client.post("/api/v1/auth/login", json=user_data)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create a task for the user
    task_data = {
        "title": "Task to Delete",
        "description": "This task will be deleted permanently.",
        "priority": 1,
        "status": "todo",
        "due_date": "2026-01-01T10:00:00Z"
    }
    create_response = await client.post("/api/v1/tasks/", json=task_data, headers=headers)
    assert create_response.status_code == 200
    task_id = create_response.json()["id"]

    # 3. Delete the task
    delete_response = await client.delete(f"/api/v1/tasks/{task_id}", headers=headers)
    assert delete_response.status_code == 204 # No Content

    # 4. Verify the task is indeed deleted by trying to fetch it
    get_response = await client.get(f"/api/v1/tasks/{task_id}", headers=headers)
    assert get_response.status_code == 404
    assert "Task not found" in get_response.json()["detail"]

    # 5. Try to delete a non-existent task
    non_existent_task_id = 9999
    non_existent_delete_response = await client.delete(f"/api/v1/tasks/{non_existent_task_id}", headers=headers)
    assert non_existent_delete_response.status_code == 404
    assert "Task not found" in non_existent_delete_response.json()["detail"]

    # 6. Register a second user and try to delete the first user's task
    user2_data = {"email": "deleteuser2@example.com", "password": "strongpassword"}
    await client.post("/api/v1/auth/signup", json=user2_data)
    login_response_2 = await client.post("/api/v1/auth/login", json=user2_data)
    token_2 = login_response_2.json()["access_token"]
    headers_2 = {"Authorization": f"Bearer {token_2}"}

    # Create another task for user 1 to ensure task_id from step 2 is still valid for testing ownership
    create_response_3 = await client.post("/api/v1/tasks/", json={"title": "Another Task for User 1", "status": "todo", "priority": 1, "due_date": "2026-01-01T10:00:00Z"}, headers=headers)
    task_id_user1 = create_response_3.json()["id"]


    other_user_delete_response = await client.delete(f"/api/v1/tasks/{task_id_user1}", headers=headers_2)
    assert other_user_delete_response.status_code == 404
    assert "Task not found or not owned by user" in other_user_delete_response.json()["detail"]

@pytest.mark.asyncio
async def test_delete_task_unauthorized(client: AsyncClient):
    response = await client.delete("/api/v1/tasks/1")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}
