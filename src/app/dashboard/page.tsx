"use client";
import React, { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import ProcessTracker from "@/components/custom/dashboard/ProcessTracker";
import TrackingTable from "@/components/custom/dashboard/TrackingTable";

// Import the new dashboard components
import {
  StatCard,
  WeeklyActivityChart,
  ApprovalStatusChart,
  DashboardHeader,
  FormStat,
  WeeklyDataPoint,
  StatusLevel,
  RecentForm
} from "@/components/custom/dashboard/DashboardComponents";

// Sample data
const formStats: FormStat = {
  total: 34,
  approved: 21,
  rejected: 5,
  pending: 8,
  weekChange: 12.5,
};

const weeklyData: WeeklyDataPoint[] = [
  { name: "Mon", submitted: 4, approved: 2, rejected: 1 },
  { name: "Tue", submitted: 6, approved: 4, rejected: 0 },
  { name: "Wed", submitted: 5, approved: 3, rejected: 1 },
  { name: "Thu", submitted: 7, approved: 5, rejected: 0 },
  { name: "Fri", submitted: 8, approved: 4, rejected: 2 },
  { name: "Sat", submitted: 2, approved: 1, rejected: 0 },
  { name: "Sun", submitted: 2, approved: 2, rejected: 1 },
];

const statusByLevel: StatusLevel[] = [
  { approved: 18, rejected: 4, pending: 12, name: "Level 1" },
  { approved: 16, rejected: 3, pending: 7, name: "Level 2" },
  { approved: 14, rejected: 2, pending: 4, name: "Level 3" },
  { approved: 12, rejected: 1, pending: 3, name: "Level 4" },
  { approved: 10, rejected: 0, pending: 2, name: "Level 5" },
];

const recentForms: RecentForm[] = [
  {
    id: "REQ-2025-001",
    submitter: "John Doe",
    department: "IT Department",
    status: "Approved",
    level: 3,
    updatedAt: "2025-02-28",
  },
  {
    id: "REQ-2025-002",
    submitter: "Jane Smith",
    department: "Finance",
    status: "Pending",
    level: 2,
    updatedAt: "2025-02-27",
  },
  {
    id: "REQ-2025-003",
    submitter: "Robert Johnson",
    department: "HR",
    status: "Rejected",
    level: 1,
    updatedAt: "2025-02-26",
  },
  {
    id: "REQ-2025-004",
    submitter: "Emily Williams",
    department: "Marketing",
    status: "Approved",
    level: 4,
    updatedAt: "2025-02-25",
  },
  {
    id: "REQ-2025-005",
    submitter: "Michael Brown",
    department: "Operations",
    status: "Pending",
    level: 1,
    updatedAt: "2025-02-24",
  },
];

const processData: {
  id: string;
  name: string;
  stage: number;
  totalStages: number;
  status: "completed" | "in-progress" | "pending";
  updatedAt: string;
}[] = [
  {
    id: "REQ-2025-001",
    name: "Laptop Request",
    stage: 4,
    totalStages: 5,
    status: "in-progress",
    updatedAt: "2025-02-28",
  },
  {
    id: "REQ-2025-002",
    name: "Software License",
    stage: 2,
    totalStages: 5,
    status: "in-progress",
    updatedAt: "2025-02-27",
  },
  {
    id: "REQ-2025-003",
    name: "Office Equipment",
    stage: 5,
    totalStages: 5,
    status: "completed",
    updatedAt: "2025-02-26",
  },
  {
    id: "REQ-2025-004",
    name: "Mobile Device",
    stage: 1,
    totalStages: 5,
    status: "pending",
    updatedAt: "2025-02-25",
  }
];

const DashboardPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-500 dark:text-green-400";
      case "rejected":
        return "text-red-500 dark:text-red-400";
      case "pending":
        return "text-amber-500 dark:text-amber-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string): React.ReactNode => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
        );
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500 dark:text-amber-400" />;
      default:
        return (
          <AlertCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        );
    }
  };

  const getProgressColorClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "pending":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getFormattedDate = (): string => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    setCurrentDate(getFormattedDate());
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const statCardData = [
    {
      title: "Total Forms",
      value: formStats.total,
      change: formStats.weekChange,
      icon: <Activity className="h-10 w-10 text-blue-500 dark:text-blue-400" />
    },
    {
      title: "Approved",
      value: formStats.approved,
      subtitle: `${Math.round((formStats.approved / formStats.total) * 100)}% approval rate`,
      valueColor: "text-green-600 dark:text-green-400",
      icon: <CheckCircle className="h-10 w-10 text-green-500 dark:text-green-400" />
    },
    {
      title: "Rejected",
      value: formStats.rejected,
      subtitle: `${Math.round((formStats.rejected / formStats.total) * 100)}% rejection rate`,
      valueColor: "text-red-600 dark:text-red-400",
      icon: <XCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
    },
    {
      title: "Pending",
      value: formStats.pending,
      subtitle: "Across all approval levels",
      valueColor: "text-amber-600 dark:text-amber-400",
      icon: <Clock className="h-10 w-10 text-amber-500 dark:text-amber-400" />
    }
  ];

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6  min-h-screen overflow-y-auto">
      {/* Dashboard Header */}
      <DashboardHeader currentDate={currentDate} onRefresh={handleRefresh} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardData.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            change={stat.change}
            valueColor={stat.valueColor}
            icon={stat.icon}
            isLoaded={isLoaded}
          />
        ))}
      </div>


      {/* Recent Forms */}
      <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-950 rounded-xl shadow overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Asset Requests</h2>
          <p className="text-sm text-green-700 dark:text-green-400 mt-1">Track and monitor request status</p>
        </div>
        <div className="overflow-x-auto">
          <TrackingTable 
            formStats={formStats}
            recentForms={recentForms}
            isLoaded={isLoaded}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filter={filter}
            setFilter={setFilter}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            getProgressColorClass={getProgressColorClass}
          />
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;