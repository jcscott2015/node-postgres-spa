import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WebSocketState {
  status: "idle" | "connecting" | "open" | "closed" | "error";
  messages: string[];
  error: string | null;
}

const initialState: WebSocketState = {
  status: "idle",
  messages: [],
  error: null,
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setWebSocketStatus(state, action: PayloadAction<WebSocketState["status"]>) {
      state.status = action.payload;
    },
    appendMessage(state, action: PayloadAction<string>) {
      state.messages = [action.payload, ...state.messages].slice(0, 8);
      state.error = null;
    },
    setWebSocketError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const {
  setWebSocketStatus,
  appendMessage,
  setWebSocketError,
  clearMessages,
} = websocketSlice.actions;
export default websocketSlice.reducer;
