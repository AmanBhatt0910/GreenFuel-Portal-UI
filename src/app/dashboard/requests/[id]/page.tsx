"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  CalendarDays,
  AlertCircle,
  Send,
  DownloadCloud,
  Eye,
  MessageSquare,
  Info,
  DollarSign,
  Paperclip,
  PlusCircle,
  User,
  Building,
  Building2,
  Bell,
  Bookmark,
  Lightbulb,
  CheckSquare,
  AlertTriangle,
  ListOrdered,
  ChevronRight,
  Layers,
  BarChart,
  Tag,
  Users,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "@/app/hooks/use-axios";
import {
  ApiDocument,
  ApprovalLevel,
  BudgetRequest,
  ChatMessage,
  Comment,
  Designation,
  Document,
  EntityInfo,
  StatusBadge,
  UserInfo,
} from "./type";
import { GFContext } from "@/context/AuthContext";
import AssetDetailsTable from "./components/AssetDetailsTable";

// Define a consistent color theme
const COLORS = {
  primary: {
    light: "#e0f2fe", // Light blue
    medium: "#38bdf8", // Medium blue
    default: "#0284c7", // Default blue
    dark: "#0369a1", // Dark blue
  },
  secondary: {
    light: "#f0fdf4", // Light green
    medium: "#4ade80", // Medium green
    default: "#16a34a", // Default green
    dark: "#166534", // Dark green
  },
  tertiary: {
    light: "#fef3c7", // Light amber
    medium: "#fbbf24", // Medium amber
    default: "#d97706", // Default amber
    dark: "#b45309", // Dark amber
  },
  quaternary: {
    light: "#e0e7ff", // Light indigo
    medium: "#818cf8", // Medium indigo
    default: "#4f46e5", // Default indigo
    dark: "#4338ca", // Dark indigo
  },
  status: {
    pending: { bg: "#fef3c7", text: "#d97706", icon: "#f59e0b" },
    approved: { bg: "#dcfce7", text: "#16a34a", icon: "#22c55e" },
    rejected: { bg: "#fee2e2", text: "#dc2626", icon: "#ef4444" },
    neutral: { bg: "#f3f4f6", text: "#4b5563", icon: "#6b7280" },
  },
};

interface CommentInputProps {
  onAddComment: (text: string) => void;
}

// Separate component for comment input to prevent re-renders of the entire page
const CommentInput: React.FC<CommentInputProps> = React.memo(
  ({ onAddComment }) => {
    const [inputValue, setInputValue] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
    };

    const handleSubmit = () => {
      if (inputValue.trim()) {
        onAddComment(inputValue);
        setInputValue("");
      }
    };

    return (
      <div className="w-full space-y-3">
        <Textarea
          placeholder="Add your comment..."
          value={inputValue}
          onChange={handleChange}
          className="resize-none border-gray-300 focus:border-sky-500 focus:ring-sky-500 rounded-lg"
          rows={3}
        />
        <Button
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
          className="ml-auto bg-sky-600 hover:bg-sky-700 text-white flex items-center transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
        >
          <Send className="h-4 w-4 mr-2" /> Add Comment
        </Button>
      </div>
    );
  }
);

interface CommentItemProps {
  comment: Comment;
  formatDate: (dateString: string) => string;
}

// Separate component for rendering a single comment
const CommentItem: React.FC<CommentItemProps> = React.memo(
  ({ comment, formatDate }) => {
    return (
      <div className="p-4 bg-sky-50 rounded-lg border border-sky-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center mb-3">
          <Avatar className="h-9 w-9 mr-3 border-2 border-sky-200">
            <AvatarFallback className="bg-gradient-to-br from-sky-400 to-sky-600 text-white">
              {comment.author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sky-900">{comment.author}</p>
            <p className="text-xs text-sky-600">
              {formatDate(comment.timestamp)}
            </p>
          </div>
        </div>
        <p className="whitespace-pre-line text-gray-700">{comment.text}</p>
      </div>
    );
  }
);

interface CommentsListProps {
  comments: Comment[];
  formatDate: (dateString: string) => string;
}

// Separate component for comments list
const CommentsList: React.FC<CommentsListProps> = React.memo(
  ({ comments, formatDate }) => {
    if (comments.length === 0) {
      return (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No comments yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Be the first to leave a comment
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            formatDate={formatDate}
          />
        ))}
      </div>
    );
  }
);

interface DocumentsListProps {
  documents: Document[];
}

