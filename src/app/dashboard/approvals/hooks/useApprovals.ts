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
  assestDetail: (formId: number) => Promise<void>;
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
export default function useApprovals({ initialFilter = 'all' }: UseApprovalsProps = {}): UseApprovalsReturn {
  const [forms, setForms] = useState<EnrichedApprovalForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState("");
  const [userCache, setUserCache] = useState<Record<string, UserInfo>>({});
  const [departmentCache, setDepartmentCache] = useState<Record<string, string>>({});
  const api = useAxios();

  useEffect(() => {
    const fun = async() => {
      const res = await api.get('approval-logs/');
      console.log(res);
    }

    fun();
  },[])

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

  const assestDetail =async(formId : number) =>{
    try {
      
      const response = await api.get(`/approval-items?form_id=${formId}/`);
      console.log(response)
    
    } catch (error) {
      console.log(error)
    }

  }

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
      // console.log(response.data)
      const rawData = response.data ;
      
      const enrichedData = await enrichApprovalData(rawData);
      
      // Sort by newest first (by date)
      const sortedData = enrichedData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime(); // Newest first
      });
      
      setForms(sortedData);
    } catch (err) {
      console.error("Error fetching approvals:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch approvals'));
      
      
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
      (form.budget_id?.toLowerCase() || form.id.toLowerCase()).includes(search) ||
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
    refreshApprovals: fetchApprovals,
    assestDetail
  };
} 