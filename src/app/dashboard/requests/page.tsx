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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Calendar,
  Building,
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
  current_level: number;
  max_level: number;
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
        console.log("Response from fetchRequestsData:", response.data);
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

  // Update filtered requests when search term or status filter changes
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
          request.current_status.toLowerCase() === statusFilter.toLowerCase()
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

  // Get status badge
  const getStatusBadge = (request: BudgetRequest) => {
    if (request.rejected) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    }

    switch (request.current_status?.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending (Level {request.current_level}/{request.max_level})
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Unknown
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading budget requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <CustomBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Budget Requests", href: "/dashboard/requests" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Budget Requests</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage and track all budget requests
        </p>
      </div>

      {/* Search and filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, reason, amount..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                className={statusFilter === "pending" ? "bg-amber-500" : ""}
                onClick={() =>
                  setStatusFilter(statusFilter === "pending" ? null : "pending")
                }
              >
                <Clock className="h-4 w-4 mr-1" />
                Pending
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                size="sm"
                className={statusFilter === "approved" ? "bg-green-600" : ""}
                onClick={() =>
                  setStatusFilter(
                    statusFilter === "approved" ? null : "approved"
                  )
                }
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approved
              </Button>
              <Button
                variant={statusFilter === "rejected" ? "default" : "outline"}
                size="sm"
                className={statusFilter === "rejected" ? "bg-red-600" : ""}
                onClick={() =>
                  setStatusFilter(
                    statusFilter === "rejected" ? null : "rejected"
                  )
                }
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Requests List */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Budget Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No budget requests found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div
                    className="p-4 bg-white dark:bg-gray-800 cursor-pointer"
                    onClick={() => toggleRowExpansion(request.id)}
                  >
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="font-semibold">{request.budget_id}</h3>
                          {getStatusBadge(request)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {request.reason}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-2 md:mt-0">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm font-medium">
                            {formatCurrency(request.total)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm">
                            {formatDate(request.date)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(request.id);
                          }}
                        >
                          {expandedRows.includes(request.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded view */}
                  {expandedRows.includes(request.id) && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900">
                      <Separator className="mb-4" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Request Details
                          </h4>
                          <table className="w-full text-sm">
                            <tbody>
                              <tr>
                                <td className="py-1 font-medium">Category:</td>
                                <td>{request.approval_category}</td>
                              </tr>
                              <tr>
                                <td className="py-1 font-medium">Type:</td>
                                <td>{request.approval_type}</td>
                              </tr>
                              <tr>
                                <td className="py-1 font-medium">Requestor:</td>
                                <td>{getUserName(request.user)}</td>
                              </tr>
                              <tr>
                                <td className="py-1 font-medium">
                                  Department:
                                </td>
                                <td>{getDepartmentName(request.department)}</td>
                              </tr>
                              <tr>
                                <td className="py-1 font-medium">
                                  Business Unit:
                                </td>
                                <td>
                                  {getBusinessUnitName(request.business_unit)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Benefit to Organization
                          </h4>
                          <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded border">
                            {request.benefit_to_organisation ||
                              "No information provided"}
                          </p>

                          {request.rejected && request.rejection_reason && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2 text-red-600">
                                Rejection Reason
                              </h4>
                              <p className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-100 dark:border-red-800">
                                {request.rejection_reason}
                              </p>
                            </div>
                          )}

                          <div className="flex justify-end mt-4 gap-2">
                            <Link
                              href={`/dashboard/requests/${request.id}${
                                currentUserId ? `?userId=${currentUserId}` : ""
                              }`}
                            >
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                            {request.current_status?.toLowerCase() ===
                              "pending" && (
                              <Link
                                href={`/dashboard/requests/${request.id}${
                                  currentUserId
                                    ? `?userId=${currentUserId}`
                                    : ""
                                }`}
                              >
                                <Button size="sm">Review Request</Button>
                              </Link>
                            )}
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

        <CardFooter className="flex justify-between items-center border-t p-4">
          <p className="text-sm text-gray-500">
            Showing {filteredRequests.length} of {requests.length} requests
          </p>
          <div className="flex gap-2">
            <Link href="/dashboard/requests/new">
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-1" />
                New Request
              </Button>
            </Link>
            {(searchTerm || statusFilter) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter(null);
                }}
              >
                <Filter className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BudgetRequestsList;
