<!--
Sync Impact Report:
- Version change: 0.0.0 (initial template) → 1.0.0
- Modified principles: All principles are new, based on user-provided sections.
- Added sections: All sections (Project Overview, Code Quality Standards, Security Standards, Database Standards, API Design Standards, Frontend Architecture, Design System, Testing Standards, Development Workflow, Deployment Standards, Performance Standards, Success Criteria by Phase) are new.
- Removed sections: None (old content was placeholder template).
- Templates requiring updates:
    - .specify/templates/plan-template.md (⚠ pending)
    - .specify/templates/spec-template.md (⚠ pending)
    - .specify/templates/tasks-template.md (⚠ pending)
    - .specify/templates/commands/*.md (⚠ pending)
- Follow-up TODOs: None
-->
# ADD_TaskFlow-App Constitution

## 1. Project Overview
Project Name: ADD_TaskFlow-App
Purpose: Modern Todo Web Application with full authentication and task management
Phases: 4-phase structured development
  Phase 1: Project Foundation Setup - Monorepo, Next.js 16, FastAPI, Design System
  Phase 2: User Authentication - Better Auth, JWT tokens, Signup/Login
  Phase 3: Task Management (CRUD) - PostgreSQL, SQLModel, Task Operations
  Phase 4: UI & Full Integration - Frontend UI, API Integration, Testing, Polish
Tech Stack: Next.js 16 (App Router), FastAPI, SQLModel, Neon PostgreSQL, Tailwind CSS, Framer Motion, Better Auth

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

## 3. Security Standards
### Authentication:
- Better Auth for frontend authentication
- JWT tokens with 24-hour expiry for access, 7 days for refresh
- Token validation in FastAPI middleware
- Password hashing with bcrypt (12 rounds minimum)
- All API endpoints protected by default (except /health, /auth)
### Data Protection:
- Environment variables for all secrets (DATABASE_URL, JWT_SECRET)
- No hardcoded secrets in code
- Input validation on both frontend and backend
- SQL injection prevention via SQLModel only
- CORS configured for specific origins
### User Data Isolation:
- All database queries must filter by user_id from JWT token
- API: GET /api/tasks returns only current user's tasks
- Frontend must not expose other users' data
- User ownership verification before update/delete operations

## 4. Database Standards
### Schema Design:
- Tables: users, tasks (expandable for Phase 3-4)
- Required columns: id, created_at, updated_at for all tables
- Foreign keys: user_id references users(id)
- Indexes on: user_id, status, due_date
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
```

## 5. API Design Standards
### Endpoint Structure:
- Base: `/api/v1/`
- Health: `GET /api/health`
- Auth: `POST /api/auth/signup`, `POST /api/auth/login`
- Tasks: `GET /api/tasks`, `POST /api/tasks`, `GET /api/tasks/{id}`, `PUT /api/tasks/{id}`, `DELETE /api/tasks/{id}`, `PATCH /api/tasks/{id}/complete`
### HTTP Methods:
- `GET`: Retrieve resources
- `POST`: Create new resources
- `PUT`: Update entire resources
- `PATCH`: Partial updates (complete toggle)
- `DELETE`: Remove resources
### Response Format:
- Success: `200`/`201` with data
- Error: Consistent error format: `{"detail": "message", "status": 400}`
- Validation errors: `422` with field-specific messages

## 6. Frontend Architecture
### App Router Structure:
```
app/
├── (auth)/
│   ├── signup/page.tsx
│   └── login/page.tsx
├── dashboard/
│   ├── tasks/page.tsx
│   └── profile/page.tsx
├── layout.tsx
└── page.tsx
```
### Component Structure:
```
components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── tasks/
│   ├── TaskList.tsx
│   └── TaskForm.tsx
├── layout/
│   ├── Header.tsx
│   └── Sidebar.tsx
└── shared/
    ├── api.ts
    └── utils.ts
```

## 7. Design System
### Colors (Tailwind):
- Primary: blue-500 (#3b82f6) to purple-600 (#8b5cf6) gradient
- Secondary: gray scale
- Success: green-500 (#10b981)
- Warning: yellow-500 (#f59e0b)
- Error: red-500 (#ef4444)
### Typography:
- Font: Inter (Google Fonts)
- Scale: 12px, 14px, 16px, 18px, 20px, 24px, 32px
- Weights: 400, 500, 600, 700
### Spacing:
- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
### Animations:
- Library: Framer Motion
- Duration: 150ms, 300ms, 500ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Transitions: fade, slide, scale

## 8. Testing Standards
### Frontend:
- Jest + React Testing Library
- 80% coverage for components
- MSW for API mocking
- Playwright for E2E (Phase 4)
### Backend:
- pytest with 90% coverage
- Test database with fixtures
- API endpoint testing with TestClient
### Test Structure:
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows

## 9. Development Workflow
### Git:
- Feature branches from `main`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Pull requests with code review
- Semantic versioning for releases
### Spec-Kit Plus Workflow:
- Constitution (this file)
- Specification (`specs/` folder)
- Plan (`plan.md`)
- Tasks (`tasks.md`)
- Implementation
- Testing & Review
### Environment Setup:
- Development: `localhost:3000` (frontend), `localhost:8000` (backend)
- Staging: preview deployments
- Production: Vercel (frontend) + Railway (backend)

## 10. Deployment Standards
### Frontend (Vercel):
- Automatic deployment from `main` branch
- Preview deployments for PRs
- Environment variables in Vercel dashboard
- Custom domain setup
### Backend (Railway):
- PostgreSQL via Neon
- Environment variables in Railway
- Health check endpoint monitoring
- Logging and monitoring setup

## 11. Performance Standards
### Frontend:
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Bundle optimization
### Backend:
- API response time < 200ms (p95)
- Database query optimization
- Connection pooling
- Caching where appropriate

## 12. Success Criteria by Phase
### Phase 1 - Foundation:
- Monorepo: `frontend/`, `backend/`, `specs/`, `docs/`
- Next.js 16: running on `localhost:3000`
- FastAPI: running on `localhost:8000` with `/health` endpoint
- Design system: Tailwind config with colors, typography
- Basic components: `Button`, `Card`, `Input`, `Modal`, `LoadingSpinner`
### Phase 2 - Authentication:
- Better Auth: signup and login pages
- JWT tokens: issued and validated
- Protected routes: middleware for authentication
- User context: available throughout app
### Phase 3 - Task Management:
- Database: `users` and `tasks` tables created
- API endpoints: full CRUD for tasks
- User isolation: each user sees only their tasks
- Task operations: create, read, update, delete, complete toggle
### Phase 4 - UI & Integration:
- Task UI: complete interface for all operations
- Frontend-backend integration: all API calls working
- Testing: unit, integration, E2E tests passing
- Deployment: both frontend and backend deployed
- Documentation: setup guide, API docs, user guide

## Governance
Applicable: All 4 phases
Status: Active - All development must follow these standards

**Version**: 1.0.0 | **Ratified**: 2026-01-01 | **Last Amended**: 2026-01-01