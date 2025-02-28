import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import { errorCodeMap } from "@/lib/error-codes";

interface UseAxiosResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: () => void;
}

export const useAxios = <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: any = null
): UseAxiosResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance({
        method,
        url,
        data: body,
      });
      setData(response.data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      const status = err?.response?.status;
      const mappedError = errorCodeMap[status] || "An unknown error occurred.";
      setError(mappedError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, method, body]);

  return { data, error, loading, refetch: fetchData };
};
