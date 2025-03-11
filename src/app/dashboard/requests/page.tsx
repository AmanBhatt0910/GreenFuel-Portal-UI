"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  Building,
  Users,
  FileCheck,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Briefcase,
  Award,
  Bell,
  Info,
  Filter,
  Search,
  ChevronRight,
  ChevronDown,
  LucideInfo,
  Layers,
  Calendar as CalendarIcon,
  PlusCircle,
  MinusCircle,
  ArrowRight,
} from "lucide-react";
import useAxios from "@/app/hooks/use-axios";
import CustomBreadcrumb from "@/components/custom/CustomBreadcrumb";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Define the interface to match your data structure
interface BudgetRequest {
  id: number;
  budget_id: string;
  date: string;
  total: string;
  reason: string;
  policy_agreement: boolean;
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
  designation: number;
  initiate_dept: number | null;
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

  // Animation variants for various components
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -5,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
      },
    },
  };

  const timelineExpandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.5,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const progressBarVariants = {
    hidden: { width: "0%" },
    visible: (percent: number) => ({
      width: `${percent}%`,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    }),
  };

  const timelinePointVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: (delay: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: delay * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 200,
      },
    }),
  };

  const statusBadgeVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 15 }
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  useEffect(() => {
    const fetchRequestsData = async () => {
      try {
        setLoading(true);

        // Fetch budget requests
        const response = await api.get(`/approval-requests/`);
        setRequests(response.data);
        setFilteredRequests(response.data);

        // Fetch related data for filtering
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
      setBusinessUnits([]);
      setDepartments([]);
      setUsers([]);
    }
  };

  // Update filtered requests when search term or status filter changes
  useEffect(() => {
    let filtered = [...requests];

    // Apply search filter
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

    // Apply status filter
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

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(parseFloat(amount));
  };

  // Get business unit name
  const getBusinessUnitName = (id: number) => {
    const unit = businessUnits.find((unit) => unit.id === id);
    return unit?.name || `Business Unit #${id}`;
  };

  // Get department name
  const getDepartmentName = (id: number) => {
    const department = departments.find((dept) => dept.id === id);
    return department?.name || `Department #${id}`;
  };

  // Get user name
  const getUserName = (id: number) => {
    const user = users.find((u) => u.id === id);
    return user?.name || `User #${id}`;
  };

  // Get approval level label
  const getApprovalLevelLabel = (level: number) => {
    const labels = [
      "Initial",
      "Department",
      "Finance",
      "Senior Management",
      "Executive",
    ];

    return labels[level - 1] || `Level ${level}`;
  };

  // Get approval timeline step
  const renderApprovalTimeline = (request: BudgetRequest) => {
    // Use 7 levels as requested
    const maxLevels = 7;
    const currentLevel = request.current_level;

    const levelLabels = [
      "Initial",
      "Department",
      "Finance",
      "Senior Management",
      "Executive",
      "Board",
      "Final",
    ];

    const progressPercent = ((currentLevel - 1) / (maxLevels - 1)) * 100;

    return (
      <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <div className="relative">
          {/* Main progress bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700 absolute top-5 left-0 right-0 rounded-full z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
              variants={progressBarVariants}
              initial="hidden"
              animate="visible"
              custom={progressPercent}
            ></motion.div>
          </div>

          {/* Timeline points */}
          <div className="flex justify-between relative z-10">
            {Array.from({ length: maxLevels }).map((_, index) => {
              const stepNumber = index + 1;
              let status = "";

              if (request.rejected) {
                status =
                  stepNumber < currentLevel
                    ? "completed"
                    : stepNumber === currentLevel
                    ? "rejected"
                    : "future";
              } else {
                status =
                  stepNumber < currentLevel
                    ? "completed"
                    : stepNumber === currentLevel
                    ? "current"
                    : "future";
              }

              return (
                <div key={stepNumber} className="flex flex-col items-center">
                  {/* Status indicator */}
                  <motion.div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full shadow-md
                      ${
                        status === "completed"
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                          : status === "current"
                          ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
                          : status === "rejected"
                          ? "bg-gradient-to-br from-red-400 to-red-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700"
                      }
                      ${
                        status === "current"
                          ? "shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
                          : ""
                      }
                    `}
                    variants={timelinePointVariants}
                    initial="initial"
                    animate="animate"
                    custom={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {status === "completed" ? (
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    ) : status === "rejected" ? (
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </motion.svg>
                    ) : (
                      <span className="font-medium">{stepNumber}</span>
                    )}
                  </motion.div>

                  {/* Step label */}
                  <motion.span
                    className={`
                      mt-3 text-xs font-medium
                      ${
                        status === "completed"
                          ? "text-green-600 dark:text-green-400"
                          : status === "current"
                          ? "text-blue-600 dark:text-blue-400"
                          : status === "rejected"
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-500 dark:text-gray-400"
                      }
                    `}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.3 + index * 0.1, duration: 0.3 },
                    }}
                  >
                    {levelLabels[index]}
                  </motion.span>

                  {/* Current indicator animation */}
                  {status === "current" && (
                    <motion.div
                      className="absolute -bottom-6 left-0 right-0 flex justify-center"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.8, duration: 0.3 },
                      }}
                    >
                      <motion.div
                        className="h-1 w-1 rounded-full bg-blue-500"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "mirror",
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Get status badge with level info
  const getStatusBadge = (request: BudgetRequest) => {
    const { current_status, current_level, max_level, rejected } = request;

    if (rejected) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <div className="inline-flex cursor-help">
              <motion.div
                variants={statusBadgeVariants}
                initial="initial"
                animate="animate"
                whileHover="pulse"
              >
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Rejected
                  <Info className="h-3 w-3 ml-1" />
                </Badge>
              </motion.div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-medium">Request Rejected</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rejected at approval level {current_level} (
                {getApprovalLevelLabel(current_level)})
              </p>
              {request.rejection_reason && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h5 className="font-medium text-sm mt-2">Reason:</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {request.rejection_reason}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </PopoverContent>
        </Popover>
      );
    }

    switch (current_status?.toLowerCase()) {
      case "approved":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <div className="inline-flex cursor-help">
                <motion.div
                  variants={statusBadgeVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="pulse"
                >
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Approved
                    <Info className="h-3 w-3 ml-1" />
                  </Badge>
                </motion.div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-medium">Request Approved</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed all {max_level} approval levels
                </p>
              </motion.div>
            </PopoverContent>
          </Popover>
        );
      case "pending":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <div className="inline-flex cursor-help">
                <motion.div
                  variants={statusBadgeVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="pulse"
                >
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Level {current_level}/{max_level}
                    <Info className="h-3 w-3 ml-1" />
                  </Badge>
                </motion.div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-medium">Current Approval Status</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Awaiting approval at level {current_level} (
                  {getApprovalLevelLabel(current_level)})
                </p>
                <motion.p
                  className="text-xs text-gray-500 dark:text-gray-400 mt-2"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {current_level - 1} of {max_level} levels completed
                </motion.p>
              </motion.div>
            </PopoverContent>
          </Popover>
        );
      default:
        return (
          <motion.div
            variants={statusBadgeVariants}
            initial="initial"
            animate="animate"
          >
            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Unknown
            </Badge>
          </motion.div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          ></motion.div>
          <motion.p
            className="text-gray-600 dark:text-gray-400"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading budget requests...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto py-3 max-w-[95%] bg-gradient-to-br dark:from-gray-900 dark:to-gray-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CustomBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Budget Requests", href: "/dashboard/requests" },
        ]}
      />

      <motion.div
        className="mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Budget Requests</h1>
        <p className="text-green-700 dark:text-green-400 text-sm font-medium mt-1">
          Manage and view all budget requests
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 shadow-sm mb-6 border-green-100 dark:border-green-900/30">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <motion.div
                className="relative flex-1"
                initial={{ width: "90%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              >
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by ID, reason, amount or category..."
                  className="pl-9 bg-white dark:bg-gray-700 border-green-200 dark:border-green-900/50 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </motion.div>
              <div className="flex gap-2 flex-wrap">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    className={
                      statusFilter === "pending"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "border-amber-500 text-amber-600 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-500 dark:hover:bg-amber-950/30"
                    }
                    onClick={() =>
                      setStatusFilter(
                        statusFilter === "pending" ? null : "pending"
                      )
                    }
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Pending
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={
                      statusFilter === "approved" ? "default" : "outline"
                    }
                    className={
                      statusFilter === "approved"
                        ? "bg-green-600 hover:bg-green-700"
                        : "border-green-600 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-500 dark:hover:bg-green-950/30"
                    }
                    onClick={() =>
                      setStatusFilter(
                        statusFilter === "approved" ? null : "approved"
                      )
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approved
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={
                      statusFilter === "rejected" ? "default" : "outline"
                    }
                    className={
                      statusFilter === "rejected"
                        ? "bg-red-600 hover:bg-red-700"
                        : "border-red-600 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-500 dark:hover:bg-red-950/30"
                    }
                    onClick={() =>
                      setStatusFilter(
                        statusFilter === "rejected" ? null : "rejected"
                      )
                    }
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejected
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Budget Requests List */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-800/90 shadow overflow-hidden mb-6 border-green-100 dark:border-green-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">All Budget Requests</CardTitle>
            <CardDescription>
              Showing {filteredRequests.length} of {requests.length} total
              requests
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {filteredRequests.length === 0 ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <AlertCircle className="h-12 w-12 mb-4" />
                    </motion.div>
                    <motion.p
                      className="text-lg font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      No budget requests found
                    </motion.p>
                    <motion.p
                      className="mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      Try adjusting your search or filters
                    </motion.p>
                  </div>
                </motion.div>
              ) : (
                filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="overflow-hidden"
                  >
                    <Card className="border-l-4 border-l-green-600 dark:border-l-green-500 bg-white dark:bg-gray-850 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <CardContent className="p-0">
                        {/* Main Request Row */}
                        <div
                          className="p-4 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                          onClick={() => toggleRowExpansion(request.id)}
                        >
                          {/* Request ID and Details */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-green-700 dark:text-green-500">
                                {request.budget_id}
                              </h3>
                              {getStatusBadge(request)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                              <span className="font-medium">Purpose:</span>{" "}
                              {request.reason}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800 flex items-center gap-1"
                              >
                                <DollarSign className="h-3 w-3" />
                                {formatCurrency(request.total)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800 flex items-center gap-1"
                              >
                                <FileCheck className="h-3 w-3" />
                                {request.approval_category}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-teal-50 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 border-teal-200 dark:border-teal-800 flex items-center gap-1"
                              >
                                <Building className="h-3 w-3" />
                                {getBusinessUnitName(request.business_unit)}
                              </Badge>
                            </div>
                          </div>

                          {/* Date and Controls */}
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(request.date)}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center text-green-700 dark:text-green-500 hover:text-green-900 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRowExpansion(request.id);
                              }}
                            >
                              <span>View Details</span>
                              {expandedRows.includes(request.id) ? (
                                <ChevronDown className="ml-1 h-4 w-4" />
                              ) : (
                                <ChevronRight className="ml-1 h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {expandedRows.includes(request.id) && (
                            <motion.div
                              key={`details-${request.id}`}
                              variants={timelineExpandVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="px-4 pb-4 pt-0"
                            >
                              <Separator className="mb-4 bg-gray-200 dark:bg-gray-700" />

                              {/* Detailed Information */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                      Request Details
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium">
                                          Approval Type
                                        </span>
                                        <span className="text-sm">
                                          {request.approval_type}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium">
                                          Requested by
                                        </span>
                                        <span className="text-sm flex items-center">
                                          <User className="h-3 w-3 mr-1" />
                                          {getUserName(request.user)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium">
                                          Department
                                        </span>
                                        <span className="text-sm">
                                          {getDepartmentName(
                                            request.department
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium">
                                          Business Unit
                                        </span>
                                        <span className="text-sm">
                                          {getBusinessUnitName(
                                            request.business_unit
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium">
                                          Notified to
                                        </span>
                                        <span className="text-sm">
                                          {getUserName(request.notify_to)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                      Benefit to Organization
                                    </h4>
                                    <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                                      {request.benefit_to_organisation ||
                                        "No information provided"}
                                    </p>
                                  </div>
                                </div>

                                {/* Right Column - Approval Timeline */}
                                <div className="space-y-4">
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Approval Progress
                                  </h4>
                                  {renderApprovalTimeline(request)}

                                  {/* Actions */}
                                  <div className="flex justify-end gap-2 mt-4">
                                    <Link
                                      href={`/dashboard/requests/${request.id}`}
                                    >
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        Full Details
                                      </Button>
                                    </Link>
                                    {request.current_status?.toLowerCase() ===
                                      "pending" && (
                                      <Link
                                        href={`/dashboard/requests/${request.id}/review`}
                                      >
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/30"
                                        >
                                          Review
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between bg-green-50/50 dark:bg-green-950/20 p-4 border-t border-green-100 dark:border-green-900/30">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredRequests.length} of {requests.length} requests
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/requests/new">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  New Request
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/30"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter(null);
                }}
              >
                <Filter className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default BudgetRequestsList;
