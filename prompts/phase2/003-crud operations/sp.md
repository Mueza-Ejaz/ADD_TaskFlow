# **PHASE 3 SPECIFICATION CREATION COMMAND**

## **PROJECT CONTEXT:**
You are a Senior Product Manager creating specifications for TaskFlow Pro - a modern Todo application.

## **CURRENT STATUS:**
- **Phase 1:** Complete (Project foundation, monorepo setup, database connection)
- **Phase 2:** Complete (User authentication with Better Auth + JWT, signup/login working)
- **Phase 3:** Task CRUD Operations (This phase - core functionality)

## **TECH STACK:**
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend:** FastAPI, SQLModel, Python 3.12+
- **Database:** Neon PostgreSQL (Serverless)
- **Authentication:** Better Auth + JWT (already implemented in Phase 2)
- **State Management:** React Query, React Context

## **SPECIFICATION OUTPUT FILE:**
Create: `specs/phase-3-task-crud/spec.md`

## **SPECIFICATION REQUIREMENTS:**

### **1. CORE FUNCTIONALITY:**
Implement complete Task CRUD (Create, Read, Update, Delete) operations with:
- User-specific task isolation (each user sees only their tasks)
- Rich task attributes (title, description, priority, due date, status)
- Interactive UI with drag & drop between columns
- Real-time updates and smooth animations
- Filtering, sorting, and search capabilities
- Responsive design for mobile, tablet, and desktop

### **2. USER STORIES (Must be SMART - Specific, Measurable, Achievable, Relevant, Time-bound):**

#### **Story 1: Create Task**
"As a logged-in user, I want to create a new task with details so I can track my work."

**Acceptance Criteria:**
- User can click "New Task" button to open creation modal
- Required fields: Title (1-200 characters, mandatory)
- Optional fields: Description (max 1000 characters), Priority (Low/Medium/High dropdown), Due Date (date picker)
- Real-time validation shows errors immediately
- On successful submission: task appears in dashboard, success toast shows, form closes
- Loading state during API call

#### **Story 2: View Tasks Dashboard**
"As a logged-in user, I want to see all my tasks in an organized dashboard."

**Acceptance Criteria:**
- Dashboard shows: Today (tasks due today), Pending (future tasks), Overdue (past due), Completed
- Each task card displays: Title, priority indicator (color-coded), due date, status
- Empty state when no tasks
- Task summary statistics (total, pending, completed, overdue count)
- Toggle between list view and kanban view

#### **Story 3: Filter and Sort Tasks**
"As a logged-in user, I want to filter and sort my tasks to find what I need."

**Acceptance Criteria:**
- Filter by: Status (All/Pending/Completed/Overdue), Priority (All/High/Medium/Low)
- Sort by: Due Date (ascending/descending), Priority (High to Low), Created Date
- Search: Real-time search by title and description
- Clear all filters button
- Active filter count displayed

#### **Story 4: Update Task**
"As a logged-in user, I want to edit task details to keep them updated."

**Acceptance Criteria:**
- Click task card opens edit modal with pre-filled data
- All fields editable (title, description, priority, due date)
- Save button persists changes, Cancel button discards
- Real-time validation
- Success toast on save, task updates immediately in UI

#### **Story 5: Delete Task**
"As a logged-in user, I want to delete tasks I no longer need."

**Acceptance Criteria:**
- Delete button/icon on each task card
- Confirmation modal before deletion (with task title)
- Undo option for 5 seconds after deletion
- Success toast on deletion
- Task removed from UI immediately

#### **Story 6: Toggle Task Status**
"As a logged-in user, I want to mark tasks as complete or incomplete."

**Acceptance Criteria:**
- Checkbox on each task card toggles complete/incomplete
- Visual indication (strikethrough for completed tasks)
- Task moves automatically between columns (Pending ↔ Completed)
- Smooth animation during status change
- No page reload required

### **3. TECHNICAL SPECIFICATIONS:**

#### **Backend API Endpoints (All require JWT authentication):**

**GET /api/v1/tasks**
- List tasks for current user with pagination
- Query parameters: `status`, `priority`, `sort`, `search`, `page`, `limit`
- Response: `{ tasks: [], total: number, page: number, limit: number }`

**GET /api/v1/tasks/{task_id}**
- Get single task details
- Response: Complete task object

**POST /api/v1/tasks**
- Create new task
- Request body: `{ title: string, description?: string, priority?: "Low"|"Medium"|"High", due_date?: string }`
- Response: Created task object

**PUT /api/v1/tasks/{task_id}**
- Update existing task
- Request body: `{ title?: string, description?: string, priority?: "Low"|"Medium"|"High", due_date?: string, completed?: boolean }`
- Response: Updated task object

**PATCH /api/v1/tasks/{task_id}/complete**
- Toggle completion status
- Response: Updated task object

**DELETE /api/v1/tasks/{task_id}**
- Delete task
- Response: 204 No Content

