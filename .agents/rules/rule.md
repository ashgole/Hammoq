# Project Rules: Hammoq Task Manager Application

## 1. Technology Stack & Language Constraints
- **Frontend**: React.js 18+, Vite, Vanilla CSS3 (Custom Properties / Design Tokens).
- **Backend**: Node.js, Express.js 4+.
- **Database**: MongoDB (Atlas) via Mongoose ODM.
- **Language**: Strict **JavaScript (ES Modules for Frontend, CommonJS for Backend)**. No TypeScript.
- **Dependencies**: Lean and lightweight. No unnecessary external state libraries (Redux) or CSS frameworks (Tailwind, Bootstrap). Pure React hooks (`useState`, `useEffect`, `useCallback`, `useContext`) and semantic HTML/CSS.

---

## 2. Mandatory User Rules

### Rule 1: Seamless Dark & Light Theme Across All Components
- Every UI element (Dashboard, Navbar, Cards, Inputs, Selects, Buttons, Badges, Modals, Tables, Spinners, Alerts, Scrollbars) **MUST** support both **Light** and **Dark** themes.
- Theme switching must be instantaneous, smooth, and driven by centralized CSS custom properties in `index.css`.
- Must respect user's system preferences (`prefers-color-scheme`) by default and persist user toggle in `localStorage`.
- All text and UI elements must maintain WCAG AA contrast compliance in both themes.

### Rule 2: Adherence to SOLID Principles
1. **Single Responsibility Principle (SRP)**:
   - Each component, controller, service, or route handler must have exactly one reason to change.
   - Frontend: Dedicated API service (`services/api.js`), dedicated modals (`TaskModal.jsx`, `DeleteConfirmModal.jsx`), dedicated filters (`TaskFilters.jsx`), and dedicated stats (`DashboardStats.jsx`).
   - Backend: Modular breakdown into `config/`, `controllers/`, `models/`, `routes/`, and `middleware/`.
2. **Open/Closed Principle (OCP)**:
   - Components and services should be open for extension (e.g., adding extra status/priority filters or theme tokens) without altering existing core logic.
3. **Liskov Substitution Principle (LSP)**:
   - Consistent interface contracts across endpoints and component props.
4. **Interface Segregation Principle (ISP)**:
   - Components accept only the props necessary for their isolated task; avoid fat props objects.
5. **Dependency Inversion Principle (DIP)**:
   - UI components rely on service abstractions (`services/api.js`) rather than inlining fetch operations.

---

## 3. Architecture & Code Structure

### Frontend (`client/`)
- **Centralized API**: All network communication with the backend happens exclusively inside `src/services/api.js`.
- **Component Reusability**: Common elements (Badges, Buttons, Modal wrappers) must be modular and reusable.
- **React Hooks**: Utilize proper dependencies in `useEffect` and `useCallback` to avoid memory leaks and stale closures.
- **State Management**: Clean local and contextual state without unnecessary re-renders.
- **Responsiveness**: Mobile-first fluid responsive grid and flexbox layout across mobile, tablet, and desktop viewports.

### Backend (`server/`)
- **Layer Separation**:
  - `src/config/`: Configuration & DB connection setup.
  - `src/models/`: Mongoose schemas and model definitions.
  - `src/controllers/`: Business logic and HTTP response formatting.
  - `src/routes/`: Route declarations and controller binding.
  - `src/middleware/`: Global error handling, request logging, and validation middleware.
- **Database & Collection**:
  - Connect to database name: `Hammoq`.
  - Bind explicitly to collection: `'tasks'`.
  - Include automatic Mongoose timestamps (`createdAt`, `updatedAt`).
  - Strict schema validations (required `title`, enum constraints for `status` and `priority`).
- **Standardized Response Format**:
  - Success: `{ "success": true, "data": ..., "message": "..." }`
  - Error: `{ "success": false, "message": "..." }`

---

## 4. Security & Environment Rules
- **NEVER** commit `.env` or hardcode credentials, connection strings, or secrets in any source file.
- Maintain `.env.example` in both root and `server/` with placeholder credentials.
- Ensure `.gitignore` ignores all `.env`, `.env.*`, and `node_modules` paths.
- Sanitize inputs and validate parameters (such as MongoDB `ObjectId`) before executing queries to prevent injection.

---

## 5. Quality, Verification & Production Readiness
- No mock data: all features (CRUD, search, filtering, status transitions, metrics) must connect directly to the live backend and MongoDB database.
- Production build (`npm run build` in `client/`) must succeed with zero errors or warnings.
- Robust error handling: every async call must gracefully catch errors, display actionable UI feedback to the user, and allow retry.
