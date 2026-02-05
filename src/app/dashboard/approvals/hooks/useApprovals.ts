import { useState, useEffect, useCallback } from "react";
import useAxios from "@/app/hooks/use-axios";
import {
  ApprovalForm,
  UserInfo,
  EnrichedApprovalForm,
} from "../components/interfaces";

interface UseApprovalsProps {
  initialFilter?: string;
}

interface UseApprovalsReturn {
  forms: EnrichedApprovalForm[];
  loading: boolean;
  error: Error | null;
  filter: string;
  setFilter: (filter: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredForms: EnrichedApprovalForm[];
  refreshApprovals: () => Promise<void>;
  assetDetail: (formId: number) => Promise<void>;
  // Pagination properties
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  // Pagination functions
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
}

/**
 * useApprovals Hook
 *
 * A custom hook for managing approval request data in the application.
 * This hook handles fetching, filtering, and searching approval forms,
 * as well as managing the loading and error states.
 *
 * Features:
 * - Fetches approval forms data from API
 * - Provides filtering by status and date range
 * - Enables searching by form fields (title, id, etc.)
 * - Manages loading, error, and empty states
 * - Supports view switching between table and list
 * - Handles pagination of results
 *
 * @returns {Object} The approval state and control functions
 * @returns {Array<EnrichedApprovalForm>} returns.forms - The filtered approval forms
 * @returns {boolean} returns.loading - Whether data is being fetched
 * @returns {string|null} returns.error - Error message if fetch failed
 * @returns {Object} returns.filters - Current filter settings
 * @returns {Function} returns.setFilters - Function to update filters
 * @returns {string} returns.searchTerm - Current search term
 * @returns {Function} returns.setSearchTerm - Function to update search
 * @returns {string} returns.viewMode - Current view mode (table/list)
 * @returns {Function} returns.setViewMode - Function to switch view modes
 */
export default function useApprovals({
  initialFilter = "all",
}: UseApprovalsProps = {}): UseApprovalsReturn {
  const [forms, setForms] = useState<EnrichedApprovalForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState("");
  const [userCache, setUserCache] = useState<Record<string, UserInfo>>({});
  const [departmentCache, setDepartmentCache] = useState<
    Record<string, string>
  >({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const api = useAxios();

  // Fetch user details by ID
  const fetchUserDetails = useCallback(
    async (userId: string | number): Promise<UserInfo> => {
      const userIdStr = String(userId);

      // Check cache first
      if (userCache[userIdStr]) {
        return userCache[userIdStr];
      }

      try {
        const response = await api.get(`/userInfo/${userIdStr}/`);
        const userData = response.data;
        const userInfo: UserInfo = {
          id: Number(userIdStr),
          name: userData.name || userData.username || userIdStr,
          email: userData.email || "No email available",
        };

        // Update cache
        setUserCache((prev) => ({
          ...prev,
          [userIdStr]: userInfo,
        }));

        return userInfo;
      } catch (err) {
        console.error(`Error fetching user details for ID ${userId}:`, err);
        return {
          id: Number(userIdStr),
          name: String(userId),
          email: "No email available",
        };
      }
    },
    [api, userCache],
  );

  const assetDetail = async (formId: number) => {
    try {
      await api.get(`/approval-items?form_id=${formId}/`);
    } catch {
      // Error handling
    }
  };

  // Fetch department details by ID
  const fetchDepartmentDetails = useCallback(
    async (deptId: string | number) => {
      const deptIdStr = String(deptId);

      // Check cache first
      if (departmentCache[deptIdStr]) {
        return departmentCache[deptIdStr];
      }

      try {
        const response = await api.get(`/departments/${deptIdStr}/`);
        const deptName = response.data.name || deptIdStr;

        // Update cache
        setDepartmentCache((prev) => ({
          ...prev,
          [deptIdStr]: deptName,
        }));

        return deptName;
      } catch (err) {
        console.error(
          `Error fetching department details for ID ${deptId}:`,
          err,
        );
        return String(deptId); // Return ID as fallback
      }
    },
    [api, departmentCache],
  );

  // Enrich approval data with names
  const enrichApprovalData = useCallback(
    async (approvals: ApprovalForm[]) => {
      const enrichedData = await Promise.all(
        approvals.map(async (form) => {
          const userInfo = await fetchUserDetails(form.user);
          const departmentName = await fetchDepartmentDetails(form.department);

          return {
            ...form,
            user_name: userInfo.name,
            user_email: userInfo.email,
            department_name: departmentName,
          } as EnrichedApprovalForm;
        }),
      );

      return enrichedData;
    },
    [fetchUserDetails, fetchDepartmentDetails],
  );

  const fetchApprovals = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);

        // Fetch approval requests with pagination
        const response = await api.get(
          `/approval-requests/?page=${page}&page_size=${pageSize}`,
        );

        let approvalRequests: ApprovalForm[] = [];
        let total = 0;

        // Handle both paginated and raw array responses
        if (Array.isArray(response.data)) {
          approvalRequests = response.data;
          total = response.data.length;
        } else if (response.data && response.data.results) {
          approvalRequests = response.data.results;
          total = response.data.count || 0;
        }

        setTotalCount(total);
        setTotalPages(Math.ceil(total / pageSize));

        // Enrich the approval requests with user and department names
        const enrichedForms = await enrichApprovalData(approvalRequests);

        setForms(enrichedForms);
        setCurrentPage(page);
      } catch (err) {
        console.error("Error fetching approvals:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch approvals"),
        );
      } finally {
        setLoading(false);
      }
    },
    [api, pageSize, enrichApprovalData],
  );

  useEffect(() => {
    fetchApprovals(1); // Start with page 1
  }, [pageSize, fetchApprovals]); // Refetch when page size changes

  // Pagination functions
  const nextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      fetchApprovals(newPage);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      fetchApprovals(newPage);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchApprovals(page);
    }
  };

  // Reset to first page when filter or search changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      fetchApprovals(1);
    }
  }, [filter, searchTerm, currentPage, fetchApprovals]);

  // Computed pagination properties
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Filter forms based on status and search term
  const filteredForms = forms.filter((form) => {
    // Status filter
    const statusMatch =
      filter === "all" || form.status.toLowerCase() === filter.toLowerCase();

    // Search filter (case insensitive)
    const search = searchTerm.toLowerCase();
    const searchMatch =
      searchTerm === "" ||
      (form.budget_id?.toLowerCase() || String(form.id).toLowerCase()).includes(
        search,
      ) ||
      (
        form.user_name?.toLowerCase() || String(form.user).toLowerCase()
      ).includes(search) ||
      (
        form.department_name?.toLowerCase() ||
        String(form.department).toLowerCase()
      ).includes(search) ||
      form.approval_category.toLowerCase().includes(search);

    return statusMatch && searchMatch;
  });

  return {
    forms,
    loading,
    error,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    filteredForms,
    refreshApprovals: () => fetchApprovals(currentPage),
    assetDetail,
    // Pagination properties
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    // Pagination functions
    nextPage,
    previousPage,
    goToPage,
  };
}
