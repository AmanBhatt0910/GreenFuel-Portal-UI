"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";
import useAxios from "@/app/hooks/use-axios";
import CustomBreadcrumb from "@/components/custom/CustomBreadcrumb";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";
import BasicPagination from "@/components/ui/paginations";

// Interface for budget request data
interface BudgetRequest {
  id: number;
  budget_id: string;
  date: string;
  total: string;
  reason: string;
  current_status: string;
  benefit_to_organisation: string;
  approval_category: string;
  current_form_level: number;
  form_max_level: number;
  rejected: boolean;
  rejection_reason: string | null;
  user: number;
  business_unit: number;
  department: number;
  notify_to: number;
  has_unread_chat?: boolean;
  pending_approver_name?: string;
}

interface EntityInfo {
  id: number;
  name: string;
}

const BudgetRequestsList = () => {
  const api = useAxios();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BudgetRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "amount" | "id">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [businessUnits, setBusinessUnits] = useState<EntityInfo[]>([]);
  const [departments, setDepartments] = useState<EntityInfo[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  const fetchRequestsData = async (page: number = 1) => {
    try {
      setLoading(true);

      const response = await api.get(`/approval-requests/?page=${page}`);
      // Handle paginated response - extract the results array and pagination info
      const paginationData = response.data;
      const fetchedRequests: BudgetRequest[] = paginationData.results || [];
      
      // Set pagination info
      setTotalCount(paginationData.count || 0);
      setNextPage(paginationData.next);
      setPreviousPage(paginationData.previous);
      
      // Calculate total pages based on the count and results length
      const itemsPerPage = 20; // Default page size from Django Rest Framework
      setTotalPages(Math.ceil((paginationData.count || 0) / itemsPerPage));

      const enrichedRequests = await Promise.all(
        fetchedRequests.map(async (req) => {
          let hasUnreadChat = false;
          let pendingApproverName = undefined;

          try {
            const unreadRes = await api.get("/chats", {
              params: {
                form_id: req.id,
                unread: true,
              },
            });
            hasUnreadChat = unreadRes?.data?.unread_chat === true;
          } catch (error) {
            console.error(`Can't fetch unread chat for request ${req.id}`, error);
          }

          try {
            if (!req.rejected && req.current_status?.toLowerCase() === "pending") {
              const approverRes = await api.get("/approver", {
                params: {
                  business_unit: req.business_unit,
                  department: req.department,
                  level: req.current_form_level,
                },
              });

              pendingApproverName = approverRes?.data?.user?.name || undefined;
            }
          } catch (error) {
            console.error(`Can't fetch approver for request ${req.id}`, error);
          }

          return {
            ...req,
            has_unread_chat: hasUnreadChat,
            pending_approver_name: pendingApproverName,
          };
        })
      );

      setRequests(enrichedRequests);
      setFilteredRequests(enrichedRequests);

      try {
        const userRes = await api.get("/userInfo/");
        if (userRes.data?.id) {
          setCurrentUserId(userRes.data.id);
        }
      } catch (userError) {
        console.error("Error fetching user info", userError);
      }

      await fetchRelatedData();
    } catch (mainError) {
      console.error("Error loading budget requests:", mainError);
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestsData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchRelatedData = async () => {
    try {
      const businessUnitsResponse = await api.get("business-units/");
      if (businessUnitsResponse.data) {
        setBusinessUnits(businessUnitsResponse.data);
      }

      // Fetch departments
      const departmentsResponse = await api.get("departments/");
      if (departmentsResponse.data) {
        setDepartments(departmentsResponse.data);
      }

      // Fetch users
      const usersResponse = await api.get("userInfo/");
      if (usersResponse.data) {
        setUsers(usersResponse.data);
      }
    } catch (error) {
      console.error("Error fetching related data:", error);
    }
  };

  useEffect(() => {
    let filtered = [...requests];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.budget_id.toLowerCase().includes(search) ||
          request.reason.toLowerCase().includes(search) ||
          request.total.toString().includes(search) ||
          request.approval_category.toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (request) =>
          (statusFilter === "rejected" && request.rejected) ||
          (!request.rejected &&
            request.current_status.toLowerCase() === statusFilter.toLowerCase())
      );
    }

    // Sort requests
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case "amount":
          aValue = parseFloat(a.total);
          bValue = parseFloat(b.total);
          break;
        case "id":
          aValue = a.budget_id.toLowerCase();
          bValue = b.budget_id.toLowerCase();
          break;
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests, sortBy, sortOrder]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sorting
  const handleSort = (column: "date" | "amount" | "id") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // Get sort icon
  const getSortIcon = (column: "date" | "amount" | "id") => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  // Get entity names
  const getBusinessUnitName = (id: number) => {
    const unit = businessUnits.find((unit) => unit.id === id);
    return unit?.name || `Business Unit #${id}`;
  };

  const getDepartmentName = (id: number) => {
    const department = departments.find((dept) => dept.id === id);
    return department?.name || `Department #${id}`;
  };

  const getUserName = (id: number) => {
    const user = users.find((u) => u.id === id);
    return user?.name || `User #${id}`;
  };

  // Get status badge with appropriate colors
  const getStatusBadge = (request: BudgetRequest) => {
    if (request.rejected) {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 flex items-center"
        >
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    }

    switch (request.current_status?.toLowerCase()) {
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 flex items-center"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800 flex items-center"
          >
            <Clock className="h-3 w-3 mr-1" />
            {request.pending_approver_name
              ? `Pending - ${request.pending_approver_name}`
              : `Pending (Level ${request.current_form_level}/${request.form_max_level})`}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
          >
            Unknown
          </Badge>
        );
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      Training: "text-purple-600 dark:text-purple-400",
      Equipment: "text-emerald-600 dark:text-emerald-400",
      Software: "text-teal-600 dark:text-teal-400",
      Travel: "text-orange-600 dark:text-orange-400",
      Marketing: "text-pink-600 dark:text-pink-400",
      "Office Supplies": "text-cyan-600 dark:text-cyan-400",
      Consulting: "text-green-600 dark:text-green-400",
      Research: "text-violet-600 dark:text-violet-400",
    };

    return categoryMap[category] || "text-blue-600 dark:text-blue-400";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-500">Loading budget requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl sm:px-6">
      <CustomBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Budget Requests", href: "/dashboard/requests" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Budget Requests</h1>
        <p className="text-gray-600 mt-2">
          Manage and track all budget requests across your organization
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-8 bg-white rounded-lg border border-blue-100 shadow-sm overflow-hidden">
        <div className="p-5">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
              <Input
                placeholder="Search by ID, reason, amount..."
                className="w-full pl-9 focus:ring-2 focus:ring-blue-500 border-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select
                value={statusFilter || "all"}
                onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-40 border-blue-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [column, order] = value.split("-") as [typeof sortBy, typeof sortOrder];
                  setSortBy(column);
                  setSortOrder(order);
                }}
              >
                <SelectTrigger className="w-48 border-blue-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="amount-desc">Highest Amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                  <SelectItem value="id-asc">ID A-Z</SelectItem>
                  <SelectItem value="id-desc">ID Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Requests Table */}
      <div className="bg-white rounded-lg border border-blue-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-blue-100">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-blue-800 tracking-tight">
                Budget Requests
              </h2>
              <p className="text-sm text-blue-500/80 mt-1">
                Showing {filteredRequests.length} of {totalCount} request
                {totalCount !== 1 ? "s" : ""}.
              </p>
            </div>
            <Link href="/dashboard/form">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <PlusCircle className="h-4 w-4 mr-1.5" />
                New Request
              </Button>
            </Link>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium mb-1 text-blue-700">No requests found</h3>
            <p className="text-sm text-blue-500/70 max-w-md mx-auto">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-100">
                  <TableHead 
                    className="cursor-pointer hover:bg-blue-50 text-blue-700 font-semibold"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-2">
                      Request ID
                      {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead className="text-blue-700 font-semibold">Reason</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-blue-50 text-blue-700 font-semibold"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center gap-2">
                      Amount
                      {getSortIcon("amount")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-blue-50 text-blue-700 font-semibold"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {getSortIcon("date")}
                    </div>
                  </TableHead>
                  <TableHead className="text-blue-700 font-semibold">Status</TableHead>
                  <TableHead className="text-blue-700 font-semibold">Category</TableHead>
                  <TableHead className="text-blue-700 font-semibold">Business Unit</TableHead>
                  <TableHead className="text-blue-700 font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow 
                    key={request.id} 
                    className="hover:bg-blue-50/50 border-blue-100/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-700 font-semibold">
                          {request.budget_id}
                        </span>
                        {request.has_unread_chat && (
                          <span
                            title="Unread chat"
                            className="px-1.5 py-0.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded-full flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-700 line-clamp-2" title={request.reason}>
                          {request.reason}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-700 font-semibold">
                        {formatCurrency(request.total)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-blue-600">
                        <Calendar className="w-4 h-4 mr-1.5 text-blue-400" />
                        {formatDate(request.date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request)}
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${getCategoryColor(request.approval_category)}`}>
                        {request.approval_category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {getBusinessUnitName(request.business_unit)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        href={`/dashboard/requests/${request.id}${currentUserId ? `?userId=${currentUserId}` : ""}`}
                      >
                        <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <CardFooter className="flex justify-between items-center border-t border-blue-100 p-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-blue-500/70">
              Showing page {currentPage} of {totalPages} (Total: {totalCount} requests)
            </p>
            {(searchTerm || statusFilter) && (
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter(null);
                }}
              >
                <Filter className="h-4 w-4 mr-1.5" />
                Clear Filters
              </Button>
            )}
          </div>
          
          {/* Pagination Component */}
          {totalPages > 1 && (
            <BasicPagination
              totalPages={totalPages}
              initialPage={currentPage}
              onPageChange={handlePageChange}
              className="ml-auto"
            />
          )}
        </CardFooter>
      </div>
    </div>
  );
};

export default BudgetRequestsList;
