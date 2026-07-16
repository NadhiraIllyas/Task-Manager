import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/tasks');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/tasks/${id}/status`, { status });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Update Task Status Quick Action
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index].status = action.payload.status;
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;