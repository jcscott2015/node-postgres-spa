import { describe, expect, it, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/authSlice";
import { setAuth, setAuthError } from "@/app/authSlice";

describe("OAuth callback flow", () => {
  it("exchanges authorization code for token", async () => {
    const store = configureStore({
      reducer: { auth: authReducer },
    });

    const code = "test-auth-code";
    const mockToken = "test-access-token";

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ access_token: mockToken }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await fetch("/oauth/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state: null }),
    });

    const data = (await response.json()) as { access_token: string };
    expect(data.access_token).toBe(mockToken);

    store.dispatch(setAuth({ username: "oauth-user" }));

    const state = store.getState();
    expect(state.auth.status).toBe("authenticated");
    expect(state.auth.username).toBe("oauth-user");
  });

  it("handles callback errors", () => {
    const store = configureStore({
      reducer: { auth: authReducer },
    });

    store.dispatch(setAuthError("OAuth callback failed."));

    const state = store.getState();
    expect(state.auth.error).toBe("OAuth callback failed.");
  });
});
