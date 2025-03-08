import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';

// Async thunk for fetching video comments
export const fetchVideoComments = createAsyncThunk(
    'comments/fetchVideoComments',
    async (videoId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/comments/${videoId}`);
            console.log(response.data)
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
        }
    }
);

// Async thunk for adding a comment
export const addComment = createAsyncThunk(
    'comments/addComment',
    async ({videoId, comment}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/comments/${videoId}`, { comment });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
        }
    }
);

// Async thunk for updating a comment
export const updateComment = createAsyncThunk(
    'comments/updateComment',
    async ({commentId, comment}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/comments/c/${commentId}`, { comment });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
        }
    }
);

// Async thunk for deleting a comment
export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async (commentId, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/comments/c/${commentId}`);
            return commentId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
        }
    }
);

const commentsSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch comments
            .addCase(fetchVideoComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVideoComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
                state.error = null;
            })
            .addCase(fetchVideoComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.comments = [];
            })
            // Add comment
            .addCase(addComment.pending, (state) => {
                state.error = null;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
                state.error = null;
            })
            .addCase(addComment.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Update comment
            .addCase(updateComment.pending, (state) => {
                state.error = null;
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                const index = state.comments.findIndex(
                    comment => comment._id === action.payload._id
                );
                if (index !== -1) {
                    state.comments[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateComment.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Delete comment
            .addCase(deleteComment.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(
                    comment => comment._id !== action.payload
                );
                state.error = null;
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export default commentsSlice.reducer;
