import { useState, useEffect, useCallback, useContext } from "react";
import useAxios from "@/app/hooks/use-axios";
import {
  ApprovalForm,
  Comment,
  UserInfo,
  Department,
  BusinessUnit,
  Designation,
  ChatRoom,
  ChatMessage,
  UserCache,
  DepartmentCache,
  BusinessUnitCache,
  DesignationCache,
} from "@/app/dashboard/approvals/components/interfaces";
import { formatDate } from "@/app/dashboard/approvals/components/utils";
import { toast } from "sonner";
import { GFContext } from "@/context/AuthContext";

interface UseApprovalDetailsProps {
  id: string;
}

interface UseApprovalDetailsReturn {
  form: ApprovalForm | null;
  enrichedForm: any;
  loading: boolean;
  error: Error | null;
  comments: Comment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  rejectionDialogOpen: boolean;
  setRejectionDialogOpen: (open: boolean) => void;
  handleApprove: () => Promise<void>;
  handleReject: () => Promise<void>;
  handleAddComment: () => Promise<void>;
  isChatLoading: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  assestDetails: any;
}

/**
 * useApprovalDetails Hook
 *
 * A custom hook for managing the detailed view of a single approval request.
 * This hook handles fetching the approval details, comments, and provides
 * functionality for actions like approving, rejecting, and commenting.
 *
 * Features:
 * - Fetches detailed information for a specific approval by ID
 * - Manages comments associated with the approval
 * - Provides functions for approving and rejecting the request
 * - Handles state for rejection dialog and reason
 * - Maintains loading and error states for all operations
 *
 * @param {string|number} id - The ID of the approval request to fetch
 * @returns {Object} The approval details state and control functions
 * @returns {EnrichedApprovalForm|null} returns.form - The approval form data
 * @returns {boolean} returns.loading - Whether data is being fetched
 * @returns {string|null} returns.error - Error message if fetch failed
 * @returns {Array<Comment>} returns.comments - Comments on the approval
 * @returns {Function} returns.addComment - Function to add a new comment
 * @returns {Function} returns.handleApprove - Function to approve the request
 * @returns {Function} returns.handleReject - Function to reject the request
 * @returns {string} returns.rejectionReason - Current rejection reason
 * @returns {Function} returns.setRejectionReason - Function to update rejection reason
 * @returns {boolean} returns.rejectionDialogOpen - Whether rejection dialog is open
 * @returns {Function} returns.setRejectionDialogOpen - Function to toggle rejection dialog
 */
