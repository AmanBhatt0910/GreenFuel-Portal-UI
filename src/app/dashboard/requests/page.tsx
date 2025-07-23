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
} from "lucide-react";
import useAxios from "@/app/hooks/use-axios";
import CustomBreadcrumb from "@/components/custom/CustomBreadcrumb";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

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
  const [businessUnits, setBusinessUnits] = useState<EntityInfo[]>([]);
  const [departments, setDepartments] = useState<EntityInfo[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRequestsData = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/approval-requests/`);
        const fetchedRequests: BudgetRequest[] = response.data;

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

    fetchRequestsData();
  }, []);


  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

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

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  // Toggle row expansion
  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
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

  const groupByMonth = (items: BudgetRequest[]) => {
    const grouped: Record<string, BudgetRequest[]> = {};

    items.forEach((item) => {
      const date = new Date(item.date);
      const monthYear = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });

      if (!grouped[monthYear]) grouped[monthYear] = [];
      grouped[monthYear].push(item);
    });

    return grouped;
  };

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
        {/* <div className="h-1 bg-blue-500"></div> */}
        <div className="p-5">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
              <input
                placeholder="Search by ID, reason, amount..."
                className="w-full pl-9 pr-4 py-2 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium border ${
                  statusFilter === "pending"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "text-amber-600 border-amber-200 hover:bg-amber-50"
                }`}
                onClick={() =>
                  setStatusFilter(statusFilter === "pending" ? null : "pending")
                }
              >
                <Clock className="h-4 w-4 mr-1.5" />
                Pending
              </button>
              <button
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium border ${
                  statusFilter === "approved"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "text-green-600 border-green-200 hover:bg-green-50"
                }`}
                onClick={() =>
                  setStatusFilter(
                    statusFilter === "approved" ? null : "approved"
                  )
                }
              >
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Approved
              </button>
              <button
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium border ${
                  statusFilter === "rejected"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "text-red-600 border-red-200 hover:bg-red-50"
                }`}
                onClick={() =>
                  setStatusFilter(
                    statusFilter === "rejected" ? null : "rejected"
                  )
                }
              >
                <XCircle className="h-4 w-4 mr-1.5" />
                Rejected
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Requests List */}
      <div className="bg-white rounded-lg border border-blue-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-blue-100">
          <div className="text-xl font-semibold text-blue-700">
            Budget Requests ({filteredRequests.length})
          </div>
        </div>

          <CardContent className="p-0">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium mb-1 text-blue-700">No requests found</h3>
                <p className="text-sm text-blue-500/70 max-w-md mx-auto">
                  Try adjusting your filters or search
                </p>
              </div>
            ) : (
              Object.entries(groupByMonth(filteredRequests))
                .sort((a, b) => new Date(b[1][0].date).getTime() - new Date(a[1][0].date).getTime())
                .map(([month, monthRequests]) => (
                  <details key={month} open className="border-b border-blue-100 px-3 py-2 bg-blue-50/30">
                    <summary className="cursor-pointer text-lg font-semibold text-blue-700 flex items-center justify-between group">
                      <span>{month} ({monthRequests.length})</span>
                      <ChevronDown className="w-4 h-4 text-blue-400 group-open:rotate-180 transition-transform" />
                    </summary>

                    <div className="space-y-4 mt-4 transition-all">
                      {monthRequests.map((request) => (
                        <div
                          key={request.id}
                          className="p-4 bg-white hover:bg-blue-50 rounded-lg border border-blue-100 shadow-sm transition-all cursor-pointer"
                          onClick={() => toggleRowExpansion(request.id)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-blue-700 font-semibold text-base tracking-tight">
                                  {request.budget_id}
                                </h3>

                                {request.has_unread_chat && (
                                  <span title="Unread chat" className="px-2 py-0.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded-full flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    Unread
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                                {request.reason}
                              </p>
                            </div>

                            <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                              <div className="flex items-center text-sm text-blue-600">
                                <Calendar className="w-4 h-4 mr-1.5 text-blue-400" />
                                {formatDate(request.date)}
                              </div>
                              <span className="text-sm text-green-700 font-medium">{formatCurrency(request.total)}</span>
                              {getStatusBadge(request)}
                            </div>
                          </div>

                          {/* expanded row content */}
                          {expandedRows.includes(request.id) && (
                            <div className="mt-4 p-4 bg-blue-50/20 border-t border-blue-100 rounded-b-lg">
                              <p className="text-sm text-blue-900 font-medium">
                                Business Unit: {getBusinessUnitName(request.business_unit)} | Department: {getDepartmentName(request.department)} | Requested by {getUserName(request.user)}
                              </p>
                              {request.benefit_to_organisation && (
                                <div className="mt-3">
                                  <h4 className="text-sm font-medium text-blue-600 mb-1">Benefit to Organisation</h4>
                                  <p className="text-sm text-gray-700 bg-blue-50 rounded-md p-3 border border-blue-100">
                                    {request.benefit_to_organisation}
                                  </p>
                                </div>
                              )}
                              <div className="mt-4 text-right">
                                <Link
                                  href={`/dashboard/requests/${request.id}${currentUserId ? `?userId=${currentUserId}` : ""}`}
                                >
                                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                ))
            )}
          </CardContent>

        <CardFooter className="flex justify-between items-center border-t border-blue-100 dark:border-blue-900/40 p-4">
        <p className="text-sm text-blue-500/70">
            Showing {filteredRequests.length} of {requests.length} requests
          </p>
          <div className="flex gap-2">
            {(searchTerm || statusFilter) && (
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter(null);
                }}
              >
                <Filter className="h-4 w-4 mr-1.5" />
                Clear Filters
              </Button>
            )}
            <Link href="/dashboard/form">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PlusCircle className="h-4 w-4 mr-1.5" />
                New Request
              </Button>
            </Link>
          </div>
        </CardFooter>
      </div>
    </div>
  );
};

export default BudgetRequestsList;
