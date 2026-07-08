import { describe, expect, it } from "vitest";
import reducer, { clearAuth, setAuth } from "@/app/authSlice";

describe("auth slice", () => {
  it("stores a token and username", () => {
    const state = reducer(
      undefined,
      setAuth({ token: "abc", username: "demo" }),
    );
    expect(state.token).toBe("abc");
    expect(state.username).toBe("demo");
  });

  it("clears auth state", () => {
    const state = reducer(
      { token: "abc", username: "demo", error: null },
      clearAuth(),
    );
    expect(state.token).toBeNull();
    expect(state.username).toBeNull();
  });
});
