import { configureStore } from '@reduxjs/toolkit';
import planReducer from './slices/planSlice';
import authReducer from './slices/authSlice';
import staffReducer from './slices/staffSlice';
import teamReducer from './slices/teamSlice';
import leadStatusReducer from './slices/statusSlice';

export const store = configureStore({
  reducer: {
    plan: planReducer,
    auth: authReducer,
    staff: staffReducer,
    team: teamReducer,
    leadStatus: leadStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
