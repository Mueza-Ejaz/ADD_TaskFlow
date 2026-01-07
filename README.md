# ADD_TaskFlow-App

## Project Overview

**Purpose:** Modern Todo Web Application with full authentication and task management.

**Phases:** This project is structured into 4 distinct phases:
1.  **Phase 1: Project Foundation Setup** (Current Phase) - Establishing monorepo, Next.js 16, FastAPI, Design System.
2.  **Phase 2: User Authentication** - Implementing JWT tokens, Signup/Login.
3.  **Phase 3: Task Management (CRUD)** - Implementing PostgreSQL, SQLModel, Task Operations.
4.  **Phase 4: UI & Full Integration** - Frontend UI, API Integration, Testing, Polish.

**Tech Stack:**
*   **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion.
*   **Backend:** FastAPI, Python 3.12+, SQLModel.
*   **Database:** Neon PostgreSQL.

## Phase 1: Project Foundation Setup Summary

**Goal:** Establish the complete development foundation for ADD_TaskFlow-App.

**Scope:**
*   Monorepo structure creation and organization.
*   Next.js 16 frontend setup with TypeScript and App Router.
*   FastAPI backend setup with basic configuration.
*   Design system implementation (colors, typography, spacing, animations).
*   Development environment setup (Git, environment variables, scripts).
*   Database connection configuration (Neon PostgreSQL).
*   Basic health endpoints and API documentation.

**Requirements Highlights:**
*   Monorepo with `frontend/`, `backend/`, `specs/`, `docs/` directories.
*   Frontend: Next.js 16 with TypeScript, Tailwind CSS, Framer Motion.
*   Backend: FastAPI with SQLModel, Neon PostgreSQL connection.
*   Design System: Defined Colors, Typography, Spacing, and 6 UI components.
*   Environment setup: Git, environment variables, development scripts, and documentation.

**Acceptance Criteria:** 21 SMART criteria across Frontend, Backend, Development, and Design System aspects, ensuring a robust foundation.

## Phase 2: User Authentication Setup

**Overview:**
This phase implements user authentication using NextAuth.js on the frontend and JWT-based verification on the FastAPI backend. Users can sign up, log in, and access protected resources.

**Frontend Setup (Next.js):**
1.  **Install Dependencies:**
    ```bash
    cd frontend
    npm install next-auth jose jwt-decode
    ```
2.  **Environment Variables (`frontend/.env.local`):**
    Create or update `frontend/.env.local` with the following:
    ```
    NEXTAUTH_SECRET="your_nextauth_secret_key_here" # Generate a strong secret
    NEXTAUTH_URL="http://localhost:3000" # Your frontend URL
    NEXT_PUBLIC_API_BASE_URL="http://localhost:8001" # Your backend API URL
    ```
    *   **NEXTAUTH_SECRET**: A random string used to hash tokens, sign cookies, and generate cryptographic keys. You can generate one using `openssl rand -base64 32` or similar.
    *   **NEXTAUTH_URL**: The canonical URL of your frontend application.
3.  **NextAuth.js Configuration:**
    Ensure `frontend/lib/auth.ts`, `frontend/app/api/auth/[...nextauth]/route.ts`, `frontend/providers/AuthProvider.tsx`, and `frontend/app/layout.tsx` are configured as per the implementation.

**Backend Setup (FastAPI):**
1.  **Environment Variables (`backend/.env`):**
    Ensure `backend/.env` contains the following JWT-related secrets:
    ```
    JWT_SECRET_KEY=your-32-character-secret-key-here # Generate a strong secret
    JWT_ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=1440 # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS=7
    ```
    *   **JWT_SECRET_KEY**: A strong secret key used for signing JWT tokens.
    *   **JWT_ALGORITHM**: The algorithm used for JWT signing (e.g., HS256).
    *   **ACCESS_TOKEN_EXPIRE_MINUTES**: Expiration time for access tokens in minutes.
    *   **REFRESH_TOKEN_EXPIRE_DAYS**: Expiration time for refresh tokens in days (if implemented).

**Database Setup:**
The database will automatically create `users` table and update `tasks` table with `user_id` foreign key on FastAPI application startup. Ensure your PostgreSQL instance (e.g., Neon) is running and configured correctly in `backend/.env`'s `DATABASE_URL`.

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- Python (v3.12 or higher)
- pip (Python package installer)

### Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ADD_TaskFlow-App
   ```

2. **Set up the backend:**
   ```bash
   # Navigate to the backend directory
   cd backend

   # Create a virtual environment (recommended)
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Set up the frontend:**
   ```bash
   # Navigate to the frontend directory
   cd ../frontend

   # Install dependencies
   npm install
   ```

4. **Configure environment variables:**

   For the **backend** (`backend/.env`), ensure you have:
   ```
   DATABASE_URL="sqlite:///taskflow.db"
   JWT_SECRET_KEY=your-super-secret-key-change-in-production
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   REFRESH_TOKEN_EXPIRE_DAYS=7
   ALLOWED_ORIGINS=http://localhost:3000
   ```

   For the **frontend** (`frontend/.env.local`), ensure you have:
   ```
   NEXTAUTH_SECRET="S*#^A"g-)vU)bII.;odR"qH3bdM7`B"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_API_BASE_URL="http://localhost:8001"
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   uvicorn src.main:app --host localhost --port 8001 --reload
   ```

2. **In a new terminal, start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API docs: [http://localhost:8001/docs](http://localhost:8001/docs)

The application will now be fully functional with all CRUD operations available on the dashboard.
