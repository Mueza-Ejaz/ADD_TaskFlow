# Setup Guide for ADD_TaskFlow-App

This guide provides step-by-step instructions to set up and run the ADD_TaskFlow-App locally.

## Prerequisites

Ensure you have the following installed on your system:

-   **Git**: For version control.
-   **Node.js (18+)**: For frontend development (Next.js).
-   **npm** or **Yarn** or **pnpm**: Node.js package manager (npm comes with Node.js).
-   **Python (3.12+)**: For backend development (FastAPI).
-   **pip**: Python package installer (comes with Python).
-   **PostgreSQL Database**: A running instance of PostgreSQL (e.g., local installation, Docker, or a cloud service like Neon).

## 1. Clone the Repository

First, clone the project repository from GitHub:

```bash
git clone <repository-url>
cd ADD_TaskFlow-App
```
*(Replace `<repository-url>` with the actual URL of your repository.)*

## 2. Frontend Setup (Next.js)

Navigate to the `frontend/` directory and install dependencies.

```bash
cd frontend
npm install # or yarn install or pnpm install
```

### Environment Variables

Create a `.env.local` file in the `frontend/` directory (if it doesn't exist) and set the backend API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
*(Adjust `http://localhost:8000` if your backend runs on a different address/port.)*

### Run Frontend Development Server

```bash
npm run dev
```
The frontend application should now be running at `http://localhost:3000`.

## 3. Backend Setup (FastAPI)

Navigate to the `backend/` directory and create a Python virtual environment.

```bash
cd ../backend
python -m venv .venv
```

Activate the virtual environment:

-   **Windows:**
    ```bash
    .\.venv\Scripts\activate
    ```
-   **macOS/Linux:**
    ```bash
    source ./.venv/bin/activate
    ```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

### Database Configuration

Ensure your PostgreSQL database is running and create a `.env` file in the `backend/` directory with your database connection string and JWT secret:

```
DATABASE_URL="postgresql://user:password@host:port/dbname"
JWT_SECRET="your_secret_jwt_key_here"
ALLOWED_ORIGINS="http://localhost:3000"
```
*(Replace `user`, `password`, `host`, `port`, `dbname` with your PostgreSQL credentials. Ensure `JWT_SECRET` is a strong, random string.)*

### Run Backend Development Server

```bash
uvicorn src.main:app --reload
```
The backend API should now be running at `http://localhost:8000`. API documentation (Swagger UI) will be available at `http://localhost:8000/docs`.

## 4. Troubleshooting

### Frontend (Next.js)
-   **"Cannot find module 'tailwindcss'"**: Ensure Tailwind CSS is correctly installed and configured. Re-run `npm install` in `frontend/`.
-   **CORS errors**: Verify `ALLOWED_ORIGINS` in `backend/.env` includes your frontend's URL (`http://localhost:3000` by default).

### Backend (FastAPI)
-   **Database connection errors**: Double-check `DATABASE_URL` in `backend/.env` for correct credentials and host/port. Ensure your PostgreSQL server is running and accessible.
-   **"ModuleNotFoundError"**: Ensure your Python virtual environment is activated (`source ./.venv/bin/activate`) and all packages are installed (`pip install -r requirements.txt`).

---

*This document is a living guide and will be updated as the project evolves.*
