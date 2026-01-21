"""
Official MCP Server Implementation for AI Chatbot
Exposes task management tools via the Model Context Protocol
"""

import asyncio
import json
import logging
from typing import Dict, Any, List
from contextlib import asynccontextmanager

from mcp.server import Server
from mcp.types import (
    CallToolResult,
    TextContent,
    Tool,
    ToolExecution,
    TASK_FORBIDDEN  # Default - tools cannot be called as tasks
)
from pydantic import BaseModel
from sqlmodel import Session, create_engine
from starlette.applications import Starlette
from starlette.routing import Mount
from starlette.responses import JSONResponse
from starlette.requests import Request
from mcp.server.streamable_http_manager import StreamableHTTPSessionManager

from backend.src.models.task import Task
from backend.src.database import get_session_context, settings


# Initialize MCP Server
server = Server(
    name="taskflow-mcp-server",
    version="1.0.0"
)


# Tool parameter models
class AddTaskParams(BaseModel):
    user_id: str
    title: str
    description: str = ""


class ListTasksParams(BaseModel):
    user_id: str
    status: str = "all"


class UpdateTaskParams(BaseModel):
    user_id: str
    task_id: int
    title: str = None
    description: str = None


class CompleteTaskParams(BaseModel):
    user_id: str
    task_id: int


class DeleteTaskParams(BaseModel):
    user_id: str
    task_id: int = None
    title: str = None


# Tool definitions with schemas
@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="add_task",
            description="Create a new task for a user",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "ID of the user creating the task"},
                    "title": {"type": "string", "description": "Title of the task"},
                    "description": {"type": "string", "description": "Description of the task"}
                },
                "required": ["user_id", "title"]
            },
            execution=ToolExecution(taskSupport=TASK_FORBIDDEN)  # Synchronous execution
        ),
        Tool(
            name="list_tasks",
            description="Retrieve tasks from the list",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "ID of the user whose tasks to list"},
                    "status": {"type": "string", "description": "Filter tasks by status (all, pending, completed)"}
                },
                "required": ["user_id"]
            },
            execution=ToolExecution(taskSupport=TASK_FORBIDDEN)  # Synchronous execution
        ),
        Tool(
            name="complete_task",
            description="Mark a task as complete",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "ID of the user who owns the task"},
                    "task_id": {"type": "integer", "description": "ID of the task to mark as completed"}
                },
                "required": ["user_id", "task_id"]
            },
            execution=ToolExecution(taskSupport=TASK_FORBIDDEN)  # Synchronous execution
        ),
        Tool(
            name="delete_task",
            description="Remove a task from the list",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "ID of the user who owns the task"},
                    "task_id": {"type": "integer", "description": "ID of the task to delete (optional)"},
                    "title": {"type": "string", "description": "Title of the task to delete (alternative to task_id)"}
                },
                "required": ["user_id"],
                "anyOf": [
                    {"required": ["task_id"]},
                    {"required": ["title"]}
                ]
            },
            execution=ToolExecution(taskSupport=TASK_FORBIDDEN)  # Synchronous execution
        ),
        Tool(
            name="update_task",
            description="Modify task title or description",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "ID of the user who owns the task"},
                    "task_id": {"type": "integer", "description": "ID of the task to update"},
                    "title": {"type": "string", "description": "New title for the task"},
                    "description": {"type": "string", "description": "New description for the task"}
                },
                "required": ["user_id", "task_id"]
            },
            execution=ToolExecution(taskSupport=TASK_FORBIDDEN)  # Synchronous execution
        )
    ]


# Tool implementations
@server.call_tool()
async def handle_tool(name: str, arguments: Dict[str, Any]) -> CallToolResult:
    """Handle all tool calls"""
    try:
        if name == "add_task":
            return await handle_add_task(arguments)
        elif name == "list_tasks":
            return await handle_list_tasks(arguments)
        elif name == "complete_task":
            return await handle_complete_task(arguments)
        elif name == "delete_task":
            return await handle_delete_task(arguments)
        elif name == "update_task":
            return await handle_update_task(arguments)
        else:
            return CallToolResult(
                content=[TextContent(type="text", text=f"Unknown tool: {name}")],
                isError=True
            )
    except Exception as e:
        return CallToolResult(
            content=[TextContent(type="text", text=f"Error executing tool {name}: {str(e)}")],
            isError=True
        )


