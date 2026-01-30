import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    try {
      const token = Cookies.get('token');
      const userCookie = Cookies.get('user');
      if (token && userCookie && userCookie !== 'undefined') {
        const user = JSON.parse(userCookie);
        return {
          user: user,
          token: token,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        };
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
      Cookies.remove('token');
      Cookies.remove('user');
    }
  }
  return {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      console.log(action);
      // Set cookies for 32 hours (32/24 days)
      const expires = 32 / 24;
      Cookies.set('token', action.payload.token, { expires });
      Cookies.set('user', JSON.stringify(action.payload.user), { expires });
      return state;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove('token');
      Cookies.remove('user');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    hydrate: (state) => {
      if (typeof window !== 'undefined') {
        const token = Cookies.get('token');
        const userCookie = Cookies.get('user');
        if (token && userCookie && userCookie !== 'undefined') {
          state.token = token;
          state.user = JSON.parse(userCookie);
          state.isAuthenticated = true;
        }
      }
    },
  },
});

export const { setUser, logout, setLoading, setError, hydrate } = authSlice.actions;
export default authSlice.reducer;
