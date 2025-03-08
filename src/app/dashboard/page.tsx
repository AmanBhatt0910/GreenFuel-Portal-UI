"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import TrackingTable from "@/components/custom/dashboard/TrackingTable";

import {
  StatCard,
  DashboardHeader,
  FormStat,
  RecentForm,
} from "@/components/custom/dashboard/DashboardComponents";
import useAxios from "../hooks/use-axios";
import { GFContext } from "@/context/AuthContext";

const formStats: FormStat = {
  total: 34,
  approved: 21,
  rejected: 5,
  pending: 8,
  weekChange: 12.5,
};

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

const DashboardPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const {setUserInfo} = useContext(GFContext)

  const api = useAxios();

  const getUserDashboardData = async () => {
    try {
      const response = await api.get("/userInfo/?self=true");
      // console.log(response.data);
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


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
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    getUserDashboardData();
    setCurrentDate(getFormattedDate());
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const statCardData = [
    {
      title: "Total Forms",
      value: formStats.total,
      change: formStats.weekChange,
      icon: <Activity className="h-10 w-10 text-blue-500 dark:text-blue-400" />,
    },
    {
      title: "Approved",
      value: formStats.approved,
      subtitle: `${Math.round(
        (formStats.approved / formStats.total) * 100
      )}% approval rate`,
      valueColor: "text-green-600 dark:text-green-400",
      icon: (
        <CheckCircle className="h-10 w-10 text-green-500 dark:text-green-400" />
      ),
    },
    {
      title: "Rejected",
      value: formStats.rejected,
      subtitle: `${Math.round(
        (formStats.rejected / formStats.total) * 100
      )}% rejection rate`,
      valueColor: "text-red-600 dark:text-red-400",
      icon: <XCircle className="h-10 w-10 text-red-500 dark:text-red-400" />,
    },
    {
      title: "Pending",
      value: formStats.pending,
      subtitle: "Across all approval levels",
      valueColor: "text-amber-600 dark:text-amber-400",
      icon: <Clock className="h-10 w-10 text-amber-500 dark:text-amber-400" />,
    },
  ];

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6 min-h-screen overflow-y-auto">
      <DashboardHeader currentDate={currentDate} onRefresh={handleRefresh} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardData.map((stat) => (
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

      <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-950 rounded-xl shadow overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Recent Asset Requests
          </h2>
          <p className="text-sm text-green-700 dark:text-green-400 mt-1">
            Track and monitor request status
          </p>
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
