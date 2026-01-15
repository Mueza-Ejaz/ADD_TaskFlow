Create a comprehensive specification file for Phase 5: AI Chatbot Backend following Spec-Kit Plus standards.

**File Location:** `specs/P3-05-chatbot-backend/spec.md`

**Specification Structure:**

# Phase 5: AI Chatbot Backend Specification

## 1. Overview
Build a stateless AI chatbot backend with MCP server architecture that allows users to manage tasks through natural language conversations.

## 2. Scope

### In-Scope:
- MCP Server with 5 task management tools (add_task, list_tasks, complete_task, delete_task, update_task)
- Stateless chat endpoint: `POST /api/{user_id}/chat`
- OpenAI Agents SDK integration for natural language processing
- Database models for conversations and messages
- Integration with existing task CRUD operations
- Context7 MCP server for accurate documentation retrieval
- Skill integration: context7-expert for hallucination-free documentation

### Out-of-Scope:
- Frontend chat interface (Phase 6)
- User authentication (already implemented in Phase 2)
- Basic task CRUD (already implemented in Phase 3)
- Deployment configuration (covered in deployment standards)

## 3. User Stories

### As a User, I want to:
- US5.1: Ask in natural language to add a task (e.g., "Remind me to buy groceries")
- US5.2: View my tasks by asking (e.g., "Show me my pending tasks")
- US5.3: Mark tasks complete by speaking (e.g., "Mark task 3 as done")
- US5.4: Delete tasks through conversation (e.g., "Remove the meeting task")
- US5.5: Update task details naturally (e.g., "Change task 1 to 'Call mom tonight'")
- US5.6: Continue conversations after server restart (stateless persistence)
- US5.7: Get clear confirmation for all actions
- US5.8: See which MCP tools were invoked during conversation

## 4. Acceptance Criteria

### MCP Server (AC5.1 - AC5.5):
- AC5.1: `add_task` tool accepts user_id, title, description and returns task_id
- AC5.2: `list_tasks` tool accepts user_id, status filter and returns task array
- AC5.3: `complete_task` tool accepts user_id, task_id and marks task complete
- AC5.4: `delete_task` tool accepts user_id, task_id and removes task
- AC5.5: `update_task` tool accepts user_id, task_id, title/description updates

### Chat Endpoint (AC5.6 - AC5.10):
- AC5.6: `POST /api/{user_id}/chat` accepts conversation_id (optional) and message
- AC5.7: Endpoint returns conversation_id, response, and tool_calls array
- AC5.8: All user messages stored in database with role='user'
- AC5.9: All AI responses stored in database with role='assistant'
- AC5.10: Server holds NO state between requests (stateless)

### Agent Behavior (AC5.11 - AC5.15):
- AC5.11: Agent understands natural language commands for all 5 task operations
- AC5.12: Agent uses appropriate MCP tool based on user intent
- AC5.13: Agent confirms actions with friendly responses
- AC5.14: Agent handles errors gracefully with helpful messages
- AC5.15: Agent can chain multiple tools in single turn if needed

### Skill Integration (AC5.16 - AC5.17):
- AC5.16: When agent needs documentation, use `context7-expert` skill
- AC5.17: Skill path: `.claude/skills/context7-expert.md`
- AC5.18: Apply skill before any MCP tool usage for library verification
- AC5.19: Skill must prevent hallucinations in library IDs

## 5. Technical Requirements

### Database Models (From Constitution):
```python
# Required tables: conversations, messages
# Models must include: user_id, created_at, updated_at
# Foreign keys: user_id → users.id, conversation_id → conversation.id

API Standards:
Base URL: /api/v1/

Chat endpoint: POST /api/{user_id}/chat

Response format: JSON with conversation_id, response, tool_calls

Error format: {"detail": "message", "status": 400}

MCP Server Implementation:
- Use Official MCP SDK (Python)
- Tools must follow exact parameter requirements
- All tools include user_id parameter for data isolation
- Tool responses follow standardized JSON format

Integration Requirements:
- Must work with existing Better Auth JWT tokens
- Must filter all data by authenticated user_id
- Must reuse existing Task model and database connection
- Must follow Constitution v2.0.0 AI System Standards

6. Skill Usage Instructions
How to Use context7-expert Skill:
Apply skill from .claude/skills/context7-expert.md
and answer using Context7 MCP tools only:

[Your technical question about OpenAI Agents SDK, MCP SDK, etc.]

Skill Purpose:
- Prevents hallucinations in library IDs
- Ensures accurate, up-to-date documentation
- Enforces two-step handshake (resolve → fetch)
- Standardizes mode selection (code vs info)
- Requires pagination persistence

When to Apply Skill:
- Before implementing OpenAI Agents SDK components
- When referencing MCP SDK documentation
- When designing chat endpoint architecture
- When troubleshooting integration issues
- Before any library/technology research

Skill Location:
Project Root → .claude/skills/context7-expert.md

. Success Criteria (from Constitution)
Phase 5 Must Deliver:
✅ MCP Server: 5 task management tools exposed
✅ Chat Endpoint: POST /api/{user_id}/chat working statelessly
✅ Database: conversations and messages tables created
✅ OpenAI Integration: Agents SDK properly configured
✅ Integration: All existing task CRUD operations work via MCP tools

8. References
Constitution Sections:
Section 2: Code Quality Standards (AI Systems)
Section 3: Security Standards (AI Security)
Section 4: Database Standards (Conversation/Message models)
Section 5: API Design Standards (Chat endpoint format)

Section 13: AI System Standards (Agent behavior)
Existing Components:
Phase 2: Better Auth JWT tokens
Phase 3: Task CRUD operations
Phase 4: Frontend-backend integration

External Documentation:
OpenAI Agents SDK: Use context7-expert skill for accurate docs
MCP SDK: Use context7-expert skill for official patterns
FastAPI: Use context7-expert skill for integration examples

9. Implementation Order
MCP Server Setup (Week 1)
Install MCP SDK
Create 5 task tools
Test tool invocation

Chat Endpoint (Week 2)
Create FastAPI route
Implement stateless design
Integrate OpenAI Agents SDK

Database Migration (Week 2)
Create conversations table
Create messages table
Add foreign key constraints

Integration Testing (Week 3)
Test MCP tools with existing tasks
Validate stateless architecture
Test skill integration

Deployment Prep (Week 3)
Environment variables setup
Health check endpoints
Logging configuration

10. Risk Mitigation

Technical Risks:
- Hallucinations in AI responses → Mitigation: Use context7-expert skill
- Stateless design complexity → Mitigation: Clear database schema
- MCP tool integration issues → Mitigation: Follow official SDK patterns
- Performance in chat responses → Mitigation: Response time < 2s target

Skill Integration Risks:
- Incorrect skill application → Mitigation: Explicit instructions in AC5.16-AC5.19
- Missing skill activation → Mitigation: Mandatory skill path reference
- Outdated documentation → Mitigation: Skill enforces Context7 verification

Governance: This specification follows ADD_TaskFlow-App Constitution v2.0.0
Status: Draft
Version: 1.0.0
Created: 2026-01-14
