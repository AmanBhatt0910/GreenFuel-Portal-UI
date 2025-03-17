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

interface ApprovalForm {
  id: string;
  user: string;
  business_unit: string;
  department: string;
  designation: string;
  date: string;
  total: number;
  reason: string;
  policy_agreement: boolean;
  initiate_dept: string;
  status: string;
  benefit_to_organisation: string;
  approval_category: string;
  approval_type: string;
  notify_to: string;
  current_level: number;
  max_level: number;
  rejected: boolean;
  rejection_reason: string | null;
  budget_id: string;
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

// Modify interface for API responses
interface UserInfo {
  id: number;
  name: string;
  email: string;
  username?: string;
}

interface Department {
  id: number;
  name: string;
}

interface BusinessUnit {
  id: number;
  name: string;
}

interface Designation {
  id: number;
  name: string;
}

// Add cache interfaces to reduce API calls
interface UserCache {
  [key: string]: UserInfo;
}

interface DepartmentCache {
  [key: string]: Department;
}

interface BusinessUnitCache {
  [key: string]: BusinessUnit;
}

interface DesignationCache {
  [key: string]: Designation;
}

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
  
  // Add caches for API data
  const [userCache, setUserCache] = useState<UserCache>({});
  const [departmentCache, setDepartmentCache] = useState<DepartmentCache>({});
  const [businessUnitCache, setBusinessUnitCache] = useState<BusinessUnitCache>({});
  const [designationCache, setDesignationCache] = useState<DesignationCache>({});
  
  // Add enriched data state
  const [enrichedForm, setEnrichedForm] = useState<any>(null);
  
