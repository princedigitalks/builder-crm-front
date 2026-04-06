import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  builder: any | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getInitialToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('builder_token');
};

const initialState: AuthState = {
  user: null,
  builder: null,
  token: getInitialToken(),
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.builder = action.payload.builder;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('builder_token', action.payload.token);
        // Set cookie for middleware to see
        document.cookie = `builder_token=${action.payload.token}; path=/; max-age=86400; SameSite=Lax`;
      }
    },
    logout: (state) => {
      state.user = null;
      state.builder = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('builder_token');
        // Remove cookie
        document.cookie = "builder_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
