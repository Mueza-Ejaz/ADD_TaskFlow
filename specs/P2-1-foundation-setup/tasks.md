# Tasks: Phase 1: Project Foundation Setup

**Input**: Design documents from `specs/P2-1-foundation-setup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by logical phases of the foundation setup.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project root directory `ADD_TaskFlow-App/`
- [X] T002 Create folder structure per constitution and spec
- [X] T003 Initialize Git repository with `.gitignore`
- [X] T004 Create initial `README.md` with project overview
- [X] T005 Create `CLAUDE.md` files (root, frontend, backend)
- [X] T006 Set up Git hooks (pre-commit for linting)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Frontend Core Setup
- [X] T007 Initialize Next.js 16 with TypeScript and App Router in `frontend/`
- [X] T008 Configure Tailwind CSS with design tokens in `frontend/tailwind.config.ts`
- [X] T009 Add Inter font from Google Fonts in `frontend/tailwind.config.ts`
- [X] T010 Install `framer-motion` for animations in `frontend/package.json`
- [X] T011 Install `date-fns` for date manipulation in `frontend/package.json`
- [X] T012 Install `clsx` for conditional classes in `frontend/package.json`
- [X] T013 Set up ESLint + Prettier with project rules in `frontend/.eslintrc.json`, `frontend/.prettierrc`
- [X] T014 Configure `next.config.ts` for environment variables in `frontend/next.config.ts`

### Backend Core Setup
- [X] T015 Create Python virtual environment in `backend/`
- [X] T016 Create `requirements.txt` with pinned versions in `backend/requirements.txt`
- [X] T017 Create FastAPI application structure: `src/main.py`, `src/config.py`, `src/database.py`, `src/api/v1/health.py`, `src/core/middleware.py` in `backend/`
- [X] T018 Set up environment variables (`.env`, `.env.example`): `DATABASE_URL`, `JWT_SECRET`, `ALLOWED_ORIGINS`
- [X] T019 Configure CORS for frontend communication in `backend/src/core/middleware.py`
- [X] T020 Create OpenAPI/Swagger documentation at `/docs` (verification task, FastAPI auto-generates)

**Checkpoint**: Foundation ready - subsequent phases can now begin in parallel

---

## Phase 3: Frontend Layout & API Client Stub

**Goal**: Establish basic frontend layout and API client structure

- [X] T021 [P] Create basic layout structure in `frontend/app/layout.tsx`
- [X] T022 [P] Create landing page showing project status in `frontend/app/page.tsx`
- [X] T023 [P] Create global styles with Tailwind directives in `frontend/app/globals.css`
- [X] T024 [P] Create `lib/api.ts` skeleton for API client in `frontend/lib/api.ts`

---

## Phase 4: Design System Implementation

**Goal**: Implement complete design system with UI components

- [X] T025 Complete Tailwind configuration: Color palette, Typography scale, Spacing system in `frontend/tailwind.config.ts`
- [X] T026 [P] Create `Button.tsx` in `frontend/components/ui/Button.tsx`
- [X] T027 [P] Create `Card.tsx` in `frontend/components/ui/Card.tsx`
- [X] T028 [P] Create `Input.tsx` in `frontend/components/ui/Input.tsx`
- [X] T029 [P] Create `Modal.tsx` in `frontend/components/ui/Modal.tsx`
- [X] T030 [P] Create `LoadingSpinner.tsx` in `frontend/components/ui/LoadingSpinner.tsx`
- [X] T031 [P] Create `Toast.tsx` in `frontend/components/ui/Toast.tsx`
- [X] T032 Create animation utilities with Framer Motion in `frontend/lib/animations.ts`
- [X] T033 Create design system documentation in `docs/design-system.md`

---

## Phase 5: Integration & Validation

**Goal**: Connect all components and validate against acceptance criteria

- [X] T034 Connect frontend to backend API (update API client in `frontend/lib/api.ts`)
- [X] T035 Set up Neon PostgreSQL connection and test with simple query
- [X] T036 Create comprehensive health check system (Backend: `backend/src/api/v1/health.py`, Frontend: `frontend/app/page.tsx`)
- [X] T037 Validate all 21 acceptance criteria (Refer to `specs/P2-1-foundation-setup/spec.md`)
- [X] T038 Create complete documentation: `README.md`, `docs/setup.md`, API documentation (verify Swagger UI), Troubleshooting guide

---

## Phase 6: Testing Setup & Initial Tests

**Goal**: Implement and configure testing environments and write initial tests

### Frontend Testing
- [X] T039 Install Jest + React Testing Library for frontend in `frontend/package.json`
- [X] T040 Configure test environment for frontend in `frontend/jest.config.js`, `frontend/setupTests.ts`
- [X] T041 Write basic test for landing page in `frontend/tests/page.test.tsx`
- [X] T042 Write unit tests for all UI components in `frontend/components/ui/*.test.tsx`
- [X] T043 Set up visual regression testing (if Storybook is used or other tools)

### Backend Testing
- [X] T044 Install pytest and configure for backend in `backend/`
- [X] T045 Configure test environment for backend in `backend/pytest.ini`
- [X] T046 Create test for health endpoint in `backend/tests/test_health.py`
- [X] T047 Test database connection for backend

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple areas and final checks

- [X] T048 Documentation updates (ensure all `docs/` files are complete and up-to-date)
- [X] T049 Code cleanup and refactoring across frontend and backend
- [X] T050 Performance optimization (frontend bundle, backend API response times)
- [X] T051 Security hardening (review env var usage, CORS configuration)
- [X] T052 Final validation against success metrics (Lighthouse score > 90, backend health < 100ms)
- [X] T053 Prepare for Phase 2 (review `plan.md`'s Phase 2 Preparation section)

---

## Dependencies & Execution Order

### Phase Dependencies

-   **Phase 1: Setup**: No dependencies - can start immediately.
-   **Phase 2: Foundational**: Depends on Phase 1 completion - BLOCKS all subsequent phases.
-   **Phase 3: Frontend Layout & API Client Stub**: Can start after Phase 2.
-   **Phase 4: Design System Implementation**: Can start after Phase 2.
-   **Phase 5: Integration & Validation**: Depends on Phases 3 and 4 completion.
-   **Phase 6: Testing Setup & Initial Tests**: Can start after Phase 2, runs in parallel with Phases 3 and 4, but some tasks depend on implementation.
-   **Final Phase: Polish & Cross-Cutting Concerns**: Depends on completion of all previous phases.

### Within Each Phase

-   Tasks should generally be completed in the order listed.
-   Tasks marked `[P]` can be executed in parallel with other `[P]` tasks within the same phase or other independent phases.

### Parallel Opportunities

-   Frontend (`Phase 3`) and Backend (`Phase 2` after core setup) tasks can proceed in parallel after `Phase 2` foundational setup.
-   Many tasks within `Phase 4: Design System Implementation` are marked `[P]` and can be done concurrently.
-   Testing setup (`Phase 6`) can be initiated early, but specific tests will depend on the corresponding implementation tasks.

---

## Implementation Strategy

### MVP First

1.  Complete Phase 1: Setup
2.  Complete Phase 2: Foundational (CRITICAL - blocks all subsequent development)
3.  Complete Phases 3 and 4 (Frontend Layout, API Client Stub, Design System) to get a basic UI and connected APIs.
4.  Complete Phase 5: Integration & Validation to ensure core functionality.
5.  **STOP and VALIDATE**: Ensure basic project runs and accepts criteria.

### Incremental Delivery

1.  Complete Phase 1: Setup + Phase 2: Foundational → Core infrastructure ready.
2.  Incrementally build out Phase 3, 4, 5, and 6, testing at each significant step.

### Parallel Team Strategy

With multiple developers:

1.  Team completes Phase 1: Setup and Phase 2: Foundational together.
2.  Once Foundational is done:
    -   Developer A: Focus on Frontend Layout (`Phase 3`) and Design System components (`Phase 4`).
    -   Developer B: Focus on Backend API structures and database connections (`Phase 2`, `Phase 5` related tasks).
    -   Developer C: Focus on Testing Setup (`Phase 6`) and initial test writing.
3.  Integration tasks in `Phase 5` can be done collaboratively once respective Frontend/Backend parts are ready.

---

## Notes

-   `[P]` tasks = different files, often independent of other `[P]` tasks within the same phase.
-   Each phase aims for a complete, independently testable increment where possible.
-   Verify tests fail before implementing.
-   Commit after each task or logical group.
-   Stop at any checkpoint to validate progress.
-   Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence.
