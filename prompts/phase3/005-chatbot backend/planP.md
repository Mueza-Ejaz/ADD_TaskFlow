Create a detailed implementation plan for Phase 5: AI Chatbot Backend following Spec-Kit Plus plan template standards.

**File Location:** `specs/P3-05-chatbot-backend/plan.md`

**Plan Structure:**

# Phase 5: AI Chatbot Backend Implementation Plan

## 1. Architecture Overview

### System Architecture:

### Key Components:
1. **MCP Server** - Task management tools + Context7 integration
2. **Chat Endpoint** - Stateless FastAPI route with OpenAI Agents SDK
3. **Database Layer** - New conversations/messages tables
4. **Skill Integration** - context7-expert skill for documentation
5. **Security Layer** - JWT validation, user isolation

## 2. Implementation Phases

### Phase 5A: Foundation Setup (Week 1)
**Objective:** Setup MCP server and database schema

**Tasks:**
1. **MCP Server Structure**
   - Install MCP SDK and create server structure
   - Define 5 task tool interfaces (add_task, list_tasks, complete_task, delete_task, update_task)
   - Integrate existing task CRUD logic from Phase 3

2. **Database Migration**
   - Create `conversations` table migration
   - Create `messages` table migration
   - Add foreign key constraints to existing tasks table
   - Update SQLModel models as per constitution

3. **Development Environment**
   - Set up OpenAI Agents SDK locally
   - Configure MCP server to run alongside FastAPI
   - Test basic MCP tool invocation

**Skill Usage Instructions:**
- Use `context7-expert` skill for MCP SDK documentation
- Apply skill: `Apply skill from .claude/skills/context7-expert.md`
- Reference path: Project root → `.claude/skills/context7-expert.md`

### Phase 5B: Core Implementation (Week 2)
**Objective:** Build chat endpoint and agent integration

**Tasks:**
1. **Chat Endpoint Implementation**
   - Create `POST /api/{user_id}/chat` endpoint
   - Implement stateless request cycle
   - Store user messages and AI responses in database

2. **OpenAI Agents SDK Integration**
   - Set up Agent with MCP tools configuration
   - Implement natural language understanding for task commands
   - Add tool calling visualization in responses

3. **Context7 Integration**
   - Integrate Context7 MCP server for documentation
   - Apply context7-expert skill for all library research
   - Ensure zero hallucinations in tool documentation

4. **Error Handling & Validation**
   - Add JWT token validation middleware
   - Implement user isolation (all queries filter by user_id)
   - Add rate limiting for chat endpoints

### Phase 5C: Integration & Testing (Week 3)
**Objective:** Full integration and comprehensive testing

**Tasks:**
1. **End-to-End Testing**
   - Test all 5 MCP tools via natural language
   - Verify stateless architecture (server restart test)
   - Test conversation persistence

2. **Performance Optimization**
   - Optimize chat response time (< 2 seconds target)
   - Implement connection pooling for database
   - Add caching for frequently accessed conversations

3. **Security Hardening**
   - Input sanitization for natural language prompts
   - Implement audit logging for tool calls
   - Add monitoring for abnormal chat patterns

4. **Documentation & Deployment**
   - Create API documentation for chat endpoint
   - Write deployment guide for MCP server
   - Prepare environment variables configuration

## 3. Component Breakdown

### A. MCP Server Components:
1. **Task Tools Module** (`mcp_tools/task_tools.py`)
   - `add_task()`: Creates new task with user_id validation
   - `list_tasks()`: Retrieves tasks with status filtering
   - `complete_task()`: Marks task as completed
   - `delete_task()`: Removes task with ownership check
   - `update_task()`: Updates task title/description

2. **Context7 Integration Module** (`mcp_tools/context7_integration.py`)
   - Wrapper for Context7 MCP server
   - Automatic application of context7-expert skill
   - Hallucination prevention layer

3. **MCP Server Main** (`mcp_server/main.py`)
   - MCP SDK server initialization
   - Tool registration and configuration
   - Error handling and logging

### B. Chat Endpoint Components:
1. **Chat Router** (`api/chat.py`)
   - FastAPI router for `/api/{user_id}/chat`
   - Request validation with Pydantic models
   - Response formatting with tool_calls array

2. **Agent Service** (`services/agent_service.py`)
   - OpenAI Agents SDK configuration
   - MCP tools integration with agent
   - Conversation history management

3. **Database Service** (`services/conversation_service.py`)
   - CRUD operations for conversations and messages
   - Stateless conversation retrieval
   - Message pagination support

### C. Skill Integration Components:
1. **Skill Enforcement Layer** (`skills/enforcement.py`)
   - Automatic context7-expert skill application
   - Hallucination detection and prevention
   - Documentation quality validation

## 4. Dependencies and Sequencing

### Critical Path:
Week 1: MCP Server Setup → Database Migration → Development Environment
↓
Week 2: Chat Endpoint → Agents SDK → Context7 Integration → Error Handling
↓
Week 3: E2E Testing → Performance Optimization → Security → Documentation

