// src/App.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import type { RootState } from "@/app/store";
import {
  appendMessage,
  setWebSocketError,
  setWebSocketStatus,
} from "@/app/websocketSlice";
import { NotificationBanner } from "@/components/NotificationBanner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { CallbackPage } from "@/pages/CallbackPage";
import { UserFormPage } from "@/pages/UserFormPage";
import { UsersPage } from "@/pages/UsersPage";
import { createSocketConnection } from "@/app/websocketClient";
import { performLogout } from "@/app/logout";

function LogoutRoute({
  dispatch,
  navigate,
}: {
  dispatch: (action: import("@reduxjs/toolkit").UnknownAction) => void;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}) {
  useEffect(() => {
    void performLogout({ dispatch, navigate, logout: async () => undefined });
  }, [dispatch, navigate]);
  return <Navigate to="/login" replace />;
}

export function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      dispatch(setWebSocketStatus("idle"));
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";

    const host =
      window.location.port === "5173" ? "localhost:5000" : window.location.host;

    dispatch(setWebSocketStatus("connecting"));

    const socket = createSocketConnection(token, host, protocol);

    socket.onopen = () => dispatch(setWebSocketStatus("open"));

    socket.onmessage = (event) => {
      dispatch(appendMessage(event.data));
    };

    socket.onerror = () => dispatch(setWebSocketError("Socket error"));
    socket.onclose = () => dispatch(setWebSocketStatus("closed"));

    return () => {
      socket.close();
      dispatch(setWebSocketStatus("idle"));
    };
  }, [dispatch, token]);

  return (
    <div className="app-shell">
      <div className="topbar">
        <div>
          <strong>OAuth user manager</strong>
          <div className="helper">
            Token-based access for login, users, and websocket updates
          </div>
        </div>
        <nav className="nav-links">
          {token ? <Link to="/users">List users</Link> : null}
          {token ? <Link to="/users/new">Add user</Link> : null}
          {token ? <Link to="/logout">Logout</Link> : null}
        </nav>
      </div>
      {location.pathname !== "/login" ? <NotificationBanner /> : null}
      <main className="content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route
            path="/logout"
            element={<LogoutRoute dispatch={dispatch} navigate={navigate} />}
          />
          <Route element={<ProtectedRoute />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/new" element={<UserFormPage />} />
            <Route path="/users/:id/edit" element={<UserFormPage />} />
          </Route>
          <Route
            path="*"
            element={<Navigate to={token ? "/users" : "/login"} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
