"use client";

import React, { useEffect, useState } from "react";
import {
  CardContent,
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
  approval_type: string;
  current_form_level: number;
  form_max_level: number;
  rejected: boolean;
  rejection_reason: string | null;
  user: number;
  business_unit: number;
  department: number;
  notify_to: number;
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
        console.log(response)
        setRequests(response.data);
        setFilteredRequests(response.data);

        // Fetch current user ID
        try {
          const userResponse = await api.get("/userInfo/");
          if (userResponse.data && userResponse.data.id) {
            setCurrentUserId(userResponse.data.id);
          }
        } catch (userError) {
          console.error("Error fetching current user:", userError);
        }

        // Fetch related data for display
        await fetchRelatedData();
      } catch (error) {
        console.error("Error fetching requests data:", error);
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
      // Fetch business units
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
            Pending (Level {request.current_form_level}/{request.form_max_level})
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

  // Category color mapping
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
              Try adjusting your search or filters to find what you&apos;re looking for
            </p>
          </div>

          ) : (
            <div className="divide-y divide-blue-100 dark:divide-blue-900/40">
              {filteredRequests.map((request) => (
                <div key={request.id} className="overflow-hidden">
                  <div
                    className="p-5 hover:bg-blue-50/50 transition-colors cursor-pointer"
                    onClick={() => toggleRowExpansion(request.id)}
                  >
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="font-medium text-blue-700 dark:text-blue-400">
                            {request.budget_id}
                          </h3>
                          {getStatusBadge(request)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                          {request.reason}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 mt-3 sm:mt-0">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-500 mr-1.5" />
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(request.total)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-500 mr-1.5" />
                          <span className="text-sm text-blue-600">
                            {formatDate(request.date)}
                          </span>
                        </div>
                        <div className="ml-auto">
                          {expandedRows.includes(request.id) ? (
                            <ChevronDown className="h-5 w-5 text-blue-400" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-blue-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded view */}
                  {expandedRows.includes(request.id) && (
                    <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-900/40">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800/50 shadow-sm">
                          <h4 className="text-sm font-medium uppercase tracking-wide text-blue-500 dark:text-blue-400 mb-3">
                            Request Details
                          </h4>
                          <table className="w-full text-sm">
                            <tbody className="divide-y divide-blue-100 dark:divide-blue-900/40">
                              <tr>
                                <td className="py-2 pr-4 font-medium text-blue-600/70 dark:text-blue-400/80 w-1/3">
                                  Category:
                                </td>
                                <td
                                  className={`py-2 ${getCategoryColor(
                                    request.approval_category
                                  )}`}
                                >
                                  {request.approval_category}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 font-medium text-blue-600/70 dark:text-blue-400/80">
                                  Type:
                                </td>
                                <td className="py-2 text-teal-600 dark:text-teal-400">
                                  {request.approval_type}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 font-medium text-blue-600/70 dark:text-blue-400/80">
                                  Requestor:
                                </td>
                                <td className="py-2 text-blue-700 dark:text-blue-300">
                                  {getUserName(request.user)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 font-medium text-blue-600/70 dark:text-blue-400/80">
                                  Department:
                                </td>
                                <td className="py-2 text-purple-600 dark:text-purple-400">
                                  {getDepartmentName(request.department)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 font-medium text-blue-600/70 dark:text-blue-400/80">
                                  Business Unit:
                                </td>
                                <td className="py-2 text-teal-600 dark:text-teal-400">
                                  {getBusinessUnitName(request.business_unit)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800/50 shadow-sm mb-4">
                            <h4 className="text-sm font-medium uppercase tracking-wide text-blue-500 dark:text-blue-400 mb-3">
                              Benefit to Organization
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-blue-50/70 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800/40">
                              {request.benefit_to_organisation ||
                                "No information provided"}
                            </p>
                          </div>

                          {request.rejected && request.rejection_reason && (
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800/50 shadow-sm mb-4">
                              <h4 className="text-sm font-medium uppercase tracking-wide text-red-500 dark:text-red-400 mb-3">
                                Rejection Reason
                              </h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-800/40">
                                {request.rejection_reason}
                              </p>
                            </div>
                          )}

                          <div className="flex justify-end gap-3">
                            <Link
                              href={`/dashboard/requests/${request.id}${
                                currentUserId ? `?userId=${currentUserId}` : ""
                              }`}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30"
                              >
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
