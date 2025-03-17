"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Search,
  Clock,
  AlertCircle,
  ExternalLink,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAxios from "@/app/hooks/use-axios";

interface UserInfo {
  name: string;
  email: string;
  username?: string;
}

interface ApprovalForm {
  id: string;
  user: string;
  user_name?: string;
  user_email?: string;
  business_unit: string;
  department: string;
  department_name?: string;
  designation: string;
  date: string;
  formatted_date?: string;
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

// Cache objects to avoid redundant API calls
interface UserCache {
  [key: string]: UserInfo;
}

interface DepartmentCache {
  [key: string]: string;
}

const ApprovalDashboard: React.FC = () => {
  const [forms, setForms] = useState<ApprovalForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userCache, setUserCache] = useState<UserCache>({});
  const [departmentCache, setDepartmentCache] = useState<DepartmentCache>({});
  const api = useAxios();
  const router = useRouter();

  // Improved date formatting function to handle more date formats
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      // Try to parse the date in multiple formats
      let date: Date;
      
      // Check if it's an ISO string (2025-03-10)
      if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
        date = new Date(dateString);
      } 
      // Check if it includes timestamp format (2025-03-17T06:03:44.416543Z)
      else if (dateString.includes('T') && dateString.includes(':')) {
        date = new Date(dateString);
      }
      // Try to parse other date formats
      else {
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date format: ${dateString}`);
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

  // Fetch user details by ID
  const fetchUserDetails = async (userId: string): Promise<UserInfo> => {
    // Check cache first
    if (userCache[userId]) {
      return userCache[userId];
    }
    
    try {
      const response = await api.get(`/userInfo/${userId}/`);
      console.log("User response:", response.data);
      const userData = response.data;
      const userInfo: UserInfo = {
        name: userData.name || userData.username || userId,
        email: userData.email || 'No email available',
        username: userData.username
      };
      
      // Update cache
      setUserCache(prev => ({
        ...prev,
        [userId]: userInfo
      }));
      
      return userInfo;
    } catch (error) {
      console.error(`Error fetching user details for ID ${userId}:`, error);
      return { 
        name: userId, 
        email: 'No email available',
        username: 'No username available'
      };
    }
  };

  // Fetch department details by ID
  const fetchDepartmentDetails = async (deptId: string) => {
    // Check cache first
    if (departmentCache[deptId]) {
      return departmentCache[deptId];
    }
    
    try {
      const response = await api.get(`/departments/${deptId}/`);
      const deptName = response.data.name || deptId;
      
      // Update cache
      setDepartmentCache(prev => ({
        ...prev,
        [deptId]: deptName
      }));
      
      return deptName;
    } catch (error) {
      console.error(`Error fetching department details for ID ${deptId}:`, error);
      return deptId; // Return ID as fallback
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
          formatted_date: formatDate(form.date)
        };
      })
    );
    
    return enrichedData;
  };

  // Fetch approval requests
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/pending-approvals/`);
        console.log("Raw response data:", response.data);
        
        const rawData = response.data || mockForms;
        
        // Log a date example for debugging
        if (rawData.length > 0) {
          console.log("Example date before formatting:", rawData[0].date);
          console.log("Example date after formatting:", formatDate(rawData[0].date));
        }
        
        const enrichedData = await enrichApprovalData(rawData);
        setForms(enrichedData);
      } catch (error) {
        console.error("Error fetching approvals:", error);
        // Use mock data as fallback
        const enrichedMockData = await enrichApprovalData(mockForms);
        setForms(enrichedMockData);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const navigateToDetails = (id: string) => {
    router.push(`/dashboard/approvals/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-3 h-3 mr-1" />;
      case "approved":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "rejected":
        return <XCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const filteredForms = forms.filter((form) => {
    // Status filter
    const statusMatch =
      filter === "all" || form.status.toLowerCase() === filter.toLowerCase();

    // Search filter (case insensitive)
    const search = searchTerm.toLowerCase();
    const searchMatch =
      searchTerm === "" ||
      form.id.toLowerCase().includes(search) ||
      (form.user_name?.toLowerCase() || form.user.toLowerCase()).includes(search) ||
      (form.department_name?.toLowerCase() || form.department.toLowerCase()).includes(search) ||
      form.approval_category.toLowerCase().includes(search);

    return statusMatch && searchMatch;
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="p-4 md:p-6">
          {/* Simple Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Approval Dashboard</h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Manage request approvals and feedback</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4 lg:mt-0">
                  <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {forms.filter(f => f.status.toLowerCase() === "pending").length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pending</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {forms.filter(f => f.status.toLowerCase() === "approved").length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Approved</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {forms.filter(f => f.status.toLowerCase() === "rejected").length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Rejected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Filter bar */}
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Filter className="h-4 w-4" />
                  <span>Filter Requests</span>
                </div>

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Search requests"
                      className="pl-9 w-full md:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full md:w-36">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : filteredForms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                  <AlertCircle className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  No requests found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  {searchTerm
                    ? "Try adjusting your search terms or filters to find what you're looking for."
                    : "There are no approval requests matching your current criteria."}
                </p>
              </div>
            ) : (
              <div>
                {/* Desktop view: Table */}
                <div className="hidden md:block overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                        <TableHead className="w-[130px]">Request ID</TableHead>
                        <TableHead className="w-[220px]">Requester</TableHead>
                        <TableHead className="w-[180px]">Department</TableHead>
                        <TableHead className="w-[150px]">Category</TableHead>
                        <TableHead className="w-[180px]">Date</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredForms.map((form) => (
                        <TableRow
                          key={form.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-white">
                            {form.id}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900 dark:text-white">{form.user_name || form.user}</div>
                              <div className="text-xs text-blue-600 dark:text-blue-400">{form.user_email || "No email available"}</div>
                            </div>
                          </TableCell>
                          <TableCell>{form.department_name || form.department}</TableCell>
                          <TableCell>{form.approval_category}</TableCell>
                          <TableCell>{form.formatted_date || form.date}</TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(
                                form.status
                              )} flex w-fit items-center px-2 py-0.5`}
                            >
                              {getStatusIcon(form.status)}
                              {form.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-900/30 dark:hover:bg-blue-900/20"
                              onClick={() => navigateToDetails(form.id)}
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile view: List of cards */}
                <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredForms.map((form) => (
                    <div 
                      key={form.id}
                      className="py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                      onClick={() => navigateToDetails(form.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {form.id}
                          </div>
                          <div className="mt-1">
                            <div className="text-sm font-medium">{form.user_name || form.user}</div>
                            <div className="text-xs text-gray-500">{form.user_email || "No email available"}</div>
                            <div className="text-xs text-gray-500 mt-1">{form.department_name || form.department}</div>
                          </div>
                        </div>
                        <Badge
                          className={`${getStatusColor(form.status)} flex items-center px-2 py-0.5`}
                        >
                          {getStatusIcon(form.status)}
                          {form.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500">
                          <div>{form.approval_category}</div>
                          <div className="text-xs text-gray-400 mt-1">{form.formatted_date || form.date}</div>
                        </div>
                        <div className="flex items-center text-blue-600">
                          <span className="mr-1">View details</span>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default ApprovalDashboard;
