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
        if (error.response?.status === 401) {
            const refreshResponse = await dispatch(refreshAccessToken());
            if (refreshResponse.payload) {
                const reply = await axiosInstance.patch("/users/refresh-token");
                return reply.data;
            }
        }
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
        window.location.href = "http://localhost:8000/api/v1/auth/google";
    } catch (error) {
        toast.error("Google login failed");
        return rejectWithValue(error.response?.data || "Google login failed");
    }
});

export const refreshAccessToken = createAsyncThunk("user/refreshAccessToken", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch("/users/refresh-token");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Token refresh failed");
    }
});

export const updateAccountDetails = createAsyncThunk("user/updateAccount", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch("/users/update-account", userData);
        toast.success("Account updated successfully!");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Update failed");
        return rejectWithValue(error.response?.data || "Update failed");
    }
});

export const changePassword = createAsyncThunk("user/changePassword", async (passwordData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/change-password", passwordData);
        toast.success("Password changed successfully!");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Password change failed");
        return rejectWithValue(error.response?.data || "Password change failed");
    }
});

export const updateAvatar = createAsyncThunk("user/updateAvatar", async (avatarFile, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        const response = await axiosInstance.patch("/users/avatar", formData);
        toast.success("Avatar updated successfully!");
        return response.data;
    } catch (error) {
        toast.error("Avatar update failed");
        return rejectWithValue(error.response?.data || "Avatar update failed");
    }
});

export const updateCoverImage = createAsyncThunk("user/updateCoverImage", async (coverFile, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("coverImage", coverFile);
        const response = await axiosInstance.patch("/users/cover-image", formData);
        toast.success("Cover image updated successfully!");
        return response.data;
    } catch (error) {
        toast.error("Cover image update failed");
        return rejectWithValue(error.response?.data || "Cover image update failed");
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
        isUpdatingAccount: false,
        isChangingPassword: false,
        isUpdatingAvatar: false,
        isUpdatingCover: false,
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

        builder
            .addCase(updateAccountDetails.pending, (state) => {
                state.isUpdatingAccount = true;
            })
            .addCase(updateAccountDetails.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isUpdatingAccount = false;
            })
            .addCase(updateAccountDetails.rejected, (state) => {
                state.isUpdatingAccount = false;
            });

        builder
            .addCase(changePassword.pending, (state) => {
                state.isChangingPassword = true;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isChangingPassword = false;
            })
            .addCase(changePassword.rejected, (state) => {
                state.isChangingPassword = false;
            });

        builder
            .addCase(updateAvatar.pending, (state) => {
                state.isUpdatingAvatar = true;
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isUpdatingAvatar = false;
            })
            .addCase(updateAvatar.rejected, (state) => {
                state.isUpdatingAvatar = false;
            });

        builder
            .addCase(updateCoverImage.pending, (state) => {
                state.isUpdatingCover = true;
            })
            .addCase(updateCoverImage.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isUpdatingCover = false;
            })
            .addCase(updateCoverImage.rejected, (state) => {
                state.isUpdatingCover = false;
            });
    },
});

export default userSlice.reducer;