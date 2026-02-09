import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import useAxios from "@/app/hooks/use-axios";
import {
  ApprovalForm,
  UserInfo,
  EnrichedApprovalForm,
} from "../components/interfaces";

interface UseApprovalsProps {
  initialFilter?: string;
}

export default function useApprovals({
  initialFilter = "all",
}: UseApprovalsProps = {}) {
  const [forms, setForms] = useState<EnrichedApprovalForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  const PAGE_SIZE = 10; // match backend

  const api = useAxios();
  const hasFetched = useRef(false);

  const fetchApprovals = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/approval-requests/?page=${pageNumber}`);
      const rawData: ApprovalForm[] = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

        setCount(response.data.count || 0);
        setNext(response.data.next);
        setPrevious(response.data.previous);

      const uniqueUserIds = [
        ...new Set(
          rawData.map((f) => f.user).filter((id) => id && id !== "null"),
        ),
      ];
      const uniqueDeptIds = [
        ...new Set(
          rawData.map((f) => f.department).filter((id) => id && id !== "null"),
        ),
      ];

      const userMap: Record<string, UserInfo> = {};
      const deptMap: Record<string, string> = {};

      await Promise.all(
        uniqueUserIds.map(async (id) => {
          try {
            const res = await api.get(`/userInfo/${id}/`);
            userMap[String(id)] = {
              id: Number(id),
              name: res.data.name || res.data.username || String(id),
              email: res.data.email || "",
            };
          } catch {
            userMap[String(id)] = {
              id: Number(id),
              name: `User ${id}`,
              email: "",
            };
          }
        }),
      );

      await Promise.all(
        uniqueDeptIds.map(async (id) => {
          try {
            const res = await api.get(`/departments/${id}/`);
            deptMap[String(id)] = res.data.name || String(id);
          } catch {
            deptMap[String(id)] = `Dept ${id}`;
          }
        }),
      );

      // 3. Enrich existing data
      const enriched = rawData.map((form) => ({
        ...form,
        user_name: userMap[String(form.user)]?.name || "Unknown",
        user_email: userMap[String(form.user)]?.email || "",
        department_name: deptMap[String(form.department)] || "Unknown",
      }));

      setForms(enriched as EnrichedApprovalForm[]);
    } catch (err) {
      console.error("Approvals Fetch Error:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch approvals"),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovals(page);
  }, [page]);

  // Client-side filtering and searching
  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      const statusMatch =
        filter === "all" || form.status.toLowerCase() === filter.toLowerCase();
      const search = searchTerm.toLowerCase();
      const searchMatch =
        !searchTerm ||
        form.budget_id?.toLowerCase().includes(search) ||
        String(form.id).toLowerCase().includes(search) ||
        form.user_name?.toLowerCase().includes(search) ||
        form.approval_category.toLowerCase().includes(search);

      return statusMatch && searchMatch;
    });
  }, [forms, filter, searchTerm]);

  return {
    forms,
    loading,
    error,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    filteredForms,
    refreshApprovals: fetchApprovals,

    // pagination
    page,
    setPage,
    count,
    next,
    previous,
    totalPages: Math.ceil(count / PAGE_SIZE),

    assestDetail: async (id: number) => {
      await api.get(`/approval-items?form_id=${id}/`);
    },
  };
}