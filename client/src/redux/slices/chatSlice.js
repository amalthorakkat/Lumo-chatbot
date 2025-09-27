
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessions: [],
  currentSessionId: null,
  messages: [],
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSessions(state, action) {
      state.sessions = action.payload;
    },
    setCurrentSession(state, action) {
      state.currentSessionId = action.payload.sessionId;
      state.messages = action.payload.messages;
    },
    clearMessages(state) {
      state.messages = [];
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    updateSessionTitle(state, action) {
      const { sessionId, title } = action.payload;
      const session = state.sessions.find((s) => s._id === sessionId);
      if (session) {
        session.title = title;
      }
    },
  },
});

export const {
  setSessions,
  setCurrentSession,
  clearMessages,
  addMessage,
  setLoading,
  updateSessionTitle,
} = chatSlice.actions;

export default chatSlice.reducer;