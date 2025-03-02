"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Filter,
  Search,
  FileCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomBreadcrumb from "@/components/custom/CustomBreadcrumb";

// Mock request data
const requestData = [
  {
    id: "REQ-2025-001",
    title: "Laptop Replacement",
    type: "Hardware",
    submittedOn: "2025-02-28",
    status: "Approved",
    level: 3,
    currentReviewer: "Finance Department",
    nextReviewer: "IT Department",
    priority: "High",
    hasRejection: false,
  },
  {
    id: "REQ-2025-002",
    title: "Software License",
    type: "Software",
    submittedOn: "2025-02-27",
    status: "Pending",
    level: 2, 
    currentReviewer: "Department Head",
    nextReviewer: "Finance Department",
    priority: "Medium",
    hasRejection: false,
  },
  {
    id: "REQ-2025-003",
    title: "Office Chair",
    type: "Furniture",
    submittedOn: "2025-02-26",
    status: "Rejected",
    level: 1,
    currentReviewer: "Department Head",
    nextReviewer: null,
    priority: "Low",
    hasRejection: true,
  },
  {
    id: "REQ-2025-004",
    title: "Meeting Room Projector",
    type: "Hardware",
    submittedOn: "2025-02-25",
    status: "Approved",
    level: 4,
    currentReviewer: "IT Department",
    nextReviewer: "Admin",
    priority: "High",
    hasRejection: false,
  },
  {
    id: "REQ-2025-005",
    title: "External Monitor",
    type: "Hardware",
    submittedOn: "2025-02-24",
    status: "Pending",
    level: 1,
    currentReviewer: "Department Head",
    nextReviewer: "Finance Department",
    priority: "Medium",
    hasRejection: false,
  },
];

// Mock approval hierarchy data
const approvalHierarchy = [
  { level: 1, name: "Department Head Review" },
  { level: 2, name: "Finance Department Review" },
  { level: 3, name: "IT Department Review" },
  { level: 4, name: "Admin Review" },
  { level: 5, name: "Final Approval & Processing" },
];

const RequestsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Filter and search logic
  const filteredRequests = requestData.filter((request) => {
    // Filter by search term
    const matchesSearchTerm =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus =
      statusFilter === "all" || request.status.toLowerCase() === statusFilter.toLowerCase();

    // Filter by type
    const matchesType =
      typeFilter === "all" || request.type.toLowerCase() === typeFilter.toLowerCase();

    // Filter by tab
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "myRequests") || 
      (activeTab === "pendingApproval" && 
        (request.status === "Pending" && 
         request.currentReviewer === "Department Head"));

    return matchesSearchTerm && matchesStatus && matchesType && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Unknown
          </Badge>
        );
    }
  };

  const handleViewRequest = (id: string) => {
    router.push(`/dashboard/requests/${id}`);
  };

  return (
    <div className="container mx-auto py-6 max-w-[95%] bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-950">
      <CustomBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Requests", href: "/dashboard/requests" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Asset Requests</h1>
        <p className="text-green-700 dark:text-green-400 text-sm font-medium mt-1">
          View and manage all your asset requests
        </p>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="myRequests">My Requests</TabsTrigger>
          <TabsTrigger value="pendingApproval">Pending Approval</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-800/90 shadow overflow-hidden mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter requests by status, type, and search criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search by ID or title..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Type</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hardware">Hardware</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-800/90 shadow">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium flex items-center">
                        <FileCheck className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                        {request.id}
                      </TableCell>
                      <TableCell>{request.title}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.submittedOn}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          Level {request.level} - {request.currentReviewer}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewRequest(request.id)}
                          className="flex items-center text-gray-700 hover:text-green-700 dark:text-gray-300 dark:hover:text-green-400"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <AlertCircle className="h-12 w-12 mb-2 opacity-20" />
                        <h3 className="text-lg font-medium">No requests found</h3>
                        <p className="text-sm">
                          Try adjusting your filters or search criteria
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button asChild className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
          <Link href="/dashboard/form">
            Create New Request
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RequestsPage;
