# Tasks: Phase 6 AI Chatbot Frontend

**Feature**: `P3-06-AI-chatbotUI`
**Status**: Todo

## Implementation Strategy
- **Incremental Delivery**: We will build the foundation first, then the core chat loop, followed by tool visualization, and finally persistence and polish.
- **MVP Scope**: Phases 1, 2, and 3 constitute the MVP (Functional Chat).
- **Parallelization**: Component UI building can happen in parallel with API integration logic once the types are defined.

## Dependencies
1. **US1 (Manage Tasks)**: Depends on Phase 2 (Foundation)
2. **US2 (Tool Visualization)**: Depends on US1 (Message Flow)
3. **US3 (Persistence)**: Depends on US1 (Basic Chat)
4. **US4 (Mobile)**: Depends on US1 & US2 (UI Components)

---

## Phase 1: Setup
**Goal**: Initialize project structure and install dependencies.

- [ ] T001 Install dependencies (ChatKit, Framer Motion) in `frontend/package.json`
- [ ] T002 Configure environment variables in `frontend/.env.local`
- [ ] T003 Create directory structure in `frontend/app/dashboard/chatbot/`
- [ ] T004 Create component directory structure in `frontend/components/chatbot/`
- [ ] T005 Define TypeScript interfaces for Message and Conversation in `frontend/types/chat.ts`

## Phase 2: Foundational
**Goal**: Establish backend communication and state management.
**Prerequisites**: Phase 1 complete.

- [ ] T006 [P] Create API client service for chat in `frontend/lib/api/chat.ts`
- [ ] T007 Implement `ChatProvider` context in `frontend/providers/ChatProvider.tsx`
- [ ] T008 [P] Create `useChat` hook skeleton in `frontend/hooks/useChat.ts`
- [ ] T009 [P] Create `useConversations` hook skeleton in `frontend/hooks/useConversations.ts`
- [ ] T010 Add Chatbot link to main navigation in `frontend/components/layout/Sidebar.tsx`

## Phase 3: Manage Tasks via Chat (P1) [US1]
**Goal**: Users can send messages and receive text responses.
**Test Criteria**: User sends "Hello", system displays user bubble, shows typing indicator, then displays assistant response.

- [ ] T011 [US1] Create `MessageInput` component with send button in `frontend/components/chatbot/MessageInput.tsx`
- [ ] T012 [US1] Create `ChatMessage` component with role-based styling in `frontend/components/chatbot/ChatMessage.tsx`
- [ ] T013 [US1] Implement `ChatInterface` layout in `frontend/components/chatbot/ChatInterface.tsx`
- [ ] T014 [US1] Connect `useChat` hook to `POST /api/{user_id}/chat` in `frontend/hooks/useChat.ts`
- [ ] T015 [US1] Implement optimistic UI updates (append user message immediately) in `frontend/providers/ChatProvider.tsx`
- [ ] T016 [US1] Implement typing indicator state and UI in `frontend/components/chatbot/ChatInterface.tsx`
- [ ] T017 [US1] Wire up main page to render ChatInterface in `frontend/app/dashboard/chatbot/page.tsx`

## Phase 4: Real-time Tool Visualization (P2) [US2]
**Goal**: Users see "Thinking..." and specific tool actions (e.g., "Adding task").
**Test Criteria**: User says "Add task X", UI shows "Calling add_task...", then updates to "Success".

- [ ] T018 [US2] Update `Message` type to include `toolCalls` in `frontend/types/chat.ts`
- [ ] T019 [US2] Create `ToolCallStatus` component in `frontend/components/chatbot/ToolCallStatus.tsx`
- [ ] T020 [US2] Integrate `ToolCallStatus` into `ChatMessage` component in `frontend/components/chatbot/ChatMessage.tsx`
- [ ] T021 [US2] Update `useChat` to parse tool calls from API response in `frontend/hooks/useChat.ts`
- [ ] T022 [US2] Implement specific icons for `add_task`, `list_tasks`, etc. in `frontend/components/chatbot/ToolCallStatus.tsx`

## Phase 5: Conversation Persistence (P2) [US3]
**Goal**: Chat history survives page reloads.
**Test Criteria**: Refresh page → History is restored.

- [ ] T023 [US3] Implement `fetchConversations` in `frontend/lib/api/chat.ts`
- [ ] T024 [US3] Create `ConversationHistory` sidebar component in `frontend/components/chatbot/ConversationHistory.tsx`
- [ ] T025 [US3] Update `ChatProvider` to load history on mount in `frontend/providers/ChatProvider.tsx`
- [ ] T026 [US3] Implement "New Chat" functionality in `frontend/components/chatbot/ConversationHistory.tsx`
- [ ] T027 [US3] Add local storage caching (optional optimization) in `frontend/hooks/useConversations.ts`

## Phase 6: Mobile Responsive Chat (P3) [US4]
**Goal**: Usable on mobile devices.
**Test Criteria**: Viewport < 768px shows single column, hamburger menu for history.

- [ ] T028 [US4] Implement mobile sidebar toggle in `frontend/components/chatbot/ChatInterface.tsx`
- [ ] T029 [US4] Adjust `MessageInput` layout for mobile keyboards in `frontend/components/chatbot/MessageInput.tsx`
- [ ] T030 [US4] Ensure touch targets are accessible (min 44px) in `frontend/components/chatbot/ConversationHistory.tsx`
- [ ] T031 [US4] Test and fix overflow issues on small screens in `frontend/app/dashboard/chatbot/page.tsx`

## Phase 7: Polish & Cross-Cutting
**Goal**: Final UX improvements and cleanup.

- [ ] T032 Add Framer Motion entry animations to messages in `frontend/components/chatbot/ChatMessage.tsx`
- [ ] T033 Implement task list auto-refresh trigger in `frontend/hooks/useChat.ts`
- [ ] T034 Add error boundary for chat component in `frontend/components/chatbot/ChatErrorBoundary.tsx`
- [ ] T035 Final accessibility audit (ARIA labels, keyboard nav) in `frontend/components/chatbot/`


