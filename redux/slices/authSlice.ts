import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  builder: any | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getFromStorage = (key: string) => {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem(key);
  try {
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getFromStorage('builder_user'),
  builder: getFromStorage('builder_info'),
  token: typeof window !== 'undefined' ? localStorage.getItem('builder_token') : null,
  isAuthenticated: !!(typeof window !== 'undefined' && localStorage.getItem('builder_token')),
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
        localStorage.setItem('builder_user', JSON.stringify(action.payload.user));
        localStorage.setItem('builder_info', JSON.stringify(action.payload.builder));
        // Set cookie for middleware to see
        document.cookie = `builder_token=${action.payload.token}; path=/; max-age=86400; SameSite=Lax`;
      }
    },
    updateBuilder: (state, action) => {
      state.builder = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('builder_info', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      state.builder = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('builder_token');
        localStorage.removeItem('builder_user');
        localStorage.removeItem('builder_info');
        // Remove cookie
        document.cookie = "builder_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    },
  },
});

export const { setAuth, logout, updateBuilder } = authSlice.actions;
export default authSlice.reducer;
