import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios.js';
import { toast } from "sonner";
// Define the initial state
const initialState = {
  videos: [],
  loading: false,
  error: null,
  totalVideos: 0,
  currentVideo: null,
  loadingCurrentVideo: false,
  networkError: false,
  publishLoading: false,
  updateLoading: false,
  deleteLoading: false,
  likeLoading: false,
  dislikeLoading: false
};

export const fetchAllVideos = createAsyncThunk(
  'video/fetchAllVideos',
  async ({ page, limit, query = "", sortBy = "createdAt", sortType = "desc", userId = null }) => {
    try {
      const response = await axiosInstance.get('/videos/', {
        params: { page, limit, query, sortBy, sortType, userId },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

export const fetchCurrentVideo = createAsyncThunk(
  'video/fetchCurrentVideo',
  async (videoId) => {
    try {
      const response = await axiosInstance.get(`/videos/${videoId}`, {
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

export const publishVideo = createAsyncThunk(
  'video/publishVideo',
  async (formData) => {
    try {
      const response = await axiosInstance.post('/videos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

export const updateVideo = createAsyncThunk(
  'video/updateVideo',
  async ({ videoId, formData }) => {
    try {
      const response = await axiosInstance.patch(`/videos/${videoId}`, formData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

export const deleteVideo = createAsyncThunk(
  'video/deleteVideo',
  async (videoId) => {
    try {
      const response = await axiosInstance.delete(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

export const toggleVideoLike = createAsyncThunk(
  'video/toggleLike',
  async (videoId) => {
    try {
      const response = await axiosInstance.post(`/videos/${videoId}/like`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

export const toggleVideoDislike = createAsyncThunk(
  'video/toggleDislike',
  async (videoId) => {
    try {
      const response = await axiosInstance.post(`/videos/${videoId}/dislike`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
);

const handleError = (error) => {
  if (error.code === 'ERR_NETWORK') {
    toast.error('Network connection error. Please check your internet connection.');
    throw new Error('Network connection error. Please check your internet connection.');
  }
  if (error.response) {
    if (error.response.status === 500) {
      toast.error('Server error occurred. Please try again later.');
    }
    throw error.response.data;
  }
  throw error;
};

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
      // Fetch All Videos
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
      // Fetch Current Video
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
      })
      // Publish Video
      .addCase(publishVideo.pending, (state) => {
        state.publishLoading = true;
        state.error = null;
      })
      .addCase(publishVideo.fulfilled, (state, action) => {
        state.publishLoading = false;
        state.videos.unshift(action.payload.data);
        toast.success('Video published successfully!');
      })
      .addCase(publishVideo.rejected, (state, action) => {
        state.publishLoading = false;
        state.error = action.error.message;
      })
      // Update Video
      .addCase(updateVideo.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedVideo = action.payload.data;
        const index = state.videos.findIndex(video => video._id === updatedVideo._id);
        if (index !== -1) {
          state.videos[index] = updatedVideo;
        }
        if (state.currentVideo?._id === updatedVideo._id) {
          state.currentVideo = updatedVideo;
        }
        toast.success('Video updated successfully!');
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.error.message;
      })
      // Delete Video
      .addCase(deleteVideo.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.videos = state.videos.filter(video => video._id !== action.meta.arg);
        if (state.currentVideo?._id === action.meta.arg) {
          state.currentVideo = null;
        }
        toast.success('Video deleted successfully!');
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.error.message;
      })
      // Toggle Like
      .addCase(toggleVideoLike.pending, (state) => {
        state.likeLoading = true;
        state.error = null;
      })
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        state.likeLoading = false;
        const updatedVideo = action.payload.data;
        const index = state.videos.findIndex(video => video._id === updatedVideo._id);
        if (index !== -1) {
          state.videos[index] = updatedVideo;
        }
        if (state.currentVideo?._id === updatedVideo._id) {
          state.currentVideo = updatedVideo;
        }
      })
      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.likeLoading = false;
        state.error = action.error.message;
      })
      // Toggle Dislike
      .addCase(toggleVideoDislike.pending, (state) => {
        state.dislikeLoading = true;
        state.error = null;
      })
      .addCase(toggleVideoDislike.fulfilled, (state, action) => {
        state.dislikeLoading = false;
        const updatedVideo = action.payload.data;
        const index = state.videos.findIndex(video => video._id === updatedVideo._id);
        if (index !== -1) {
          state.videos[index] = updatedVideo;
        }
        if (state.currentVideo?._id === updatedVideo._id) {
          state.currentVideo = updatedVideo;
        }
      })
      .addCase(toggleVideoDislike.rejected, (state, action) => {
        state.dislikeLoading = false;
        state.error = action.error.message;
      });
  },
}); 

// Update these export names to match the imports
export const likeVideo = toggleVideoLike;
export const dislikeVideo = toggleVideoDislike;

export const { clearNetworkError } = videoSlice.actions;
export const { reducer: videoReducer } = videoSlice;