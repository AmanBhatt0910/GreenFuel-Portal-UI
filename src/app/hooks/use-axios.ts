"use client";

import { jwtDecode } from "jwt-decode";
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useContext, useMemo } from "react";
import { GFContext } from "@/context/AuthContext";

type AuthToken = {
  access: string;
  refresh: string;
};

const useAxios = (): AxiosInstance => {
  const { authToken, baseURL, setAuthToken } = useContext(GFContext);
  const router = useRouter();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL,
    });

    instance.interceptors.request.use(
      async (req: InternalAxiosRequestConfig) => {
        if (!authToken) {
          router.push("/");
          return Promise.reject("No auth token available");
        }

        req.headers.Authorization = `Bearer ${authToken.access}`;

        const user = jwtDecode(authToken.access) as { exp?: number };
        const isExpired = dayjs.unix(user.exp || 0).diff(dayjs()) < 1;

        if (!isExpired) {
          return req;
        }

        try {
          const response = await axios.post<AuthToken>(
            `${baseURL}/auth/token/refresh/`,
            {
              refresh: authToken.refresh,
            }
          );

          localStorage.setItem("accessToken", JSON.stringify(response.data));
          setAuthToken(response.data);

          req.headers.Authorization = `Bearer ${response.data.access}`;

          return req;
        } catch (error) {
          console.error("Token refresh failed:", error);
          router.push("/auth/login");
          return Promise.reject(error);
        }
      }
    );

    instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error("Axios Error:", error);

        if (error.response?.status === 401) {
          router.push("/auth/login");
        } else if (error.response?.status) {
          toast.error(`Error (${error.response.status})`);
        } else {
          toast.error("Network error");
        }

        return Promise.reject(error);
      }
    );

    return instance;

  }, [authToken?.access, authToken?.refresh, baseURL]);

  return axiosInstance;
};

export default useAxios;
