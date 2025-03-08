import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "sonner";

export const signup = createAsyncThunk("user/signup", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/register", userData);
        toast.success("Signup successful!");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Signup failed");
        return rejectWithValue(error.response?.data || "Signup failed");
    }
});

export const checkAuth = createAsyncThunk("user/checkAuth", async (_, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/users/current-user");
        return response.data;
    } catch (error) {
        console.log(error);
        if (error.response?.status === 401) {
            const refreshResponse = await dispatch(refreshAccessToken());
            if (refreshResponse.payload) {
                const reply = await axiosInstance.patch("/users/refresh-token");
                return reply.data;
            }
        }
        toast.error("Authentication check failed");
        return rejectWithValue(error.response?.data || "Auth check failed");
    }
});

export const signIn = createAsyncThunk("user/signIn", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/login", credentials);
        toast.success("Login successful!");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
        return rejectWithValue(error.response?.data || "Login failed");
    }
});

export const googleSignIn = createAsyncThunk("user/googleSignIn", async (tokenId, { rejectWithValue }) => {
    try {
        // const response = await axiosInstance.get("/auth/google", { tokenId });
        window.location.href = "http://localhost:8000/api/v1/auth/google"
        // toast.success("Google login successful!"); 
        // return response.data;
    } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Google login failed");
        return rejectWithValue(error.response?.data || "Google login failed");
    }
});

export const refreshAccessToken = createAsyncThunk("user/refreshAccessToken", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch("/users/refresh-token");
        toast.success("Token refreshed successfully!");
        return response.data;
    } catch (error) {
        toast.error("Token refresh failed");
        return rejectWithValue(error.response?.data || "Token refresh failed");
    }
});
const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        isCheckingAuth: false,
        isLoggingIn: false,
        isRegistring: false,
        isRefreshingToken: false,
        isGoogleSigningIn: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state) => {
                state.isLoggingIn = true;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isLoggingIn = false;
            })
            .addCase(signIn.rejected, (state) => {
                state.isLoggingIn = false;
            });

        builder
            .addCase(googleSignIn.pending, (state) => {
                state.isGoogleSigningIn = true;
            })
            .addCase(googleSignIn.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isGoogleSigningIn = false;
            })
            .addCase(googleSignIn.rejected, (state) => {
                state.isGoogleSigningIn = false;
            });

        builder
            .addCase(signup.pending, (state) => {
                state.isRegistring = true;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isRegistring = false;
            })
            .addCase(signup.rejected, (state) => {
                state.isRegistring = false;
            });

        builder
            .addCase(checkAuth.pending, (state) => {
                state.isCheckingAuth = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isCheckingAuth = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isCheckingAuth = false;
            });

        builder
            .addCase(refreshAccessToken.pending, (state) => {
                state.isRefreshingToken = true;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isRefreshingToken = false;
            })
            .addCase(refreshAccessToken.rejected, (state) => {
                state.isRefreshingToken = false;
            });
    },
});

export default userSlice.reducer;