async def handle_add_task(params: Dict[str, Any]) -> CallToolResult:
    """Handle add_task tool call"""
    try:
        validated_params = AddTaskParams(**params)

        # Get database session
        engine = create_engine(settings.DATABASE_URL)
        with Session(engine) as session:
            task = Task(
                user_id=validated_params.user_id,
                title=validated_params.title,
                description=validated_params.description,
                status="pending"
            )
            session.add(task)
            session.commit()
            session.refresh(task)

        result = {
            "task_id": task.id,
            "status": "created",
            "title": task.title,
            "message": f"Task '{task.title}' has been created successfully!"
        }

        return CallToolResult(
            content=[TextContent(type="text", text=json.dumps(result))],
            isError=False
        )
    except Exception as e:
        return CallToolResult(
            content=[TextContent(type="text", text=json.dumps({
                "error": str(e),
                "message": f"Failed to create task: {str(e)}"
            }))],
            isError=True
        )


async def handle_list_tasks(params: Dict[str, Any]) -> CallToolResult:
    """Handle list_tasks tool call"""
    try:
        validated_params = ListTasksParams(**params)

        # Get database session
        engine = create_engine(settings.DATABASE_URL)
        with Session(engine) as session:
            query = session.query(Task).filter(Task.user_id == validated_params.user_id)

            if validated_params.status != "all" and validated_params.status in ["pending", "completed"]:
                query = query.filter(Task.status == validated_params.status)

            tasks = query.all()

        tasks_list = [
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "completed": task.completed
            }
            for task in tasks
        ]

        result = {
            "tasks": tasks_list,
            "message": f"Found {len(tasks_list)} tasks for user {validated_params.user_id}"
        }

        return CallToolResult(
            content=[TextContent(type="text", text=json.dumps(result))],
            isError=False
        )
    except Exception as e:
        return CallToolResult(
            content=[TextContent(type="text", text=json.dumps({
                "error": str(e),
                "message": f"Failed to list tasks: {str(e)}"
            }))],
            isError=True
        )


async def handle_complete_task(params: Dict[str, Any]) -> CallToolResult:
    """Handle complete_task tool call"""
    try:
        validated_params = CompleteTaskParams(**params)

        # Get database session
        engine = create_engine(settings.DATABASE_URL)
        with Session(engine) as session:
            task = session.get(Task, validated_params.task_id)

            if not task or task.user_id != validated_params.user_id:
                return CallToolResult(
                    content=[TextContent(type="text", text=json.dumps({
                        "error": "Task not found or access denied",
                        "message": f"Task with ID {validated_params.task_id} not found or doesn't belong to user."
                    }))],
                    isError=True
                )

            task.status = "completed"
            task.completed = True
            session.add(task)
            session.commit()
            session.refresh(task)

        result = {
            "task_id": task.id,
            "status": "completed",
            "title": task.title,
            "message": f"Task '{task.title}' has been marked as completed!"
        }

        return CallToolResult(
            content=[TextContent(type="text", text=json.dumps(result))],
            isError=False
        )
    except Exception as e:
        return CallToolResult(
            content=[TextContent(type="text", text=json.dumps({
                "error": str(e),
                "message": f"Failed to complete task: {str(e)}"
            }))],
            isError=True
        )


