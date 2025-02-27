"use client";
import React, { useEffect, useState } from "react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const formStats = {
  total: 34,
  approved: 21,
  rejected: 5,
  pending: 8,
  todaySubmitted: 7,
  weekChange: 12.5,
  monthChange: 8.3,
};

const statusByLevel = [
  { level: "Level 1", approved: 18, rejected: 4, pending: 12, name: "Level 1" },
  { level: "Level 2", approved: 16, rejected: 3, pending: 7, name: "Level 2" },
  { level: "Level 3", approved: 14, rejected: 2, pending: 4, name: "Level 3" },
  { level: "Level 4", approved: 12, rejected: 1, pending: 3, name: "Level 4" },
  { level: "Level 5", approved: 10, rejected: 0, pending: 2, name: "Level 5" },
];

const weeklyData = [
  { name: "Mon", submitted: 4, approved: 2, rejected: 1 },
  { name: "Tue", submitted: 6, approved: 4, rejected: 0 },
  { name: "Wed", submitted: 5, approved: 3, rejected: 1 },
  { name: "Thu", submitted: 7, approved: 5, rejected: 0 },
  { name: "Fri", submitted: 8, approved: 4, rejected: 2 },
  { name: "Sat", submitted: 2, approved: 1, rejected: 0 },
  { name: "Sun", submitted: 2, approved: 2, rejected: 1 },
];

const recentForms = [
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

const DashboardPage = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [CurrentDate , setCurrentDate] = useState<string>();

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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

  const getProgressColorClass = (status: string) => {
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

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString();
  };

  useEffect(() => {
    setCurrentDate(getFormattedDate());
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-[#1D1D2A] min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="dark:border-gray-700 dark:text-gray-300"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Today <span>{CurrentDate}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="dark:border-gray-700 dark:text-gray-300 cursor-pointer"
            onClick={()=> window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dark:bg-[#2D2D3A] dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Forms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formStats.total}
                </div>
                <div className="flex items-center mt-1">
                  <Badge
                    variant={
                      formStats.weekChange > 0 ? "default" : "destructive"
                    }
                    className={
                      formStats.weekChange > 0
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }
                  >
                    {formStats.weekChange > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(formStats.weekChange)}%
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    vs last week
                  </span>
                </div>
              </div>
              <Activity className="h-10 w-10 text-blue-500 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-[#2D2D3A] dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formStats.approved}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((formStats.approved / formStats.total) * 100)}%
                  approval rate
                </div>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-[#2D2D3A] dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {formStats.rejected}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((formStats.rejected / formStats.total) * 100)}%
                  rejection rate
                </div>
              </div>
              <XCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-[#2D2D3A] dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {formStats.pending}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Across all approval levels
                </div>
              </div>
              <Clock className="h-10 w-10 text-amber-500 dark:text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dark:bg-[#2D2D3A] dark:border-gray-700">
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

        <Card className="dark:bg-[#2D2D3A] dark:border-gray-700">
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
      </div>

      <Card className="dark:bg-[#2D2D3A] dark:border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Form Tracking</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Track approval status across all levels
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Search forms..."
                className="w-64 dark:bg-[#252533] dark:border-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-36 dark:bg-[#252533] dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#252533] dark:border-gray-700">
                  <SelectItem value="all">All Forms</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
                <TableHead className="dark:text-gray-400">Form ID</TableHead>
                <TableHead className="dark:text-gray-400">Submitter</TableHead>
                <TableHead className="dark:text-gray-400">Department</TableHead>
                <TableHead className="dark:text-gray-400">Status</TableHead>
                <TableHead className="dark:text-gray-400">
                  Approval Level
                </TableHead>
                <TableHead className="dark:text-gray-400">
                  Last Updated
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentForms.map((form) => (
                <TableRow key={form.id} className="dark:border-gray-700">
                  <TableCell className="font-medium dark:text-white">
                    {form.id}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {form.submitter}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {form.department}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(form.status)}
                      <span className={`ml-2 ${getStatusColor(form.status)}`}>
                        {form.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Level {form.level}/5</span>
                        <span>{form.level * 20}%</span>
                      </div>
                      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full ${getProgressColorClass(
                            form.status
                          )}`}
                          style={{ width: `${form.level * 20}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">
                    {form.updatedAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {recentForms.length} of {formStats.total} forms
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="dark:border-gray-700 dark:text-gray-300"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="dark:border-gray-700 dark:text-gray-300"
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card className="dark:bg-[#2D2D3A] dark:border-gray-700">
        <CardHeader>
          <CardTitle>Approval Process Overview</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Visual representation of the 5-level approval workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700"></div>

            <div className="flex justify-between relative pt-6">
              {[1, 2, 3, 4, 5].map((level) => (
                <div key={level} className="flex flex-col items-center">
                  <div
                    className={`rounded-full h-8 w-8 flex items-center justify-center text-white text-sm
                    ${
                      level === 1
                        ? "bg-green-500 dark:bg-green-600"
                        : level === 2
                        ? "bg-green-500 dark:bg-green-600"
                        : level === 3
                        ? "bg-amber-500 dark:bg-amber-600"
                        : "bg-gray-400 dark:bg-gray-600"
                    }`}
                  >
                    {level}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-medium dark:text-white">
                      Level {level}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {level === 1
                        ? "Team Lead"
                        : level === 2
                        ? "Department Manager"
                        : level === 3
                        ? "Division Director"
                        : level === 4
                        ? "VP"
                        : "Executive"}
                    </div>
                    <div className="mt-1">
                      <Badge
                        className={
                          level <= 2
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : level === 3
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }
                      >
                        {level <= 2
                          ? "Approved"
                          : level === 3
                          ? "Pending"
                          : "Waiting"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}

              <div className="absolute top-10 left-8 right-8 h-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
