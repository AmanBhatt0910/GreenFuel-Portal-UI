import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Determine if we're in production environment
const isProduction = process.env.NODE_ENV === 'production' || 
  (typeof window !== 'undefined' && (
    window.location.hostname === 'sugamgreenfuel.in' ||
    window.location.hostname.includes('sugamgreenfuel')
  ));

// Determine the base URL based on environment
const getBaseUrl = () => {
  // In production, always use the production URL
  if (isProduction) {
    return 'http://api.sugamgreenfuel.in';
  }
  
  // Otherwise, use environment variable or fallback
  return process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000';
};

const baseURL = getBaseUrl();
// console.log('NODE_ENV:', process.env.NODE_ENV);
// console.log('isProduction:', isProduction);
// console.log('Axios instance using base URL:', baseURL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
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

      const status = error.response?.status;
      const errorData: any = error.response?.data;

      /*
      ✅ IGNORE harmless 404 cases
      */
      if (
        status === 404 &&
        errorData &&
        typeof errorData === "object" &&
        (
          errorData.error === "No approval requests found." ||
          errorData.error === "No pending approvals found." ||
          errorData.error === "No records found."
        )
      ) {
        return Promise.reject({
          isHandledEmpty: true,
          response: error.response,
        });
      }

      /*
      Handle 401 token refresh
      */
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const authTokenString = localStorage.getItem("authToken");

          if (authTokenString) {
            const authToken = JSON.parse(authTokenString);

            if (authToken?.refreshToken) {
              const refreshResponse = await axios.post(
                `${baseURL}/auth/token/refresh/`,
                { refresh: authToken.refreshToken }
              );

              const newToken = refreshResponse.data;

              localStorage.setItem("authToken", JSON.stringify(newToken));

              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${newToken.access}`,
              };

              return axiosInstance(originalRequest);
            }
          }
        } catch (refreshError) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userInfo");

          window.location.href = "/auth/login";
        }
      }

      return Promise.reject(error);
    }
  );

export default axiosInstance;
