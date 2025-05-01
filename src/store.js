import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  user: null,
  token: null,
  role: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.error = null;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;

// Add this function to restore auth state from localStorage
export function initializeAuthFromStorage(dispatch, loginSuccess) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const role = localStorage.getItem('role');
  if (token && user && role) {
    dispatch(loginSuccess({ user, token, role }));
  }
} 