**GET /api/v1/tasks/summary**
- Get task statistics
- Response: `{ total: number, pending: number, completed: number, overdue: number }`

#### **Database Schema Updates:**
```sql
-- Add columns to existing tasks table
ALTER TABLE tasks ADD COLUMN priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High'));
ALTER TABLE tasks ADD COLUMN due_date TIMESTAMP;
ALTER TABLE tasks ADD COLUMN completed BOOLEAN DEFAULT FALSE;
ALTER TABLE tasks ADD COLUMN description TEXT;

-- Performance indexes
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority ON tasks(priority);

Frontend Components Required:
TaskDashboard - Main dashboard layout
TaskKanban - Kanban board with columns
TaskList - List view alternative
TaskCard - Individual task component
TaskForm - Create/Edit form (reusable)
TaskFilters - Filter and sort controls
TaskSummary - Statistics component
EmptyState - When no tasks
ConfirmationModal - Delete confirmation
Toast - Success/error notifications

State Management Strategy:
Server State: React Query (TanStack Query) for API data
UI State: React Context for filters, modals, theme
Form State: React Hook Form with Zod validation
Cache Strategy: Stale-while-revalidate with optimistic updates

4. UI/UX REQUIREMENTS:
Design System Integration:
Use existing color palette from Phase 1
Priority colors: High (#ef4444), Medium (#f59e0b), Low (#10b981)
Consistent spacing (4px baseline grid)
Typography hierarchy established

Animations & Transitions:
Task creation: Fade in + slide up
Task deletion: Fade out + shrink
Status change: Checkmark animation + column transition
Modal: Scale in/out with backdrop fade
Drag & drop: Smooth movement with preview

Responsive Breakpoints:
Mobile (< 640px): Single column, simplified cards
Tablet (640px-1024px): Two columns
Desktop (> 1024px): Three columns (kanban) or full-width list

Accessibility Requirements:
WCAG 2.1 AA compliance
Keyboard navigation support
Screen reader labels
Focus management for modals
Color contrast ratio > 4.5:1

5. SECURITY REQUIREMENTS:
Data Isolation:
All database queries must include WHERE user_id = current_user.id
API middleware validates JWT and sets user context
Frontend cannot access another user's tasks

Input Validation:
Backend: Pydantic models with strict validation
Frontend: Form validation before submission
SQL injection prevention via SQLModel parameterized queries

Rate Limiting:
Task creation: 10 requests/minute per user
API calls: 60 requests/minute per user

6. PERFORMANCE REQUIREMENTS:
API Performance:
Task list load: < 300ms
Task operations (create/update/delete): < 200ms
Initial dashboard load: < 2 seconds

Frontend Optimization:
Code splitting for task components
Virtual scrolling for large lists

Image optimization (none currently, but structure ready)

Bundle size monitoring

7. TESTING REQUIREMENTS:
Backend Tests:
Unit tests for task service layer (90%+ coverage)

Integration tests for all endpoints

Security tests for data isolation

Frontend Tests:
Component tests for TaskCard, TaskForm (React Testing Library)

Integration tests for task workflows

E2E tests for complete CRUD flow (Playwright)

Coverage Targets:
Backend: 90% minimum

Frontend: 80% minimum

Critical paths (login → create task → complete task → delete): 100%

8. ERROR HANDLING:
User-Friendly Errors:
Form validation errors shown inline

API errors as toast notifications with actionable messages

Network errors with retry option

404: "Task not found" with suggestion to create new

Error Scenarios Covered:
Task not found (deleted by another session)

Unauthorized access attempts

Database connection issues

Invalid input data

Rate limit exceeded

9. SUCCESS VALIDATION CHECKLIST:
Functional Validation:
User can create task with all field types

Tasks appear in correct columns based on due date/status

All filters and sorts work correctly

Task editing saves and updates immediately

Task deletion with confirmation and undo

Status toggling moves tasks between columns

Data persists across page reloads

Security Validation:
User A cannot see/access User B's tasks

All API calls require valid JWT

No sensitive data exposure in logs/errors

Performance Validation:
Dashboard loads < 2 seconds with 100 tasks

Task operations < 300ms

Smooth animations at 60fps

Mobile performance acceptable

UX Validation:
Mobile responsive on all breakpoints

Accessible via keyboard navigation

Clear, actionable error messages

Intuitive interface (first-time user can figure out)

10. INTEGRATION WITH EXISTING SYSTEM:
With Phase 2 Authentication:
All task API calls automatically include JWT token

User context available for task ownership

Protected routes already implemented

With Phase 1 Design System:
Use existing Button, Input, Card components

Apply consistent spacing and typography

Follow established color palette

SPECIFICATION FILE FORMATTING:

Use proper markdown with headers (##, ###)

Include code blocks for SQL and API examples

Use tables where appropriate

Add checkboxes for acceptance criteria

Reference existing constitution: @.specify/memory/constitution.md

FILE LOCATION: specs/phase-3-task-crud/spec.md

NOW CREATE THIS SPECIFICATION FILE.



