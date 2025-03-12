import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "sonner";

export const fetchRecommendations = createAsyncThunk(
    "recommendations/fetch",
    async ({ limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/recommendations?limit=${limit}`);
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
            await axiosInstance.post("/recommendations/track", { videoId, action });
            return { videoId, action };
        } catch (error) {
            console.error("Failed to track video action");
            return rejectWithValue(error.response?.data);
        }
    }
);

const recommendationSlice = createSlice({
    name: "recommendations",
    initialState: {
        recommendations: [],
        isLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecommendations.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.recommendations = action.payload.data;
                state.isLoading = false;
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export default recommendationSlice.reducer;