import { createSlice } from '@reduxjs/toolkit';

const logsSlice = createSlice({
  name: 'logs',
  initialState: [],
  reducers: {
    addLog(state, action) {
      // Prepend new log so that newest logs appear at the top. Max 30 logs.
      state.unshift(action.payload);
      if (state.length > 30) {
        state.pop();
      }
    },
    clearLogs(state) {
      return [];
    }
  }
});

export const { addLog, clearLogs } = logsSlice.actions;

export const selectAllLogs = state => state.logs;

export default logsSlice.reducer;
