import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  username: string | null;
  error: string | null;
}

const initialState: AuthState = {
  token:
    typeof window !== "undefined"
      ? window.localStorage.getItem("auth-token")
      : null,
  username:
    typeof window !== "undefined"
      ? window.localStorage.getItem("auth-username")
      : null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ token: string; username: string }>) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.error = null;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("auth-token", action.payload.token);
        window.localStorage.setItem("auth-username", action.payload.username);
      }
    },
    clearAuth(state) {
      state.token = null;
      state.username = null;
      state.error = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("auth-token");
        window.localStorage.removeItem("auth-username");
      }
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setAuth, clearAuth, setAuthError } = authSlice.actions;
export default authSlice.reducer;