  // Format date in a readable way
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      // Format: March 21, 2025, 3:30 PM
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
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
        email: userData.email || 'No email available'
      };
      
      // Update cache
      setUserCache(prev => ({
        ...prev,
        [userKey]: userInfo
      }));
      
      return userInfo;
    } catch (error) {
      console.error(`Error fetching user details for ID ${userId}:`, error);
      return { 
        id: userId,
        name: `User ${userId}`, 
        email: 'No email available'
      };
    }
  };
  
  // Fetch department details
  const fetchDepartmentDetails = async (deptId: number): Promise<Department> => {
    const deptKey = deptId.toString();
    
    // Check cache first
    if (departmentCache[deptKey]) {
      return departmentCache[deptKey];
    }
    
    try {
      const response = await api.get(`/departments/${deptId}/`);
      const department: Department = {
        id: deptId,
        name: response.data.name || `Department ${deptId}`
      };
      
      // Update cache
      setDepartmentCache(prev => ({
        ...prev,
        [deptKey]: department
      }));
      
      return department;
    } catch (error) {
      console.error(`Error fetching department details for ID ${deptId}:`, error);
      return { 
        id: deptId,
        name: `Department ${deptId}`
      };
    }
  };
  
  // Fetch business unit details
  const fetchBusinessUnitDetails = async (buId: number): Promise<BusinessUnit> => {
    const buKey = buId.toString();
    
    // Check cache first
    if (businessUnitCache[buKey]) {
      return businessUnitCache[buKey];
    }
    
    try {
      const response = await api.get(`/business-units/${buId}/`);
      const businessUnit: BusinessUnit = {
        id: buId,
        name: response.data.name || `Business Unit ${buId}`
      };
      
      // Update cache
      setBusinessUnitCache(prev => ({
        ...prev,
        [buKey]: businessUnit
      }));
      
      return businessUnit;
    } catch (error) {
      console.error(`Error fetching business unit details for ID ${buId}:`, error);
      return { 
        id: buId,
        name: `Business Unit ${buId}`
      };
    }
  };
  
  // Fetch designation details
  const fetchDesignationDetails = async (designationId: number): Promise<Designation> => {
    const designationKey = designationId.toString();
    
    // Check cache first
    if (designationCache[designationKey]) {
      return designationCache[designationKey];
    }
    
    try {
      const response = await api.get(`/designations/${designationId}/`);
      const designation: Designation = {
        id: designationId,
        name: response.data.name || `Designation ${designationId}`
      };
      
      // Update cache
      setDesignationCache(prev => ({
        ...prev,
        [designationKey]: designation
      }));
      
      return designation;
    } catch (error) {
      console.error(`Error fetching designation details for ID ${designationId}:`, error);
      return { 
        id: designationId,
        name: `Designation ${designationId}`
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
        fetchDesignationDetails(Number(form.designation))
      ]);
      
      return {
        ...form,
        user_name: user.name,
        user_email: user.email,
        department_name: department.name,
        business_unit_name: businessUnit.name,
        designation_name: designation.name,
        formatted_date: formatDate(form.date),
        formatted_total: new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(Number(form.total))
      };
    } catch (error) {
      console.error('Error enriching approval data:', error);
      return form;
    }
  };

  // Fetch approval details
  useEffect(() => {
    const fetchApprovalDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch actual data from API
        const response = await api.get(`/approval-requests/${params.id}/`);
        const formData = response.data;
        
        console.log("API response:", formData);
        setForm(formData);
        
        // Enrich the data with names
        const enrichedData = await enrichApprovalData(formData);
        setEnrichedForm(enrichedData);
        
        // Fetch comments (if available) or use mock data
        // const commentsResponse = await api.get(`/approval-comments/${params.id}/`);
        // setComments(commentsResponse.data);
        setComments(mockComments);
      } catch (error) {
        console.error("Error fetching approval details:", error);
        
        // Fallback to mock data
        const foundForm = mockForms.find((f) => f.id === params.id);
        if (foundForm) {
          setForm(foundForm);
          const enrichedData = await enrichApprovalData(foundForm);
          setEnrichedForm(enrichedData);
        }
        
        setComments(mockComments);
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
              {/* Header with key information */}
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
                        <span className="font-medium">{enrichedForm?.user_name || form.user}</span>
                      </div>
                      <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 ml-6">
                        {enrichedForm?.user_email || ""}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 mr-1">Submitted:</span>
                        <span className="font-medium">{enrichedForm?.formatted_date || form.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clipboard className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 mr-1">Type:</span>
                        <span className="font-medium">{form.approval_type}</span>
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
                          {/* Approval Information */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                              <Info className="w-4 h-4 mr-2 text-blue-500" />
                              Approval Information
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <dl className="grid grid-cols-3 gap-x-3 gap-y-3 text-sm">
                                <dt className="col-span-1 font-medium text-gray-500">Budget ID:</dt>
                                <dd className="col-span-2 font-semibold">{form.budget_id}</dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Category:</dt>
                                <dd className="col-span-2">
                                  <Badge variant="outline" className="font-normal">
                                    {form.approval_category}
                                  </Badge>
                                </dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Type:</dt>
                                <dd className="col-span-2">
                                  <Badge variant="outline" className="font-normal">
                                    {form.approval_type}
                                  </Badge>
                                </dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Status:</dt>
                                <dd className="col-span-2">
                                  <Badge
                                    className={`${getStatusColor(form.status)} flex w-fit items-center px-2 py-0.5`}
                                  >
                                    {getStatusIcon(form.status)}
                                    {form.status}
                                  </Badge>
                                </dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Approval Level:</dt>
                                <dd className="col-span-2">
                                  <div className="flex items-center">
                                    <span className="font-medium">{form.current_level}</span>
                                    <span className="mx-1">of</span>
                                    <span>{form.max_level}</span>
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>

                          {/* Request Reason */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Request Reason</h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <p className="text-sm">{form.reason}</p>
                            </div>
                          </div>

                          {/* Benefit to Organization */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Benefit to Organization</h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <p className="text-sm">{form.benefit_to_organisation}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {/* Requester Details */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                              <User className="w-4 h-4 mr-2 text-blue-500" />
                              Requester Details
                            </h3>
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <dl className="grid grid-cols-3 gap-x-3 gap-y-3 text-sm">
                                <dt className="col-span-1 font-medium text-gray-500">Name:</dt>
                                <dd className="col-span-2 font-semibold">{enrichedForm?.user_name || form.user}</dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Email:</dt>
                                <dd className="col-span-2 text-blue-600 dark:text-blue-400">{enrichedForm?.user_email || "Not available"}</dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Business Unit:</dt>
                                <dd className="col-span-2">{enrichedForm?.business_unit_name || form.business_unit}</dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Department:</dt>
                                <dd className="col-span-2">{enrichedForm?.department_name || form.department}</dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Designation:</dt>
                                <dd className="col-span-2">{enrichedForm?.designation_name || form.designation}</dd>
                              </dl>
                            </div>
                          </div>

                          {/* Financial Information */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                              <div className="w-4 h-4 mr-2 text-blue-500">₹</div>
                              Financial Information
                            </h3>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4">
                              <div className="text-center mb-3">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Total Amount</div>
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                  {enrichedForm?.formatted_total || form.total}
                                </div>
                              </div>
                              
                              <Separator className="my-3" />
                              
                              <dl className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
                                <dt className="col-span-1 font-medium text-gray-500">Budget ID:</dt>
                                <dd className="col-span-1 text-right">{form.budget_id}</dd>
                                
                                <dt className="col-span-1 font-medium text-gray-500">Policy Agreement:</dt>
                                <dd className="col-span-1 text-right">
                                  {form.policy_agreement ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      Accepted
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                      Not Accepted
                                    </Badge>
                                  )}
                                </dd>
                              </dl>
                            </div>
                          </div>

                          {/* Approval Action Section */}
                          {form.status === "Pending" && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
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

                  {/* Comments Tab - Remains largely unchanged */}
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