### Dependency Map:
MCP Server Setup
├─ Database Migration (depends on Phase 3 task schema)
└─ Development Environment Setup
↓
Chat Endpoint
├─ Agents SDK (depends on MCP tools)
└─ Context7 Integration (depends on MCP server)
↓
Testing & Optimization
├─ All components must be complete
└─ Performance testing requires full integration


### External Dependencies:
1. **Phase 3 Complete** - Task CRUD operations must work
2. **Phase 2 Complete** - JWT authentication must be functional
3. **Context7 MCP Server** - Must be added to Claude CLI
4. **OpenAI API Key** - Required for Agents SDK

## 5. Design Decisions

### Decision 1: Stateless vs Stateful Chat
**Choice:** Stateless architecture
**Why:** Horizontal scalability, resilience to server restarts
**Trade-off:** Slightly more database load vs better scalability
**ADR Required:** ADR-005-Stateless-Architecture

### Decision 2: MCP Tool Design
**Choice:** 5 separate tools vs 1 unified tool
**Why:** Clear separation of concerns, easier testing
**Trade-off:** More tool definitions vs cleaner boundaries
**ADR Required:** ADR-006-MCP-Tool-Design

### Decision 3: Skill Integration Method
**Choice:** Explicit skill application in plan vs implicit
**Why:** Ensures context7-expert skill is always used for documentation
**Trade-off:** Manual step required vs automatic but potentially missed
**ADR Required:** ADR-007-Skill-Integration

### Decision 4: Database Schema Design
**Choice:** Separate conversations and messages tables
**Why:** Normalized data, easier querying, follows constitution
**Trade-off:** More joins vs cleaner data model
**Constitution Reference:** Section 4 Database Standards

## 6. Skill Integration Strategy

### Skill Application Protocol:
When implementing ANY library/technology in Phase 5:
- Activate context7-expert skill: Apply skill from .claude/skills/context7-expert.md
- Query Context7 for accurate documentation
- Follow two-step handshake: resolve-library-id → get-library-docs
- Apply pagination persistence if needed


### Mandatory Skill Usage For:
- OpenAI Agents SDK implementation
- MCP SDK patterns and best practices
- FastAPI advanced features (WebSockets, middleware)
- SQLModel migrations and advanced queries
- Any library mentioned in constitution Section 13

### Skill Path Reference:
Absolute Path: ADD_TaskFlow-App/.claude/skills/context7-expert.md
Relative Path: .claude/skills/context7-expert.md
CLI Command: Apply skill from .claude/skills/context7-expert.md


## 7. Testing Strategy

### Unit Tests:
- MCP tool functions (mock database)
- Agent service (mock OpenAI responses)
- Conversation service (in-memory database)

### Integration Tests:
- Chat endpoint with real MCP server
- Complete request cycle (user message → AI response)
- Database persistence verification

### E2E Tests:
- Natural language commands for all 5 task operations
- Stateless architecture validation (server restart)
- Error scenarios (invalid JWT, missing tasks)

### Skill Validation Tests:
- Verify context7-expert skill prevents hallucinations
- Test two-step handshake enforcement
- Validate pagination persistence

## 8. Risk Mitigation

### Technical Risks:
1. **MCP Tool Integration Complexity**
   - Mitigation: Start with single tool (add_task), then expand
   - Fallback: Manual CRUD operations if MCP fails

2. **OpenAI Agents SDK Learning Curve**
   - Mitigation: Use context7-expert skill for accurate documentation
   - Fallback: Reference official examples from Context7

3. **Stateless Architecture Overhead**
   - Mitigation: Optimize database queries with indexes
   - Monitoring: Track response times and database load

### Skill Integration Risks:
1. **Forgotten Skill Application**
   - Mitigation: Explicit mention in every implementation task
   - Checklist: Add skill application to task acceptance criteria

2. **Context7 Server Unavailability**
   - Mitigation: Cache documentation locally after first fetch
   - Fallback: Use saved documentation from previous sessions

## 9. Success Metrics

### Phase Completion Criteria:
- ✅ All 5 MCP tools implemented and tested
- ✅ Chat endpoint responds in < 2 seconds (p95)
- ✅ Stateless architecture validated (survives server restart)
- ✅ context7-expert skill applied for all documentation
- ✅ User isolation maintained (no data leakage)
- ✅ Comprehensive test coverage (> 80%)

### Skill Integration Success:
- Zero hallucinations in library IDs
- All documentation sourced from Context7
- Two-step handshake followed in 100% of cases
- Pagination persistence applied when needed

## 10. Resource Requirements

### Development:
- OpenAI API key (for Agents SDK)
- Neon PostgreSQL database (already setup)
- Context7 MCP server access (already configured)
- Local development: Python 3.12+, Node.js 18+

### Deployment:
- Backend server with MCP server capability
- Environment variables: OPENAI_API_KEY, DATABASE_URL, JWT_SECRET
- Monitoring: Chat response times, error rates, skill application logs

---

**Governance:** This plan follows ADD_TaskFlow-App Constitution v2.0.0
**Status:** Draft
**Version:** 1.0.0
**Created:** 2026-01-14
**Reference Documents:**
- Phase 5 Specification: `specs/phase5-ai-chatbot-backend/spec.md`
- Constitution: `ADD_TaskFlow-App Constitution v2.0.0`
- Skill File: `.claude/skills/context7-expert.md`


