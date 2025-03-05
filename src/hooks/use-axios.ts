"use client";
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, Method } from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/lib/toast-util";
import { errorCodeMap } from "@/lib/error-codes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const useAxios = () => {
  const { authToken, setTokens, isAuthenticated } = useAuth();
  const router = useRouter();

  const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000, 
  });

  axiosInstance.interceptors.request.use(
    async (req: InternalAxiosRequestConfig) => {
      // Skip auth check for login endpoint
      if (req.url && (req.url.includes('/auth/login') || req.url.includes('/auth/token'))) {
        return req;
      }
      
      // Redirect to login if not authenticated for protected endpoints
      if (!isAuthenticated) {
        router.push("/login");
        return Promise.reject("No auth token available");
      }

      if (authToken?.accessToken) {
        req.headers.Authorization = `Bearer ${authToken.accessToken}`;
      }
      return req;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          if (authToken?.refreshToken) {
            const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
              refresh: authToken.refreshToken,
            });
            
            // Adjust this based on your actual API response format
            const { access, refresh } = response.data;
            setTokens(access, refresh);
            
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          router.push("/login");
          toast.error("Your session has expired. Please log in again.");
        }
      }
      
      toast.error(errorCodeMap[error.response?.status] || "An unknown error occurred.");
      return Promise.reject(error);
    }
  );

  const request = async <T>(url: string, method: Method = "get", data?: any, config = {}): Promise<T> => {
    try {
      const response = await axiosInstance({
        url,
        method,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  };

  return request;
};

export default useAxios;
