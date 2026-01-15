Create a comprehensive specification file for Phase 6: AI Chatbot Frontend following Spec-Kit Plus standards.

**File Location:** `specs/P3-06-AI-chatbotUI/spec.md`

**Specification Structure:**

# Phase 6: AI Chatbot Frontend Specification

## 1. Overview
Build an intuitive AI chatbot interface using OpenAI ChatKit that allows users to manage tasks through natural language conversations, integrated with the Phase 5 backend.

## 2. Scope

### In-Scope:
- OpenAI ChatKit setup and domain allowlist configuration
- Responsive chat interface with message history
- Real-time tool call visualization and status updates
- Integration with existing Better Auth system
- Conversation persistence and restoration
- Mobile-responsive design with animations
- Integration with backend chat endpoint from Phase 5
- Skill integration: context7-expert for frontend ChatKit implementation

### Out-of-Scope:
- Backend AI logic (already implemented in Phase 5)
- User authentication flows (already implemented in Phase 2)
- Basic task management UI (already implemented in Phase 4)
- Admin dashboard or analytics

## 3. User Stories

### As a User, I want to:
- US6.1: Access chatbot from main navigation menu
- US6.2: See conversation history with clear user/assistant differentiation
- US6.3: Send natural language messages about task management
- US6.4: See real-time typing indicators when AI is processing
- US6.5: View which MCP tools are being called during conversation
- US6.6: Continue conversations seamlessly after page refresh
- US6.7: Use chatbot on mobile devices with responsive design
- US6.8: See animated feedback for message sending and receiving
- US6.9: Clear conversation history or start new conversation
- US6.10: Get visual confirmation when tasks are created/updated/deleted

### As a Developer, I want to:
- US6.11: Easy ChatKit setup with proper domain configuration
- US6.12: Clean component architecture following existing patterns
- US6.13: Type-safe ChatKit integration with TypeScript
- US6.14: Proper error handling for network issues
- US6.15: Integration with existing design system (Tailwind + Framer Motion)

## 4. Acceptance Criteria

### ChatKit Setup (AC6.1 - AC6.4):
- AC6.1: ChatKit configured with domain key from environment variable
- AC6.2: Domain allowlist properly configured in OpenAI dashboard
- AC6.3: Local development works on localhost without allowlist
- AC6.4: Production deployment requires domain verification

### Chat Interface (AC6.5 - AC6.10):
- AC6.5: Messages display in bubbles with user/assistant colors (blue/gray)
- AC6.6: Timestamps shown for each message
- AC6.7: Typing indicator appears during AI processing
- AC6.8: Tool call status shows loading/success/error states
- AC6.9: Smooth animations for message entry (fade + slide)
- AC6.10: Mobile-responsive with proper touch interactions

### Integration (AC6.11 - AC6.15):
- AC6.11: Chat interface integrates with existing Better Auth tokens
- AC6.12: Messages sent to Phase 5 backend endpoint: `POST /api/{user_id}/chat`
- AC6.13: Conversation history persists across page refreshes
- AC6.14: Error handling for network failures with retry option
- AC6.15: Integration with existing task UI to show created/updated tasks

### Skill Integration (AC6.16 - AC6.19):
- AC6.16: When implementing ChatKit components, use `context7-expert` skill
- AC6.17: Skill path: `.claude/skills/context7-expert.md`
- AC6.18: Apply skill for OpenAI ChatKit documentation and best practices
- AC6.19: Skill must be used for all library/technology research in this phase

### Performance (AC6.20 - AC6.22):
- AC6.20: Initial chat load time < 1 second
- AC6.21: Message sending animation < 150ms
- AC6.22: Smooth 60fps animations on all interactions

## 5. Technical Requirements

### Tech Stack:
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React with TypeScript strict mode
- **Chat Component**: OpenAI ChatKit
- **Styling**: Tailwind CSS + design system from constitution
- **Animations**: Framer Motion
- **State Management**: React hooks + Context API
- **HTTP Client**: axios or fetch with interceptors

### File Structure:
app/chatbot/
├── page.tsx # Main chat page
├── layout.tsx # Chat layout
└── components/
├── ChatInterface.tsx # Main chat component
├── ChatMessage.tsx # Individual message bubble
├── MessageInput.tsx # Message input with send button
├── ToolCallStatus.tsx # MCP tool call visualization
├── ConversationHistory.tsx # Sidebar with conversation list
└── hooks/
├── useChat.ts # Chat logic hook
└── useConversations.ts # Conversation management hook


### Design System Compliance:
- **Colors**: Follow constitution Section 7 (blue-100 for user, gray-100 for assistant)
- **Typography**: Inter font with proper scale
- **Spacing**: 4px base unit from constitution
- **Animations**: Framer Motion with constitution-specified durations
- **Components**: Extend existing ui/ components (Button, Card, Input)

### Integration Points:
1. **Auth Integration**: Use existing auth context from Phase 2
2. **API Integration**: Connect to Phase 5 chat endpoint
3. **Task Integration**: Update task lists when tasks are created via chat
4. **State Integration**: Share conversation state with existing dashboard

## 6. Skill Usage Instructions

### How to Use context7-expert Skill for Phase 6:
Apply skill from .claude/skills/context7-expert.md
and research using Context7 MCP tools only:

[Your question about OpenAI ChatKit, React best practices, etc.]


### Specific Applications for Phase 6:
1. **OpenAI ChatKit Setup**
   - Resolve: `OpenAI ChatKit` or `@openai/chatkit`
   - Mode: `code` for implementation examples
   - Topic: "setup", "configuration", "domain allowlist"

2. **React TypeScript Patterns**
   - Resolve: `React` or `TypeScript`
   - Mode: `code` for component patterns
   - Topic: "hooks", "context", "state management"

