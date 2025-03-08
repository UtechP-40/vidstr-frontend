import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios.js';

// Define the initial state
const initialState = {
  videos: [],
  loading: false,
  error: null,
  totalVideos: 0,
  currentVideo: null,
  loadingCurrentVideo: false,
  networkError: false
};

export const fetchAllVideos = createAsyncThunk(
  'video/fetchAllVideos',
  async ({ page, limit, query = "", sortBy = "createdAt", sortType = "desc", userId = null }) => {
    try {
      const response = await axiosInstance.get('/videos/', {
        params: { page, limit, query, sortBy, sortType, userId },
        timeout: 10000 // 10 second timeout
      });

      console.log("Fetched videos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching videos:", error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network connection error. Please check your internet connection.');
      }
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  }
);

export const fetchCurrentVideo = createAsyncThunk(
  'video/fetchCurrentVideo',
  async (videoId) => {
    try {
      const response = await axiosInstance.get(`/videos/${videoId}`, {
        timeout: 10000 // 10 second timeout
      });

      console.log("Fetched current video:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching current video:", error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network connection error. Please check your internet connection.');
      }
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  }
);

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    clearNetworkError: (state) => {
      state.networkError = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.networkError = false;
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = state.videos.concat(action.payload.data.videos);
        state.totalVideos = action.payload.data.totalVideos;
        state.networkError = false;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.networkError = action.error.message.includes('Network connection error');
      })
      .addCase(fetchCurrentVideo.pending, (state) => {
        state.loadingCurrentVideo = true;
        state.error = null;
        state.networkError = false;
      })
      .addCase(fetchCurrentVideo.fulfilled, (state, action) => {
        state.loadingCurrentVideo = false;
        state.currentVideo = action.payload.data;
        state.networkError = false;
      })
      .addCase(fetchCurrentVideo.rejected, (state, action) => {
        state.loadingCurrentVideo = false;
        state.error = action.error.message;
        state.networkError = action.error.message.includes('Network connection error');
      });
  },
});

export const { clearNetworkError } = videoSlice.actions;
export const { reducer: videoReducer } = videoSlice;