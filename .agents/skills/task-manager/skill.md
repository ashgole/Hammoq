---
name: task-manager
description: Development guide, architectural patterns, and execution workflow for building the Hammoq Full-Stack Task Manager application.
---

# Hammoq Task Manager Development Skill

## 1. Purpose & Scope
This guide provides an end-to-end development workflow for creating, extending, and testing the Hammoq Task Manager application. The system consists of a Vite + React frontend client and an Express + Mongoose Node.js backend connected to MongoDB.

---

## 2. Before-Implementation Checklist
Before writing or modifying any code, verify that:
1. [ ] **Node.js Environment**: Node.js (v18+) and npm are available and functioning.
2. [ ] **Environment Configuration**: `server/.env` exists and contains a valid `MONGODB_URI` pointing to the `Hammoq` database.
3. [ ] **Rules Acknowledged**: Both User Rules (Dark/Light theme on every component, SOLID principles) are strictly understood.
4. [ ] **Directory Boundaries**: Frontend files stay in `client/`, backend in `server/`, shared documentation in root.
5. [ ] **Dependency Constraints**: JavaScript only (no TypeScript), no heavy UI frameworks, native `fetch` only.

---

## 3. 8-Step Development Workflow

### Step 1: Schema Definition & DB Connectivity
- Define `server/src/models/Task.js` schema with:
  - `title`: String, required, trim, max 120 chars.
  - `description`: String, trim, max 1000 chars.
  - `status`: String, enum: `['Pending', 'In Progress', 'Completed']`, default `'Pending'`.
  - `priority`: String, enum: `['Low', 'Medium', 'High']`, default `'Medium'`.
  - `dueDate`: Date, optional.
  - `timestamps`: `{ createdAt, updatedAt }`.
- Bind schema explicitly to the `'tasks'` collection: `mongoose.model('Task', taskSchema, 'tasks')`.
- Connect via `mongoose.connect(process.env.MONGODB_URI, { dbName: 'Hammoq' })` in `server/src/config/db.js`.

### Step 2: Backend Controller & Service Logic
- Implement `taskController.js`:
  - `getTasks`: Parse query parameters (`status`, `priority`, `search`, `sortBy`, `sortOrder`). Construct dynamic Mongoose query. Return tasks array and dashboard stats (total, pending, in-progress, completed).
  - `getTaskById`: Validate `mongoose.isValidObjectId(id)`. Return 404 if not found.
  - `createTask`: Validate mandatory fields (`title`), sanitize inputs, persist document.
  - `updateTask`: Validate ID, apply updates with `{ new: true, runValidators: true }`.
  - `deleteTask`: Validate ID, remove document, return confirmation.

### Step 3: Route Mounting & Error Middleware
- Expose REST endpoints in `server/src/routes/api.routes.js`:
  - `GET /api/tasks`
  - `GET /api/tasks/:id`
  - `POST /api/tasks`
  - `PUT /api/tasks/:id`
  - `DELETE /api/tasks/:id`
- Implement `errorHandler.js` middleware catching CastError, ValidationError, duplicate key errors, and 500 internal errors with normalized JSON responses.

### Step 4: Frontend API Layer
- In `client/src/services/api.js`, implement unified helper functions:
  - `fetchHelloMessage()`
  - `fetchTasks({ search, status, priority, sortBy, sortOrder })`
  - `fetchTaskById(id)`
  - `createTask(data)`
  - `updateTask(id, data)`
  - `deleteTask(id)`
- Handle network timeouts, HTTP error codes, and JSON parsing consistently.

### Step 5: Dashboard Layout & State Architecture
- In `client/src/App.jsx`, organize state:
  - `tasks`: Array of task items.
  - `stats`: Aggregate counts `{ total, pending, inProgress, completed }`.
  - `filters`: Search term, selected status, priority, and sort options.
  - `modals`: Active task for edit/create, active task for delete confirmation.
  - `uiState`: `loading`, `error`, `bannerMessage`.
