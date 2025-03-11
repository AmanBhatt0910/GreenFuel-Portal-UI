"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
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

const RequestDetailsPage = () => {
  const params = useParams();
  const requestId = params.id as string;

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

  const api = useAxios();

  // Set progress percentage based on current level and approval statuses
  useEffect(() => {
    if (request && approvalLevels.length > 0) {
      const approvedLevels = approvalLevels.filter(
        (level) => level.status.toLowerCase() === "approved"
      ).length;
      setApprovalProgress(
        Math.round((approvedLevels / request.max_level) * 100)
      );
    }
  }, [request, approvalLevels]);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/userInfo/");
        setUserInfo(response.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to load user information");
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch request data
  useEffect(() => {
    if (requestId) {
      const fetchRequestData = async () => {
        try {
          setLoading(true);
          const response = await api.get(`approval-requests/`);
          const requestData = response.data;
          console.log("requestData", requestData);
          setRequest(requestData);

          if (requestData.approval_levels) {
            setApprovalLevels(requestData.approval_levels);
          }

          if (requestData.documents) {
            setDocuments(requestData.documents);
          }

          if (requestData.comments) {
            setComments(requestData.comments);
          }

          // Fetch chat messages if available
          if (requestData.chatMessages) {
            setChatMessages(requestData.chatMessages);
          } else {
            // If not available in the main request, try to fetch them separately
            try {
              const chatResponse = await api.get(
                `/approval-requests/${requestId}/chat/`
              );
              setChatMessages(chatResponse.data);
            } catch (chatErr) {
              console.error("Error fetching chat messages:", chatErr);
            }
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
        level: userInfo?.approval_level,
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

  // Handle rejection submission
  const handleReject = async () => {
    if (!formValid || !request) return;

    try {
      setLoading(true);

      // Send rejection to API
      await api.post(`/approval-requests/${requestId}/reject/`, {
        level: userInfo?.approval_level,
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

  // Check if the current user can take action on this request
  const canTakeAction = (): boolean => {
    if (!request || !userInfo) return false;

    // Check if both current_level and designation match
    return (
      userInfo.approval_level === request.current_level &&
      userInfo.designation === request.designation &&
      !request.rejected
    );
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

  // Get status badge color and icon
  const getStatusBadge = (status: string): StatusBadge => {
    switch (status.toLowerCase()) {
      case "approved":
        return {
          color: "text-green-800 border-green-200",
          bgColor: "bg-green-50",
          icon: <CheckCircle className="h-4 w-4 mr-1 text-green-600" />,
        };
      case "rejected":
        return {
          color: "text-red-800 border-red-200",
          bgColor: "bg-red-50",
          icon: <XCircle className="h-4 w-4 mr-1 text-red-600" />,
        };
      case "pending":
      default:
        return {
          color: "text-amber-800 border-amber-200",
          bgColor: "bg-amber-50",
          icon: <Clock className="h-4 w-4 mr-1 text-amber-600" />,
        };
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get available levels for chat that aren't the current user's level
  const getAvailableChatLevels = (): number[] => {
    if (!userInfo || !approvalLevels.length) return [];

    return approvalLevels
      .map((level) => level.level)
      .filter((level) => level !== userInfo.approval_level);
  };

  // Get document icon based on file type
  const getDocumentIcon = (type: string) => {
    if (type.includes("pdf")) return "pdf";
    if (type.includes("word")) return "doc";
    if (type.includes("excel") || type.includes("sheet")) return "xls";
    if (type.includes("image")) return "img";
    return "file";
  };

  // Generate initials for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading && !request) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 gap-4"
        >
          <div className="relative inline-flex">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-blue-500"></span>
          </div>
          <p className="text-lg font-medium text-gray-700">
            Loading request details...
          </p>
          <div className="w-64">
            <Progress value={45} className="h-2" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Notice</AlertTitle>
            <AlertDescription>No request data available.</AlertDescription>
          </Alert>
        </motion.div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(request.current_status);
  const availableChatLevels = getAvailableChatLevels();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 max-w-6xl"
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3"
            >
              <div className="animate-spin h-5 w-5 border-b-2 border-blue-600 rounded-full"></div>
              <p className="font-medium">Processing...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <Alert className="bg-green-50 border border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1"
                onClick={() => setError(null)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <DollarSign className="h-8 w-8 text-blue-600" />
              </motion.div>
              Budget Request
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <span className="font-medium text-gray-700">ID:</span>{" "}
              {request.budget_id} <span className="mx-2">•</span>
              <span className="font-medium text-gray-700">Date:</span>{" "}
              {formatDate(request.date)}
            </p>
          </div>
          <Badge
            className={`${statusBadge.color} ${statusBadge.bgColor} flex items-center mt-2 md:mt-0 px-3 py-1.5 text-sm font-medium border`}
          >
            {statusBadge.icon}
            {request.current_status.charAt(0).toUpperCase() +
              request.current_status.slice(1)}
          </Badge>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="bg-blue-600 text-white p-3 rounded-full">
                  <BarChart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Approval Progress
                  </h3>
                  <p className="text-sm text-gray-600">
                    Level {request.current_level} of {request.max_level}
                  </p>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="flex justify-between mb-1 text-sm font-medium">
                  <span>Current Progress</span>
                  <span>{approvalProgress}%</span>
                </div>
                <Progress
                  value={approvalProgress}
                  className="h-2.5 bg-blue-100"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs
        defaultValue="details"
        className="w-full"
        onValueChange={setCurrentTab}
      >
        <TabsList className="mb-6 p-1 bg-blue-50 rounded-lg gap-2.5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-white"
            >
              <Info className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-white"
            >
              <History className="h-4 w-4 mr-2" />
              Approval History
            </TabsTrigger>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <TabsTrigger value="chat" className="data-[state=active]:bg-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
          </motion.div>
          {documents.length > 0 && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
            </motion.div>
          )}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <TabsTrigger
              value="comments"
              className="data-[state=active]:bg-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
              {comments.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-blue-100 text-blue-800"
                >
                  {comments.length}
                </Badge>
              )}
            </TabsTrigger>
          </motion.div>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="details" className="mt-0">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r  p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-blue-600" />
                        {request.approval_type} - {request.approval_category}
                      </CardTitle>
                      <CardDescription className="mt-1 text-gray-600">
                        {request.reason}
                      </CardDescription>
                    </div>
                    <div>
                      <Badge
                        variant="outline"
                        className="font-semibold bg-white"
                      >
                        {request.current_status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50"
                      >
                        <div className="p-2 bg-blue-100 rounded-full text-blue-700">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-500 text-sm">
                            Total Amount
                          </h3>
                          <p className="font-bold text-lg text-gray-900">
                            {request.total}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50"
                      >
                        <div className="p-2 bg-blue-100 rounded-full text-blue-700">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-500 text-sm">
                            Date Submitted
                          </h3>
                          <p className="font-medium text-gray-900">
                            {formatDate(request.date)}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50"
                      >
                        <div className="p-2 bg-blue-100 rounded-full text-blue-700">
                          <Building className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-500 text-sm">
                            Department
                          </h3>
                          <p className="font-medium text-gray-900">
                            ID: {request.department}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50"
                      >
                        <div className="p-2 bg-blue-100 rounded-full text-blue-700">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-500 text-sm">
                            Requester
                          </h3>
                          <p className="font-medium text-gray-900">
                            User ID: {request.user}
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Info className="h-5 w-5 mr-2 text-blue-600" />
                        Benefit to Organization
                      </h3>
                      <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-gray-800 leading-relaxed">
                          {request.benefit_to_organisation}
                        </p>
                      </div>
                    </div>

                    {request.rejected && request.rejection_reason && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Alert
                          variant="destructive"
                          className="bg-red-50 border-red-200 text-red-900"
                        >
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <AlertTitle className="text-lg font-semibold">
                            Rejection Reason
                          </AlertTitle>
                          <AlertDescription className="mt-1">
                            {request.rejection_reason}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </div>
                </CardContent>

                {/* Action buttons - only show if both level AND designation match */}
                {canTakeAction() && (
                  <CardFooter className="flex justify-end space-x-4 bg-gray-50 p-6 border-t">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setShowRejectionDialog(true)}
                            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reject this budget request</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleApprove}
                            className="bg-green-600 text-white hover:bg-green-700"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Approve this budget request</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-600" />
                    Approval History
                  </CardTitle>
                  <CardDescription>
                    Track the progress of this request through approval levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {approvalLevels.map((level, index) => (
                      <div key={index} className="relative">
                        <div
                          className={`flex items-start ${
                            index !== approvalLevels.length - 1 ? "pb-8" : ""
                          }`}
                        >
                          {/* Timeline connector */}
                          {index !== approvalLevels.length - 1 && (
                            <div className="absolute top-10 left-4 bottom-0 w-0.5 bg-gray-200"></div>
                          )}

                          {/* Status icon */}
                          <div
                            className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-4 z-10 ${
                              level.status.toLowerCase() === "approved"
                                ? "bg-green-100 text-green-600"
                                : level.status.toLowerCase() === "rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-amber-100 text-amber-600"
                            }`}
                          >
                            {level.status.toLowerCase() === "approved" ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : level.status.toLowerCase() === "rejected" ? (
                              <XCircle className="h-5 w-5" />
                            ) : (
                              <Clock className="h-5 w-5" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <h4 className="text-lg font-semibold text-gray-900 mr-2">
                                {level.title}
                              </h4>
                              <Badge
                                className={`${
                                  getStatusBadge(level.status).color
                                } ${
                                  getStatusBadge(level.status).bgColor
                                } flex items-center px-2 py-0.5 text-xs font-medium border`}
                              >
                                {getStatusBadge(level.status).icon}
                                {level.status}
                              </Badge>
                            </div>

                            <div className="text-sm text-gray-500 flex items-center mb-2">
                              <span className="font-medium mr-1">
                                Level {level.level}
                              </span>
                              {level.approvedBy && (
                                <>
                                  <span className="mx-2">•</span>
                                  <User className="h-3 w-3 mr-1" />
                                  <span>{level.approvedBy}</span>
                                </>
                              )}
                              {level.approvedAt && (
                                <>
                                  <span className="mx-2">•</span>
                                  <CalendarDays className="h-3 w-3 mr-1" />
                                  <span>{formatDate(level.approvedAt)}</span>
                                </>
                              )}
                            </div>

                            {level.comments && (
                              <div className="bg-gray-50 p-3 rounded-md text-gray-700 text-sm mt-2">
                                <p className="italic">"{level.comments}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="mt-0">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Communication
                  </CardTitle>
                  <CardDescription>
                    Communicate with other approval levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col h-96">
                    <ScrollArea className="flex-1 p-4">
                      {chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                          <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                          <p>No messages yet</p>
                          <p className="text-sm">
                            Start a conversation with other approval levels
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {Array.isArray(chatMessages) ? 
                            chatMessages.map((message) => (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${
                                  message.senderId === userInfo?.id
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                                    message.senderId === userInfo?.id
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  <div className="flex items-center mb-1">
                                    <span className="text-xs font-medium">
                                      {message.senderId === userInfo?.id
                                        ? "You"
                                        : message.senderName}{" "}
                                      (Level {message.fromLevel})
                                    </span>
                                    <span className="mx-1">→</span>
                                    <span className="text-xs">
                                      Level {message.toLevel}
                                    </span>
                                  </div>
                                  <p>{message.message}</p>
                                  <p
                                    className={`text-xs mt-1 text-right ${
                                      message.senderId === userInfo?.id
                                        ? "text-blue-100"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {formatDate(message.timestamp)}
                                  </p>
                                </div>
                              </motion.div>
                            ))
                            : <p>No messages available</p>
                          }
                          <div ref={chatEndRef} />
                        </div>
                      )}
                    </ScrollArea>

                    {/* Chat input */}
                    <div className="border-t p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <select
                            className="rounded-md border border-gray-300 py-2 px-3 text-sm flex-grow-0 w-40"
                            value={selectedChatLevel || ""}
                            onChange={(e) =>
                              setSelectedChatLevel(Number(e.target.value))
                            }
                          >
                            <option value="">Select level</option>
                            {availableChatLevels.map((level) => (
                              <option key={level} value={level}>
                                Level {level}
                              </option>
                            ))}
                          </select>
                          <Input
                            placeholder="Type your message..."
                            value={newChatMessage}
                            onChange={(e) => setNewChatMessage(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendChatMessage();
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            onClick={handleSendChatMessage}
                            disabled={
                              !newChatMessage.trim() ||
                              selectedChatLevel === null
                            }
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        {!selectedChatLevel && (
                          <p className="text-xs text-amber-600">
                            <AlertCircle className="h-3 w-3 inline mr-1" />
                            Please select a level to send message to
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Documents
                  </CardTitle>
                  <CardDescription>
                    View and download supporting documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {documents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <p>No documents attached to this request</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((doc) => (
                        <motion.div
                          key={doc.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center p-4 border rounded-lg"
                        >
                          <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {doc.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {doc.size} • {doc.type}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="icon" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <DownloadCloud className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="mt-0">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Comments
                  </CardTitle>
                  <CardDescription>
                    Comments and notes from approval process
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {comments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p>No comments yet</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-4"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {getInitials(comment.author)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {comment.author}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    Level {comment.level} •{" "}
                                    {formatDate(comment.timestamp)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-gray-800">{comment.text}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}

                    {/* Add comment form */}
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Add Comment
                      </h4>
                      <div className="flex flex-col gap-3">
                        <Textarea
                          placeholder="Add your comment..."
                          className="resize-none"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          ref={commentInputRef}
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Rejection Reason Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Reject Request
            </DialogTitle>
            <DialogDescription>
              Please provide a detailed reason for rejecting this budget
              request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason for rejection"
              className="resize-none h-32"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            {rejectionReason.trim().length > 0 &&
              rejectionReason.trim().length < 10 && (
                <p className="mt-2 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3 inline mr-1" />
                  Rejection reason must be at least 10 characters long
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
              <XCircle className="mr-2 h-4 w-4" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default RequestDetailsPage;
