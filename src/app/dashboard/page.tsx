"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";
import ProcessTracker from "@/components/custom/Dashboard/ProcessTracker";
import TrackingTable from "@/components/custom/Dashboard/TrackingTable";

// Types definitions
interface FormStat {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  weekChange: number;
}

interface WeeklyDataPoint {
  name: string;
  submitted: number;
  approved: number;
  rejected: number;
}

interface StatusLevel {
  name: string;
  approved: number;
  pending: number;
  rejected: number;
}

interface RecentForm {
  id: string;
  submitter: string;
  department: string;
  status: string;
  level: number;
  updatedAt: string;
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  change?: number;
  valueColor?: string;
  icon: React.ReactNode;
}

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
    id: "GF-2025-0027",
    submitter: "John Doe",
    department: "Sales",
    status: "Approved",
    level: 5,
    updatedAt: "2 hours ago",
  },
  {
    id: "GF-2025-0026",
    submitter: "Jane Smith",
    department: "Marketing",
    status: "Pending",
    level: 3,
    updatedAt: "4 hours ago",
  },
  {
    id: "GF-2025-0025",
    submitter: "Mike Johnson",
    department: "Operations",
    status: "Rejected",
    level: 2,
    updatedAt: "6 hours ago",
  },
  {
    id: "GF-2025-0024",
    submitter: "Sarah Williams",
    department: "HR",
    status: "Approved",
    level: 5,
    updatedAt: "8 hours ago",
  },
  {
    id: "GF-2025-0023",
    submitter: "Alex Brown",
    department: "Finance",
    status: "Pending",
    level: 1,
    updatedAt: "10 hours ago",
  },
];

// Animation variants for Framer Motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * 0.1,
      duration: 0.4 
    }
  })
};

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

  const statCards: StatCardProps[] = [
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

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-[#1D1D2A] min-h-screen">
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Form Approval Dashboard
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="dark:border-gray-700 dark:text-gray-300 flex items-center"
          >
            <Calendar className="h-4 w-4 mr-2" />
            <span>{currentDate}</span>
          </Button>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="dark:border-gray-700 dark:text-gray-300 cursor-pointer"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            custom={index}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={statCardVariants}
          >
            <Card className="dark:bg-[#2D2D3A] dark:border-gray-700 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`text-3xl font-bold ${stat.valueColor || "text-gray-900 dark:text-white"}`}>
                      {stat.value}
                    </div>
                    <div className="flex items-center mt-1">
                      {stat.change ? (
                        <>
                          <Badge
                            variant={stat.change > 0 ? "default" : "destructive"}
                            className={
                              stat.change > 0
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }
                          >
                            {stat.change > 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(stat.change)}%
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            vs last week
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {stat.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  {stat.icon}
                </div>
              </CardContent>
              {/* Decorative bottom line that animates in */}
              <motion.div 
                className={`h-1 ${stat.title === "Total Forms" ? "bg-blue-500" : 
                  stat.title === "Approved" ? "bg-green-500" : 
                  stat.title === "Rejected" ? "bg-red-500" : "bg-amber-500"}`}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={cardVariants}
        >
          <Card className="dark:bg-[#2D2D3A] dark:border-gray-700 overflow-hidden">
            <CardHeader>
              <CardTitle>Weekly Form Activity</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Overview of submissions, approvals and rejections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={weeklyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorSubmitted"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#6552D0" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6552D0" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient
                        id="colorApproved"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient
                        id="colorRejected"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "currentColor" }}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <YAxis
                      tick={{ fill: "currentColor" }}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-200 dark:stroke-gray-700"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2D2D3A",
                        borderColor: "#4B5563",
                        color: "#F9FAFB",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="submitted"
                      stroke="#6552D0"
                      fillOpacity={1}
                      fill="url(#colorSubmitted)"
                    />
                    <Area
                      type="monotone"
                      dataKey="approved"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorApproved)"
                    />
                    <Area
                      type="monotone"
                      dataKey="rejected"
                      stroke="#EF4444"
                      fillOpacity={1}
                      fill="url(#colorRejected)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={cardVariants}
        >
          <Card className="dark:bg-[#2D2D3A] dark:border-gray-700 overflow-hidden">
            <CardHeader>
              <CardTitle>Approval Status by Level</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Form status distribution across all approval levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={statusByLevel}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-200 dark:stroke-gray-700"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "currentColor" }}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <YAxis
                      tick={{ fill: "currentColor" }}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2D2D3A",
                        borderColor: "#4B5563",
                        color: "#F9FAFB",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="approved" stackId="a" fill="#10B981" />
                    <Bar dataKey="pending" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="rejected" stackId="a" fill="#EF4444" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Render the TrackingTable component and pass props */}
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

      <ProcessTracker />
    </div>
  );
};

export default DashboardPage;