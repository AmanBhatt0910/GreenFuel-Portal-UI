"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  CalendarDays,
  AlertCircle,
  Building,
  Send,
  DownloadCloud,
  Eye,
  MessageSquare,
  History,
  Info,
  PieChart,
  BarChart,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Paperclip,
  PlusCircle,
  Bookmark,
  Stamp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "@/app/hooks/use-axios";
import axios from "axios";

// Define TypeScript interfaces for the data structure
interface BudgetRequest {
  id: number;
  budget_id: string;
  date: string;
  total: string;
  reason: string;
  policy_agreement: boolean;
  current_status: string;
  benefit_to_organisation: string;
  approval_category: string;
  approval_type: string;
  current_level: number;
  max_level: number;
  rejected: boolean;
  rejection_reason: string | null;
  user: number;
  business_unit: number;
  department: number;
  designation: number;
  initiate_dept: number | null;
  notify_to: number;
}

interface ApprovalLevel {
  level: number;
  title: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  comments: string | null;
}

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  url: string;
}

interface ApiDocument {
  id: number;
  url: string;
  type: string;
  uploaded_at: string;
  file: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  level: number;
  authorId: number;
}

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  approval_level: number;
  designation: number;
}

interface StatusBadge {
  color: string;
  icon: React.ReactNode;
  bgColor: string;
}

interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  timestamp: string;
  fromLevel: number;
  toLevel: number;
}

interface EntityInfo {
  id: number;
  name: string;
}

interface Designation extends EntityInfo {
  level: number;
  department_name?: string;
  department?: number;
}

