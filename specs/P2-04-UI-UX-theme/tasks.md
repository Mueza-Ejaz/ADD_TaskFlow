# Tasks: Phase 4: UI/UX Overhaul

**Input**: Design documents from `specs/P2-04-ui-ux-theme/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/README.md`, `quickstart.md`

**Tests**: Test tasks are included as verification steps within each user story's implementation, rather than separate TDD test-first tasks, as not explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Paths assume a monorepo structure with `frontend/` and `backend/` directories.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initial project setup for the UI/UX overhaul, ensuring all necessary foundational libraries and configurations are in place.

- [X] T001 Install Framer Motion dependency. `frontend/package.json`
- [X] T002 Update Tailwind CSS configuration with new color palette, glassmorphism variants, and animation presets. `frontend/tailwind.config.ts`

---

## Phase 2: Foundational (Design System Components)

**Purpose**: Develop reusable UI components that embody the core design principles (glassmorphism, animations) and will be used across multiple user stories. These components are prerequisites for efficient development of subsequent phases.

**Checkpoint**: Core reusable design components are implemented and ready for integration.

- [X] T003 [P] Create `GlassCard` component for reusable glassmorphism styling. `frontend/components/ui/GlassCard.tsx`
- [X] T004 [P] Create `AnimatedBackground` component for dynamic mesh gradients. `frontend/components/ui/AnimatedBackground.tsx`
- [X] T005 [P] Create `ParticleEffect` component for subtle floating particles. `frontend/components/ui/ParticleEffect.tsx`
- [X] T006 [P] Create `AnimatedButton` component with hover animations. `frontend/components/ui/AnimatedButton.tsx`
- [X] T007 [P] Create `PageTransition` component for smooth route transitions. `frontend/components/ui/PageTransition.tsx`
- [X] T008 [P] Create `StatisticsCard` component with animated numerical counts. `frontend/components/ui/StatisticsCard.tsx` (Needed for US3)

---

## Phase 3: User Story 1 - Impressive Landing Page [US1] (Priority: P1) 🎯 MVP

**Goal**: Implement the Landing, Login, and Signup pages strictly according to the detailed "Senior Frontend Engineer" directive.

**Independent Test**: The landing page matches the specific visual requirements (dark mode, specific glows, glassmorphism card), and the Login/Signup buttons navigate correctly.

### Implementation for User Story 1

- [X] T009 [US1] Implement Landing, Login, and Signup pages. Follow the detailed requirements in `specs/P2-04-UI-UX-theme/landing-page-prompt.md`.
    - Create `frontend/components/BackgroundGlow.tsx` (Teal/green glows, full screen black bg).
    - Create `frontend/components/LandingCard.tsx` (Glassmorphism, specific icon, text, buttons).
    - Update `frontend/app/page.tsx` (Landing page assembly).
    - Create `frontend/app/login/page.tsx` (Login page with email/password).
    - Create `frontend/app/signup/page.tsx` (Signup page with name/email/password).
    - Ensure strict adherence to Tailwind classes and no external libraries as requested.

- [X] T010 [US1] Verify navigation and responsiveness. (Manual Check)

**Checkpoint**: The Landing, Login, and Signup pages are implemented exactly as specified.

---

## Phase 4: User Story 2 - Enjoyable Dashboard Experience [US2] (Priority: P1)

**Goal**: Transform the main task management dashboard into a beautiful, smooth, and enjoyable interface with consistent glassmorphism design and fluid interactions.

**Independent Test**: A logged-in user can access the dashboard, interact with tasks through drag & drop, open modals, and perceive a visually consistent and smooth experience.

### Implementation for User Story 2

