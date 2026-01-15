# Phase 0 Research: AI Chatbot Backend

**Feature**: P3-05-chatbot-backend
**Date**: 2026-01-15

## 1. Technical Context & Clarifications

### 1.1 Context7 Integration
**Question**: Is `context7-expert` a runtime dependency for the Chatbot or a development tool for the engineer?
**Analysis**: 
- `spec.md` states: "Skill Purpose: Prevents hallucinations in library IDs... When to Apply Skill: Before implementing...". 
- `planP.md` included a `context7_integration.py` component.
**Decision**: Context7 is a **Development Time** tool. 
- It will NOT be included in the runtime `requirements.txt`.
- It will NOT be part of the `mcp_server` code.
- It will be used by the agent/developer to verify library usage during implementation.
- The `mcp_tools/context7_integration.py` mentioned in `planP.md` will be **omitted**.

### 1.2 OpenAI Agents SDK
**Question**: How to integrate OpenAI Agents SDK with FastAPI statelessly?
**Analysis**:
- Agents SDK usually manages state.
- Requirement FR-007 mandates "stateless" server.
- **Pattern**: 
    1. Receive `conversation_id` + message.
    2. Load conversation history from DB (`messages` table).
    3. Re-hydrate Agent with history.
    4. Run Agent (which calls MCP tools).
    5. Save new messages (User + Assistant + Tool Calls) to DB.
    6. Return response.
    7. Discard Agent instance.
**Decision**: Use "Rehydration Pattern". The Agent will be initialized per-request with history from the database.

### 1.3 MCP Server & FastAPI
**Question**: How to run MCP Server alongside FastAPI?
**Analysis**:
- MCP is typically a stdio-based server, but for a web backend, we need to invoke it internally or run it as a service.
- Since we are building the "Chatbot Backend" which *is* the MCP host (it calls the tools), the `mcp_server` components described in `planP.md` are actually **internal tools** defined within the application, exposed to the OpenAI Agent.
- The `mcp_tools` module will define functions decorated with `@mcp.tool` (or equivalent SDK annotation) that the Agent can call.
- We might also want to expose these tools via a standard MCP protocol if we want *other* clients (like Claude Desktop) to connect, but the primary consumer is the internal OpenAI Agent.
**Decision**: Define tools using the MCP Python SDK. Register them with the OpenAI Agent. If external MCP access is needed, we can expose a distinct endpoint (SSE/Stdio), but for `POST /chat`, the Agent calls Python functions directly.

## 2. Technology Selection

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Language** | Python 3.12+ | Project standard, async support. |
| **Web Framework** | FastAPI | Async, Pydantic integration, existing stack. |
| **Agent Framework** | OpenAI Agents SDK | Requirement, native tool calling. |
| **Tool Protocol** | MCP SDK (Python) | Standardized tool definition, extensibility. |
| **Database** | SQLModel (PostgreSQL) | Existing stack, async ORM. |
| **Auth** | Better Auth (JWT) | Existing stack, stateless validation. |

## 3. Implementation Strategy
1. **Define Tools**: Implement `add_task`, etc. as standalone Python functions with Pydantic models.
2. **Wrap Tools**: Use MCP SDK to define them as "Tools".
3. **Agent Loop**: In `/chat` endpoint, load history -> init Agent with Tools -> `agent.run(message)` -> save history -> return.
