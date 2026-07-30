# Frontend Architecture

## Fitness Tracker & Goal Management - React Frontend

This document describes the architecture, folder structure, design patterns, and data flow of the **FitnessAndGoalFrontend** application — a modern, responsive Single Page Application (SPA) built with **React 19**, **Vite**, **Tailwind CSS**, and **React Router**.

---

## 1. Technology Stack

| Layer          | Technology                 | Purpose                                               |
| -------------- | -------------------------- | ----------------------------------------------------- |
| UI Library     | **React 19**               | Component-based UI, hooks, concurrent rendering       |
| Build Tool     | **Vite**                   | Fast dev server, HMR, optimized production builds     |
| Routing        | **React Router DOM v7**    | Client-side routing & protected/public route wrappers |
| Styling        | **Tailwind CSS 3**         | Utility-first CSS framework                           |
| HTTP Client    | **Axios**                  | Promise-based API calls with interceptors             |
| Backend (BaaS) | **Supabase JS**            | Optional direct DB access / auth alternative          |
| Icons          | **Lucide React**           | Lightweight, consistent icon set                      |
| Linting        | **ESLint + React plugins** | Code quality                                          |

---

## 2. High-Level Architecture

The application follows a **modular layered architecture** with clear separation of concerns:

```
┌──────────────────────────────────────────────────────────┐
│                      Browser (SPA)                      │
│                                                          │
│   ┌─────────────┐   ┌──────────────┐   ┌──────────────┐  │
│   │   Routes    │──▶│    Pages     │──▶│ Components   │  │
│   │ (Protected/ │   │ (Dashboard,  │   │ (UI +Layout) │  │
│   │  Public)    │   │  Workouts..) │   │              │  │
│   └─────────────┘   └──────┬───────┘   └──────────────┘  │
│                            │                             │
│                    ┌───────▼────────┐                    │
│                    │  AuthContext   │  (Global state)     │
│                    └───────┬────────┘                    │
│                            │                             │
│                    ┌───────▼────────┐                    │
│                    │  API Layer     │  (Axios + Supabase) │
│                    └───────┬────────┘                    │
└────────────────────────────┼─────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
    ┌──────────────────┐         ┌──────────────────┐
    │  Spring Boot REST │         │     Supabase     │
    │   (Backend API)   │         │   (Postgres BaaS)│
    └──────────────────┘         └──────────────────┘
```

**Key principles:**

- **Layered structure** — UI never talks to HTTP directly; it goes through the API layer.
- **Single source of truth** — Authentication state lives in `AuthContext`.
- **Feature-based grouping** — Code is grouped by feature (`auth/`, `goals/`, `workouts/`, `dashboard/`) inside shared folders.

---

## 3. Folder Structure

```
FitnessAndGoalFrontend/
├── .env                       # Environment variables (VITE_API_URL, Supabase keys)
├── index.html                 # Vite entry HTML
├── package.json               # Dependencies & scripts
├── tailwind.config.js         # Tailwind theme
├── vite.config.js             # Vite + React + @vitejs/plugin-react
├── postcss.config.js
├── eslint.config.js
│
└── src/
    ├── main.jsx               # Application bootstrap (ReactDOM.createRoot)
    ├── App.jsx                # Top-level routing & AuthProvider
    ├── index.css              # Tailwind directives + global styles
    │
    ├── api/                   # ── HTTP / data access layer ─────────────
    │   ├── apiClient.js       # Axios instance + interceptors
    │   ├── auth.js            # login, register, logout, me()
    │   ├── workouts.js        # CRUD for workouts
    │   ├── goals.js           # CRUD for goals
    │   └── index.js           # Re-exports (barrel)
    │
    ├── context/               # ── React Context (global state) ─────────
    │   ├── AuthContext.jsx    # user, token, login(), register(), logout()
    │   └── index.js
    │
    ├── routes/                # ── Route guards ──────────────────────────
    │   ├── ProtectedRoute.jsx # Redirects to /login if not authenticated
    │   ├── PublicRoute.jsx    # Redirects to /dashboard if already logged in
    │   └── index.js
    │
    ├── components/            # ── Reusable presentational + layout ─────
    │   ├── layout/
    │   │   ├── Layout.jsx     # Page shell (Navbar + outlet)
    │   │   ├── Navbar.jsx     # Top navigation w/ logout
    │   │   └── index.js
    │   └── ui/                # Atomic UI primitives
    │       ├── Button.jsx
    │       ├── Input.jsx
    │       ├── Select.jsx
    │       ├── Textarea.jsx
    │       ├── Card.jsx
    │       ├── Modal.jsx
    │       ├── Badge.jsx
    │       ├── ProgressBar.jsx
    │       ├── Spinner.jsx
    │       ├── EmptyState.jsx
    │       └── index.js
    │
    └── pages/                 # ── Feature pages (route targets) ───────
        ├── auth/
        │   ├── LoginPage.jsx
        │   └── RegisterPage.jsx
        ├── dashboard/
        │   └── DashboardPage.jsx
        ├── workouts/
        │   └── WorkoutsPage.jsx
        └── goals/
            └── GoalsPage.jsx
```

---

## 4. Routing Design

Defined centrally in `src/App.jsx`. Two types of wrappers control access:

