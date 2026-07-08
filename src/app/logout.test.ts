import { describe, expect, it, vi } from "vitest";
import { clearAuth } from "@/app/authSlice";
import { performLogout } from "@/app/logout";

describe("performLogout", () => {
  it("clears auth and redirects to login after logout", async () => {
    const dispatch = vi.fn();
    const navigate = vi.fn();
    const logout = vi.fn().mockResolvedValue(undefined);

    await performLogout({ dispatch, navigate, logout });

    expect(logout).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(clearAuth());
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });
});
