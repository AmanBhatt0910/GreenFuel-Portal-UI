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

const ApprovalDashboard: React.FC = () => {
  const [forms, setForms] = useState<ApprovalForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const api = useAxios();
  const router = useRouter();

  // Fetch approval requests
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        setLoading(true);
        // const response = await api.get(`/approval-requests/`);
        // setForms(response.data || mockForms);
        setForms(mockForms);
      } catch (error) {
        console.error("Error fetching approvals:", error);
        setForms(mockForms);
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
      form.submitter.toLowerCase().includes(search) ||
      form.department.toLowerCase().includes(search) ||
      form.formData.approvalCategory.toLowerCase().includes(search);

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
                        <TableHead className="w-[120px]">Request ID</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
                        <TableHead className="w-[100px] text-right">
                          Actions
                        </TableHead>
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
                          <TableCell>{form.submitter}</TableCell>
                          <TableCell>{form.department}</TableCell>
                          <TableCell>{form.formData.approvalCategory}</TableCell>
                          <TableCell>{form.updatedAt}</TableCell>
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
                          <span className="font-medium text-gray-900 dark:text-white">
                            {form.id}
                          </span>
                          <div className="text-sm text-gray-500 mt-1">
                            {form.submitter} · {form.department}
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
                          {form.formData.approvalCategory}
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
      assetAmount: "1200 USD",
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
        { name: "Keyboard", quantity: 1 },
      ],
      assetAmount: "800 USD",
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
        { name: "Editing Software License", quantity: 1 },
      ],
      assetAmount: "3500 USD",
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

export default ApprovalDashboard;
