import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import platformsReducer from '../features/platforms/platformsSlice';
import logsReducer, { addLog } from '../features/logs/logsSlice';

const loggerMiddleware = store => next => action => {
  // Prevent infinite loops by avoiding logging actions dispatched by the logs slice itself
  if (action && typeof action === 'object' && action.type && !action.type.startsWith('logs/')) {
    try {
      store.dispatch(addLog({
        id: `log-${Date.now()}-${Math.random()}`,
        type: action.type,
        timestamp: new Date().toLocaleTimeString(),
        // Safeguard payload cloning for DevTools visualization
        payload: action.payload ? JSON.parse(JSON.stringify(action.payload)) : null
      }));
    } catch (e) {
      // Fallback for non-serializable actions
    }
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
    logs: logsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware)
});