export default function useApprovalDetails({
  id,
}: UseApprovalDetailsProps): UseApprovalDetailsReturn {
  const [form, setForm] = useState<ApprovalForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [assestDetails, setassestDetails] = useState();
  const [error, setError] = useState<Error | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { userInfo, setUserInfo } = useContext(GFContext);

  const [currentUserId, setCurrentUserId] = useState<number>(userInfo?.id || 0);

  // Add enriched data state
  const [enrichedForm, setEnrichedForm] = useState<any>(null);

  // Cache states
  const [userCache, setUserCache] = useState<UserCache>({});
  const [departmentCache, setDepartmentCache] = useState<DepartmentCache>({});
  const [businessUnitCache, setBusinessUnitCache] = useState<BusinessUnitCache>({});
  const [designationCache, setDesignationCache] = useState<DesignationCache>({});

  const api = useAxios();

  // Fetch user details
  const fetchUserDetails = async (userId: number): Promise<UserInfo> => {
    const userKey = userId.toString();

    // Check cache first
    if (userCache[userKey]) {
      return userCache[userKey];
    }

    try {
      const response = await api.get(`/userInfo/${userId}/`);
      const userData = response.data;
      const userInfo: UserInfo = {
        id: userId,
        name: userData.name || userData.username || `User ${userId}`,
        email: userData.email || "No email available",
      };

      // Update cache
      setUserCache((prev: UserCache) => ({
        ...prev,
        [userKey]: userInfo,
      }));

      return userInfo;
    } catch (err) {
      console.error(`Error fetching user details for ID ${userId}:`, err);
      return {
        id: userId,
        name: `User ${userId}`,
        email: "No email available",
      };
    }
  };

  // Fetch department details
  const fetchDepartmentDetails = async (
    deptId: number
  ): Promise<Department> => {
    const deptKey = deptId.toString();

    // Check cache first
    if (departmentCache[deptKey]) {
      return departmentCache[deptKey] as Department;
    }

    try {
      const response = await api.get(`/departments/${deptId}/`);
      const department: Department = {
        id: deptId,
        name: response.data.name || `Department ${deptId}`,
      };

      // Update cache
      setDepartmentCache((prev: DepartmentCache) => ({
        ...prev,
        [deptKey]: department,
      }));

      return department;
    } catch (err) {
      console.error(`Error fetching department details for ID ${deptId}:`, err);
      return {
        id: deptId,
        name: `Department ${deptId}`,
      };
    }
  };

  

  // Fetch business unit details
  const fetchBusinessUnitDetails = async (
    buId: number
  ): Promise<BusinessUnit> => {
    const buKey = buId.toString();

    // Check cache first
    if (businessUnitCache[buKey]) {
      return businessUnitCache[buKey];
    }

    try {
      const response = await api.get(`/business-units/${buId}/`);
      const businessUnit: BusinessUnit = {
        id: buId,
        name: response.data.name || `Business Unit ${buId}`,
      };

      // Update cache
      setBusinessUnitCache((prev: BusinessUnitCache) => ({
        ...prev,
        [buKey]: businessUnit,
      }));

      return businessUnit;
    } catch (err) {
      console.error(
        `Error fetching business unit details for ID ${buId}:`,
        err
      );
      return {
        id: buId,
        name: `Business Unit ${buId}`,
      };
    }
  };

  // Fetch designation details
  const fetchDesignationDetails = async (
    designationId: number
  ): Promise<Designation> => {
    const designationKey = designationId.toString();

    // Check cache first
    if (designationCache[designationKey]) {
      return designationCache[designationKey];
    }

    try {
      const response = await api.get(`/designations/${designationId}/`);
      const designation: Designation = {
        id: designationId,
        name: response.data.name || `Designation ${designationId}`,
      };

      // Update cache
      setDesignationCache((prev: DesignationCache) => ({
        ...prev,
        [designationKey]: designation,
      }));

      return designation;
    } catch (err) {
      console.error(
        `Error fetching designation details for ID ${designationId}:`,
        err
      );
      return {
        id: designationId,
        name: `Designation ${designationId}`,
      };
    }
  };

  // Enrich approval data with names
  const enrichApprovalData = async (form: ApprovalForm) => {
    try {
      const [user, department, businessUnit, designation] = await Promise.all([
        fetchUserDetails(Number(form.user)),
        fetchDepartmentDetails(Number(form.department)),
        fetchBusinessUnitDetails(Number(form.business_unit)),
        fetchDesignationDetails(Number(form.designation)),
      ]);

      return {
        ...form,
        user_name: user.name,
        user_email: user.email,
        department_name: department.name,
        business_unit_name: businessUnit.name,
        designation_name: designation.name,
        formatted_date: formatDate(form.date),
        formatted_total: new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(Number(form.total)),
      };
    } catch (err) {
      console.error("Error enriching approval data:", err);
      return form;
    }
  };

  // Fetch approval details
  const fetchApprovalDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/approval-requests/${id}/`);
      const formData = response.data;
      console.log(formData)

      setForm(formData);

      // Enrich the data with names
      const enrichedData = await enrichApprovalData(formData);
      setEnrichedForm(enrichedData);

      // Fetch asset details using the form ID from the response data
      if (formData && formData.id) {
        await fetchAssetDetails(formData.id);
        await fetchComments(formData.id);
      }

    } catch (err) {
      console.error("Error fetching approval details:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch approval details")
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Renamed and updated fetch asset details function
  const fetchAssetDetails = async(formId: number) => {
    try {
      const response = await api.get(`/approval-items/?form_id=${formId}`);
    
      setassestDetails(response.data);
    } catch (error:any) {
      console.error("Error fetching asset details:", error?.message);
    }
  };

  // Fetch comments for the form
  const fetchComments = async (formId: number | string) => {
    try {
      setIsChatLoading(true);
      const response = await api.get(`/chats?form_id=${formId}`);
      console.log(response)
      
      if (response.data && Array.isArray(response.data)) {
        // Map API response to Comment interface
        const mappedComments: Comment[] = response.data.map((chat: any) => ({
          id: chat.id,
          user: chat.sender?.name || chat.sender?.username || "User",
          userRole: "User",
          userInitials: chat.sender?.name 
            ? chat.sender.name.charAt(0) 
            : chat.sender?.username 
              ? chat.sender.username.charAt(0) 
              : "U",
          text: chat.message,
          timestamp: chat.timestamp,
          read: chat.read ? "true" : ""
        }));
        
        setComments(mappedComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchApprovalDetails();
    }
  }, [id, fetchApprovalDetails]);

  // Handle approve action
  const handleApprove = async () => {
    try {
      setIsApproving(true);

      // Call the API to approve the request
      const res = await api.post(`/approval-requests/${id}/approve/`);
      
      // Check if the API call was successful
      if (res.status === 200) {
        toast.success("Request approved successfully!");
        
        // Only update the local state if the API call was successful
        if (form) {
          setForm({
            ...form,
            status: "Approved",
            rejected: false,
          });

          if (enrichedForm) {
            setEnrichedForm({
              ...enrichedForm,
              status: "Approved",
              rejected: false,
            });
          }
        }

        // Add a system comment
        const systemComment: Comment = {
          id: Date.now(), // Use timestamp as numeric ID
          user: "You",
          userRole: "Approver",
          userInitials: "YO",
          text: "Request approved.",
          timestamp: new Date().toISOString(),
          read: ""
        };

        setComments([...comments, systemComment]);
      } else {
        toast.error("Failed to approve request");
      }
    } catch (err) {
      console.error("Error approving request:", err);
      toast.error("An error occurred while approving the request.");
    } finally {
      setIsApproving(false);
    }
  };

  // Handle reject action
  const handleReject = async () => {
    // Check if rejection reason is provided
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setIsRejecting(true);

      // Call the API to reject the request
      const res = await api.post(`/approval-requests/${id}/reject/`, {
        comments: rejectionReason,
      });
      
      // Close the dialog only after API call is initiated
      setRejectionDialogOpen(false);
      
      if (res.status === 200) {
        toast.success("Request rejected successfully!");
        
        // Only update local state if the API call was successful
        if (form) {
          setForm({
            ...form,
            status: "Rejected",
            rejected: true,
            rejection_reason: rejectionReason,
          });

          if (enrichedForm) {
            setEnrichedForm({
              ...enrichedForm,
              status: "Rejected",
              rejected: true,
              rejection_reason: rejectionReason,
            });
          }
        }

        // Add a system comment
        const systemComment: Comment = {
          id: Date.now(), // Use timestamp as numeric ID
          user: "You",
          userRole: "Approver",
          userInitials: "YO",
          text: `Request rejected. Reason: ${rejectionReason}`,
          timestamp: new Date().toISOString(),
          read: ""
        };

        setComments([...comments, systemComment]);
        setRejectionReason("");
      } else {
        toast.error("Failed to reject request");
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast.error("An error occurred while rejecting the request.");
      // Reopen the dialog if there was an error
      setRejectionDialogOpen(true);
    } finally {
      setIsRejecting(false);
    }
  };

  // Handle add comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !form) return;

    try {
      const commentData = {
        form: form.id,
        sender: currentUserId,
        message: newComment,
      };

      
      const response = await api.post(`/chats/`, commentData);
      
      
      const newCommentObj: Comment = {
        id: response.data.id,
        user: response.data.sender?.name || response.data.sender?.username || "You",
        userRole: "Approver",
        userInitials: response.data.sender?.name ? response.data.sender.name.charAt(0) : "U",
        text: response.data.message,
        timestamp: response.data.timestamp,
        read: response.data.read ? "true" : ""
      };

      // Add to comments list
      setComments((prevComments) => [...prevComments, newCommentObj]);
      
      // Clear comment input
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    }
  };

  return {
    form,
    enrichedForm,
    loading,
    error,
    comments,
    newComment,
    setNewComment,
    rejectionReason,
    setRejectionReason,
    rejectionDialogOpen,
    setRejectionDialogOpen,
    handleApprove,
    handleReject,
    handleAddComment,
    isChatLoading,
    isApproving,
    isRejecting,
    assestDetails
  };
}