// Separate component for document list
const DocumentsList: React.FC<DocumentsListProps> = React.memo(
  ({ documents }) => {
    if (documents.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No documents attached</p>
          <p className="text-gray-400 text-sm mt-1">
            Upload supporting documents for this request
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const fullUrl = `http://127.0.0.1:8000${doc.url}`;

          // Choose an icon based on file type
          let DocIcon = FileText;
          if (doc.type?.toLowerCase().includes("pdf")) DocIcon = FileText;
          else if (doc.type?.toLowerCase().includes("image"))
            DocIcon = FileText;
          else if (
            doc.type?.toLowerCase().includes("excel") ||
            doc.type?.toLowerCase().includes("sheet")
          )
            DocIcon = FileText;

          return (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-3 rounded-lg mr-4 shadow-sm">
                  <DocIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {doc.type} • {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-lg"
                  onClick={() => window.open(fullUrl, "_blank")}
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-lg"
                  onClick={async () => {
                    try {
                      const response = await fetch(fullUrl);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = doc.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error("Download failed:", error);
                    }
                  }}
                >
                  <DownloadCloud className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

interface GFContextType {
  userInfo: UserInfo | null;
}

const RequestDetailsPage: React.FC = () => {
  const params = useParams();
  const requestId = params.id as string;
  const searchParams = useSearchParams();

  const [request, setRequest] = useState<BudgetRequest | null>(null);
  const [userInfos, setUserInfo] = useState<UserInfo | null>(null);
  const [approvalLevels, setApprovalLevels] = useState<ApprovalLevel[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("details");
  const [formValid, setFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [approvalProgress, setApprovalProgress] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [businessUnits, setBusinessUnits] = useState<EntityInfo[]>([]);
  const [departments, setDepartments] = useState<EntityInfo[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);

  const [assestDetails, setassestDetails] = useState();

  const [designationMap, setDesignationMap] = useState<
    Map<number, Designation>
  >(new Map());
  const [departmentMap, setDepartmentMap] = useState<Map<number, EntityInfo>>(
    new Map()
  );
  const [businessUnitMap, setBusinessUnitMap] = useState<
    Map<number, EntityInfo>
  >(new Map());

  const { userInfo } = useContext(GFContext);

  const userIdParam = userInfo?.id;

  const api = useAxios();

  // Format date function - memoized to prevent recreation on each render
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, []);

  // Get status badge - memoized
  const getStatusBadge = useCallback((status: string): StatusBadge => {
    if (!status) {
      return {
        color: "text-gray-500",
        icon: <Info className="h-4 w-4" />,
        bgColor: "bg-gray-100",
      };
    }

    switch (status.toLowerCase()) {
      case "pending":
        return {
          color: `text-${COLORS.status.pending.text}`,
          icon: (
            <Clock
              className="h-4 w-4"
              style={{ color: COLORS.status.pending.icon }}
            />
          ),
          bgColor: `bg-${COLORS.status.pending.bg}`,
        };
      case "approved":
        return {
          color: `text-${COLORS.status.approved.text}`,
          icon: (
            <CheckCircle
              className="h-4 w-4"
              style={{ color: COLORS.status.approved.icon }}
            />
          ),
          bgColor: `bg-${COLORS.status.approved.bg}`,
        };
      case "rejected":
        return {
          color: `text-${COLORS.status.rejected.text}`,
          icon: (
            <XCircle
              className="h-4 w-4"
              style={{ color: COLORS.status.rejected.icon }}
            />
          ),
          bgColor: `bg-${COLORS.status.rejected.bg}`,
        };
      default:
        return {
          color: `text-${COLORS.status.neutral.text}`,
          icon: (
            <Info
              className="h-4 w-4"
              style={{ color: COLORS.status.neutral.icon }}
            />
          ),
          bgColor: `bg-${COLORS.status.neutral.bg}`,
        };
    }
  }, []);

  // Optimized entity lookup function - memoized
  const getEntityName = useCallback(
    (entityMap: Map<number, EntityInfo>, id: number): string => {
      const entity = entityMap.get(id);
      return entity ? entity.name : "Unknown";
    },
    []
  );

  // Optimized user lookup function - memoized
  const getUserName = useCallback(
    (userId: number): string => {
      const user = users.find((u) => u.id === userId);
      return user ? user.name : "Unknown User";
    },
    [users]
  );

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Get current user info - either from params or get current user
        const endpoint = userIdParam
          ? `/userInfo/${userIdParam}`
          : "/userInfo/";
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
          console.log("response", response);
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

  // Fetch comments - now using useCallback
  const fetchComments = useCallback(async () => {
    if (!request?.id) return;

    try {
      setLoading(true);

      const response = await api.get(`/chats?form_id=${request.id}`);

      // Map the API response based on the actual structure
      const mappedComments = response.data.map((chat: any) => {
        const authorName = chat.sender?.name || "Unknown";

        return {
          id: chat.id,
          author: authorName,
          text: chat.message,
          timestamp: chat.timestamp,
          read: chat.read,
          authorId: chat.sender?.id,
        };
      });

      // Only update state if comments have changed
      if (JSON.stringify(mappedComments) !== JSON.stringify(comments)) {
        setComments(mappedComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  }, [request?.id, comments]);

  // Use the callback in the effect
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Fetch documents - now using useCallback
  const fetchDocuments = useCallback(async () => {
    if (!request?.id) return;

    try {
      setLoading(true);

      const response = await api.get(
        `/approval-attachments?form_id=${request.id}`
      );

      const mappedDocuments = response.data.map((doc: ApiDocument) => ({
        id: doc.id,
        name: doc.file.split("/").pop() || "Document",
        type: doc.type || "Unknown",
        size: formatDate(doc.uploaded_at),
        url: doc.file,
      }));

      // Only update state if documents have changed
      if (JSON.stringify(mappedDocuments) !== JSON.stringify(documents)) {
        setDocuments(mappedDocuments);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  }, [request?.id, documents, formatDate, api]);

  // Use the callback in the effect
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    if (request?.id) {
      fetchAssetDetails(request.id);
    }
  }, [request?.id]);

  const fetchAssetDetails = async (formId: number) => {
    try {
      const response = await api.get(`/approval-items/?form_id=${formId}`);
      console.log("Asset details response:", response);
      setassestDetails(response.data);
    } catch (error: any) {
      console.error("Error fetching asset details:", error?.message);
    }
  };

  // Optimized handleAddComment function
  const handleAddComment = useCallback(
    async (commentText: string) => {
      if (!commentText.trim() || !userInfos) return;

      try {
        const commentData = {
          form: requestId,
          sender: userInfos?.id,
          message: commentText,
        };

        const response = await api.post(`/chats/`, commentData);

        const newCommentObj: Comment = {
          id: response.data.id || Date.now(),
          author: userInfos?.name || "You",
          text: commentText,
          timestamp: response.data.timestamp || new Date().toISOString(),
          read: response.data.read || "",
        };

        setComments((prevComments) => [...prevComments, newCommentObj]);
      } catch (err) {
        console.error("Error adding comment:", err);
        setError("Failed to add comment");
      }
    },
    [requestId, userInfos]
  );

  if (loading && !request) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-sky-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sky-700 font-medium">Loading request details...</p>
          <p className="text-sky-500 text-sm mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant="destructive"
        className="max-w-4xl mx-auto mt-8 border border-red-200 shadow-md"
      >
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg">Error</AlertTitle>
        <AlertDescription className="mt-2">{error}</AlertDescription>
      </Alert>
    );
  }

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <Alert className="border border-sky-200 bg-sky-50 shadow-md">
          <AlertCircle className="h-5 w-5 text-sky-600" />
          <AlertTitle className="text-sky-700">Not Found</AlertTitle>
          <AlertDescription className="text-sky-600 mt-1">
            The requested budget request was not found.
          </AlertDescription>
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
            <Alert className="bg-green-50 border border-green-200 shadow-md">
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
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl shadow-md p-6 mb-6 border-l-4 border-sky-500 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Bookmark className="mr-2 h-6 w-6 text-sky-600" />
              Budget Request {request.budget_id}
            </h1>
            <div className="flex items-center flex-wrap gap-3">
              <Badge
                className={`px-3 py-1.5 text-sm font-medium ${
                  getStatusBadge(request.current_status).bgColor
                } ${getStatusBadge(request.current_status).color} rounded-md`}
              >
                <span className="flex items-center">
                  {getStatusBadge(request.current_status).icon}
                  <span className="ml-1.5">{request.current_status}</span>
                </span>
              </Badge>
              <span className="text-sm text-gray-600 flex items-center bg-gray-100 px-3 py-1.5 rounded-md">
                <CalendarDays className="h-4 w-4 mr-1.5 text-sky-600" />
                {formatDate(request.date)}
              </span>
              <span className="text-sm text-gray-600 flex items-center bg-gray-100 px-3 py-1.5 rounded-md">
                <DollarSign className="h-4 w-4 mr-1.5 text-sky-600" />
                {request.total}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs
            defaultValue="details"
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start mb-6 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-100 data-[state=active]:to-indigo-100 data-[state=active]:text-sky-700 transition-all duration-300 rounded-md"
              >
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-100 data-[state=active]:to-indigo-100 data-[state=active]:text-sky-700 transition-all duration-300 rounded-md"
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-100 data-[state=active]:to-indigo-100 data-[state=active]:text-sky-700 transition-all duration-300 rounded-md"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-0">
              <Card className="border border-gray-200 shadow-md overflow-hidden rounded-xl">
                <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-sky-50 to-indigo-50">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-sky-600 mr-2" />
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Budget Request Details
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 mt-1">
                    Complete information about this budget request
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-sky-50 p-5 rounded-xl border border-sky-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <h3 className="font-medium text-sky-800 mb-4 text-lg flex items-center">
                        <Info className="h-5 w-5 mr-2 text-sky-600" />
                        Basic Information
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-white p-3 rounded-md border border-sky-100 hover:border-sky-200 transition-colors duration-300">
                          <p className="text-sm font-medium text-sky-700">
                            Budget ID
                          </p>
                          <p className="text-base text-gray-
                          <p className="text-base text-gray-900 mt-1">
                            {request.budget_id}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-sky-100">
                          <p className="text-sm font-medium text-sky-700">
                            Date Submitted
                          </p>
                          <p className="text-base text-gray-900 mt-1 flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1.5 text-sky-500" />
                            {formatDate(request.date)}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-sky-100">
                          <p className="text-sm font-medium text-sky-700">
                            Total Amount
                          </p>
                          <p className="text-base text-gray-900 mt-1 flex items-center">
                            <DollarSign className="h-4 w-4 mr-1.5 text-sky-500" />
                            {request.total}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-sky-100">
                          <p className="text-sm font-medium text-sky-700">
                            Approval Type
                          </p>
                          <p className="text-base text-gray-900 mt-1">
                            {request.approval_type}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-sky-100">
                          <p className="text-sm font-medium text-sky-700">
                            Approval Category
                          </p>
                          <p className="text-base text-gray-900 mt-1">
                            {request.approval_category}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-5 rounded-lg border border-sky-100">
                      <h3 className="font-medium text-amber-800 mb-4 text-lg flex items-center">
                        <Building className="h-5 w-5 mr-2 text-amber-600" />
                        Organizational Details
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-white p-3 rounded-md border border-amber-100">
                          <p className="text-sm font-medium text-amber-700">
                            Requester
                          </p>
                          <p className="text-base text-gray-900 mt-1">
                            {getUserName(request.user)}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-md border border-amber-100">
                          <p className="text-sm font-medium text-amber-700">
                            Business Unit
                          </p>
                          <p className="text-base text-gray-900 mt-1">
                            {getEntityName(
                              businessUnitMap,
                              request.business_unit
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Department
                          </p>
                          <p className="text-base text-gray-900">
                            {getEntityName(departmentMap, request.department)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Initiating Department
                          </p>
                          <p className="text-base text-gray-900">
                            {request.initiate_dept
                              ? getEntityName(
                                  departmentMap,
                                  request.initiate_dept
                                )
                              : "Same as Department"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Notify To
                          </p>
                          <p className="text-base text-gray-900">
                            {request.notify_to
                              ? getUserName(request.notify_to)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="font-medium text-gray-700 mb-4 text-lg">
                      Request Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Reason for Request
                        </p>
                        <p className="text-base text-gray-900 whitespace-pre-line mt-1">
                          {request.reason}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Benefit to Organization
                        </p>
                        <p className="text-base text-gray-900 whitespace-pre-line mt-1">
                          {request.benefit_to_organisation}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Policy Agreement
                        </p>
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
                          <p className="text-sm font-medium text-red-500">
                            Rejection Reason
                          </p>
                          <p className="text-base text-red-600 whitespace-pre-line mt-1">
                            {request.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <AssetDetailsTable
                    assets={
                      Array.isArray(assestDetails)
                        ? assestDetails
                        : assestDetails
                        ? [assestDetails]
                        : []
                    }
                  />
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
                  <DocumentsList documents={documents} />
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
                    <CommentsList comments={comments} formatDate={formatDate} />
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <CommentInput onAddComment={handleAddComment} />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
