# Research & Analysis: Phase 6 AI Chatbot Frontend

**Feature**: AI Chatbot Frontend (`P3-06-AI-chatbotUI`)
**Date**: 2026-01-16
**Status**: Complete

## 1. Technology Selection

### Chat Interface: OpenAI ChatKit vs Custom
- **Decision**: **OpenAI ChatKit**
- **Rationale**: 
  - Provides a standardized, battle-tested UI for LLM interactions.
  - Reduces development time for core chat features (streaming, thread management).
  - Explicitly requested in the feature specification.
- **Implementation Strategy**: 
  - Wrap ChatKit components with custom Tailwind CSS to match the existing design system.
  - Use `context7-expert` skill to ensure correct configuration and domain allowlist setup.

### State Management: React Context vs Redux
- **Decision**: **React Context + Hooks**
- **Rationale**: 
  - The chat state is localized and distinct from the global application state (like auth).
  - `ChatProvider` pattern allows easy access to chat actions (`sendMessage`, `clearChat`) throughout the dashboard.
  - Lower complexity overhead than Redux.

### Real-time Updates: Polling vs WebSockets
- **Decision**: **Polling / HTTP Streaming**
- **Rationale**: 
  - The Phase 5 backend uses standard REST endpoints.
  - ChatKit handles streaming responses natively via standard HTTP.
  - Avoids the complexity of a separate WebSocket server for this phase.

## 2. Integration Patterns

### Backend Communication
- **Endpoint**: `POST /api/{user_id}/chat`
- **Auth**: Use existing `Better Auth` JWT tokens in the Authorization header.
- **Data Flow**:
  1. Frontend sends user message → Backend.
  2. Backend interacts with OpenAI Agents SDK.
  3. Backend streams response + tool calls back to Frontend.
  4. Frontend visualizes tool calls (e.g., "Adding task...") in real-time.

## 3. Unknowns & Clarifications

| Unknown | Resolution |
|---------|------------|
| **ChatKit Styling** | Resolved: ChatKit supports custom class names and standard CSS. We will override styles using our Tailwind utility classes. |
| **Mobile Responsiveness** | Resolved: Will use a Sidebar drawer pattern for conversation history on mobile, overlaying the chat interface. |
| **Tool Call UI** | Resolved: Custom `ToolCallStatus` component will render specific states (loading, success, error) based on the structured tool output from the backend. |

## 4. Best Practices (via Context7 Skill)

- **Security**: Never expose OpenAI API keys on the frontend. Use the backend proxy pattern (which Phase 5 provides).
- **Performance**: Implement virtualization if conversation history exceeds 50 messages.
- **UX**: Always show a "typing" or "processing" state to acknowledge user input immediately.
