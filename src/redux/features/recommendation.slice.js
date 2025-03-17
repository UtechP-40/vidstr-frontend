import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "sonner";

export const fetchRecommendations = createAsyncThunk(
    "recommendations/fetch",
    async ({ limit = 20, page = 1,currentVideoId }, { rejectWithValue, getState }) => {
        try {
            const { SelectedCategory } = getState().recommendations;
            const response = await axiosInstance.get('/recommendations', {
                params: { 
                    limit, 
                    page,
                    category: SelectedCategory.name === 'All' ? null : SelectedCategory._id,
                    currentVideoId:currentVideoId || null
                }
            });
            return response.data;
        } catch (error) {
            toast.error("Failed to fetch recommendations");
            return rejectWithValue(error.response?.data || "Failed to fetch recommendations");
        }
    }
);

export const trackVideoAction = createAsyncThunk(
    "recommendations/track",
    async ({ videoId, action }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/recommendations/track', {
                videoId,
                action
            });
            return response.data;
        } catch (error) {
            toast.error("Failed to track video action");
            return rejectWithValue(error.response?.data || "Failed to track video action");
        }
    }
);

const recommendationSlice = createSlice({
    name: "recommendations",
    initialState: {
        recommendations: [],
        SelectedCategory:"All",
        isLoading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalVideos: 0
    },
    reducers: {
        resetRecommendations: (state) => {
            state.recommendations = [];
            state.currentPage = 1;
            state.totalPages = 1;
            state.totalVideos = 0;
        },
        setSelectedCategory: (state, action) => {
            state.SelectedCategory = action.payload;
            state.recommendations = [];
            state.currentPage = 1;
            state.totalPages = 1;
            state.totalVideos = 0;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecommendations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.recommendations = action.payload.data.videos;
                state.currentPage = action.payload.data.currentPage;
                state.totalPages = action.payload.data.totalPages;
                state.totalVideos = action.payload.data.totalVideos;
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { resetRecommendations,setSelectedCategory } = recommendationSlice.actions;
export default recommendationSlice.reducer;