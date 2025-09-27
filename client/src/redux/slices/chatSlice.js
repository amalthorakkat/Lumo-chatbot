import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  loading: false,
  currentSessionId: null,
  sessions: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setCurrentSession: (state, action) => {
      state.currentSessionId = action.payload.sessionId;
      state.messages = action.payload.messages || [];
    },
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
  },
});

export const {
  addMessage,
  setLoading,
  clearMessages,
  setCurrentSession,
  setSessions,
} = chatSlice.actions;
export default chatSlice.reducer;
