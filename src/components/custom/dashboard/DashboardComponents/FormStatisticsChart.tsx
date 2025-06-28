import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Calendar, BarChart2, DownloadCloud, RefreshCw, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import useAxios from "@/app/hooks/use-axios";
import { YearlyStatsResponse } from "@/app/dashboard/page";

// Component Props
interface FormStatisticsChartProps {
  className?: string;
  yearlyStats?: YearlyStatsResponse | null;
}

const FormStatisticsChart: React.FC<FormStatisticsChartProps> = ({ 
  className, 
  yearlyStats 
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [exporting, setExporting] = React.useState<boolean>(false);
  const [hoverBar, setHoverBar] = React.useState<number | null>(null);
  const [isChartHovered, setIsChartHovered] = React.useState<boolean>(false);
  
  // Prepare data from API
  const chartData = yearlyStats?.data.map(month => ({
    name: month.month.substring(0, 3),
    created: month.created,
    approved: month.approved,
    rejected: month.rejected
  })) || [];

  // Calculate totals
  const totalCreated = chartData.reduce((sum, item) => sum + item.created, 0);
  const totalApproved = chartData.reduce((sum, item) => sum + item.approved, 0);
  const totalRejected = chartData.reduce((sum, item) => sum + item.rejected, 0);
  
  const approvalRate = totalCreated > 0 ? (totalApproved / totalCreated) * 100 : 0;
  const rejectionRate = totalCreated > 0 ? (totalRejected / totalCreated) * 100 : 0;

  // Previous period comparison - not used in this implementation
  const createdGrowth = 0;
  const approvedGrowth = 0;
  const rejectedGrowth = 0;

  // Function to export data (simulated)
  const exportToExcel = () => {
    setExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setExporting(false);
    }, 1500);
  };
  
  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          className="bg-gray-800/95 backdrop-blur-sm p-4 border border-gray-700 rounded-lg shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-gray-100 font-medium mb-2">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={`tooltip-${index}`} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                <span className="text-gray-300 mr-2">{entry.name}:</span>
                <span className="text-gray-100 font-medium">{entry.value}</span>
              </div>
            ))}
            {/* Add approval rate for this data point */}
            {payload[0] && payload[1] && (
              <div className="pt-1 mt-1 border-t border-gray-700">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-blue-400"></div>
                  <span className="text-gray-300 mr-2">Approval Rate:</span>
                  <span className="text-gray-100 font-medium">
                    {payload[0].value > 0 
                      ? ((payload[1].value / payload[0].value) * 100).toFixed(1) + '%'
                      : '0%'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          transition: { duration: 0.3 }
        }}
      >
        {/* Header with gradient effect */}
        <div className="relative overflow-hidden">
          <div className="absolute -left-10 -top-20 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -right-10 -bottom-20 w-40 h-40 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
          
          <div className="relative p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <motion.div 
                className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <BarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Form Statistics</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track your form performance over time</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart area */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {yearlyStats?.year ? `Year ${yearlyStats.year}` : "Current Year"}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button 
                className="flex cursor-pointer items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsLoading(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </motion.button>
              <motion.button 
                className="flex cursor-pointer items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={exportToExcel}
                disabled={exporting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DownloadCloud className={`w-4 h-4 ${exporting ? 'animate-bounce' : ''}`} />
                <span>{exporting ? "Exporting..." : "Export"}</span>
              </motion.button>
            </div>
          </div>
          
          <div 
            className={`h-80 transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}
            onMouseEnter={() => setIsChartHovered(true)}
            onMouseLeave={() => {
              setIsChartHovered(false);
              setHoverBar(null);
            }}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="h-12 w-12 rounded-full border-t-2 border-r-2 border-blue-600"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                ></motion.div>
              </div>
            )}
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData} 
                  barGap={8} 
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  onMouseMove={(data) => {
                    if (data.activeTooltipIndex !== undefined) {
                      setHoverBar(data.activeTooltipIndex);
                    }
                  }}
                  onMouseLeave={() => setHoverBar(null)}
                >
                  <defs>
                    <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    </linearGradient>
                    <linearGradient id="approvedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.4}/>
                    </linearGradient>
                    <linearGradient id="rejectedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af" 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#4b5563', strokeWidth: 1 }}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#4b5563', strokeWidth: 1 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: "20px"
                    }}
                    iconType="circle"
                    formatter={(value) => <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{value}</span>}
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
                  >
                    {chartData.map((_, index) => (
                      <Cell 
                        key={`created-${index}`} 
                        fillOpacity={hoverBar === index ? 1 : isChartHovered ? 0.7 : 0.9}
                        strokeWidth={hoverBar === index ? 2 : 1}
                      />
                    ))}
                  </Bar>
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
                  >
                    {chartData.map((_, index) => (
                      <Cell 
                        key={`approved-${index}`} 
                        fillOpacity={hoverBar === index ? 1 : isChartHovered ? 0.7 : 0.9}
                        strokeWidth={hoverBar === index ? 2 : 1}
                      />
                    ))}
                  </Bar>
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
                  >
                    {chartData.map((_, index) => (
                      <Cell 
                        key={`rejected-${index}`} 
                        fillOpacity={hoverBar === index ? 1 : isChartHovered ? 0.7 : 0.9}
                        strokeWidth={hoverBar === index ? 2 : 1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full inline-block mb-3">
                    <BarChart2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No data available
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <motion.div 
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
              whileHover={{ 
                y: -4, 
                boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Created</span>
                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-md">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalCreated.toLocaleString()}
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
              whileHover={{ 
                y: -4, 
                boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Approved</span>
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalApproved.toLocaleString()}
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
              whileHover={{ 
                y: -4, 
                boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Rejected</span>
                <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-md">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalRejected.toLocaleString()}
              </div>
            </motion.div>
          </div>
          
          
        </div>
      </motion.div>
    </div>
  );
};

export default FormStatisticsChart;