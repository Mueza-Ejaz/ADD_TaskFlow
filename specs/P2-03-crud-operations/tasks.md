# Tasks: Task CRUD Operations

**Input**: Design documents from `specs/P2-03-crud-operations/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories)

**Tests**: The feature specification indicates backend and frontend testing requirements, so test tasks will be included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description with file path`

-   **[P]**: Can run in parallel (different files, no dependencies)
-   **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
-   Include exact file paths in descriptions

## Path Conventions

-   **Web app**: `backend/src/`, `frontend/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure. Although the feature directory is set up, these tasks ensure proper project configuration.

-   [x] T001 Configure backend environment if needed (e.g., install dependencies if not already done)
-   [x] T002 Configure frontend environment if needed (e.g., install dependencies if not already done)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented. This aligns with Phase 3A: Backend Foundation from `plan.md`.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Implementation for Foundational Tasks

-   [x] T003 [P] Update database schema for `Task` entity in `backend/src/models/task.py` (add `user_id`, `priority`, `due_date`, `status` columns).
-   [x] T004 [P] Create Pydantic schema for `Task` and `TaskCreate`/`TaskUpdate` in `backend/src/schemas/task.py`.
-   [x] T005 [P] Implement base `Task` service layer for database interactions in `backend/src/services/task_service.py`.
-   [x] T006 [P] Configure FastAPI router for tasks under `/api/v1/tasks` in `backend/src/api/v1/endpoints/tasks.py`.
-   [x] T007 Implement middleware for user-specific task isolation in `backend/src/core/middleware.py` (if not already handled by JWT).
-   [x] T008 Implement basic unit tests for `Task` model and schemas in `backend/tests/test_task_models.py`.
-   [x] T009 Implement basic unit tests for `Task` service layer in `backend/tests/test_task_service.py`.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Task (Priority: P1)

**Goal**: Allow users to create new tasks with various attributes.

**Independent Test**: Successfully create a task via the UI and verify its presence in the dashboard.

### Tests for User Story 1

-   [x] T010 [P] [US1] Write frontend unit tests for `TaskForm` component in `frontend/components/TaskForm.test.tsx`.
-   [x] T011 [P] [US1] Write frontend integration tests for create task flow in `frontend/tests/integration/create_task.test.tsx`.
-   [x] T012 [P] [US1] Write backend integration tests for `POST /api/v1/tasks` endpoint in `backend/tests/test_task_api.py`.

### Implementation for User Story 1

-   [x] T013 [P] [US1] Create `TaskForm` React component in `frontend/components/TaskForm.tsx` (using React Hook Form and Zod).
-   [x] T014 [P] [US1] Implement generic `Modal` UI component in `frontend/components/ui/Modal.tsx`.
-   [x] T015 [US1] Integrate `TaskForm` into a modal for task creation in `frontend/app/dashboard/page.tsx`.
-   [x] T016 [US1] Implement `POST /api/v1/tasks` endpoint in `backend/src/api/v1/endpoints/tasks.py` to create tasks with user_id.
-   [x] T017 [US1] Add React Query mutation for creating tasks with optimistic updates in `frontend/hooks/useTasks.ts`.

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Tasks Dashboard (Priority: P1)

**Goal**: Display user-specific tasks in an interactive dashboard organized by status.

**Independent Test**: Log in and verify that personal tasks are displayed correctly, categorized by status.

### Tests for User Story 2

-   [x] T018 [P] [US2] Write frontend unit tests for `TaskCard` component in `frontend/components/TaskCard.test.tsx`.
-   [x] T019 [P] [US2] Write frontend integration tests for dashboard loading and task display in `frontend/tests/integration/view_dashboard.test.tsx`.
-   [x] T020 [P] [US2] Write backend integration tests for `GET /api/v1/tasks` endpoint in `backend/tests/test_task_api.py`.

### Implementation for User Story 2

-   [x] T021 [P] [US2] Design and implement dashboard page layout in `frontend/app/dashboard/page.tsx`.
-   [x] T022 [P] [US2] Create `TaskCard` component to display individual task details in `frontend/components/TaskCard.tsx`.
-   [x] T023 [P] [US2] Create `TaskList` and `TaskKanban` components for displaying tasks in columns in `frontend/components/TaskList.tsx`, `frontend/components/TaskKanban.tsx`.
-   [x] T024 [US2] Implement `GET /api/v1/tasks` endpoint in `backend/src/api/v1/endpoints/tasks.py` to fetch user-specific tasks.
-   [x] T025 [US2] Configure React Query hook for fetching and caching tasks in `frontend/hooks/useTasks.ts`.
-   [x] T026 [US2] Implement loading and empty states for the dashboard in `frontend/app/dashboard/page.tsx` and `frontend/components/EmptyState.tsx`.

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 4 - Update Task (Priority: P1)

**Goal**: Allow users to update existing task details.

**Independent Test**: Edit an existing task and verify changes persist and are displayed.

### Tests for User Story 4

-   [x] T027 [P] [US4] Write frontend unit tests for `TaskForm` (edit mode) in `frontend/components/TaskForm.test.tsx`.
-   [x] T028 [P] [US4] Write frontend integration tests for update task flow in `frontend/tests/integration/update_task.test.tsx`.
-   [x] T029 [P] [US4] Write backend integration tests for `PUT /api/v1/tasks/{task_id}` endpoint in `backend/tests/test_task_api.py`.

### Implementation for User Story 4

-   [x] T030 [US4] Implement `PUT /api/v1/tasks/{task_id}` endpoint in `backend/src/api/v1/endpoints/tasks.py` to update task details.
-   [x] T031 [US4] Add React Query mutation for updating tasks with optimistic updates in `frontend/hooks/useTasks.ts`.
-   [x] T032 [US4] Integrate `TaskForm` (reused) into a modal for task editing, pre-filling with existing data in `frontend/app/dashboard/page.tsx`.

**Checkpoint**: User Stories 1, 2 AND 4 should all work independently

---

## Phase 6: User Story 6 - Toggle Task Status (Priority: P1)

**Goal**: Easily change task status via drag-and-drop.

**Independent Test**: Drag a task between status columns and verify status updates and visual movement.

### Tests for User Story 6

-   [x] T033 [P] [US6] Write frontend unit tests for Drag & Drop functionality in `frontend/components/TaskKanban.test.tsx`.
-   [x] T034 [P] [US6] Write frontend integration tests for status toggle via drag & drop in `frontend/tests/integration/toggle_status.test.tsx`.
-   [x] T035 [P] [US6] Write backend integration tests for `PATCH /api/v1/tasks/{task_id}/complete` endpoint in `backend/tests/test_task_api.py`.

### Implementation for User Story 6

-   [x] T036 [US6] Implement `PATCH /api/v1/tasks/{task_id}/complete` endpoint in `backend/src/api/v1/endpoints/tasks.py` to update task status.
-   [x] T037 [US6] Integrate `@dnd-kit` into `TaskKanban` component for drag-and-drop functionality in `frontend/components/TaskKanban.tsx`.
-   [x] T038 [US6] Add React Query mutation for toggling task status with optimistic updates in `frontend/hooks/useTasks.ts`.
-   [x] T039 [US6] Implement real-time updates for task status changes (e.g., using WebSockets or polling if necessary, or simply relying on React Query re-fetch).

**Checkpoint**: All P1 user stories are complete and independently functional

---

## Phase 7: User Story 3 - Filter, Sort, and Search Tasks (Priority: P2)

**Goal**: Filter, sort, and search tasks efficiently.

**Independent Test**: Apply filters/sorts/searches and verify task list accuracy.

### Tests for User Story 3

-   [x] T040 [P] [US3] Write frontend unit tests for `TaskFilters` component in `frontend/components/TaskFilters.test.tsx`.
-   [x] T041 [P] [US3] Write frontend integration tests for filter, sort, search functionality in `frontend/tests/integration/filter_sort_search.test.tsx`.
-   [x] T042 [P] [US3] Write backend integration tests for filtering, sorting, and searching logic in `backend/tests/test_task_api.py`.

### Implementation for User Story 3

-   [x] T043 [P] [US3] Create `TaskFilters` component with priority, status, and due date filters in `frontend/components/TaskFilters.tsx`.
-   [x] T044 [P] [US3] Implement search input functionality in `frontend/components/TaskFilters.tsx`.
-   [x] T045 [P] [US3] Implement sorting controls for due date and priority in `frontend/components/TaskFilters.tsx`.
-   [x] T046 [US3] Update `GET /api/v1/tasks` endpoint in `backend/src/api/v1/endpoints/tasks.py` to accept filter, sort, and search parameters.
-   [x] T047 [US3] Integrate filter, sort, and search parameters with React Query for task fetching in `frontend/hooks/useTasks.ts`.

**Checkpoint**: All P1 and P2 user stories are complete and independently functional

---

## Phase 8: User Story 5 - Delete Task (Priority: P2)

**Goal**: Safely delete unwanted tasks.

**Independent Test**: Delete a task and confirm its removal from the dashboard.

### Tests for User Story 5

-   [x] T048 [P] [US5] Write frontend unit tests for `ConfirmationModal` component in `frontend/components/ConfirmationModal.test.tsx`.
-   [x] T049 [P] [US5] Write frontend integration tests for delete task flow in `frontend/tests/integration/delete_task.test.tsx`.
-   [x] T050 [P] [US5] Write backend integration tests for `DELETE /api/v1/tasks/{task_id}` endpoint in `backend/tests/test_task_api.py`.

### Implementation for User Story 5

-   [x] T051 [P] [US5] Create `ConfirmationModal` UI component in `frontend/components/ui/ConfirmationModal.tsx`.
-   [x] T052 [US5] Implement `DELETE /api/v1/tasks/{task_id}` endpoint in `backend/src/api/v1/endpoints/tasks.py` to delete tasks.
-   [x] T053 [US5] Add React Query mutation for deleting tasks with optimistic updates and confirmation in `frontend/hooks/useTasks.ts` and `frontend/app/dashboard/page.tsx`.

**Checkpoint**: All P1 and P2 user stories are complete and independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall application quality. This aligns with Phase 3E: Polish & Testing from `plan.md`.

-   [x] T054 [P] Refine animations and transitions for task operations (create, update, delete, status change) and UI elements (modals, drag & drop) in `frontend/lib/animations.ts`, `frontend/styles/globals.css`.
-   [x] T055 [P] Implement comprehensive error handling and user feedback (e.g., `Toast` component for API errors) in `frontend/components/ui/Toast.tsx`, `frontend/lib/api.ts`.
-   [x] T056 Ensure full accessibility (WCAG 2.1 AA compliance, keyboard navigation, screen reader labels, focus management, color contrast ratio) across all new frontend components.
-   [x] T057 Conduct a full performance review and optimize frontend bundle size, code splitting, and API call efficiency.
-   [x] T058 Expand backend test coverage to 90%+ and frontend test coverage to 80%+.
-   [x] T059 Document new API endpoints in `docs/api/tasks.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