- [X] T015 [US2] Apply glassmorphism styles to the main dashboard container and layout elements. `frontend/app/dashboard/page.tsx`
- [X] T016 [US2] Redesign the header with user profile dropdown and transparent sidebar/navigation to align with the new theme. `frontend/components/layout/Header.tsx`, `frontend/components/layout/Sidebar.tsx`
- [X] T017 [US2] Integrate the new color scheme across all existing dashboard UI elements. `frontend/styles/globals.css` (or relevant CSS modules)
- [X] T018 [P] [US2] Update `TaskCard` component (`frontend/components/TaskCard.tsx`) with frosted glass effect and priority color accents, ensuring hover animations. `frontend/components/TaskCard.tsx`
- [X] T019 [P] [US2] Redesign kanban columns within `TaskKanban` component (`frontend/components/TaskKanban.tsx`) to match the glassmorphism style. `frontend/components/TaskKanban.tsx`
- [X] T020 [US2] Update existing modal windows (e.g., `ConfirmationModal.tsx`, task creation/editing modals) to include backdrop blur effect. `frontend/components/ConfirmationModal.tsx` (and other modals)
- [X] T021 [P] [US2] Create and integrate `FloatingActionButton` component for "New Task" on the dashboard. `frontend/components/ui/FloatingActionButton.tsx`, `frontend/app/dashboard/page.tsx`
- [X] T022 [US2] Implement smooth drag & drop animations for task management within `TaskKanban.tsx`, providing clear visual feedback. `frontend/components/TaskKanban.tsx`
- [X] T023 [US2] Verify consistent glassmorphism design, smooth hover animations, and fluid drag & drop on the dashboard. (Manual Check)

**Checkpoint**: The Dashboard is fully redesigned, interactive, and consistent with the new theme.

---

## Phase 5: User Story 3 - Smooth Navigation Experience [US3] (Priority: P2)

**Goal**: Ensure smooth transitions between all application pages with a consistent design, enhancing the overall polish and user journey. This phase also includes the creation of new ancillary pages.

**Independent Test**: A user can navigate between various application pages, including the new ones, and observe fluid page transitions, consistent design, and correctly functioning navigation elements.

### Implementation for User Story 3

- [X] T024 [US3] Design and develop User Profile Page layout (`app/dashboard/profile/page.tsx`) with a glassmorphism profile card and integrate `StatisticsCard` components. `frontend/app/dashboard/profile/page.tsx`
- [X] T025 [US3] Implement an edit profile form within a modal window on the User Profile Page. `frontend/app/dashboard/profile/page.tsx`
- [X] T026 [US3] Add a theme preferences toggle component on the User Profile Page. `frontend/app/dashboard/profile/page.tsx`
- [X] T027 [US3] Design and develop Settings Page layout (`app/settings/page.tsx`) with sections for account settings, notification preferences, theme customization, and placeholder for export/import. `frontend/app/settings/page.tsx`
- [X] T028 [US3] Design and develop About/Help Page layout (`app/about/page.tsx`) with app information, user guide, contact details, and FAQ. `frontend/app/about/page.tsx`
- [X] T029 [US3] Update the main navigation menu (e.g., `Sidebar.tsx`) to include links to the new pages and implement active states. `frontend/components/layout/Sidebar.tsx` (and other navigation components like Header)
- [X] T030 [US3] Configure new page routes within Next.js for the User Profile, Settings, and About/Help pages. `frontend/app/layout.tsx` (or relevant route files)
- [X] T031 [US3] Implement smooth page transitions (using `PageTransition` component) across all application pages, ensuring fade effects. `frontend/app/layout.tsx` (wrapper component)
- [X] T032 [US3] Verify all page transitions are smooth, consistent, and that the browser's back button works correctly with animations. (Manual Check)

**Checkpoint**: All specified new pages are implemented, navigation is integrated with smooth transitions, and the entire application has a cohesive flow.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Address application-wide improvements, optimizations, and final quality assurance not specific to individual user stories.