const RequestDetailsPage = () => {
  const params = useParams();
  const requestId = params.id as string;
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get('userId');

  const [request, setRequest] = useState<BudgetRequest | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [approvalLevels, setApprovalLevels] = useState<ApprovalLevel[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectionDialog, setShowRejectionDialog] =
    useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("details");
  const [formValid, setFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState<string>("");
  const [selectedChatLevel, setSelectedChatLevel] = useState<number | null>(
    null
  );
  const [approvalProgress, setApprovalProgress] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [businessUnits, setBusinessUnits] = useState<EntityInfo[]>([]);
  const [departments, setDepartments] = useState<EntityInfo[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [designationMap, setDesignationMap] = useState<Map<number, Designation>>(new Map());
  const [departmentMap, setDepartmentMap] = useState<Map<number, EntityInfo>>(new Map());
  const [businessUnitMap, setBusinessUnitMap] = useState<Map<number, EntityInfo>>(new Map());


  const api = useAxios();

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Get current user info - either from params or get current user
        const endpoint = userIdParam ? `/userInfo/${userIdParam}` : "/userInfo/";
        console.log("Fetching user info from:", endpoint);
        const response = await api.get(endpoint);
        
        // Get the current user's info
        setUserInfo(response.data);
        console.log("User info loaded:", response.data);
        
        // Fetch designations to get the user's level
        const designationsRes = await api.get("/designations/");
        setDesignations(designationsRes.data);
        
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to load user information");
      }
    };

    fetchUserInfo();
  }, [userIdParam]);

  // Fetch request data
  useEffect(() => {
    if (requestId) {
      const fetchRequestData = async () => {
        try {
          setLoading(true);
          // Fetch request data
          const response = await api.get(`/approval-requests/${requestId}/`);
          console.log("response", response)
          const requestData = response.data;
          setRequest(requestData);
  
          // Fetch related entity data
          const [businessUnitsRes, departmentsRes, designationsRes, usersRes] =
            await Promise.all([
              api.get("/business-units/"),
              api.get("/departments/"),
              api.get("/designations/"),
              api.get("/userInfo/"),
            ]);
  
          // Create maps for faster lookups
          const businessUnitsData = businessUnitsRes.data;
          const businessUnitsMapObj = new Map();
          businessUnitsData.forEach((unit: EntityInfo) => {
            businessUnitsMapObj.set(unit.id, unit);
          });
          setBusinessUnitMap(businessUnitsMapObj);
          setBusinessUnits(businessUnitsData);
  
          const departmentsData = departmentsRes.data;
          const departmentsMapObj = new Map();
          departmentsData.forEach((dept: EntityInfo) => {
            departmentsMapObj.set(dept.id, dept);
          });
          setDepartmentMap(departmentsMapObj);
          setDepartments(departmentsData);
  
          const designationsData = designationsRes.data;
          const designationsMapObj = new Map();
          designationsData.forEach((desig: Designation) => {
            designationsMapObj.set(desig.id, desig);
          });
          setDesignationMap(designationsMapObj);
          setDesignations(designationsData);
  
          setUsers(usersRes.data);
  
          if (requestData.approval_levels) {
            setApprovalLevels(requestData.approval_levels);
          }
  
          if (requestData.documents) {
            setDocuments(requestData.documents);
          }
  
          if (requestData.comments) {
            setComments(requestData.comments);
          }
  
          if (requestData.chatMessages) {
            setChatMessages(requestData.chatMessages);
          }
  
          setError(null);
        } catch (err) {
          console.error("Error fetching request data:", err);
          setError("Failed to load request data");
        } finally {
          setLoading(false);
        }
      };
  
      fetchRequestData();
    }
  }, [requestId]);
  
  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Validate rejection form
  useEffect(() => {
    setFormValid(rejectionReason.trim().length >= 10);
  }, [rejectionReason]);

  // Handle approval action
  const handleApprove = async () => {
    if (!request) return;

    try {
      setLoading(true);

      // Send approval to API
      await api.post(`/approval-requests/${requestId}/approve/`, {
        level: getUserDesignationLevel(),
        designation: userInfo?.designation,
        comments: "Approved",
      });

      // Refresh data after approval
      const response = await api.get(`/approval-requests/${requestId}/`);
      setRequest(response.data);

      // Update other data as needed
      if (response.data.approval_levels) {
        setApprovalLevels(response.data.approval_levels);
      }

      setSuccessMessage("Request approved successfully!");

      // Auto-dismiss success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error("Error approving request:", err);
      setError("Failed to approve request");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!request?.id) return; // ✅ early return if request is null or id is undefined
  
    const fetchDocuments = async () => {
      if (!request) return;
    
      try {
        setLoading(true); // optional: if you want to show loading state
    
        // API call using your existing `api` instance
        const response = await api.get(`/approval-attachments?form_id=${request.id}`);
    
        // Map the response data
        const mappedDocuments = response.data.map((doc: ApiDocument) => ({
          id: doc.id,
          name: doc.url.split("/").pop() || "Document",
          type: doc.type || "Unknown",
          size: formatDate(doc.uploaded_at),
          url: doc.url,
        }));
    
        setDocuments(mappedDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Failed to fetch documents"); // optional: if you have error state
      } finally {
        setLoading(false); // optional: if you have loading state
      }
    };
    
  
    fetchDocuments();
  }, [request?.id]);
  

  
  
  // Handle rejection submission
  const handleReject = async () => {
    if (!formValid || !request) return;

    try {
      setLoading(true);

      // Send rejection to API
      await api.post(`/approval-requests/${requestId}/reject/`, {
        level: getUserDesignationLevel(),
        designation: userInfo?.designation,
        rejection_reason: rejectionReason,
      });

      // Refresh data after rejection
      const response = await api.get(`/approval-requests/${requestId}/`);
      setRequest(response.data);

      // Update other data as needed
      if (response.data.approval_levels) {
        setApprovalLevels(response.data.approval_levels);
      }

      setShowRejectionDialog(false);
      setRejectionReason("");

      setSuccessMessage("Request rejected successfully.");

      // Auto-dismiss success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError("Failed to reject request");
    } finally {
      setLoading(false);
    }
  };

  // Check if the current user can take action
  const canTakeAction = (): boolean => {
    if (!request || !userInfo) {
      console.log("Cannot take action: Missing request or userInfo data");
      return false;
    }
    
    // Get the user's designation using the map for efficient lookup
    const userDesignation = designationMap.get(userInfo.designation);
    
    if (!userDesignation) {
      console.log("Cannot take action: User designation not found in map", userInfo.designation);
      return false;
    }
    
    // Log all relevant information for debugging
    console.log("Checking authorization:");
    console.log("- User ID:", userInfo.id);
    console.log("- Request User ID:", request.user);
    console.log("- User Designation:", userInfo.designation);
    console.log("- User Designation Level:", userDesignation.level);
    console.log("- Request Current Level:", request.current_level);
    console.log("- User Department:", userInfo.department);
    console.log("- Request Department:", request.department);
    console.log("- Request Rejected:", request.rejected);
    
    // First check: Don't allow creator to approve their own request
    if (userInfo.id === request.user) {
      console.log("Cannot take action: User is the creator of the request");
      return false;
    }
    
    // Check if:
    // 1. User's designation level matches the request's current_level
    // 2. User's department matches the request's department
    // 3. Request is not already rejected
    const canApprove = 
      userDesignation.level === request.current_level &&
      Number(userInfo.department) === request.department &&
      !request.rejected;
    
    console.log("Authorization result:", canApprove);
    return canApprove;
  };
  
  // Handle posting a new comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !userInfo) return;

    try {
      const response = await api.post(
        `/approval-requests/${requestId}/comments/`,
        {
          text: newComment,
          level: userInfo.approval_level,
        }
      );

      // Add new comment to list
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment");
    }
  };

  // Handle sending a chat message
  const handleSendChatMessage = async () => {
    if (!newChatMessage.trim() || !userInfo || selectedChatLevel === null)
      return;

    try {
      const message = {
        senderId: userInfo.id,
        senderName: userInfo.name,
        message: newChatMessage,
        timestamp: new Date().toISOString(),
        fromLevel: userInfo.approval_level,
        toLevel: selectedChatLevel,
      };

      const response = await api.post(
        `/approval-requests/${requestId}/chat/`,
        message
      );

      // Add new message to chat
      setChatMessages([...chatMessages, response.data]);
      setNewChatMessage("");
    } catch (err) {
      console.error("Error sending chat message:", err);
      setError("Failed to send message");
    }
  };
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get user's designation level
  const getUserDesignationLevel = (): number => {
    if (!userInfo || !designationMap) return 0;
    const designation = designationMap.get(userInfo.designation);
    return designation ? designation.level : 0;
  };

  // Get status badge properties
  const getStatusBadge = (status: string): StatusBadge => {
    if (!status) {
      return { color: 'text-gray-500', icon: <Info className="h-4 w-4" />, bgColor: 'bg-gray-100' };
    }
    
    switch (status.toLowerCase()) {
      case 'pending':
        return { color: 'text-amber-500', icon: <Clock className="h-4 w-4" />, bgColor: 'bg-amber-100' };
      case 'approved':
        return { color: 'text-green-500', icon: <CheckCircle className="h-4 w-4" />, bgColor: 'bg-green-100' };
      case 'rejected':
        return { color: 'text-red-500', icon: <XCircle className="h-4 w-4" />, bgColor: 'bg-red-100' };
      default:
        return { color: 'text-gray-500', icon: <Info className="h-4 w-4" />, bgColor: 'bg-gray-100' };
    }
  };

  // Get entity name by ID
  const getEntityName = (entityMap: Map<number, EntityInfo>, id: number): string => {
    const entity = entityMap.get(id);
    return entity ? entity.name : 'Unknown';
  };

  // Get user name by ID
  const getUserName = (userId: number): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Calculate approval progress
  useEffect(() => {
    if (request && request.max_level > 0) {
      const progress = (request.current_level / request.max_level) * 100;
      setApprovalProgress(progress);
    }
  }, [request]);

  if (loading && !request) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>The requested budget request was not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Success message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Alert className="bg-green-50 border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">Success</AlertTitle>
              <AlertDescription className="text-green-600">
                {successMessage}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Budget Request {request.budget_id}
            </h1>
            <div className="flex items-center space-x-4">
              <Badge 
                className={`px-3 py-1 text-sm font-medium ${getStatusBadge(request.current_status).bgColor} ${getStatusBadge(request.current_status).color}`}
              >
                <span className="flex items-center">
                  {getStatusBadge(request.current_status).icon}
                  <span className="ml-1">{request.current_status}</span>
                </span>
              </Badge>
              <p className="text-sm text-gray-600 flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                {formatDate(request.date)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {canTakeAction() && (
              <>
                <Button
                  onClick={handleApprove}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => setShowRejectionDialog(true)}
                  variant="destructive"
                  disabled={loading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            <Button variant="outline" className="border-gray-300">
              <DownloadCloud className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" onValueChange={setCurrentTab} className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-white p-1 rounded-lg border border-gray-200">
              <TabsTrigger value="details" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <Paperclip className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-0">
              <Card className="border border-gray-200">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-xl font-semibold text-gray-900">Budget Request Details</CardTitle>
                  <CardDescription className="text-gray-600">
                    Complete information about this budget request
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-4 text-lg">Basic Information</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Budget ID</p>
                          <p className="text-base text-gray-900">{request.budget_id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date Submitted</p>
                          <p className="text-base text-gray-900">{formatDate(request.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Amount</p>
                          <p className="text-base text-gray-900 flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-gray-600" />
                            {request.total}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Approval Type</p>
                          <p className="text-base text-gray-900">{request.approval_type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Approval Category</p>
                          <p className="text-base text-gray-900">{request.approval_category}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700 mb-4 text-lg">Organizational Details</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Requester</p>
                          <p className="text-base text-gray-900">{getUserName(request.user)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Business Unit</p>
                          <p className="text-base text-gray-900">
                            {getEntityName(businessUnitMap, request.business_unit)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Department</p>
                          <p className="text-base text-gray-900">
                            {getEntityName(departmentMap, request.department)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Initiating Department</p>
                          <p className="text-base text-gray-900">
                            {request.initiate_dept ? getEntityName(departmentMap, request.initiate_dept) : 'Same as Department'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Notify To</p>
                          <p className="text-base text-gray-900">
                            {request.notify_to ? getUserName(request.notify_to) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="font-medium text-gray-700 mb-4 text-lg">Request Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Reason for Request</p>
                        <p className="text-base text-gray-900 whitespace-pre-line mt-1">{request.reason}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Benefit to Organization</p>
                        <p className="text-base text-gray-900 whitespace-pre-line mt-1">{request.benefit_to_organisation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Policy Agreement</p>
                        <p className="text-base mt-1">
                          {request.policy_agreement ? (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" /> Agreed
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center">
                              <XCircle className="h-4 w-4 mr-1" /> Not Agreed
                            </span>
                          )}
                        </p>
                      </div>
                      {request.rejected && (
                        <div>
                          <p className="text-sm font-medium text-red-500">Rejection Reason</p>
                          <p className="text-base text-red-600 whitespace-pre-line mt-1">{request.rejection_reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
      <Card>
        <CardHeader>
          <CardTitle>Supporting Documents</CardTitle>
            <CardDescription>
              Files and documents related to this budget request
            </CardDescription>
          </CardHeader>
          <CardContent>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md mr-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(doc.url, "_blank")}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = doc.url;
                      link.download = doc.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <DownloadCloud className="h-4 w-4 mr-1" /> Download
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No documents attached</p>
            </div>
          )}

          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Document
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>


            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    Discussions and feedback about this request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {comments.length > 0 ? (
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="p-3 bg-gray-50 rounded-md border border-gray-200"
                          >
                            <div className="flex items-center mb-2">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>
                                  {comment.author.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{comment.author}</p>
                                <p className="text-xs text-gray-500">{formatDate(comment.timestamp)}</p>
                              </div>
                            </div>
                            <p className="whitespace-pre-line">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No comments yet</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <div className="w-full space-y-3">
                    <Textarea
                      ref={commentInputRef}
                      placeholder="Add your comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                    <Button 
                      onClick={handleAddComment} 
                      disabled={!newComment.trim()}
                      className="ml-auto"
                    >
                      <Send className="h-4 w-4 mr-2" /> Add Comment
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <Card>
                <CardHeader>
                  <CardTitle>Communication</CardTitle>
                  <CardDescription>
                    Chat with approvers and stakeholders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {chatMessages.length > 0 ? (
                        chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-md border ${
                              message.senderId === userInfo?.id
                                ? "bg-blue-50 border-blue-200 ml-8"
                                : "bg-gray-50 border-gray-200 mr-8"
                            }`}
                          >
                            <div className="flex items-center mb-2">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>
                                  {message.senderName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{message.senderName}</p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(message.timestamp)}
                                </p>
                              </div>
                            </div>
                            <p className="whitespace-pre-line">{message.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No messages yet</p>
                        </div>
                      )}
                      <div ref={chatEndRef}></div>
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <div className="w-full space-y-3">
                    <div className="flex items-center">
                      <label className="mr-2 text-sm text-gray-500">To:</label>
                      <select
                        className="border rounded p-1 text-sm"
                        value={selectedChatLevel || ""}
                        onChange={(e) => setSelectedChatLevel(Number(e.target.value))}
                      >
                        <option value="">Select recipient level</option>
                        {approvalLevels.map((level) => (
                          <option key={level.level} value={level.level}>
                            {level.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Textarea
                      placeholder="Type your message..."
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                    <Button
                      onClick={handleSendChatMessage}
                      disabled={!newChatMessage.trim() || selectedChatLevel === null}
                      className="ml-auto"
                    >
                      <Send className="h-4 w-4 mr-2" /> Send Message
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Approval History</CardTitle>
                  <CardDescription>
                    Timeline of approval workflow and actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {approvalLevels.map((level, index) => (
                      <div key={level.level} className="relative">
                        {index < approvalLevels.length - 1 && (
                          <div className="absolute top-6 left-3 bottom-0 w-0.5 bg-gray-200"></div>
                        )}
                        <div className="flex">
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center mr-4 ${
                              level.status === "approved"
                                ? "bg-green-100 text-green-600"
                                : level.status === "rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {level.status === "approved" ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : level.status === "rejected" ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{level.title}</p>
                              <Badge
                                variant="outline"
                                className={`${
                                  level.status === "approved"
                                    ? "text-green-600 border-green-200 bg-green-50"
                                    : level.status === "rejected"
                                    ? "text-red-600 border-red-200 bg-red-50"
                                    : "text-amber-600 border-amber-200 bg-amber-50"
                                }`}
                              >
                                {level.status}
                              </Badge>
                            </div>
                            {level.approvedBy ? (
                              <div className="mt-2 text-sm">
                                <p className="text-gray-500">
                                  {level.status === "approved" ? "Approved" : "Rejected"} by{" "}
                                  <span className="font-medium">{level.approvedBy}</span> on{" "}
                                  {formatDate(level.approvedAt || "")}
                                </p>
                                {level.comments && (
                                  <p className="mt-1 text-gray-600">
                                    "{level.comments}"
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="mt-2 text-sm text-gray-500">
                                Waiting for approval
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Progress card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Approval Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Level {request.current_level} of {request.max_level}
                    </span>
                    <span className="font-medium">{Math.round(approvalProgress)}%</span>
                  </div>
                  <Progress value={approvalProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Bookmark className="h-4 w-4 mr-2" /> Save as Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" /> Preview PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Stamp className="h-4 w-4 mr-2" /> View Approval Signature
                </Button>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Request Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Type</span>
                    <Badge variant="outline">{request.approval_type}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <Badge
                      className={`${getStatusBadge(request.current_status).bgColor} ${
                        getStatusBadge(request.current_status).color
                      } border-none`}
                    >
                      <span className="flex items-center">
                        {getStatusBadge(request.current_status).icon}
                        <span className="ml-1">{request.current_status}</span>
                      </span>
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Department</span>
                    <span className="font-medium">
                      {getEntityName(departmentMap, request.department)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium text-green-600">${request.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related requests */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Related Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 p-1 rounded mr-2">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium">BUD-2023-0014</p>
                      <p className="text-xs text-gray-500">Equipment purchase</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 p-1 rounded mr-2">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium">BUD-2023-0009</p>
                      <p className="text-xs text-gray-500">Software license</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Budget Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this budget request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
            {rejectionReason.length < 10 && (
              <p className="text-sm text-red-500">
                Please provide a detailed reason (minimum 10 characters)
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectionDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!formValid}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestDetailsPage;