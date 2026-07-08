# Contributing to the Participant Outcomes React UI

Thank you for taking the time to contribute! This guide covers local setup, architecture conventions, and smoke testing for the React frontend.

---

## 🛠️ Local Development Setup

We use pnpm for package management. The React app proxies API and WebSocket traffic to the backend service, so you will need the backend running separately (or via Docker Compose).

## Prerequisites

- Node.js (v20 or higher)
- pnpm
- Docker & Docker Compose (for running the full stack)

## Step 1: Clone and Install Dependencies

```bash
git clone https://github.com
cd node-postgres-react
pnpm install
```

## Step 2: Start the Full Stack

Start both the backend and the React dev server together:

```bash
docker compose up --build
```

The UI will be available at **http://localhost:3000** when running in a container, or at **http://localhost:5173** when running the Vite dev server directly:

```bash
pnpm dev
```

The Vite dev server proxies `/oauth`, `/api`, `/secure-rest`, and `/ws` to `localhost:5000`.

---

## 🏗️ Architecture & Coding Standards

All contributions must follow these rules. They are enforced in code review.

## 1. Zero Usage of the `any` Type

TypeScript strict mode is enabled. Using `any` is prohibited.

- Use `unknown` for values whose types are not yet determined.
- Use explicit interfaces for API response shapes.

## 2. Functional Components and Hooks Only

All components must be functional. No class components.

- Destructure props at the function signature.
- Keep components under 200 lines. Split into smaller components or hooks when approaching this limit.

## 3. State Management Layers

| Layer                 | Tool                    | When to use                          |
| --------------------- | ----------------------- | ------------------------------------ |
| Global app state      | Redux Toolkit slice     | Auth token, websocket status         |
| Server data / caching | RTK Query (`createApi`) | All API calls                        |
| Local UI state        | `useState`              | Component-scoped toggles, form state |

Never reach around RTK Query for raw `fetch` calls to data endpoints.

## 4. Form Handling

All forms must use **React Hook Form** with a **Zod** schema wired via `@hookform/resolvers/zod`. No manual `onChange` state management for form fields.

## 5. Routing

Routes are declared in `src/App.tsx`. Protected routes are wrapped with the `ProtectedRoute` component, which redirects unauthenticated users to `/login`.

Current routes:

| Path              | Component      | Protected |
| ----------------- | -------------- | --------- |
| `/login`          | `LoginPage`    | No        |
| `/callback`       | `CallbackPage` | No        |
| `/logout`         | `LogoutRoute`  | No        |
| `/users`          | `UsersPage`    | Yes       |
| `/users/new`      | `UserFormPage` | Yes       |
| `/users/:id/edit` | `UserFormPage` | Yes       |

## 6. Absolute Imports

Use the `@/` path alias for all internal imports (resolves to `src/`). Do not use relative paths like `../../`.

```ts
import { setAuth } from "@/app/authSlice";
```

---

## 🧪 Running Automated Tests

We use **Vitest** for unit tests.

```bash
# Run the full test suite once
pnpm test

# Run tests in watch mode during development
pnpm exec vitest
```

All test files live alongside the source they test (`*.test.ts` / `*.test.tsx`). Make sure all existing tests pass and write new tests for any added features.

---

## 🚬 How to Smoke Test Your Changes

### 🔑 Step 1: Log In via the UI

Open **http://localhost:3000** (container) or **http://localhost:5173** (dev server) and log in with:

- **Client ID**: `demo-client-id`
- **Client Secret**: `demo-client-secret`

On success you are redirected to `/users` and a Bearer token is stored in Redux state and `localStorage`.

Alternatively, obtain a token directly with curl:

```bash
curl -X POST http://localhost:3000/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=demo-client-id" \
  -d "client_secret=demo-client-secret"
```

Copy the `accessToken` value from the response.

---

### 📡 Step 2: Verify the WebSocket Connection

After logging in, the app automatically opens a WebSocket connection authenticated via the `Sec-WebSocket-Protocol` subprotocol header. The **NotificationBanner** component at the top of the page shows the current socket status (`idle`, `connecting`, `open`, `closed`, or `error`) and the latest pushed message.

To test the socket manually from the command line:

Using `wscat`:

```bash
wscat -c ws://localhost:3000/ws -s "access_token, YOUR_COPIED_JWT_ACCESS_TOKEN_HERE"
```

Using `websocat`:

```bash
websocat ws://localhost:3000/ws --header "Sec-WebSocket-Protocol: access_token, YOUR_COPIED_JWT_ACCESS_TOKEN_HERE"
```

Send a test event:

```json
{ "event": "get_user", "payload": { "id": 1 } }
```

Expected: the socket immediately returns user data. The NotificationBanner in the UI also updates with any server-pushed events.

---

### 🌐 Step 3: Smoke Test REST Operations via the UI

Use the **List Users**, **Add User**, and **Edit** / **Delete** controls in the UI, then verify via curl in a second terminal window.

#### Get all users

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_COPIED_JWT_ACCESS_TOKEN_HERE" \
  -w "\n"
```

#### Create a user (unauthenticated — should fail)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Realtime Dev", "email": "stream@example.com"}' \
  -w "\n"
```

Expected: `401 Unauthorized`.

#### Create a user (authenticated)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_COPIED_JWT_ACCESS_TOKEN_HERE" \
  -d '{"name": "Alice Developer", "email": "alice.dev@example.com"}' \
  -w "\n"
```

Expected: `201 Created`. The active WebSocket listener will emit a `user_created` event.

#### Get user by ID

```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer YOUR_COPIED_JWT_ACCESS_TOKEN_HERE" \
  -w "\n"
```

#### Update a user

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_COPIED_JWT_ACCESS_TOKEN_HERE" \
  -d '{"name": "Alice Smith", "email": "alice.smith@example.com"}' \
  -w "\n"
```

#### Delete a user

```bash
curl -X DELETE http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer YOUR_COPIED_JWT_ACCESS_TOKEN_HERE" \
  -w "\n"
```

---

### 🔒 Step 4: Smoke Test Logout

Click **Logout** in the navigation bar. The app dispatches `clearAuth`, wipes the token from `localStorage`, calls `POST /oauth/logout`, and redirects to `/login`. The WebSocket connection closes automatically because the token is cleared.

Verify the session is terminated:

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_CLEARED_TOKEN_HERE" \
  -w "\n"
```

Expected: `401 Unauthorized`.

## 🚀 Pull Request Checklist

Before opening a PR, confirm every item below:

1. [ ] `pnpm build` completes with zero TypeScript errors.
2. [ ] No `any` types introduced.
3. [ ] `pnpm test` passes with all specs green.
4. [ ] All new API calls go through RTK Query (`src/app/api.ts`).
5. [ ] All new forms use React Hook Form + Zod validation.
6. [ ] New routes are added to `src/App.tsx` and wrapped with `ProtectedRoute` if they require authentication.
7. [ ] No hardcoded visual values — use MUI theming and `sx`.
8. [ ] Local smoke tests pass against the running Docker stack.
