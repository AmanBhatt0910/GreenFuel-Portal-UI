"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Bell,
  Search,
  Filter,
  Download,
  Calendar,
  Settings,
  Plus,
} from "lucide-react";
import TrackingTable from "@/components/custom/dashboard/TrackingTable";
import {
  StatCard,
  FormStat,
  RecentForm,
} from "@/components/custom/dashboard/DashboardComponents";
import useAxios from "../hooks/use-axios";
import { GFContext } from "@/context/AuthContext";
import Loading from './loading';

const formStats: FormStat = {
  total: 34,
  approved: 21,
  rejected: 5,
  pending: 8,
  weekChange: 12.5,
};

const recentForms: RecentForm[] = [
  {
    id: "REQ-2023-001",
    submitter: "Rajesh Kumar",
    department: "IT Department",
    status: "Approved",
    level: 3,
    updatedAt: "2023-08-15",
  },
  {
    id: "REQ-2023-002",
    submitter: "Priya Sharma",
    department: "Finance",
    status: "Pending",
    level: 2,
    updatedAt: "2023-08-14",
  },
  {
    id: "REQ-2023-003",
    submitter: "Amit Patel",
    department: "HR",
    status: "Rejected",
    level: 1,
    updatedAt: "2023-08-12",
  },
  {
    id: "REQ-2023-004",
    submitter: "Neha Gupta",
    department: "Marketing",
    status: "Approved",
    level: 4,
    updatedAt: "2023-08-10",
  },
  {
    id: "REQ-2023-005",
    submitter: "Vikram Singh",
    department: "Operations",
    status: "Pending",
    level: 1,
    updatedAt: "2023-08-09",
  },
];

const DashboardPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { setUserInfo } = useContext(GFContext);

  const api = useAxios();

  const getUserDashboardData = async () => {
    try {
      const response = await api.get("/userInfo/?self=true");
      typeof window !== "undefined" &&
        localStorage.setItem("userInfo", JSON.stringify(response.data));
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoaded(false);
      try {
        await getUserDashboardData();
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setTimeout(() => setIsLoaded(true), 1000); // Increased timeout for better UX
      }
    };

    fetchData();
  }, []);

  const statCardData = [
    {
      title: "Total Forms",
      value: 156,
      change: 8.5,
      subtitle: "Across all departments",
      icon: <Activity className="h-10 w-10 text-blue-500 dark:text-blue-400" />,
    },
    {
      title: "Approved",
      value: 98,
      change: 5.2,
      subtitle: "Last 30 days",
      icon: <CheckCircle className="h-10 w-10 text-green-500 dark:text-green-400" />,
    },
    {
      title: "Rejected",
      value: 23,
      change: -2.1,
      subtitle: "Requires attention",
      icon: <XCircle className="h-10 w-10 text-red-500 dark:text-red-400" />,
    },
    {
      title: "Pending",
      value: 35,
      change: 3.8,
      subtitle: "Awaiting approval",
      icon: <Clock className="h-10 w-10 text-amber-500 dark:text-amber-400" />,
    },
  ];

  const quickActions = [
    { title: "New Asset Request", icon: <Plus className="h-5 w-5" /> },
    { title: "My Requests", icon: <Calendar className="h-5 w-5" /> },
    { title: "Generate Report", icon: <Download className="h-5 w-5" /> },
    { title: "System Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const recentActivities = [
    {
      type: "asset_added",
      title: "New Asset Added",
      description: "IT Department added 5 new laptops",
      time: "2 hours ago",
      icon: <Plus className="h-4 w-4 text-green-500" />,
    },
    {
      type: "maintenance",
      title: "Maintenance Completed",
      description: "Server maintenance completed successfully",
      time: "4 hours ago",
      icon: <CheckCircle className="h-4 w-4 text-blue-500" />,
    },
    {
      type: "alert",
      title: "Low Stock Alert",
      description: "Printer cartridges running low",
      time: "6 hours ago",
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
    },
  ];

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, Admin</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardData.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            change={stat.change}
            icon={stat.icon}
            isLoaded={isLoaded}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Asset Overview</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
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

        {/* <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {action.icon}
                  <span className="text-sm text-gray-700 dark:text-gray-300">{action.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.title} className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    {activity.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

// Wrap the component with Suspense
const DashboardPageWithSuspense = () => {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardPage />
    </Suspense>
  );
};

export default DashboardPageWithSuspense;