async def handle_delete_task(params: Dict[str, Any]) -> CallToolResult:
    """Handle delete_task tool call"""
    try:
        validated_params = DeleteTaskParams(**params)

        # Get database session
        engine = create_engine(settings.DATABASE_URL)
        with Session(engine) as session:
            task = None

            # Find task by ID if provided
            if validated_params.task_id is not None:
                task = session.get(Task, validated_params.task_id)
            # Find task by title if provided
            elif validated_params.title is not None:
                from sqlalchemy import and_
                tasks = session.query(Task).filter(
                    and_(
                        Task.user_id == validated_params.user_id,
                        Task.title.ilike(f"%{validated_params.title}%")  # Case-insensitive partial match
                    )
                ).all()

                if not tasks:
                    return CallToolResult(
                        content=[TextContent(type="text", text=json.dumps({
                            "error": "Task not found",
                            "message": f"No task found with title containing '{validated_params.title}'."
                        }))],
                        isError=True
                    )
                elif len(tasks) > 1:
                    # If multiple tasks match, list them for the user to be more specific
                    task_titles = [f"'{t.title}' (ID: {t.id})" for t in tasks[:5]]  # Limit to first 5
                    return CallToolResult(
                        content=[TextContent(type="text", text=json.dumps({
                            "error": "Multiple tasks found",
                            "message": f"Multiple tasks match '{validated_params.title}': {', '.join(task_titles)}. Please be more specific or use the task ID."
                        }))],
                        isError=True
                    )
                else:
                    task = tasks[0]
            else:
                return CallToolResult(
                    content=[TextContent(type="text", text=json.dumps({
                        "error": "Missing parameters",
                        "message": "Either task_id or title must be provided to delete a task."
                    }))],
                    isError=True
                )

            if not task or task.user_id != validated_params.user_id:
                return CallToolResult(
                    content=[TextContent(type="text", text=json.dumps({
                        "error": "Task not found or access denied",
                        "message": f"Task with ID {validated_params.task_id or 'unknown'} not found or doesn't belong to user."
                    }))],
                    isError=True
                )

            task_id = task.id  # Store ID before deletion
            session.delete(task)
            session.commit()

        result = {
            "task_id": task_id,
            "title": task.title,
            "status": "deleted",
            "message": f"Task '{task.title}' has been deleted successfully!"
        }

        return CallToolResult(
            content=[TextContent(type="text", text=json.dumps(result))],
            isError=False
        )
    except Exception as e:
        return CallToolResult(
            content=[TextContent(type="text", text=json.dumps({
                "error": str(e),
                "message": f"Failed to delete task: {str(e)}"
            }))],
            isError=True
        )


async def handle_update_task(params: Dict[str, Any]) -> CallToolResult:
    """Handle update_task tool call"""
    try:
        validated_params = UpdateTaskParams(**params)

        # Get database session
        engine = create_engine(settings.DATABASE_URL)
        with Session(engine) as session:
            task = session.get(Task, validated_params.task_id)

            if not task or task.user_id != validated_params.user_id:
                return CallToolResult(
                    content=[TextContent(type="text", text=json.dumps({
                        "error": "Task not found or access denied",
                        "message": f"Task with ID {validated_params.task_id} not found or doesn't belong to user."
                    }))],
                    isError=True
                )

            if validated_params.title is not None:
                task.title = validated_params.title
            if validated_params.description is not None:
                task.description = validated_params.description

            session.add(task)
            session.commit()
            session.refresh(task)

        result = {
            "task_id": task.id,
            "status": "updated",
            "title": task.title,
            "message": f"Task '{task.title}' has been updated successfully!"
        }

        return CallToolResult(
            content=[TextContent(type="text", text=json.dumps(result))],
            isError=False
        )
    except Exception as e:
        return CallToolResult(
            content=[TextContent(type="text", text=json.dumps({
                "error": str(e),
                "message": f"Failed to update task: {str(e)}"
            }))],
            isError=True
        )


# Create Starlette app for HTTP transport
@asynccontextmanager
async def lifespan(app: Starlette):
    session_manager = StreamableHTTPSessionManager(app=server)
    async with session_manager.run():
        yield {"mcp_session_manager": session_manager}


def create_app():
    """Create the Starlette application with MCP server"""
    session_manager = StreamableHTTPSessionManager(app=server)

    @asynccontextmanager
    async def lifespan(app: Starlette) -> None:
        async with session_manager.run():
            yield

    app = Starlette(
        routes=[Mount("/mcp", app=session_manager.handle_request)],
        lifespan=lifespan,
    )

    return app


# Main entry point for the MCP server
async def serve():
    """Serve the MCP server over stdio"""
    async with server.stdio():
        await server.run_and_wait_shutdown()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(serve())