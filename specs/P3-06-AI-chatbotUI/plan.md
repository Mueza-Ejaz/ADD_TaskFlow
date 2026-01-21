# Implementation Plan: Phase 6: AI Chatbot Frontend

**Branch**: `P3-06-AI-chatbotUI` | **Date**: 2026-01-16 | **Spec**: [specs/P3-06-AI-chatbotUI/spec.md](specs/P3-06-AI-chatbotUI/spec.md)
**Input**: Feature specification from `specs/P3-06-AI-chatbotUI/spec.md`

## Summary

Implement a responsive and intuitive AI chatbot interface for the TaskFlow application using OpenAI ChatKit. This frontend component will integrate with the existing Phase 5 backend to allow users to manage tasks through natural language, providing real-time tool call visualization and conversation persistence.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15+ (App Router)
**Primary Dependencies**: OpenAI ChatKit (`@openai/chatkit`), Framer Motion, Tailwind CSS, Axios/Fetch
**Storage**: Backend persistence (Phase 5), Frontend cache (React Query/Context)
**Testing**: Jest, React Testing Library, Playwright (E2E)
**Target Platform**: Web (Desktop & Mobile)
**Project Type**: Web application (Frontend focus)
**Performance Goals**: Initial load < 1s, Animations 60fps, Message interactions < 150ms
**Constraints**: Domain allowlist for OpenAI ChatKit, existing Better Auth integration

## Constitution Check

- **Frontend Standards**: Follows Section 2 (React/TS), Section 6 (Architecture), and Section 7 (Design System).
- **Security**: Implements domain allowlist as per Section 3 and Section 10.
- **Complexity**: Adheres to "Smallest Viable Change" by extending the existing dashboard.

## Project Structure

### Documentation (this feature)

```text
specs/P3-06-AI-chatbotUI/
├── spec.md              # Feature requirements
├── plan.md              # This technical plan
├── research.md          # Technology decisions
├── data-model.md        # Entity definitions
├── contracts/           # API contracts
├── quickstart.md        # Dev guide
└── tasks.md             # Implementation tasks (next step)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   └── dashboard/
│       └── chatbot/
│           ├── page.tsx          # Chatbot main page
│           ├── layout.tsx        # Chatbot layout
│           └── components/       # Chatbot-specific components
├── components/
│   └── chatbot/
│       ├── ChatInterface.tsx     # Main container
│       ├── ChatMessage.tsx       # Message bubble
│       ├── ToolCallStatus.tsx    # Tool visualization
│       ├── MessageInput.tsx      # Text input
│       └── ConversationHistory.tsx # Sidebar history
├── hooks/
│   ├── useChat.ts               # Core chat logic
│   └── useConversations.ts      # History management
└── providers/
    └── ChatProvider.tsx         # Chat state context
```

## Implementation Phases

### Phase 6A: Foundation Setup
1. **ChatKit Config**: Setup environment variables (`NEXT_PUBLIC_OPENAI_DOMAIN_KEY`) and initialize ChatKit.
2. **Component Scaffolding**: Create the directory structure and basic shell components.
3. **Theming**: Apply Tailwind styles and Framer Motion configurations aligned with the design system.

### Phase 6B: Core Features
1. **API Integration**: Connect to `POST /api/{user_id}/chat` with JWT authentication.
2. **Message Flow**: Implement sending/receiving logic with typing indicators.
3. **Tool Visualization**: Build the `ToolCallStatus` component to show real-time task operations.
4. **Persistence**: Implement history loading and persistence via the backend.

### Phase 6C: Polish & Integration
1. **Responsive Design**: Ensure full mobile support and keyboard accessibility.
2. **Navigation**: Add chatbot link to the main dashboard sidebar.
3. **State Sync**: Ensure task list refreshes when the chatbot modifies data.
4. **Testing**: Execute unit and integration tests for chat flows.

## Architecture Decisions

- **ADR-008-ChatKit-vs-Custom**: Use OpenAI ChatKit for rapid, official integration while retaining styling control via Tailwind.
- **ADR-009-Real-time-Strategy**: Use standard HTTP streaming/polling for message updates to maintain simplicity with the existing FastAPI backend.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| ChatKit Library | Requires specific domain config | Building a custom LLM UI from scratch is high-effort and error-prone. |

