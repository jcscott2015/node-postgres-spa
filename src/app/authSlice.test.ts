import { describe, expect, it } from "vitest";
import reducer, { clearAuth, setAuth, setAuthChecking } from "@/app/authSlice";

describe("auth slice", () => {
  it("stores an authenticated user", () => {
    const state = reducer(undefined, setAuth({ username: "demo" }));
    expect(state.status).toBe("authenticated");
    expect(state.username).toBe("demo");
  });

  it("marks auth as checking", () => {
    const state = reducer(undefined, setAuthChecking());
    expect(state.status).toBe("checking");
  });

  it("clears auth state", () => {
    const state = reducer(
      { status: "authenticated", username: "demo", error: null },
      clearAuth(),
    );
    expect(state.status).toBe("unauthenticated");
    expect(state.username).toBeNull();
  });
});