- Implement debounced search or instant filtering on user input.

### Step 6: Atomic Component Implementation
- **Navbar & ThemeToggle**: Header with brand logo, title, and theme switcher.
- **DashboardStats**: 4 stat cards showing Total, Pending, In Progress, and Completed task counts with color-coded badges and icons.
- **TaskFilters**: Search input with clear button, filter dropdowns for Status and Priority, sorting order selector, and "Create New Task" CTA button.
- **TaskTable / TaskList**: Responsive data table on desktop with fallback cards on mobile viewports. Shows Title, Description excerpt, Status Badge, Priority Badge, Due Date, and Action buttons (Edit, Delete).
- **TaskModal**: Accessible dialog for adding or editing a task. Form validation indicators for required fields.
- **DeleteConfirmModal**: Safety dialog prompting user confirmation before executing deletion.
- **AlertBanner**: Flash notification banner for success/error feedback with auto-dismiss.

### Step 7: Complete Dark & Light Theme Styling
- Use CSS variables exclusively for colors, borders, shadows, and backgrounds in `client/src/index.css`.
- Ensure dark mode covers:
  - Backgrounds: Primary page `#0b0f19`, cards `#131c2e`, modals `#1e293b`.
  - Text: Primary `#f8fafc`, secondary `#cbd5e1`, muted `#94a3b8`.
  - Form Controls: Inputs, selects, and textareas with dark backgrounds and accessible focus rings.
  - Badges: Low/Medium/High priority badges and Pending/In Progress/Completed status pills with distinct dark-mode backgrounds.

### Step 8: Build Verification & End-to-End Testing
- Execute `npm run build` in `client/` to verify zero Vite packaging errors.
- Test CRUD operations against live MongoDB Atlas cluster.
- Test edge cases: empty search results, special characters in title, invalid task ID, network disconnection.

---

## 4. Feature Guidelines

| Feature | Behavior & Acceptance Standard |
|---|---|
| **CRUD Operations** | Create, Read, Update, and Delete immediately synchronize with MongoDB and update the dashboard UI without requiring full page refresh. |
| **Search & Filtering** | Instant or debounced search matching task titles (case-insensitive regex). Multi-filter support (e.g. status "Pending" + priority "High"). |
| **Dashboard Metrics** | Dynamic calculation of Total, Pending, In Progress, and Completed counts. |
| **Status / Priority** | Visual distinction via color-coded badges (e.g. Red for High Priority, Yellow for Medium, Green for Low; Blue for In Progress, Green for Completed, Gray for Pending). |
| **Modal Management** | Trap focus, handle Escape key, backdrop click dismiss, clean validation state reset upon close. |
| **Responsive Design** | Flawless rendering from 320px mobile screens to large desktop monitors. |

---

## 5. Debugging & Troubleshooting

| Symptom | Probable Cause | Resolution |
|---|---|---|
| Mongoose `CastError: Cast to ObjectId failed` | Passing an invalid or undefined string in URL parameter `:id`. | Add `mongoose.isValidObjectId(req.params.id)` check before querying. |
| CORS blocked error in browser | Express CORS origin mismatch with Vite origin. | Ensure `cors({ origin: 'http://localhost:5173' })` is configured before routes. |
| Theme not applying to modal or inputs | Hardcoded hex colors in CSS or missing variable inheritance. | Inspect element in DevTools and replace hardcoded colors with `var(--...)`. |
| Task not persisting to database | Database or collection name mismatch. | Verify connection specifies `{ dbName: 'Hammoq' }` and model specifies `'tasks'`. |

---

## 6. Completion Criteria
- [x] All CRUD operations work against live MongoDB Atlas.
- [x] Dashboard metrics accurately reflect database records.
- [x] Search, filter, and sorting function seamlessly together.
- [x] Light and dark modes render beautifully on all components.
- [x] SOLID principles strictly honored across codebase.
- [x] Zero compilation or build errors (`npm run build`).
