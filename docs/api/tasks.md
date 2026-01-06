# Task Management API Endpoints

This document provides details for the task management endpoints exposed by the FastAPI backend.

## Base URL

`/api/v1/tasks`

---

## 1. Create a New Task

### `POST /api/v1/tasks`

Creates a new task for the authenticated user.

**Request Headers:**
`Authorization: Bearer <access_token>`

**Request Body:** `application/json`
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, and fruits",
  "priority": 1,
  "due_date": "2026-01-08T12:00:00Z",
  "status": "pending"
}
```

**Response (Success - `201 Created`):** `application/json`
Returns the newly created task.
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, and fruits",
  "priority": 1,
  "due_date": "2026-01-08T12:00:00Z",
  "status": "pending",
  "user_id": 1
}
```

**Response (Error - `422 Unprocessable Entity`):** `application/json`
If the request body is invalid.
```json
{
  "detail": [
    {
      "loc": [
        "body",
        "title"
      ],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
---

## 2. Get All Tasks for the User

### `GET /api/v1/tasks`

Retrieves all tasks belonging to the authenticated user. Supports filtering, sorting, and searching.

**Request Headers:**
`Authorization: Bearer <access_token>`

**Query Parameters:**
- `status`: Optional. Filter tasks by status (e.g., `pending`, `completed`).
- `priority`: Optional. Filter tasks by priority (e.g., `1`, `2`, `3`).
- `due_date_start`: Optional. Filter tasks due on or after this date (ISO 8601 format).
- `due_date_end`: Optional. Filter tasks due on or before this date (ISO 8601 format).
- `search`: Optional. Search tasks by title or description.
- `sort_by`: Optional. Field to sort by (e.g., `due_date`, `priority`, `created_at`).
- `sort_order`: Optional. Sort order (`asc` or `desc`). Defaults to `asc`.

**Response (Success - `200 OK`):** `application/json`
Returns a list of tasks.
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, and fruits",
    "priority": 1,
    "due_date": "2026-01-08T12:00:00Z",
    "status": "pending",
    "user_id": 1
  },
  {
    "id": 2,
    "title": "Finish report",
    "description": "Complete the Q4 financial report",
    "priority": 2,
    "due_date": "2026-01-10T09:00:00Z",
    "status": "in_progress",
    "user_id": 1
  }
]
```

**Response (Error - `401 Unauthorized`):** `application/json`
If no valid token is provided or the token is invalid/expired.
```json
{
  "detail": "Could not validate credentials"
}
```
---

## 3. Update a Task

### `PUT /api/v1/tasks/{task_id}`

Updates an existing task for the authenticated user.

**Request Headers:**
`Authorization: Bearer <access_token>`

**Path Parameters:**
- `task_id`: The ID of the task to update.

**Request Body:** `application/json`
```json
{
  "title": "Buy organic groceries",
  "description": "Organic milk, free-range eggs, sourdough bread, and fresh fruits",
  "priority": 2,
  "due_date": "2026-01-09T10:00:00Z",
  "status": "in_progress"
}
```

**Response (Success - `200 OK`):** `application/json`
Returns the updated task.
```json
{
  "id": 1,
  "title": "Buy organic groceries",
  "description": "Organic milk, free-range eggs, sourdough bread, and fresh fruits",
  "priority": 2,
  "due_date": "2026-01-09T10:00:00Z",
  "status": "in_progress",
  "user_id": 1
}
```

**Response (Error - `404 Not Found`):** `application/json`
If the task with the given ID does not exist or does not belong to the user.
```json
{
  "detail": "Task not found"
}
```

**Response (Error - `422 Unprocessable Entity`):** `application/json`
If the request body is invalid.
```json
{
  "detail": [
    {
      "loc": [
        "body",
        "priority"
      ],
      "msg": "value is not a valid enumeration member; permitted: 1, 2, 3",
      "type": "type_error.enum"
    }
  ]
}
```
---

## 4. Toggle Task Status (Complete/Incomplete)

### `PATCH /api/v1/tasks/{task_id}/complete`

Toggles the completion status of a task for the authenticated user. This can be used to mark a task as completed or incomplete.

**Request Headers:**
`Authorization: Bearer <access_token>`

**Path Parameters:**
- `task_id`: The ID of the task to update.

**Request Body:** `application/json`
```json
{
  "status": "completed"
}
```
*Note: The status can be 'completed', 'in_progress', 'pending', etc.*

**Response (Success - `200 OK`):** `application/json`
Returns the updated task with the new status.
```json
{
  "id": 1,
  "title": "Buy organic groceries",
  "description": "Organic milk, free-range eggs, sourdough bread, and fresh fruits",
  "priority": 2,
  "due_date": "2026-01-09T10:00:00Z",
  "status": "completed",
  "user_id": 1
}
```

**Response (Error - `404 Not Found`):** `application/json`
If the task with the given ID does not exist or does not belong to the user.
```json
{
  "detail": "Task not found"
}
```
---

## 5. Delete a Task

### `DELETE /api/v1/tasks/{task_id}`

Deletes a task for the authenticated user.

**Request Headers:**
`Authorization: Bearer <access_token>`

**Path Parameters:**
- `task_id`: The ID of the task to delete.

**Response (Success - `204 No Content`):** `(No Content)`
No content is returned upon successful deletion.

**Response (Error - `404 Not Found`):** `application/json`
If the task with the given ID does not exist or does not belong to the user.
```json
{
  "detail": "Task not found"
}
```
