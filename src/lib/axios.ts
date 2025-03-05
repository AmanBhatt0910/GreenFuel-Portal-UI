import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.3:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    if (typeof window !== "undefined") {
      const authTokenString = localStorage.getItem("authToken");

      if (authTokenString) {
        try {
          const authToken = JSON.parse(authTokenString);

          if (authToken?.accessToken) {
            config.headers.Authorization = `Bearer ${authToken.accessToken}`;
          }
        } catch (error) {
          console.error("Error parsing auth token from localStorage:", error);
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh and error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token from localStorage
        const authTokenString = localStorage.getItem("authToken");

        if (authTokenString) {
          const authToken = JSON.parse(authTokenString);

          if (authToken?.refreshToken) {
            // Call refresh token API endpoint
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token/`,
              { refreshToken: authToken.refreshToken }
            );

            const { accessToken, refreshToken } = response.data;

            // Update token in localStorage
            localStorage.setItem(
              "authToken",
              JSON.stringify({ accessToken, refreshToken })
            );

            // Update Authorization header
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            } else {
              originalRequest.headers = {
                Authorization: `Bearer ${accessToken}`,
              };
            }

            // Retry the original request with new token
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // If refresh token fails, logout the user
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        // Redirect to login page if in browser context
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    }

    // If error is not related to auth or refresh token failed
    return Promise.reject(error);
  }
);

export default axiosInstance;
