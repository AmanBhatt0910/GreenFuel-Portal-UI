import { useState, useEffect, useCallback } from 'react';
import useAxios from '@/app/hooks/use-axios';
import { ApprovalForm, UserInfo, EnrichedApprovalForm } from '../components/interfaces';

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
}

// Mock data for fallback/development
const mockForms: ApprovalForm[] = [
  {
    id: "REQ-2025-006",
    user: "Aman Bhatt",
    business_unit: "BU001",
    department: "HR",
    designation: "Senior Manager",
    date: "2025-03-10T14:30:00.000Z",
    total: 1200,
    reason: "Remote work requirement",
    policy_agreement: true,
    initiate_dept: "2",
    status: "Pending",
    benefit_to_organisation: "Increased productivity",
    approval_category: "Hardware",
    approval_type: "New Request",
    notify_to: "3",
    current_level: 2,
    max_level: 3,
    rejected: false,
    rejection_reason: null,
    budget_id: "BU001",
  },
  {
    id: "REQ-2025-007",
    user: "Priya Singh",
    business_unit: "BU002",
    department: "Engineering",
    designation: "Lead Engineer",
    date: "2025-03-11",
    total: 800,
    reason: "Current equipment malfunctioning",
    policy_agreement: true,
    initiate_dept: "3",
    status: "Pending",
    benefit_to_organisation: "Improved productivity with proper equipment",
    approval_category: "Hardware",
    approval_type: "Replacement",
    notify_to: "5",
    current_level: 1,
    max_level: 3,
    rejected: false,
    rejection_reason: null,
    budget_id: "BU002",
  },
  {
    id: "REQ-2025-008",
    user: "Rahul Verma",
    business_unit: "BU003",
    department: "Marketing",
    designation: "Marketing Manager",
    date: "2025-03-12",
    total: 3500,
    reason: "New content creation requirements",
    policy_agreement: true,
    initiate_dept: "4",
    status: "Pending",
    benefit_to_organisation: "Enhanced marketing materials and brand visibility",
    approval_category: "Software & Equipment",
    approval_type: "New Request",
    notify_to: "6",
    current_level: 3,
    max_level: 3,
    rejected: false,
    rejection_reason: null,
    budget_id: "BU003",
  },
];

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
export default function useApprovals({ initialFilter = 'all' }: UseApprovalsProps = {}): UseApprovalsReturn {
  const [forms, setForms] = useState<EnrichedApprovalForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState("");
  const [userCache, setUserCache] = useState<Record<string, UserInfo>>({});
  const [departmentCache, setDepartmentCache] = useState<Record<string, string>>({});
  const api = useAxios();

  // Fetch user details by ID
  const fetchUserDetails = async (userId: string | number): Promise<UserInfo> => {
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
        email: userData.email || 'No email available'
      };
      
      // Update cache
      setUserCache(prev => ({
        ...prev,
        [userIdStr]: userInfo
      }));
      
      return userInfo;
    } catch (err) {
      console.error(`Error fetching user details for ID ${userId}:`, err);
      return { 
        id: Number(userIdStr),
        name: String(userId), 
        email: 'No email available'
      };
    }
  };

  // Fetch department details by ID
  const fetchDepartmentDetails = async (deptId: string | number) => {
    const deptIdStr = String(deptId);
    
    // Check cache first
    if (departmentCache[deptIdStr]) {
      return departmentCache[deptIdStr];
    }
    
    try {
      const response = await api.get(`/departments/${deptIdStr}/`);
      const deptName = response.data.name || deptIdStr;
      
      // Update cache
      setDepartmentCache(prev => ({
        ...prev,
        [deptIdStr]: deptName
      }));
      
      return deptName;
    } catch (err) {
      console.error(`Error fetching department details for ID ${deptId}:`, err);
      return String(deptId); // Return ID as fallback
    }
  };

  // Enrich approval data with names
  const enrichApprovalData = async (approvals: ApprovalForm[]) => {
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
      })
    );
    
    return enrichedData;
  };

  // Fetch approval requests
  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/pending-approvals/`);
      console.log(response.data)
      const rawData = response.data || mockForms;
      
      const enrichedData = await enrichApprovalData(rawData);
      setForms(enrichedData);
    } catch (err) {
      console.error("Error fetching approvals:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch approvals'));
      
      // Use mock data as fallback
      const enrichedMockData = await enrichApprovalData(mockForms);
      setForms(enrichedMockData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  // Filter forms based on status and search term
  const filteredForms = forms.filter((form) => {
    // Status filter
    const statusMatch =
      filter === "all" || form.status.toLowerCase() === filter.toLowerCase();

    // Search filter (case insensitive)
    const search = searchTerm.toLowerCase();
    const searchMatch =
      searchTerm === "" ||
      form.id.toLowerCase().includes(search) ||
      (form.user_name?.toLowerCase() || String(form.user).toLowerCase()).includes(search) ||
      (form.department_name?.toLowerCase() || String(form.department).toLowerCase()).includes(search) ||
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
    refreshApprovals: fetchApprovals
  };
} 