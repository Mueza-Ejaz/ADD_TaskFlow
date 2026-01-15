# Tasks: AI Chatbot Backend

**Feature Branch**: `P3-05-chatbot-backend`
**Spec**: [specs/P3-05-chatbot-backend/spec.md](specs/P3-05-chatbot-backend/spec.md)
**Plan**: [specs/P3-05-chatbot-backend/plan.md](specs/P3-05-chatbot-backend/plan.md)

## Phase 1: Setup

- [ ] T001 Install dependencies (mcp, openai) in backend/requirements.txt
- [ ] T002 Configure Environment Variables (GEMINI_API_KEY) in backend/.env.example
- [ ] T003 Create directory structure for MCP tools in backend/src/services/mcp_tools.py

## Phase 2: Foundational (Blocking)

**Goal**: Establish database schema and core agent infrastructure.

- [ ] T004 Create Conversation and Message models in backend/src/models/conversation.py and message.py
- [ ] T005 [P] Create database migration for new tables using Alembic
- [ ] T006 Implement basic Agent rehydration logic in backend/src/services/agent_service.py
- [ ] T007 Define Pydantic models for ToolCall and ChatResponse in backend/src/schemas/chat.py

## Phase 3: User Story 1 (Natural Language Task Creation & Retrieval)

**Goal**: Enable users to create and list tasks using natural language.
**Story**: [US1] Natural Language Task Creation & Retrieval (P1)

- [ ] T008 [US1] Implement add_task function with user_id validation in backend/src/services/mcp_tools.py
- [ ] T009 [US1] Implement list_tasks function with status filtering in backend/src/services/mcp_tools.py
- [ ] T010 [US1] Wrap add_task and list_tasks as MCP tools in backend/src/services/mcp_tools.py
- [ ] T011 [US1] Integrate MCP tools into Agent Service initialization in backend/src/services/agent_service.py
- [ ] T012 [US1] Create POST /api/{user_id}/chat endpoint in backend/src/api/chat.py
- [ ] T013 [US1] Wire up endpoint to Agent Service and Database Service in backend/src/api/chat.py

## Phase 4: User Story 2 (Task Status & Detail Updates)

**Goal**: Enable users to update task status and details via chat.
**Story**: [US2] Task Status & Detail Updates (P2)

- [ ] T014 [US2] Implement complete_task function in backend/src/services/mcp_tools.py
- [ ] T015 [US2] Implement delete_task function in backend/src/services/mcp_tools.py
- [ ] T016 [US2] Implement update_task function in backend/src/services/mcp_tools.py
- [ ] T017 [US2] Wrap complete/delete/update functions as MCP tools in backend/src/services/mcp_tools.py
- [ ] T018 [US2] Register new tools with Agent Service in backend/src/services/agent_service.py

## Phase 5: User Story 3 (Conversational Continuity & Transparency)

**Goal**: Ensure conversation persistence and transparent tool usage.
**Story**: [US3] Conversational Continuity & Transparency (P3)

- [ ] T019 [US3] Implement full conversation history loading in backend/src/services/chat_service.py
- [ ] T020 [US3] Enhance ChatResponse schema to include tool_calls metadata in backend/src/schemas/chat.py
- [ ] T021 [US3] Update chat endpoint to persist tool_calls in Message table in backend/src/api/chat.py

## Phase 6: Polish

**Goal**: Finalize error handling, security, and performance.

- [ ] T022 Implement user isolation check decorator for all MCP tools in backend/src/services/mcp_tools.py
- [ ] T023 Add friendly error handling for agent failures in backend/src/services/agent_service.py
- [ ] T024 Verify database indexes for user_id and conversation_id in backend/src/models/conversation.py
- [ ] T025 Run final full-flow manual test of chat endpoint

## Dependencies

1. **Setup** must complete first.
2. **Foundational** blocks all User Stories.
3. **US1** establishes the chat endpoint, blocking US2 and US3.
4. **US2** extends US1 with more tools.
5. **US3** refines the persistence layer established in US1.

## Implementation Strategy

- **MVP Scope**: Complete through Phase 3 (US1). This delivers a functional chatbot that can create and list tasks.
- **Parallel Execution**:
    - T004 (Models) and T007 (Schemas) can be done in parallel.
    - T008, T009, T014, T015, T016 (Tool Implementation) can be parallelized by multiple devs.