3. **Framer Motion Animations**
   - Resolve: `Framer Motion`
   - Mode: `code` for animation examples
   - Topic: "message animations", "transitions", "gestures"

4. **Tailwind CSS Integration**
   - Resolve: `Tailwind CSS`
   - Mode: `code` for styling patterns
   - Topic: "responsive design", "dark mode", "custom components"

### Skill Enforcement:
- **Before coding**: Apply skill for documentation
- **During implementation**: Reference skill-acquired patterns
- **When stuck**: Reapply skill with specific error/issue
- **Code review**: Verify skill was applied appropriately

### Skill Location Reference:
Project Root: ADD_TaskFlow-App/.claude/skills/context7-expert.md
CLI Command: Apply skill from .claude/skills/context7-expert.md


## 7. Component Specifications

### ChatInterface Component:
```typescript
interface ChatInterfaceProps {
  initialConversationId?: number;
  userId: string;
  onTaskCreated?: (task: Task) => void;
}

// Features:
// - Real-time message display
// - Typing indicators
// - Tool call visualization
// - Error handling UI
// - Mobile responsive

ChatMessage Component:
interface ChatMessageProps {
  message: {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    toolCalls?: Array<{
      tool: string;
      status: 'loading' | 'success' | 'error';
      result?: any;
    }>;
  };
}

// Features:
// - Role-based styling (user/assistant colors)
// - Timestamp display
// - Tool call status indicators
// - Animation on mount

ToolCallStatus Component:
interface ToolCallStatusProps {
  toolCalls: Array<{
    tool: 'add_task' | 'list_tasks' | 'complete_task' | 'delete_task' | 'update_task';
    status: 'loading' | 'success' | 'error';
    parameters: any;
    result?: any;
  }>;
}

// Features:
// - Real-time status updates
// - Icons for each tool type
// - Parameter visualization
// - Result display when complete

8. Integration with Phase 5 Backend
API Communication:

Frontend (Phase 6) → Backend (Phase 5)
┌─────────────────┐    ┌─────────────────┐
│  ChatKit UI     │    │  FastAPI Server │
│                 │    │                 │
│ 1. User types   │───▶│ 1. POST /chat   │
│    message      │    │    with JWT     │
│                 │    │                 │
│ 4. Display      │◀───│ 4. Return       │
│    response     │    │    response     │
│                 │    │    + tool_calls │
└─────────────────┘    └─────────────────┘

Data Flow:
User sends message → Frontend calls POST /api/{user_id}/chat
Backend processes with OpenAI Agents SDK → Returns response + tool_calls
Frontend displays response + visualizes tool calls
If tasks created/updated, refresh task lists in background

State Synchronization:
Conversation state: Stored in backend, cached in frontend
Task state: Updated via real-time notifications or polling
User auth: Reuse existing JWT tokens and auth context

9. Success Criteria (from Constitution)
Phase 6 Must Deliver:
✅ ChatKit Integration: OpenAI ChatKit with domain configuration
✅ Chat Interface: Users can manage tasks via natural language
✅ Conversation History: Persists across sessions and server restarts
✅ User Experience: Responsive, intuitive chat interface
✅ Security: Domain allowlist properly configured for production
✅ Skill Integration: context7-expert skill used for all implementation

10. References
Constitution Sections:
Section 2: Code Quality Standards (Frontend)
Section 3: Security Standards (Domain allowlist)
Section 6: Frontend Architecture (Component structure)
Section 7: Design System (Colors, typography, animations)
Section 10: Deployment Standards (ChatKit requirements)

Dependencies:
Phase 2: Better Auth for user authentication
Phase 4: Existing UI components and design system
Phase 5: Chat endpoint (POST /api/{user_id}/chat)

Skill: .claude/skills/context7-expert.md

External Documentation (via Skill):
OpenAI ChatKit documentation (use skill to access)
React TypeScript best practices (use skill to access)
Framer Motion animation patterns (use skill to access)
Tailwind CSS responsive design (use skill to access)

11. Implementation Order
Week 1: Foundation Setup
ChatKit Configuration
Set up OpenAI ChatKit with domain key
Configure local and production environments
Test basic chat functionality
Basic Components
Create ChatInterface scaffold
Implement ChatMessage component
Set up message input with send button

Week 2: Core Features
Integration with Backend
Connect to Phase 5 chat endpoint
Implement JWT token handling
Set up error handling and retry logic
Enhanced UI/UX
Add typing indicators
Implement tool call visualization
Add animations with Framer Motion

Week 3: Polish & Testing
Mobile Responsiveness
Optimize for mobile devices
Add touch interactions
Test on multiple screen sizes
Integration Testing
Test complete user flows
Verify conversation persistence
Test error scenarios

12. Risk Mitigation
Technical Risks:
ChatKit domain configuration issues → Mitigation: Follow OpenAI docs via skill
Performance with long conversations → Mitigation: Virtual scrolling, pagination
Real-time updates complexity → Mitigation: Use React Query for state management
Mobile responsiveness challenges → Mitigation: Test early on multiple devices

Skill Integration Risks:
Incorrect ChatKit implementation → Mitigation: Use skill for accurate documentation
Outdated React patterns → Mitigation: Skill ensures current best practices
Animation performance issues → Mitigation: Skill provides optimized Framer Motion patterns

Integration Risks:
Backend API changes → Mitigation: Contract testing, versioned APIs
Auth token expiration → Mitigation: Automatic token refresh
Network connectivity issues → Mitigation: Offline queue, retry logic

Governance: This specification follows ADD_TaskFlow-App Constitution v2.0.0
Status: Draft
Version: 1.0.0
Created: 2026-01-14

