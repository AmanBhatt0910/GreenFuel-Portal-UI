import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, BarChart2, DownloadCloud, RefreshCw } from "lucide-react";
import * as XLSX from "xlsx";
import { FormStatisticsChartProps, SampleDataType, TabType } from "./types";

// Define types for the data structure

const FormStatisticsChart: React.FC<FormStatisticsChartProps> = ({
  statData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("monthly");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  // Sample data for different time periods
  const sampleData: SampleDataType = {
    weekly: [
      { name: "Mon", created: 18, approved: 12, rejected: 4 },
      { name: "Tue", created: 24, approved: 18, rejected: 3 },
      { name: "Wed", created: 30, approved: 24, rejected: 5 },
      { name: "Thu", created: 27, approved: 20, rejected: 6 },
      { name: "Fri", created: 32, approved: 26, rejected: 4 },
      { name: "Sat", created: 15, approved: 10, rejected: 2 },
      { name: "Sun", created: 12, approved: 8, rejected: 1 },
    ],
    monthly: [
      { name: "Jan", created: 85, approved: 65, rejected: 12 },
      { name: "Feb", created: 78, approved: 60, rejected: 15 },
      { name: "Mar", created: 92, approved: 75, rejected: 14 },
      { name: "Apr", created: 110, approved: 88, rejected: 17 },
      { name: "May", created: 125, approved: 100, rejected: 20 },
      { name: "Jun", created: 140, approved: 115, rejected: 18 },
    ],
    yearly: [
      { name: "2020", created: 720, approved: 580, rejected: 140 },
      { name: "2021", created: 860, approved: 710, rejected: 150 },
      { name: "2022", created: 950, approved: 800, rejected: 145 },
      { name: "2023", created: 1100, approved: 920, rejected: 180 },
      { name: "2024", created: 1250, approved: 1050, rejected: 195 },
    ],
  };

  const handleTabChange = (tab: TabType): void => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsLoading(false);
    }, 600);
  };

  const currentData = sampleData[activeTab];

  const getTabClass = (tab: TabType): string => {
    return activeTab === tab
      ? "px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow-md transform scale-105"
      : "px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all";
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    setExporting(true);

    try {
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();

      // Format the current date for the filename
      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0];

      // Format the data for Excel
      const formattedData = currentData.map((item) => ({
        [activeTab === "weekly"
          ? "Day"
          : activeTab === "monthly"
          ? "Month"
          : "Year"]: item.name,
        "Forms Created": item.created,
        "Forms Approved": item.approved,
        "Forms Rejected": item.rejected,
        "Approval Rate (%)": ((item.approved / item.created) * 100).toFixed(2),
        "Rejection Rate (%)": ((item.rejected / item.created) * 100).toFixed(2),
      }));

      // Create the main data worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData);

      // Set column widths
      const wscols = [
        { wch: 15 }, // Day/Month/Year
        { wch: 15 }, // Forms Created
        { wch: 15 }, // Forms Approved
        { wch: 15 }, // Forms Rejected
        { wch: 18 }, // Approval Rate
        { wch: 18 }, // Rejection Rate
      ];
      ws["!cols"] = wscols;

      // Add the main data worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Form Statistics");

      // Create summary worksheet
      const totalCreated = currentData.reduce(
        (sum, item) => sum + item.created,
        0
      );
      const totalApproved = currentData.reduce(
        (sum, item) => sum + item.approved,
        0
      );
      const totalRejected = currentData.reduce(
        (sum, item) => sum + item.rejected,
        0
      );

      const summaryData = [
        { Metric: "Total Forms Created", Value: totalCreated },
        { Metric: "Total Forms Approved", Value: totalApproved },
        { Metric: "Total Forms Rejected", Value: totalRejected },
        {
          Metric: "Overall Approval Rate (%)",
          Value: ((totalApproved / totalCreated) * 100).toFixed(2),
        },
        {
          Metric: "Overall Rejection Rate (%)",
          Value: ((totalRejected / totalCreated) * 100).toFixed(2),
        },
      ];

      const wsSummary = XLSX.utils.json_to_sheet(summaryData);

      // Set column widths for summary
      const wsSummaryCols = [
        { wch: 25 }, // Metric
        { wch: 15 }, // Value
      ];
      wsSummary["!cols"] = wsSummaryCols;

      // Add the summary worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

      // Generate title for the Excel file
      const title = `Form_Statistics_${activeTab}_${formattedDate}`;

      // Export the workbook
      XLSX.writeFile(wb, `${title}.xlsx`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full lg:col-span-2 mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
        {/* Header with glow effect */}
        <div className="relative overflow-hidden">
          <div className="absolute -left-10 -top-20 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -right-10 -bottom-20 w-40 h-40 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>

          <div className="relative p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                <BarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Form Statistics
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track your form performance over time
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
              <button
                className={getTabClass("weekly")}
                onClick={() => handleTabChange("weekly")}
              >
                Weekly
              </button>
              <button
                className={getTabClass("monthly")}
                onClick={() => handleTabChange("monthly")}
              >
                Monthly
              </button>
              <button
                className={getTabClass("yearly")}
                onClick={() => handleTabChange("yearly")}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Chart area */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {activeTab === "weekly"
                  ? "Last 7 days"
                  : activeTab === "monthly"
                  ? "Last 6 months"
                  : "Last 5 years"}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                className="flex cursor-pointer items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 800);
                }}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
              <button
                className="flex cursor-pointer items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={exportToExcel}
                disabled={exporting}
              >
                <DownloadCloud
                  className={`w-4 h-4 ${exporting ? "animate-bounce" : ""}`}
                />
                <span>{exporting ? "Exporting..." : "Export"}</span>
              </button>
            </div>
          </div>

          <div
            className={`h-80 transition-opacity duration-300 ${
              isLoading ? "opacity-30" : "opacity-100"
            }`}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentData}
                barGap={8}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id="createdGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient
                    id="approvedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient
                    id="rejectedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.2}
                />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#4b5563", strokeWidth: 1 }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#4b5563", strokeWidth: 1 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(31, 41, 55, 0.95)",
                    border: "none",
                    borderRadius: "0.5rem",
                    color: "#f9fafb",
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    padding: "12px",
                  }}
                  itemStyle={{ padding: "4px 0" }}
                  labelStyle={{ fontWeight: "bold", marginBottom: "8px" }}
                  animationDuration={300}
                  animationEasing="ease-out"
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                  }}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {value}
                    </span>
                  )}
                />
                <Bar
                  dataKey="created"
                  name="Forms Created"
                  fill="url(#createdGradient)"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  strokeWidth={1}
                  stroke="#4338ca"
                />
                <Bar
                  dataKey="approved"
                  name="Approved"
                  fill="url(#approvedGradient)"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  animationBegin={300}
                  strokeWidth={1}
                  stroke="#059669"
                />
                <Bar
                  dataKey="rejected"
                  name="Rejected"
                  fill="url(#rejectedGradient)"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  animationBegin={600}
                  strokeWidth={1}
                  stroke="#dc2626"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Created
                </span>
                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-md">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {statData?.form_count}
              </div>
              {/* <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                +14.2% from previous period
              </div> */}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Approved
                </span>
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {statData?.approved_count}
              </div>
              {/* <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                +9.7% from previous period
              </div> */}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Rejected
                </span>
                <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-md">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {statData?.rejected_count}
              </div>
              {/* <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                +3.2% from previous period
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStatisticsChart;
