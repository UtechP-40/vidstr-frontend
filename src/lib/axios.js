// import axios from 'axios';

// // console.log(import.meta.env);

// export const axiosInstance = axios.create({ baseURL: import.meta.env.MODE === "development" ? "http://localhost:80/api" : `${import.meta.env.VITE_BASE_URL}/api`, withCredentials: true });

// //`${import.meta.env.VITE_BASE_URL}"/api"`


import axios from 'axios';
import.meta.env.VITE_BACKEND_URL

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`; 

// Token management utility functions
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};
const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

// Axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Needed for cookies/session management
});

// Request interceptor to add tokens to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh logic
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Check if the error is due to an invalid/expired access token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = getRefreshToken();
            if (refreshToken) {
                try {
                    const refreshResponse = await axiosInstance.post('/auth/refresh-token', null, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    });

                    const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

                    // Update tokens in localStorage
                    setTokens(accessToken, newRefreshToken);

                    // Retry the original request with the new access token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Clear tokens and reject if refresh fails
                    clearTokens();
                    return Promise.reject(refreshError);
                }
            } else {
                clearTokens(); // No refresh token, clear storage
            }
        }

        // Reject all other errors
        return Promise.reject(error);
    }
);
export {axiosInstance}