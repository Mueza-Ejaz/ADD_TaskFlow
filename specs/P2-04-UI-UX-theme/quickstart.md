# Quickstart Guide: Phase 4: UI/UX Overhaul

This guide provides instructions on how to quickly get started with the TaskFlow Pro application after the Phase 4 UI/UX overhaul has been implemented. It assumes you have already set up the backend and frontend components from previous phases.

## 1. Prerequisites

*   Node.js (LTS version) and npm/yarn installed.
*   Python 3.12+ and `pip` installed.
*   Docker and Docker Compose (optional, for local PostgreSQL setup if not using Neon).
*   Backend services (FastAPI, PostgreSQL) from Phase 3 are running and accessible.

## 2. Frontend Setup (Next.js Application)

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install Frontend Dependencies**:
    The UI/UX overhaul introduces new dependencies, primarily `framer-motion`. Ensure all dependencies are installed:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the Frontend Development Server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend application should now be running on `http://localhost:3000`.

## 3. Experiencing the New UI/UX

Once the frontend server is running, open your web browser and navigate to `http://localhost:3000`.

### Key Areas to Explore:

*   **Landing Page (`http://localhost:3000`)**: Observe the full-screen animated mesh gradient background, floating particles, and interactive Login/Sign Up buttons with hover animations.
*   **Authentication Flow (`http://localhost:3000/signup`, `http://localhost:3000/login`)**: Experience the redesigned signup and login pages.
*   **Dashboard (`http://localhost:3000/dashboard`)**: Log in to see the core task management interface with glassmorphism cards, smooth drag & drop, and updated header/sidebar.
*   **New Pages**:
    *   **User Profile Page (`http://localhost:3000/dashboard/profile`)**: View your profile with the new glassmorphism card, animated statistics, and theme preferences toggle.
    *   **Settings Page (`http://localhost:3000/settings`)**: Explore the redesigned account settings, notification preferences, and theme customization options.
    *   **About/Help Page (`http://localhost:3000/about`)**: Access application information, user guide, and FAQ.
*   **Interactions**: Test all hover effects, button animations, and page transitions between different routes.

## 4. Backend (FastAPI Application)

The backend setup remains unchanged from Phase 3. If you need to restart or ensure the backend is running:

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Activate Virtual Environment**:
    ```bash
    # On Windows
    .venv\Scripts\activate
    # On macOS/Linux
    source .venv/bin/activate
    ```

3.  **Start the FastAPI Server**:
    ```bash
    uvicorn src.main:app --reload
    ```
    The backend API should be accessible at `http://localhost:8000`.

## 5. Troubleshooting

*   **Frontend not loading**: Check the browser console for errors. Ensure `npm install` (or `yarn install`) completed successfully.
*   **Backend not responding**: Verify the FastAPI server is running and accessible. Check backend logs for errors.
*   **Visual Glitches**: If `backdrop-filter` effects are not rendering, ensure your browser supports it. Some older browsers might require fallbacks.
*   **Animations feel slow**: This might indicate a performance issue. Check your browser's developer tools for FPS and rendering performance. Refer to the plan's risk mitigation section for performance optimization strategies.
