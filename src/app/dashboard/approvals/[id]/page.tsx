"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  Clock,
  MessageSquare,
  Info,
  User,
  Send,
  Clipboard,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import useAxios from "@/app/hooks/use-axios";

// Use the same interfaces from the main page
interface Asset {
  name: string;
  quantity: number;
}

interface FormDetails {
  plant: number;
  date: string;
  employeeCode: string;
  employeeName: string;
  department: number;
  designation: number;
  assets: Asset[];
  assetAmount: string;
  reason: string;
  policyAgreement: boolean;
  initiateDept: number;
  currentStatus: string;
  benefitToOrg: string;
  approvalCategory: string;
  approvalType: string;
  notifyTo: number;
}

interface ApprovalForm {
  id: string;
  submitter: string;
  department: string;
  status: string;
  level: number;
  updatedAt: string;
  formData: FormDetails;
}

interface Comment {
  id: string;
  user: string;
  userRole: string;
  text: string;
  timestamp: string;
  userInitials: string;
}

// Mock data for fallback/development
const mockForms: ApprovalForm[] = [
  {
    id: "REQ-2025-006",
    submitter: "Aman Bhatt",
    department: "HR",
    status: "Pending",
    level: 2,
    updatedAt: "2025-03-10",
    formData: {
      plant: 101,
      date: "2025-03-10",
      employeeCode: "EMP001",
      employeeName: "Aman Bhatt",
      department: 2,
      designation: 5,
      assets: [{ name: "Laptop", quantity: 1 }],
      assetAmount: "1200 INR",
      reason: "Remote work requirement",
      policyAgreement: true,
      initiateDept: 2,
      currentStatus: "Pending",
      benefitToOrg: "Increased productivity",
      approvalCategory: "Hardware",
      approvalType: "New Request",
      notifyTo: 3,
    },
  },
  {
    id: "REQ-2025-007",
    submitter: "Priya Singh",
    department: "Engineering",
    status: "Pending",
    level: 1,
    updatedAt: "2025-03-11",
    formData: {
      plant: 102,
      date: "2025-03-11",
      employeeCode: "EMP145",
      employeeName: "Priya Singh",
      department: 3,
      designation: 4,
      assets: [
        { name: "Monitor", quantity: 2 },
        { name: "Keyboard", quantity: 1 }
      ],
      assetAmount: "800 INR",
      reason: "Current equipment malfunctioning",
      policyAgreement: true,
      initiateDept: 3,
      currentStatus: "Pending",
      benefitToOrg: "Improved productivity with proper equipment",
      approvalCategory: "Hardware",
      approvalType: "Replacement",
      notifyTo: 5,
    },
  },
  {
    id: "REQ-2025-008",
    submitter: "Rahul Verma",
    department: "Marketing",
    status: "Pending",
    level: 3,
    updatedAt: "2025-03-12",
    formData: {
      plant: 101,
      date: "2025-03-12",
      employeeCode: "EMP089",
      employeeName: "Rahul Verma",
      department: 4,
      designation: 3,
      assets: [
        { name: "Photography Equipment", quantity: 1 },
        { name: "Editing Software License", quantity: 1 }
      ],
      assetAmount: "3500 INR",
      reason: "New content creation requirements",
      policyAgreement: true,
      initiateDept: 4,
      currentStatus: "Pending",
      benefitToOrg: "Enhanced marketing materials and brand visibility",
      approvalCategory: "Software & Equipment",
      approvalType: "New Request",
      notifyTo: 6,
    },
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

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1 }
  },
  exit: { opacity: 0 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const commentVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { duration: 0.2 } 
  }
};

