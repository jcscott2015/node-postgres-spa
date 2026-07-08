import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authApi } from "@/app/api";
import authReducer from "@/app/authSlice";

describe("authApi login", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends the OAuth token request as form data with client credentials", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ access_token: "abc123" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const store = configureStore({
      reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
    });

    await store.dispatch(
      authApi.endpoints.login.initiate({
        username: "demo-client-id",
        password: "demo-client-secret",
      }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [request] = fetchMock.mock.calls[0] as [Request];
    expect(request).toBeInstanceOf(Request);
    expect(request.url).toBe("http://localhost/oauth/token");
    expect(request.method).toBe("POST");
    expect(request.headers.get("Content-Type")).toBe(
      "application/x-www-form-urlencoded",
    );
    expect(request.body).toBeInstanceOf(ReadableStream);
    const bodyText = await request.text();
    expect(bodyText).toBe(
      "grant_type=client_credentials&client_id=demo-client-id&client_secret=demo-client-secret",
    );
  });
});