-   **Setup (Phase 1)**: No dependencies - can start immediately
-   **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
-   **User Stories (Phases 3-8)**: All depend on Foundational phase completion
    -   P1 user stories can proceed in parallel once Foundational is complete.
    -   P2 user stories can proceed in parallel once Foundational is complete.
-   **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

-   **User Story 1 (P1 - Create Task)**: Independent after Foundational.
-   **User Story 2 (P1 - View Tasks Dashboard)**: Independent after Foundational.
-   **User Story 4 (P1 - Update Task)**: Independent after Foundational.
-   **User Story 6 (P1 - Toggle Task Status)**: Independent after Foundational.
-   **User Story 3 (P2 - Filter, Sort, Search Tasks)**: Independent after Foundational, but benefits from US2 for context.
-   **User Story 5 (P2 - Delete Task)**: Independent after Foundational, but benefits from US2 for context.

### Within Each User Story

-   Tests MUST be written and FAIL before implementation.
-   Models/Schemas before services.
-   Services before API endpoints.
-   Frontend UI components before integration with data.
-   Story complete before moving to next priority (if working sequentially).

### Parallel Opportunities

-   All tasks marked [P] can run in parallel within their respective phases.
-   Once the Foundational phase completes, all P1 user stories can be worked on in parallel by different team members.
-   Once P1 user stories are complete, P2 user stories can be worked on in parallel.
-   Within each user story phase, test tasks can be done in parallel with other test tasks, and UI components can be done in parallel with API/service implementations (given clear contracts).