- [X] T033 Optimize animated mesh gradient backgrounds for performance and visual fluidity across various devices. `frontend/components/ui/AnimatedBackground.tsx`
- [X] T034 Implement feature detection for `backdrop-filter` with graceful fallbacks for unsupported browsers. `frontend/styles/globals.css` (or utility file)
- [X] T035 Reduce animation complexity for mobile devices and optimize touch interactions. `frontend/styles/globals.css` (or component-specific CSS)
- [X] T036 Conduct a comprehensive Lighthouse audit and implement optimizations for performance (e.g., lazy loading non-critical assets, reducing JavaScript bundle size). `frontend/next.config.ts` (and relevant component files)
- [X] T037 Perform cross-browser compatibility testing across major desktop and mobile browsers (Chrome, Firefox, Safari, Edge) and fix identified issues.
- [X] T038 Ensure all animations and interactive elements meet WCAG accessibility guidelines, including providing options for reduced motion.
- [X] T039 Fine-tune all animations for timing, easing, and overall visual impact, adjusting colors and contrasts for maximum aesthetic appeal.
- [X] T040 Conduct usability testing with a small group of users, gather feedback on the new UI/UX, and integrate critical feedback.
- [X] T041 Update the project's style guide and design system documentation with new design patterns, animation usage, and component examples. `docs/design-system.md`
- [X] T042 Perform a final production build and comprehensive quality assurance.
- [X] T043 Conduct final performance checks on the production build.
- [X] T044 Prepare a rollback plan for deployment.
- [X] T045 Run `quickstart.md` validation to ensure the application starts and functions as expected.

---

## Dependencies & Execution Order

### Phase Dependencies

-   **Setup (Phase 1)**: No dependencies - can start immediately.
-   **Foundational (Phase 2)**: Depends on Setup completion. BLOCKS all user stories.
-   **User Stories (Phases 3, 4, 5)**: All depend on Foundational phase completion.
    -   User Stories 1 and 2 (P1) can proceed in parallel.
    -   User Story 3 (P2) can proceed after Foundational, ideally after P1 stories are well underway or complete.
-   **Polish & Cross-Cutting Concerns (Phase 6)**: Depends on all user stories being substantially complete.

### User Story Dependencies

-   **User Story 1 (P1 - Impressive Landing Page)**: Can start after Foundational (Phase 2). No direct dependencies on other user stories for its core functionality.
-   **User Story 2 (P1 - Enjoyable Dashboard Experience)**: Can start after Foundational (Phase 2). No direct dependencies on other user stories for its core functionality.
-   **User Story 3 (P2 - Smooth Navigation Experience)**: Can start after Foundational (Phase 2). Integrates new pages, so it might benefit from basic styling and component readiness from earlier phases.

### Within Each User Story

-   Core component creation/integration before specific page implementations.
-   Visual implementation before verification steps.

### Parallel Opportunities

-   All Setup tasks marked [P] can run in parallel.
-   All Foundational tasks marked [P] can run in parallel (within Phase 2).
-   Once the Foundational phase completes, User Story 1 (Phase 3) and User Story 2 (Phase 4) can be worked on in parallel by different team members due to their P1 priority and relative independence.
-   Within user stories, tasks marked [P] (e.g., creating multiple UI components) can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1.  Complete Phase 1: Setup
2.  Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3.  Complete Phase 3: User Story 1
4.  **STOP and VALIDATE**: Test User Story 1 independently against its acceptance criteria.
5.  Deploy/demo if ready for a very early preview.

### Incremental Delivery

1.  Complete Setup + Foundational → Foundation ready.
2.  Add User Story 1 (Landing Page) → Test independently → Deploy/Demo (early MVP).
3.  Add User Story 2 (Dashboard) → Test independently → Deploy/Demo.
4.  Add User Story 3 (New Pages & Navigation) → Test independently → Deploy/Demo.
5.  Each story adds significant user value without breaking previously implemented stories.

### Parallel Team Strategy

With multiple developers:

1.  The team completes Setup + Foundational phases together or by designated infrastructure/core developers.
2.  Once Foundational is done:
    *   Developer A: Focuses on User Story 1 (Landing Page).
    *   Developer B: Focuses on User Story 2 (Dashboard Experience).
    *   Developer C: Focuses on User Story 3 (New Pages & Navigation).
3.  All developers contribute to the final Polish & Cross-Cutting Concerns phase.

---

## Notes

-   [P] tasks = different files, minimal immediate dependencies, suitable for parallel execution.
-   [Story] label maps task to a specific user story for traceability and independent development.
-   Each user story should be independently completable and testable.
-   Verification tasks are manual checks against acceptance criteria.
-   Commit after each task or logical group of related tasks.
-   Stop at any checkpoint to validate the completed story independently.
-   Avoid: vague tasks, same file conflicts (where possible for [P] tasks), cross-story dependencies that break independence.
