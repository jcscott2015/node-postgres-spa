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
import { useSessionQuery } from "@/app/api";
import { createSocketConnection } from "@/app/websocketClient";
import { performLogout } from "@/app/logout";
import { clearAuth, setAuth } from "@/app/authSlice";

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
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const username = useSelector((state: RootState) => state.auth.username);
  const location = useLocation();
  const { isSuccess, isError } = useSessionQuery(undefined, {
    skip: authStatus === "unauthenticated",
    pollingInterval: authStatus === "authenticated" ? 60000 : 0,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (authStatus === "checking" && isSuccess) {
      dispatch(setAuth({ username }));
      return;
    }

    if (authStatus === "checking" && isError) {
      dispatch(clearAuth());
    }
  }, [authStatus, dispatch, isError, isSuccess, username]);

  useEffect(() => {
    if (authStatus !== "authenticated") {
      dispatch(setWebSocketStatus("idle"));
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";

    const host =
      window.location.port === "5173" ? "localhost:5000" : window.location.host;

    dispatch(setWebSocketStatus("connecting"));

    const socket = createSocketConnection(host, protocol);

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
  }, [dispatch, authStatus]);

  return (
    <div className="app-shell">
      <div className="topbar">
        <div>
          <strong>OAuth user manager</strong>
          <div className="helper">
            Cookie-based access for login, users, and websocket updates
          </div>
        </div>
        <nav className="nav-links">
          {authStatus === "authenticated" ? (
            <Link to="/users">List users</Link>
          ) : null}
          {authStatus === "authenticated" ? (
            <Link to="/users/new">Add user</Link>
          ) : null}
          {authStatus === "authenticated" ? (
            <Link to="/logout">Logout</Link>
          ) : null}
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
            element={
              <Navigate
                to={authStatus === "authenticated" ? "/users" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
