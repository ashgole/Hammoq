# Hammoq Task Manager

A modern, responsive full-stack MERN application built for the **Hammoq Technical Assessment**. It features complete task lifecycle management (CRUD), real-time search & multi-filtering, dynamic dashboard statistics, and full **Dark & Light theme support** across every component, adhering to clean **SOLID design principles**.

🌐 **Live Demo on Vercel:** [https://hammoq-task-manager.vercel.app/](https://hammoq-task-manager.vercel.app/)

---

## 🚀 1. How to Run

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB Atlas**: URI configured in `server/.env`

### Environment Configuration
Create `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/Hammoq?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
```

### Running Locally

#### Step 1: Start Backend (Express + MongoDB)
```bash
cd server
npm install
npm start
# Server runs on: http://localhost:5000
```
*For development with auto-reload:* `npm run dev`

#### Step 2: Start Frontend (React + Vite)
```bash
cd client
npm install
npm run dev
# Client runs on: http://localhost:5173
```

---

## 🏛️ 2. Project Architecture

The codebase strictly enforces **separation of concerns** and **SOLID principles** across both frontend and backend services:

```text
Hammoq/
├── vercel.json                 # Multi-service Vercel deployment config
├── client/                     # Frontend (React 18 + Vite)
│   ├── src/
│   │   ├── components/         # Single-responsibility UI components
│   │   │   ├── Navbar.jsx          # Header with logo & Dark/Light ThemeToggle
│   │   │   ├── DashboardStats.jsx  # Summary cards (Total, Pending, In Progress, Done)
│   │   │   ├── TaskFilters.jsx     # Search by title, status/priority filters, sorting
│   │   │   ├── TaskTable.jsx       # Responsive table & mobile cards with action buttons
│   │   │   ├── TaskModal.jsx       # Modal for creating & editing tasks with validation
│   │   │   ├── DeleteConfirmModal.jsx # Deletion confirmation safeguard
│   │   │   ├── AlertBanner.jsx     # Toast feedback notifications
│   │   │   ├── EmptyState.jsx      # Informative empty states
│   │   │   └── LoadingSpinner.jsx  # Accessible loading indicators
│   │   ├── context/
│   │   │   └── ThemeContext.jsx    # Theme state with localStorage & OS detection
│   │   ├── services/
│   │   │   └── api.js              # Centralized API service using native fetch (DIP)
│   │   ├── App.jsx                 # Dashboard container orchestrating state & CRUD
│   │   └── index.css               # Design tokens (CSS variables for Dark/Light modes)
│   ├── vite.config.js          # Vite config with local development API proxy
│   └── package.json
└── server/                     # Backend (Node.js + Express + MongoDB Atlas)
    ├── src/
    │   ├── config/
    │   │   ├── config.js           # Environment loader & validation
    │   │   └── db.js               # MongoDB connection with serverless caching
    │   ├── models/
    │   │   └── Task.js             # Mongoose schema explicitly bound to 'tasks' collection
    │   ├── controllers/
    │   │   ├── taskController.js   # CRUD logic & global dashboard statistics
    │   │   └── hello.controller.js # Hello verification endpoint
    │   ├── routes/
    │   │   └── api.routes.js       # REST route declarations
    │   ├── middleware/
    │   │   └── errorHandler.js     # Centralized error handler (CastError, ValidationError)
    │   └── app.js                  # Express app, CORS, DB connection middleware
    ├── server.js                   # Server entry point & graceful shutdown
    └── package.json
```

### Key Architectural Highlights
- **Universal Dark & Light Theme:** Driven by semantic CSS variables in `index.css` and `ThemeContext`. Seamlessly themes buttons, tables, cards, and modal dialogs with automatic OS preference detection.
- **Decoupled API Client:** UI components consume abstract functions in `services/api.js` rather than embedding inline `fetch` calls.
- **Explicit MongoDB Binding:** Mongoose model is explicitly bound to the existing database `Hammoq` and collection `tasks`.

### REST API Endpoints
| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks (supports `search`, `status`, `priority`, `sortBy`) + stats | `200` |
| `GET` | `/api/tasks/:id` | Get single task details by ID | `200`, `404` |
| `POST` | `/api/tasks` | Create a new task (validates required `title`) | `201`, `400` |
| `PUT` | `/api/tasks/:id` | Update task details, status, or priority | `200`, `400`, `404` |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | `200`, `404` |
| `GET` | `/api/hello` | Health check endpoint | `200` |

---

## 📌 3. Project Introduction

Built for the **Hammoq Infosystems** senior developer evaluation, this application demonstrates enterprise-grade full-stack fundamentals:
- **Clean Code & SOLID Design:** Modular folder structure, single-purpose components, and clean separation between business logic and UI presentation.
- **Zero-Dependency Styling:** Modern, responsive UI with zero heavy CSS framework bloat (bundle size is only ~164 kB).
- **Production-Ready Verification:** Validated with end-to-end integration tests, graceful serverless connection handling on Vercel, and direct integration with live MongoDB Atlas.