| Wrapper          | Behaviour                                                                |
| ---------------- | ------------------------------------------------------------------------ |
| `PublicRoute`    | If user is authenticated → redirect to `/dashboard`. Else renders child. |
| `ProtectedRoute` | If user is **not** authenticated → redirect to `/login`. Else renders.   |

### Route map

| Path         | Component       | Access    | Layout   |
| ------------ | --------------- | --------- | -------- |
| `/login`     | `LoginPage`     | Public    | —        |
| `/register`  | `RegisterPage`  | Public    | —        |
| `/dashboard` | `DashboardPage` | Protected | `Layout` |
| `/workouts`  | `WorkoutsPage`  | Protected | `Layout` |
| `/goals`     | `GoalsPage`     | Protected | `Layout` |
| `/`          | → `/dashboard`  | —         | —        |
| `*`          | → `/dashboard`  | —         | —        |

---

## 5. State Management

The app intentionally uses **React Context + local state** (no Redux/Zustand) to keep it lightweight.

### `AuthContext` (global)

Holds:

- `user` — current user object (or `null`)
- `token` — JWT (also persisted in `localStorage`)
- `loading` — initial auth-check status
- `login(credentials)` — calls API, stores token, fetches user
- `register(payload)` — creates account, then logs in
- `logout()` — clears storage & state

### Local component state

Each page (e.g. `WorkoutsPage`, `GoalsPage`) manages its own list/form state via `useState` + `useEffect`.

---

## 6. API Layer (`src/api`)

### `apiClient.js`

A pre-configured **Axios** instance:

- `baseURL` from `import.meta.env.VITE_API_URL`
- Request interceptor: attaches `Authorization: Bearer <token>` if present
- Response interceptor: centralized error logging / 401 handling

### Module split

| Module        | Functions (typical)                                              |
| ------------- | ---------------------------------------------------------------- |
| `auth.js`     | `login`, `register`, `getCurrentUser`, `logout`                  |
| `workouts.js` | `getWorkouts`, `createWorkout`, `updateWorkout`, `deleteWorkout` |
| `goals.js`    | `getGoals`, `createGoal`, `updateGoal`, `deleteGoal`             |

`api/index.js` re-exports them so consumers can do:

```js
import { login, getWorkouts, getGoals } from "../api";
```

---

## 7. UI Component Layer

### Design philosophy

- **Atomic design** — small primitives in `components/ui/` (`Button`, `Input`, `Card`, `Modal`, `Badge`, `ProgressBar`, `Spinner`, `EmptyState`).
- **Composable** — pages compose primitives, never duplicate markup.
- **Tailwind-styled** — no external CSS-in-JS; utility classes only.
- **Accessible** — semantic HTML + Lucide icons + visible focus states.

### `Layout.jsx`

Wraps all protected pages:

- Renders `Navbar` (logo, nav links, user menu, logout).
- Renders `<Outlet />`-style `children` (page content) inside a max-width container with responsive padding.

---

## 8. Data Flow (Example: Creating a Workout)

```
┌──────────────────┐
│  WorkoutsPage    │
│  (form submit)   │
└────────┬─────────┘
         │ 1. createWorkout(payload)
         ▼
┌──────────────────┐
│  api/workouts.js │  2. axios POST  /api/workouts
└────────┬─────────┘
         │ 3. baseURL + Bearer token
         ▼
┌──────────────────┐
│  apiClient.js    │  4. Interceptor injects token
└────────┬─────────┘
         │
         ▼
   Spring Boot REST API
         │
         ▼ (response)
┌──────────────────┐
│  WorkoutsPage    │  5. setState([...workouts, new])
│  re-renders list │
└──────────────────┘
```

---

## 9. Environment Configuration

`.env` (at project root, **never commit secrets in production**):

```env
VITE_API_URL=http://localhost:8080/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Accessed in code via `import.meta.env.VITE_*`.

---

## 10. Build & Run

```bash
# Install
npm install

# Development (HMR on http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## 11. Security Considerations

- JWT stored in `localStorage` (acceptable for this project; for higher security, prefer httpOnly cookies set by the backend).
- All API calls are routed through a single `apiClient` so auth headers are never missed.
- `ProtectedRoute`/`PublicRoute` prevent UI leakage of authenticated screens.
- No sensitive data is logged in production.

---

## 12. Extensibility

Adding a new feature is straightforward:

1. **API** — create `src/api/<feature>.js` using the shared `apiClient`.
2. **UI primitives** — extend `components/ui/` if new atoms are needed.
3. **Page** — add `src/pages/<feature>/<Feature>Page.jsx`.
4. **Route** — register in `App.jsx` under a `ProtectedRoute`.
5. **Navbar link** — add a navigation entry for discoverability.

---

## 13. Summary

| Concern              | Solution                                       |
| -------------------- | ---------------------------------------------- |
| Component reuse      | `components/ui/` atomic primitives             |
| Page composition     | `components/layout/Layout.jsx` shell           |
| Routing & guards     | `routes/` + central `App.jsx` route table      |
| Authentication state | `context/AuthContext.jsx`                      |
| API access           | `api/` modules over shared `apiClient` (Axios) |
| Styling              | Tailwind utility classes, no runtime CSS-in-JS |
| Build / DX           | Vite + ESLint + React Fast Refresh             |

This architecture keeps the codebase **predictable, testable, and easy to scale** as new fitness-tracking features (nutrition, sleep, social, analytics, etc.) are added.
