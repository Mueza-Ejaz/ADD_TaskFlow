<!--
Sync Impact Report:
- Version change: 1.0.0 → 2.0.0
- Modified principles: All sections updated with AI Chatbot Phase requirements
- Added sections: AI System Standards
- Extended sections: Project Overview, Code Quality Standards, Security Standards, Database Standards, API Design Standards, Frontend Architecture, Testing Standards, Development Workflow, Deployment Standards, Performance Standards, Success Criteria by Phase
- Templates requiring updates:
    - .specify/templates/plan-template.md (⚠ pending)
    - .specify/templates/spec-template.md (⚠ pending)
    - .specify/templates/tasks-template.md (⚠ pending)
    - .specify/templates/commands/*.md (⚠ pending)
- Follow-up TODOs: Update templates for AI Chatbot development workflow
-->
# ADD_TaskFlow-App Constitution

## 1. Project Overview
Project Name: ADD_TaskFlow-App
Purpose: Modern Todo Web Application with full authentication, task management, and AI Chatbot
Phases: 6-phase structured development
  Phase 1: Project Foundation Setup - Monorepo, Next.js 16, FastAPI, Design System
  Phase 2: User Authentication - Better Auth, JWT tokens, Signup/Login
  Phase 3: Task Management (CRUD) - PostgreSQL, SQLModel, Task Operations
  Phase 4: UI & Full Integration - Frontend UI, API Integration, Testing, Polish
  Phase 5: AI Chatbot Backend - MCP Server, OpenAI Agents SDK, Chat Endpoint
  Phase 6: AI Chatbot Frontend - OpenAI ChatKit, Conversation Interface
Tech Stack: Next.js 16 (App Router), FastAPI, SQLModel, Neon PostgreSQL, Tailwind CSS, Framer Motion, Better Auth, OpenAI Agents SDK, MCP SDK, OpenAI ChatKit

## 2. Code Quality Standards
### Frontend:
- TypeScript strict mode enabled
- All components must have TypeScript interfaces
- Use functional components with hooks (no class components)
- ESLint + Prettier for code quality
- File naming: PascalCase for components, camelCase for utilities
- One component per file with colocated tests
### Backend:
- Python 3.12+ with full type hints
- All functions must have docstrings with parameters, returns, examples
- FastAPI with automatic OpenAPI documentation
- SQLModel for all database operations (no raw SQL)
- Pydantic models for request/response validation
### AI Systems:
- OpenAI Agents SDK with proper error handling
- MCP tools must follow official SDK patterns
- ChatKit components must be properly typed and documented
- All AI interactions must have fallback mechanisms

## 3. Security Standards
### Authentication:
- Better Auth for frontend authentication
- JWT tokens with 24-hour expiry for access, 7 days for refresh
- Token validation in FastAPI middleware
- Password hashing with bcrypt (12 rounds minimum)
- All API endpoints protected by default (except /health, /auth)
### Data Protection:
- Environment variables for all secrets (DATABASE_URL, JWT_SECRET, OPENAI_API_KEY)
- No hardcoded secrets in code
- Input validation on both frontend and backend
- SQL injection prevention via SQLModel only
- CORS configured for specific origins
### AI Security:
- OpenAI API key management with environment variables
- Domain allowlist configuration for ChatKit (required for production)
- Stateless JWT validation for chat endpoints
- Input sanitization for natural language prompts
- Rate limiting for chat endpoints to prevent abuse
### User Data Isolation:
- All database queries must filter by user_id from JWT token
- API: GET /api/tasks returns only current user's tasks
- MCP tools must validate user_id ownership for all operations
- Frontend must not expose other users' data
- User ownership verification before update/delete operations

## 4. Database Standards
### Schema Design:
- Tables: users, tasks, conversations, messages
- Required columns: id, created_at, updated_at for all tables
- Foreign keys: user_id references users(id)
- Indexes on: user_id, status, due_date, conversation_id
### Models Example:
```python
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", nullable=False)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", nullable=False)
    conversation_id: int = Field(foreign_key="conversation.id", nullable=False)
    role: str = Field(sa_column=Column(Enum('user', 'assistant', name='message_role')))
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

5. API Design Standards
Endpoint Structure:
- Base: /api/v1/
- Health: GET /api/health
- Auth: POST /api/auth/signup, POST /api/auth/login
- Tasks: GET /api/tasks, POST /api/tasks, GET /api/tasks/{id}, PUT /api/tasks/{id}, DELETE /api/tasks/{id}, 
PATCH /api/tasks/{id}/complete
- Chat: POST /api/{user_id}/chat (stateless chat endpoint)    

HTTP Methods:
- GET: Retrieve resources
- POST: Create new resources (including chat messages)
- PUT: Update entire resources
- PATCH: Partial updates (complete toggle)
- DELETE: Remove resources

Response Format:
- Success: 200/201 with data
- Error: Consistent error format: {"detail": "message", "status": 400}
- Validation errors: 422 with field-specific messages
- Chat responses: Include conversation_id, response, tool_calls array

MCP Server Standards:
- 5 Required Tools: add_task, list_tasks, complete_task, delete_task, update_task
- All tools must include user_id parameter for data isolation
- Tool responses must follow standardized JSON format
- MCP server must run alongside FastAPI on same port

6. Frontend Architecture
App Router Structure:

app/
├── (auth)/
│   ├── signup/page.tsx
│   └── login/page.tsx
├── dashboard/
│   ├── tasks/page.tsx
│   ├── chatbot/page.tsx
│   └── profile/page.tsx
├── layout.tsx
└── page.tsx

Component Structure:
components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── tasks/
│   ├── TaskList.tsx
│   └── TaskForm.tsx
├── chatbot/
│   ├── ChatInterface.tsx
│   ├── ChatMessage.tsx
│   ├── ToolCallStatus.tsx
│   └── hooks/
│       └── useChat.ts
├── layout/
│   ├── Header.tsx
│   └── Sidebar.tsx
└── shared/
    ├── api.ts
    └── utils.ts

ChatKit Integration:
- OpenAI ChatKit with domain key configuration
- Integration with existing Better Auth system
- Responsive chat interface with message history
- Tool call visualization and confirmation
- Typing indicators for AI responses

7. Design System

Colors (Tailwind):
- Primary: blue-500 (#3b82f6) to purple-600 (#8b5cf6) gradient
- Secondary: gray scale
- Success: green-500 (#10b981)
- Warning: yellow-500 (#f59e0b)
- Error: red-500 (#ef4444)
- Chat User: blue-100 (#dbeafe)
- Chat Assistant: gray-100 (#f3f4f6)

Typography:
- Font: Inter (Google Fonts)
- Scale: 12px, 14px, 16px, 18px, 20px, 24px, 32px
- Weights: 400, 500, 600, 700

Spacing:
- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

Animations:
- Library: Framer Motion
- Duration: 150ms, 300ms, 500ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Transitions: fade, slide, scale

Chat-specific: message entrance, typing indicator

Chat UI Components:
- Message bubbles with user/assistant differentiation
- Conversation history panel with scroll preservation
- Tool call status indicators (loading, success, error)
- Mobile-responsive chat interface

8. Testing Standards
Frontend:
Jest + React Testing Library
80% coverage for components
MSW for API mocking
Playwright for E2E (Phase 4+5)

Backend:
pytest with 90% coverage
Test database with fixtures
API endpoint testing with TestClient

AI System Testing:
MCP tool unit testing with mocked AI responses
Chat endpoint integration testing
Conversation flow E2E testing
Error handling for AI tool failures
Stateless architecture validation

Test Structure:
Unit tests for business logic
Integration tests for API endpoints
E2E tests for critical user flows
AI interaction tests for natural language commands

9. Development Workflow
Git:
Feature branches from main
Conventional commits: feat:, fix:, chore:, docs:, ai:
Pull requests with code review
Semantic versioning for releases

Spec-Kit Plus Workflow:
Constitution (this file)
Specification (specs/ folder)
Plan (plan.md)
Tasks (tasks.md)
Implementation

Testing & Review

Phase 5 (Backend) Implementation Order:
MCP Server setup with 5 task tools
Chat endpoint with stateless design
OpenAI Agents SDK integration
Database migrations for new tables
Integration with existing task CRUD

Phase 6 (Frontend) Implementation Order:
OpenAI ChatKit setup and domain configuration
Chat interface components
Integration with existing auth and task systems
Polish and animations

Environment Setup:
Development: localhost:3000 (frontend), localhost:8000 (backend)
Staging: preview deployments
Production: Vercel (frontend) + Railway (backend)
ChatKit: Domain allowlist configuration required for production

10. Deployment Standards
Frontend (Vercel):
Automatic deployment from main branch
Preview deployments for PRs
Environment variables in Vercel dashboard
Custom domain setup
OpenAI ChatKit domain key configuration

Backend (Railway):
PostgreSQL via Neon
Environment variables in Railway (including OpenAI API key)
Health check endpoint monitoring
Logging and monitoring setup
MCP server running alongside FastAPI

ChatKit Requirements:
Frontend must be deployed first to get production URL
Domain must be added to OpenAI allowlist (platform.openai.com/settings/organization/security/domain-allowlist)
Domain key must be stored as NEXT_PUBLIC_OPENAI_DOMAIN_KEY
Local development (localhost) works without allowlist

Stateless Architecture:
Chat endpoint must remain stateless for horizontal scaling
All conversation state must persist to database
Server restarts must not lose conversation context
Load balancer must be able to route to any backend instance

11. Performance Standards
Frontend:
Lighthouse score > 90
First Contentful Paint < 1.5s
Time to Interactive < 3.5s
Bundle optimization

Backend:
API response time < 200ms (p95)
Database query optimization
Connection pooling
Caching where appropriate

Chat System Performance:
Chat response time < 2 seconds for simple queries
Conversation history loading < 1 second
MCP tool execution < 500ms
Concurrent chat sessions support
Message streaming for better perceived performance

12. Success Criteria by Phase
Phase 1 - Foundation:
Monorepo: frontend/, backend/, specs/, docs/
Next.js 16: running on localhost:3000
FastAPI: running on localhost:8000 with /health endpoint
Design system: Tailwind config with colors, typography
Basic components: Button, Card, Input, Modal, LoadingSpinner

Phase 2 - Authentication:
Better Auth: signup and login pages
JWT tokens: issued and validated
Protected routes: middleware for authentication
User context: available throughout app

Phase 3 - Task Management:
Database: users and tasks tables created
API endpoints: full CRUD for tasks
User isolation: each user sees only their tasks
Task operations: create, read, update, delete, complete toggle

Phase 4 - UI & Integration:
Task UI: complete interface for all operations
Frontend-backend integration: all API calls working
Testing: unit, integration, E2E tests passing
Deployment: both frontend and backend deployed
Documentation: setup guide, API docs, user guide

Phase 5 - AI Chatbot Backend:
MCP Server: 5 task management tools exposed
Chat Endpoint: POST /api/{user_id}/chat working statelessly
Database: conversations and messages tables created
OpenAI Integration: Agents SDK properly configured
Integration: All existing task CRUD operations work via MCP tools

Phase 6 - AI Chatbot Frontend:
ChatKit Integration: OpenAI ChatKit with domain configuration
Chat Interface: Users can manage tasks via natural language
Conversation History: Persists across sessions and server restarts
User Experience: Responsive, intuitive chat interface
Security: Domain allowlist properly configured for production

13. AI System Standards
Agent Behavior:
Must understand natural language commands for task management
Must use appropriate MCP tools based on user intent
Must confirm actions with friendly responses
Must handle errors gracefully with helpful messages

MCP Tool Specifications:
Tools must follow exact parameter requirements
All tools must include user_id for data isolation
Tool responses must be standardized for agent consumption
Error handling must provide clear feedback to agent

Natural Language Understanding:
Support commands: add, show, list, complete, delete, update
Understand variations: "create", "mark as done", "remove", "change"
Handle contextual references: "the first task", "my meeting task"
Provide confirmation for all actions

Governance
Applicable: All 5 phases (including AI Chatbot Phase)
Status: Active - All development must follow these standards

Version: 2.0.0 | Ratified: 2026-01-13 | Last Amended: 2026-01-13


## Key Updates Made:

1. **Project Overview**: Added Phase 5A and 5B to phases list
2. **Code Quality Standards**: Added AI Systems section
3. **Security Standards**: Added AI Security subsection
4. **Database Standards**: Added Conversation and Message models
5. **API Design Standards**: Added chat endpoint and MCP standards
6. **Frontend Architecture**: Added chatbot component structure
7. **Design System**: Added chat-specific colors and components
8. **Testing Standards**: Added AI System Testing
9. **Development Workflow**: Added Phase 5A and 5B implementation order
10. **Deployment Standards**: Added ChatKit requirements and stateless architecture
11. **Performance Standards**: Added Chat System Performance
12. **Success Criteria**: Added Phase 5A and 5B success criteria
13. **New Section**: AI System Standards for agent behavior and tools

**Version updated from 1.0.0 to 2.0.0** to reflect major addition of AI Chatbot capabilities.