---

## Parallel Example: User Story 1 (Create Task)

```bash
# Frontend Tasks:
- [ ] T010 [P] [US1] Write frontend unit tests for `TaskForm` component in `frontend/components/TaskForm.test.tsx`.
- [ ] T011 [P] [US1] Write frontend integration tests for create task flow in `frontend/tests/integration/create_task.test.tsx`.
- [ ] T013 [P] [US1] Create `TaskForm` React component in `frontend/components/TaskForm.tsx` (using React Hook Form and Zod).
- [ ] T014 [P] [US1] Implement generic `Modal` UI component in `frontend/components/ui/Modal.tsx`.

# Backend Tasks:
- [ ] T012 [P] [US1] Write backend integration tests for `POST /api/v1/tasks` endpoint in `backend/tests/test_task_api.py`.
- [ ] T016 [US1] Implement `POST /api/v1/tasks` endpoint in `backend/src/api/v1/endpoints/tasks.py` to create tasks with user_id.

# Integration (after above are done):
- [ ] T015 [US1] Integrate `TaskForm` into a modal for task creation in `frontend/app/dashboard/page.tsx`.
- [ ] T017 [US1] Add React Query mutation for creating tasks with optimistic updates in `frontend/hooks/useTasks.ts`.
```

---

## Implementation Strategy

