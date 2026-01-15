# Implementation Plan: AI Chatbot Backend

**Branch**: `P3-05-chatbot-backend` | **Date**: 2026-01-15 | **Spec**: [specs/P3-05-chatbot-backend/spec.md](specs/P3-05-chatbot-backend/spec.md)
**Input**: Feature specification from `specs/P3-05-chatbot-backend/spec.md`

## Summary

Build a stateless AI chatbot backend using FastAPI and OpenAI Agents SDK. The system will expose an endpoint `POST /api/v1/{user_id}/chat` that persists conversation history in PostgreSQL (Conversations/Messages tables) and rehydrates an OpenAI Agent for each request. The Agent will have access to 5 internal MCP-defined tools (add/list/complete/delete/update tasks) to manage user tasks via natural language.

## Technical Context

**Language/Version**: Python 3.12+
**Primary Dependencies**: FastAPI, SQLModel, OpenAI Agents SDK, MCP SDK (Python)
**Storage**: PostgreSQL (Neon) - New tables: `conversations`, `messages`
**Testing**: pytest, AsyncClient, Mocking for OpenAI/MCP
**Target Platform**: Linux container (Docker/Railway)
**Project Type**: Web Application (Backend)
**Performance Goals**: Chat response < 2s (p95), stateless scalability
**Constraints**: User Isolation (JWT), Stateless Architecture, 5 MCP Tools
**Scale/Scope**: Support 50 concurrent chat sessions

## Constitution Check

*GATE: Passed.*

- **Code Quality**: Python 3.12+, Typed, Docstrings (Compliant)
- **Security**: JWT Auth, User Isolation, Input Validation (Compliant)
- **Database**: SQLModel, Standard Schema (Compliant)
- **API Design**: Standardized Endpoint, JSON Responses (Compliant)
- **AI Systems**: Stateless Agent, MCP Tools (Compliant)

## Project Structure

### Documentation (this feature)

```text
specs/P3-05-chatbot-backend/
├── plan.md              # This file
├── research.md          # Technical decisions
├── data-model.md        # DB Schema
├── quickstart.md        # Setup guide
├── contracts/           # API OpenAPIs
│   └── openapi.yaml
└── checklists/          # Requirements checklist
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   └── chat.py              # New Chat Endpoint
│   ├── core/
│   │   └── config.py            # AI Config
│   ├── models/
│   │   ├── conversation.py      # New Model
│   │   └── message.py           # New Model
│   ├── services/
│   │   ├── agent_service.py     # OpenAI Agent Logic
│   │   ├── chat_service.py      # Conversation CRUD
│   │   └── mcp_tools.py         # 5 Task Tools definitions
│   └── main.py                  # App entry
└── tests/
    ├── test_chat_api.py
    └── test_agent_service.py
```

**Structure Decision**: Option 2 (Web application) - integrated into existing backend structure.

## Implementation Phases

### Phase 5A: Foundation Setup
**Objective:** Setup MCP server tools and database schema
1. **MCP Tools**: Implement `add_task`, `list_tasks`, `complete_task`, `delete_task`, `update_task` using MCP SDK.
2. **Database**: Create `Conversation` and `Message` models and migrations.
3. **Env**: Configure OpenAI API Key and Agent settings.

### Phase 5B: Core Implementation
**Objective:** Build chat endpoint and agent integration
1. **Chat Endpoint**: `POST /api/{user_id}/chat`
2. **Agent Service**: Rehydration logic (Load History -> Init Agent -> Run -> Save).
3. **Validation**: Ensure `user_id` context is passed to tools securely.

### Phase 5C: Integration & Testing
**Objective:** Full integration and comprehensive testing
1. **E2E Tests**: Mocked OpenAI responses to test tool routing.
2. **Performance**: Verify latency targets.
3. **Docs**: API documentation.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New Tables | Persist chat history | In-memory storage violates stateless requirement |
| MCP SDK | Standardize tool defs | Custom function calling is less portable/standard |