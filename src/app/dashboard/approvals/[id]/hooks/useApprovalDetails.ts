import { useState, useEffect, useCallback } from "react";
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
  handleAddComment: () => void;
  chatRoom: ChatRoom | null;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  handleStartChat: () => Promise<void>;
  handleSendMessage: () => Promise<void>;
  assestDetails : any;
}

// Mock data
const mockForms: ApprovalForm[] = [
  {
    id: "REQ-2025-006",
    user: "Aman Bhatt",
    business_unit: "BU001",
    department: "HR",
    designation: "Senior Manager",
    date: "2025-03-10",
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
];

const mockComments: Comment[] = [
  {
    id: "comment-1",
    user: "Neha Sharma",
    userRole: "Finance Manager",
    text: "I've reviewed this request and the budget allocation seems appropriate.",
    timestamp: "2025-03-12T10:30:00Z",
    userInitials: "NS",
  },
  {
    id: "comment-2",
    user: "Rahul Varma",
    userRole: "Requester",
    text: "Thank you for your prompt review. I've attached additional information about the equipment specifications as requested.",
    timestamp: "2025-03-12T14:15:00Z",
    userInitials: "RV",
  },
];

const mockChatRoom: ChatRoom = {
  id: "chat-room-1",
  user1: 2, // requester
  user2: 1, // approver (current user)
};

const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    chatroom: "chat-room-1",
    sender: 2, // requester
    message:
      "Hi, I wanted to ask about the status of my request. When can I expect approval?",
    timestamp: "2025-03-12T10:45:00Z",
    read: true,
  },
  {
    id: "msg-2",
    chatroom: "chat-room-1",
    sender: 1, // approver (current user)
    message:
      "Hello! I'm reviewing your request now. Could you provide more details about why you need this equipment?",
    timestamp: "2025-03-12T11:00:00Z",
    read: true,
  },
  {
    id: "msg-3",
    chatroom: "chat-room-1",
    sender: 2, // requester
    message:
      "Sure, I need this for the new project we're starting next month. Our current equipment doesn't support the software requirements for the project.",
    timestamp: "2025-03-12T11:15:00Z",
    read: false,
  },
];

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

  // Add enriched data state
  const [enrichedForm, setEnrichedForm] = useState<any>(null);

  // Cache states
  const [userCache, setUserCache] = useState<UserCache>({});
  const [departmentCache, setDepartmentCache] = useState<DepartmentCache>({});
  const [businessUnitCache, setBusinessUnitCache] = useState<BusinessUnitCache>(
    {}
  );
  const [designationCache, setDesignationCache] = useState<DesignationCache>(
    {}
  );

  // Chat states
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number>(1); // Mock current user ID (approver)

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

      setForm(formData);

      // Enrich the data with names
      const enrichedData = await enrichApprovalData(formData);
      setEnrichedForm(enrichedData);

      // Fetch asset details using the form ID from the response data
      if (formData && formData.id) {
        await fetchAssetDetails(formData.id);
      }

      // Fetch comments (if available) or use mock data
      // const commentsResponse = await api.get(`/approval-comments/${id}/`);
      // setComments(commentsResponse.data); 
      setComments(mockComments);
    } catch (err) {
      console.error("Error fetching approval details:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch approval details")
      );

      // Fallback to mock data
      const foundForm = mockForms.find((f) => f.id === id);
      if (foundForm) {
        setForm(foundForm);
        const enrichedData = await enrichApprovalData(foundForm);
        setEnrichedForm(enrichedData);
      }

      setComments(mockComments);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Renamed and updated fetch asset details function
  const fetchAssetDetails = async(formId: number) => {
    try {
      const response = await api.get(`/approval-items/?form_id=${formId}`);
      console.log("Asset details response:", response);
      setassestDetails(response.data);
    } catch (error:any) {
      console.error("Error fetching asset details:", error?.message);
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
      console.log(`Approving request: ${id}`);

      // In a real app, you would call the API
      const res = await api.post(`/approval-requests/${id}/approve/`);
      console.log("Response from approve:", res);
      // window.location.href = "/dashboard/approvals";

      // if (res.status === 200) {
      //   toast.success("Request approved successfully!");
      // } else {
      //   toast.error("Something went wrong");
      // }

      // Update local state
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
        id: `comment-${Date.now()}`,
        user: "You",
        userRole: "Approver",
        text: "Request approved.",
        timestamp: new Date().toISOString(),
        userInitials: "YO",
      };

      setComments([...comments, systemComment]);
      // alert("Request approved successfully!");
    } catch (err) {
      console.error("Error approving request:", err);
      alert("An error occurred while approving the request.");
    }
  };

  // Handle reject action
  const handleReject = async () => {
    // Close the dialog
    setRejectionDialogOpen(false);

    // Check if rejection reason is provided
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      console.log(`Rejecting request: ${id} - Reason: ${rejectionReason}`);

      // In a real app, you would call the API
      const res = await api.post(`/approval-requests/${id}/reject/`, {
        comments: rejectionReason,
      });
      if (res.status === 200) {
        toast.success("Request rejected successfully!");
      } else {
        toast.error("Something went wrong");
      }

      // Update local state
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
        id: `comment-${Date.now()}`,
        user: "You",
        userRole: "Approver",
        text: `Request rejected. Reason: ${rejectionReason}`,
        timestamp: new Date().toISOString(),
        userInitials: "YO",
      };

      setComments([...comments, systemComment]);
      setRejectionReason("");
      // alert("Request rejected successfully.");
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("An error occurred while rejecting the request.");
    }
  };

  // Handle add comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      user: "You",
      userRole: "Approver",
      text: newComment,
      timestamp: new Date().toISOString(),
      userInitials: "YO",
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  // Fetch chat data
  const fetchChatData = useCallback(async () => {
    if (!id) return;

    setIsChatLoading(true);
    try {
      // Use mock data instead - simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For testing no chat state, uncomment this
      // setChatRoom(null);

      // For testing with chat data, uncomment this
      setChatRoom(mockChatRoom);
      setChatMessages(mockChatMessages);
    } catch (err) {
      console.error("Error fetching chat data:", err);
    } finally {
      setIsChatLoading(false);
    }
  }, [id]);

  // Handle starting chat
  const handleStartChat = async () => {
    if (!form) return;

    try {
      // Use mock data instead - simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create a new chat room
      const newChatRoom: ChatRoom = {
        id: `chat-room-${Date.now()}`,
        user1: Number(form.user),
        user2: currentUserId,
      };

      // Create a welcome message
      const welcomeMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        chatroom: newChatRoom.id,
        sender: currentUserId,
        message: `Chat started by ${
          enrichedForm?.user_name
            ? "approver with " + enrichedForm.user_name
            : "approver"
        }. You can now discuss this request.`,
        timestamp: new Date().toISOString(),
        read: false,
      };

      setChatRoom(newChatRoom);
      setChatMessages([welcomeMessage]);
    } catch (err) {
      console.error("Error starting chat:", err);
      alert("Failed to start chat. Please try again.");
    }
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!newComment.trim() || !chatRoom) return;

    try {
      // Create a new message object
      const message = {
        chatroom: chatRoom.id,
        sender: currentUserId,
        message: newComment,
        read: false,
      };

      // Create a temp message for optimistic update
      const tempMessage: ChatMessage = {
        ...message,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      // Update UI immediately (optimistic update)
      setChatMessages([...chatMessages, tempMessage]);
      setNewComment("");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");

      // Restore comment in text area if it failed
      setNewComment((prev) => prev || newComment);

      // Remove optimistic message
      setChatMessages((prev) =>
        prev.filter((msg) => !msg.id.startsWith("msg-"))
      );
    }
  };

  // Update the useEffect to fetch chat data when tab changes
  useEffect(() => {
    if (activeTab === "comments") {
      fetchChatData();
    }
  }, [activeTab, fetchChatData]);

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
    chatRoom,
    chatMessages,
    isChatLoading,
    handleStartChat,
    handleSendMessage,
    assestDetails
  };
}