### MVP First (P1 User Stories Only)

1.  Complete Phase 1: Setup
2.  Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3.  Complete Phase 3: User Story 1 (Create Task)
4.  Complete Phase 4: User Story 2 (View Tasks Dashboard)
5.  Complete Phase 5: User Story 4 (Update Task)
6.  Complete Phase 6: User Story 6 (Toggle Task Status)
7.  **STOP and VALIDATE**: Test all P1 user stories independently and together.
8.  Deploy/demo if ready.

### Incremental Delivery

1.  Complete Setup + Foundational → Foundation ready
2.  Add User Story 1 (Create Task) → Test independently → Deploy/Demo (Basic MVP)
3.  Add User Story 2 (View Tasks Dashboard) → Test independently → Deploy/Demo
4.  Add User Story 4 (Update Task) → Test independently → Deploy/Demo
5.  Add User Story 6 (Toggle Task Status) → Test independently → Deploy/Demo
6.  Add User Story 3 (Filter, Sort, Search Tasks) → Test independently → Deploy/Demo
7.  Add User Story 5 (Delete Task) → Test independently → Deploy/Demo
8.  Complete Polish & Cross-Cutting Concerns

### Parallel Team Strategy

With multiple developers:

1.  Team completes Setup + Foundational together.
2.  Once Foundational is done:
    -   Developer A: User Story 1 (Create Task)
    -   Developer B: User Story 2 (View Tasks Dashboard)
    -   Developer C: User Story 4 (Update Task)
    -   Developer D: User Story 6 (Toggle Task Status)
3.  Once P1 stories are complete:
    -   Developer E: User Story 3 (Filter, Sort, Search Tasks)
    -   Developer F: User Story 5 (Delete Task)
4.  Team collaborates on Polish & Cross-Cutting Concerns.

---

## Notes

-   [P] tasks = different files, no dependencies
-   [Story] label maps task to specific user story for traceability
-   Each user story should be independently completable and testable
-   Verify tests fail before implementing
-   Commit after each task or logical group
-   Stop at any checkpoint to validate story independently
-   Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence


