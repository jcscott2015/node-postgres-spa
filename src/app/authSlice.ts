import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  status: "checking" | "authenticated" | "unauthenticated";
  username: string | null;
  error: string | null;
}

const initialState: AuthState = {
  status: "checking",
  username: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ username: string | null }>) {
      state.status = "authenticated";
      state.username = action.payload.username;
      state.error = null;
    },
    setAuthChecking(state) {
      state.status = "checking";
      state.error = null;
    },
    clearAuth(state) {
      state.status = "unauthenticated";
      state.username = null;
      state.error = null;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setAuth, setAuthChecking, clearAuth, setAuthError } =
  authSlice.actions;
export default authSlice.reducer;
