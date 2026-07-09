# node-postgres-spa

OAuth2-protected React UI for managing user records, with real-time WebSocket updates.

Built with React 19, Vite, Redux Toolkit + RTK Query, React Hook Form + Zod, and React Router. Deployed as a static asset bundle served by Nginx inside a Chainguard container.

---

## Features

- OAuth2 login via `client_credentials` grant and an OAuth callback route (`/callback`) for authorization code exchange flows
- Authenticated browser sessions backed by `HttpOnly` + `Secure` cookies, checked on app startup
- All API requests include cookies via RTK Query
- Real-time push notifications over WebSocket, authenticated by the browser session cookie
- Full user CRUD: list, create, edit, delete
- Protected routes — unauthenticated users are redirected to `/login`
- Form validation with React Hook Form and Zod schemas

---

## Tech Stack

| Layer         | Tool                                                 |
| ------------- | ---------------------------------------------------- |
| UI framework  | React 19 + TypeScript                                |
| Build tool    | Vite 8 (SWC)                                         |
| State         | Redux Toolkit 2                                      |
| API / caching | RTK Query                                            |
| Forms         | React Hook Form 7 + Zod 4                            |
| Routing       | React Router 8                                       |
| Tests         | Vitest                                               |
| Container     | Chainguard Node (build) + Chainguard Nginx (runtime) |

---

## Routes

| Path              | Description                                  | Auth required |
| ----------------- | -------------------------------------------- | ------------- |
| `/login`          | OAuth2 login form                            | No            |
| `/callback`       | Authorization code exchange with spinner     | No            |
| `/logout`         | Clears the session and redirects to `/login` | No            |
| `/users`          | List all users                               | Yes           |
| `/users/new`      | Create a user                                | Yes           |
| `/users/:id/edit` | Edit a user                                  | Yes           |

---

## Getting Started

### Prerequisites

- Node.js v20+
- pnpm
- Docker & Docker Compose (for the full stack)

### Install dependencies

```bash
pnpm install
```

### Run the dev server

```bash
pnpm dev
```

The UI starts at **http://localhost:5173**. The Vite dev server proxies `/oauth`, `/api`, `/secure-rest`, and `/ws` to `localhost:5000` (configurable via `VITE_API_PROXY_TARGET`).

### Run the full stack with Docker

```bash
docker compose up --build
```

The UI is served at **http://localhost:3000** via Nginx. The container connects to the backend over the `oauth_shared_bridge` Docker network.

---

## Environment Variables

| Variable                | Default                 | Description                                    |
| ----------------------- | ----------------------- | ---------------------------------------------- |
| `VITE_API_PROXY_TARGET` | `http://localhost:5000` | Backend base URL for the Vite dev proxy        |
| `VITE_API_URL`          | `http://localhost:5000` | Backend base URL injected at container runtime |

---

## Scripts

```bash
pnpm dev       # Start Vite dev server
pnpm build     # Type-check and build for production
pnpm preview   # Preview the production build locally
pnpm test      # Run Vitest test suite once
```

---

## Project Structure

```
src/
  app/
    api.ts              # RTK Query API slices (authApi, usersApi)
    authSlice.ts        # Redux slice for auth token + username
    websocketSlice.ts   # Redux slice for WebSocket status + messages
    websocketClient.ts  # WebSocket factory (subprotocol auth)
    logout.ts           # Shared performLogout helper
    store.ts            # Redux store
  components/
    NotificationBanner.tsx  # WebSocket status + latest message
    ProtectedRoute.tsx      # Redirects unauthenticated users to /login
  pages/
    LoginPage.tsx       # OAuth2 login form
    CallbackPage.tsx    # Authorization code exchange with spinner
    UsersPage.tsx       # User list with edit/delete
    UserFormPage.tsx    # Create / edit user form
  App.tsx               # Router, nav, WebSocket lifecycle
```

---

## Authentication Flow

1. User submits credentials on `/login`
2. UI posts `grant_type=client_credentials` to `POST /oauth/token` (form-encoded)
3. The backend sets an `HttpOnly` session cookie and the UI marks the session authenticated in Redux
4. On refresh, the app checks the cookie-backed session before rendering protected routes
5. All subsequent API requests include cookies automatically
6. WebSocket connects using the browser session cookie
7. Logout dispatches `clearAuth`, calls `POST /oauth/logout`, and redirects to `/login`

---

## Testing

```bash
pnpm test
```

Tests cover OAuth token exchange format, session checking, auth slice actions, WebSocket connection setup, logout flow, and the callback code exchange.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for architecture conventions, coding standards, smoke test instructions, and the PR checklist.
