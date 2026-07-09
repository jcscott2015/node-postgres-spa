import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

export function ProtectedRoute() {
  const status = useSelector((state: RootState) => state.auth.status);

  if (status === "checking") {
    return (
      <div className="card" style={{ maxWidth: 520, margin: "2rem auto" }}>
        <p className="helper">Checking your session…</p>
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
