import type { UnknownAction } from "@reduxjs/toolkit";
import { clearAuth } from "@/app/authSlice";

interface PerformLogoutArgs {
  dispatch: (action: UnknownAction) => void;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  logout: () => Promise<unknown>;
}

export async function performLogout({
  dispatch,
  navigate,
  logout,
}: PerformLogoutArgs) {
  await logout();
  dispatch(clearAuth());
  navigate("/login", { replace: true });
}