export default function ApprovalDetails() {
  const params = useParams();
  const router = useRouter();
  const api = useAxios();
  const [form, setForm] = useState<ApprovalForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  // Fetch approval details
  useEffect(() => {
    const fetchApprovalDetails = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from API
        // const response = await api.get(`/approval-requests/${params.id}`);
        // setForm(response.data);
        
        // Using mock data for now
        const foundForm = mockForms.find((f) => f.id === params.id);
        setForm(foundForm || null);
        
        // Mock comments
        setComments(mockComments);
      } catch (error) {
        console.error("Error fetching approval details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchApprovalDetails();
    }
  }, [params.id]);

  const handleAction = async (action: "approve" | "reject") => {
    if (!reviewComment) {
      alert("Please add review comments before taking action");
      return;
    }

    try {
      // await api.put(`/approval-requests/${params.id}`, {
      //   status: action === "approve" ? "Approved" : "Rejected",
      //   comment: reviewComment
      // });

      console.log(
        `Form ID: ${params.id}, Action: ${action.toUpperCase()}, Comment: ${reviewComment}`
      );

      // Update local state
      if (form) {
        setForm({
          ...form,
          status: action === "approve" ? "Approved" : "Rejected",
        });
      }

      // Add the review comment to comments
      const newReviewComment: Comment = {
        id: `comment-${Date.now()}`,
        user: "You",
        userRole: "Approver",
        text: reviewComment,
        timestamp: new Date().toISOString(),
        userInitials: "YO",
      };
      
      setComments([...comments, newReviewComment]);
      setReviewComment("");
    } catch (error) {
      console.error(`Error ${action}ing form:`, error);
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rejected":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4 mr-1" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "rejected":
        return <XCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="p-4 md:p-6">
          <Button
            variant="ghost"
            className="mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Approvals
          </Button>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : !form ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium">Request Not Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                The approval request you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button className="mt-4" onClick={() => router.push("/dashboard/approvals")}>
                Return to Dashboard
              </Button>
            </div>
          ) : (
            <>
              {/* Simple Header */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mb-6">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Request ID</div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {form.id}
                      </h1>
                      <div className="flex items-center mt-2">
                        <span className="text-gray-500 dark:text-gray-400 mr-2">Status:</span>
                        <Badge
                          className={`${getStatusColor(form.status)} flex items-center px-2 py-1`}
                        >
                          {getStatusIcon(form.status)}
                          {form.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 mr-1">Requester:</span>
                        <span className="font-medium">{form.submitter}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 mr-1">Submitted:</span>
                        <span className="font-medium">{form.updatedAt}</span>
                      </div>
                      <div className="flex items-center">
                        <Clipboard className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 mr-1">Type:</span>
                        <span className="font-medium">{form.formData.approvalType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <TabsList className="h-14 bg-transparent p-0 w-full justify-start gap-0">
                      <TabsTrigger
                        value="details"
                        className={`h-14 border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 font-medium ${
                          activeTab === "details"
                            ? "border-blue-600 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                      >
                        <Info className="w-4 h-4 mr-2" />
                        Details
                      </TabsTrigger>
                      <TabsTrigger
                        value="comments"
                        className={`h-14 border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 font-medium ${
                          activeTab === "comments"
                            ? "border-blue-600 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Comments ({comments.length})
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Details Tab */}
                  <TabsContent value="details" className="p-0 mt-0" forceMount>
                    <div 
                      className="p-6"
                      style={{ display: activeTab === "details" ? "block" : "none" }}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                              Request Details
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <dl className="grid grid-cols-3 gap-x-3 gap-y-3 text-sm">
                                <dt className="col-span-1 font-medium text-gray-500">Employee ID:</dt>
                                <dd className="col-span-2">{form.formData.employeeCode}</dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Employee Name:</dt>
                                <dd className="col-span-2">{form.formData.employeeName}</dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Department:</dt>
                                <dd className="col-span-2">{form.department}</dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Type:</dt>
                                <dd className="col-span-2">{form.formData.approvalType}</dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Category:</dt>
                                <dd className="col-span-2">{form.formData.approvalCategory}</dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Amount:</dt>
                                <dd className="col-span-2 font-semibold text-blue-600 dark:text-blue-400">
                                  {form.formData.assetAmount}
                                </dd>
                              </dl>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Request Reason</h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <p className="text-sm">{form.formData.reason}</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Benefit to Organization</h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <p className="text-sm">{form.formData.benefitToOrg}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Assets Requested</h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Item
                                    </th>
                                    <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Quantity
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {form.formData.assets.map((asset, idx) => (
                                    <tr key={idx}>
                                      <td className="py-3">{asset.name}</td>
                                      <td className="py-3 text-right font-medium">
                                        {asset.quantity} unit(s)
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {form.status === "Pending" && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                                Approval Action
                              </h3>
                              <div className="space-y-3">
                                <Textarea
                                  placeholder="Add your review comments (required)"
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  className="resize-none border-gray-200 dark:border-gray-700 h-24"
                                />
                                <div className="flex flex-col xs:flex-row justify-end items-center gap-3">
                                  <Button
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => handleAction("reject")}
                                    disabled={!reviewComment}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                  </Button>
                                  <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleAction("approve")}
                                    disabled={!reviewComment}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Comments Tab */}
                  <TabsContent value="comments" className="p-0 mt-0" forceMount>
                    <div 
                      className="p-6"
                      style={{ display: activeTab === "comments" ? "block" : "none" }}
                    >
                      <div className="flex flex-col h-[500px]">
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                          {comments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                              <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No comments yet</h3>
                              <p className="mt-1 text-sm text-gray-500 max-w-md">
                                Be the first to leave a comment on this request.
                              </p>
                            </div>
                          ) : (
                            comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    {comment.userInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-start mb-1">
                                      <div className="font-medium text-sm">{comment.user}</div>
                                      <div className="text-xs text-gray-500">
                                        {formatDate(comment.timestamp)}
                                      </div>
                                    </div>
                                    <p className="text-sm">{comment.text}</p>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 ml-2">{comment.userRole}</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <Separator className="mb-4" />

                        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                YO
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 relative">
                              <Textarea
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="resize-none min-h-[80px] pr-12"
                              />
                              <Button
                                size="icon"
                                className="h-8 w-8 absolute bottom-2 right-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
