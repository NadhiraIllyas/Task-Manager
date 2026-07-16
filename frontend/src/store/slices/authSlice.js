import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Load initial authentication state from localStorage
const storedToken = localStorage.getItem('token');

const initialState = {
  user: null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/auth/login', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    // Auto-logout if session expired
    thunkAPI.dispatch(logout());
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
        };
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
        };
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;