import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {axiosInstance} from '../../lib/axios';

export const getUserNotifications = createAsyncThunk(
  'notifications/getUserNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/notifications');
      return response.data.data; // Access the data property from ApiResponse
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch('/notifications/mark-all-read');
      return response.data.data; // Access the data property from ApiResponse
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
      return response.data.data; // Access the data property from ApiResponse
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get notifications
      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.error = null;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unexpected error occurred';
        state.notifications = [];
      })
      // Mark all as read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          isRead: true  // Changed from 'read' to 'isRead' to match the backend model
        }));
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload || 'Failed to mark all notifications as read';
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.meta.arg);
        if (index !== -1) {
          state.notifications[index] = {
            ...state.notifications[index],
            isRead: true // Change 'read' to 'isRead' to match backend
          };
        }
        state.error = null;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload || 'Failed to mark notification as read';
      });
  },
});

export default notificationSlice.reducer;
