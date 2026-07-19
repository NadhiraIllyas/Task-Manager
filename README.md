# TaskFlow — MERN Stack Task Management App

A full-stack, user-isolated task management platform built using the MERN stack. Features secure JWT session handling, real-time workspace analytics, sorting, filtering, pagination, and a clean light theme dashboard.

## Live Deployments:

*   **Frontend Client (Vercel):** `https://task-manager-frontend-tau-ten.vercel.app` 
*   **Backend Server (Vercel):** `https://task-manager-backend-eta-one.vercel.app`

## Tech Stack:

*   **Frontend:** React (Vite), Redux Toolkit, Tailwind CSS, Axios, React-Toastify
*   **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JSON Web Tokens, Bcryptjs

## Features:

*   **User Authentication:** Secure register, login, and token preservation in `localStorage`.
*   **Data Isolation:** Users can only view, create, edit, or delete their own tasks.
*   **Workspace Analytics:** Dashboard progress bar and a dedicated Profile page with visual productivity metrics.
*   **Interactive Search & Sort:** Filter tasks instantly by title or description; sort by date, alphabet, or priority level.
*   **Local Pagination:** Clean list navigation (5 items per page) to prevent layout clutter.
*   **Toast Notifications:** Real-time feedback alerts for all task operations.

-----------------------------------------------------------------------------

## Local Installation & Setup:

1. Backend Setup
Navigate to the backend folder:
```bash
cd backend

Install dependencies:
npm install
Create a .env file inside /backend:

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/task_manager?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

Start the backend server:
npm run dev

--------------------------------------------------------------------------

2. Frontend Setup

Navigate to the frontend folder:
cd ../frontend
Install dependencies:
npm install
Create a .env file inside /frontend:

VITE_API_URL=http://localhost:5000/api

Start the frontend client:
npm run dev

------------------------------------------------------------------------------

API Endpoints:

Auth Routes

  - POST /api/auth/register — Register a new account
  - POST /api/auth/login — Login to an account
  - GET /api/auth/me — Fetch authenticated user details

Task Routes (Auth Required)

  - GET /api/tasks — Fetch user's tasks
  - POST /api/tasks — Create a new task
  - GET /api/tasks/:id — Get a specific task
  - PUT /api/tasks/:id — Update task details
  - DELETE /api/tasks/:id — Delete a task
  - PATCH /api/tasks/:id/status — Toggle status (pending/completed)


Thankyou...!