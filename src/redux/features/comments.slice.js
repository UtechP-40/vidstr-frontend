import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';

// Async thunks for comments CRUD
export const fetchVideoComments = createAsyncThunk(
    'comments/fetchVideoComments',
    async (videoId, { rejectWithValue }) => {
        try {
            const cleanVideoId = String(videoId).trim();
            const response = await axiosInstance.get(`/comments/${cleanVideoId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
        }
    }
);

export const addComment = createAsyncThunk(
    'comments/addComment',
    async ({videoId, content}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/comments/${videoId}`, { content });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
        }
    }
);

export const updateComment = createAsyncThunk(
    'comments/updateComment',
    async ({commentId, content}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/comments/${commentId}`, { content });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
        }
    }
);

export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async ({commentId,videoId}, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/comments/${commentId}`);
            return commentId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
        }
    }
);

// Async thunks for comment interactions
export const toggleCommentLike = createAsyncThunk(
    'comments/toggleLike',
    async (commentId, { rejectWithValue }) => {
        if (!commentId) {
            return rejectWithValue('Comment ID is required');
        }
        try {
            const response = await axiosInstance.post(`/comments/${commentId}/like`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
        }
    }
);

// Change this thunk
export const toggleCommentDislike = createAsyncThunk(
    'comments/toggleDislike',
    async (commentId, { rejectWithValue }) => {  // Only accept commentId parameter
        if (!commentId) {
            return rejectWithValue('Comment ID is required');
        }
        try {
            const response = await axiosInstance.post(`/comments/${commentId}/dislike`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle dislike');
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
            // Fetch comments cases
            .addCase(fetchVideoComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVideoComments.fulfilled, (state, action) => {
                state.loading = false;
                // Ensure unique comments by using Set
                const uniqueComments = Array.from(
                    new Map(action.payload.map(comment => [comment._id, comment])).values()
                );
                state.comments = uniqueComments;
                state.error = null;
            })
            // Add comment cases
            .addCase(addComment.fulfilled, (state, action) => {
                // Check if comment already exists
                const exists = state.comments.some(comment => comment._id === action.payload._id);
                if (!exists) {
                    state.comments.unshift(action.payload);
                }
                state.error = null;
            })
            // Update comment cases
            .addCase(updateComment.fulfilled, (state, action) => {
                const index = state.comments.findIndex(
                    comment => comment._id === action.payload._id
                );
                if (index !== -1) {
                    state.comments[index] = action.payload;
                }
            })
            // Delete comment cases
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(
                    comment => comment._id !== action.payload
                );
            })
            // Toggle like/dislike cases
            .addCase(toggleCommentLike.fulfilled, (state, action) => {
                const index = state.comments.findIndex(
                    comment => comment._id === action.payload.commentId
                );
                if (index !== -1) {
                    state.comments[index] = {
                        ...state.comments[index],
                        isLiked: action.payload.isLiked,
                        isDisliked: action.payload.isDisliked,
                        likesCount: action.payload.likesCount,
                        dislikesCount: action.payload.dislikesCount
                    };
                }
            })
            .addCase(toggleCommentDislike.fulfilled, (state, action) => {
                const index = state.comments.findIndex(
                    comment => comment._id === action.payload.commentId
                );
                if (index !== -1) {
                    state.comments[index] = {
                        ...state.comments[index],
                        isLiked: action.payload.isLiked,
                        isDisliked: action.payload.isDisliked,
                        likesCount: action.payload.likesCount,
                        dislikesCount: action.payload.dislikesCount
                    };
                }
            })
            // Handle all rejected cases
            .addMatcher(
                action => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.error = action.payload;
                }
            );
    }
});

export default commentsSlice.reducer;
