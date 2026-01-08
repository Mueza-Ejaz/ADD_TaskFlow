# Data Model: Phase 4: UI/UX Overhaul

## Overview

This phase focuses on a complete UI/UX overhaul and does not introduce new backend data models or modify existing backend data structures. The changes primarily concern the visual presentation, interaction, and frontend state management of existing entities. The data models described below pertain to how existing backend entities are represented and managed within the frontend application.

## Key Frontend Entities and their Representation

### 1. Task

*   **Description**: Represents a single task item. While the core data structure (from Phase 3) remains unchanged in the backend, its frontend representation will be visually enhanced.
*   **Attributes (Frontend Representation)**:
    *   `id`: Unique identifier (string or number, from backend).
    *   `user_id`: Identifier of the user who owns the task (from backend).
    *   `title`: The task's title (string).
    *   `description`: Optional detailed description (string).
    *   `completed`: Boolean indicating task completion status.
    *   `priority`: (Implicit from existing data or visually assigned) - visually indicated by color accents.
    *   `created_at`: Timestamp of creation.
    *   `updated_at`: Timestamp of last update.
*   **Relationships**: Owned by a `User Profile`. Can be moved between Kanban columns (frontend state).
*   **Visual Enhancements**: Frosted glass effect, hover animations, priority color accents.
*   **Interaction**: Drag-and-drop for reordering/status changes.

### 2. User Profile

*   **Description**: Represents the currently logged-in user's profile information. Backend data remains the same, but new frontend display attributes and interaction options are introduced.
*   **Attributes (Frontend Representation)**:
    *   `id`: Unique user identifier (from backend).
    *   `username`: User's display name (from backend).
    *   `email`: User's email (from backend).
    *   `avatar_url`: URL to user's profile picture (if applicable, from backend or default).
    *   `total_tasks`: Animated count of all tasks (derived metric from backend).
    *   `completed_tasks`: Animated count of completed tasks (derived metric from backend).
    *   `theme_preference`: User's preferred UI theme (e.g., 'dark', 'light' - *new frontend preference*).
*   **Relationships**: Owns `Task` entities.
*   **Visual Enhancements**: Glassmorphism profile card, animated statistics.
*   **Interaction**: Edit profile form via modal, theme preferences toggle.

### 3. UI Component (Conceptual)

*   **Description**: A broad conceptual entity representing reusable visual elements (e.g., buttons, cards, modals, navigation items). These are not data-carrying entities in themselves but are fundamental to the frontend architecture and implement the design system.
*   **Common Attributes/Behaviors**:
    *   `glassmorphism_style`: Application of `backdrop-filter` and transparent backgrounds.
    *   `hover_animation`: Visual feedback on hover.
    *   `page_transition_effect`: Smooth transitions when navigating.
    *   `responsive_behavior`: Adaptation to different screen sizes.
*   **Examples**: `GlassCard`, `AnimatedButton`, `FloatingActionButton`, `PageTransition`, `AnimatedBackground`.

## No New Backend Data Models

It is explicitly stated that this phase is focused on frontend UI/UX and does not involve the creation of new database tables, fields, or modifications to the existing backend data schema established in previous phases. All data displayed and manipulated will utilize the existing backend APIs and data models.
