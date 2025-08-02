import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  TrendingUp,
  TrendingDown,
  Loader
} from "lucide-react";
import useAxios from "@/app/hooks/use-axios";

// Enhanced animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    },
  },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 0.8
    },
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 15 
    }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Progress bar animation
const progressVariants = {
  hidden: { width: "0%" },
  visible: (width: number) => ({
    width: `${width}%`,
    transition: { 
      duration: 0.8, 
      ease: "easeOut", 
      delay: 0.8 
    }
  })
};

// Icon pulse animation
const pulseVariants = {
  pulse: {
    scale: [1, 1.15, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

interface StatusCardProps {
  title: string;
  count: number;
  description: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  progress?: number;
  loading?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  count,
  description,
  icon,
  color,
  trend = 0,
  progress = 0,
  loading = false
}) => {
  // Determine trend icon and color
  const TrendIcon = trend > 0 ? TrendingUp : TrendingDown;
  const trendColor = trend > 0 ? "text-green-500" : "text-red-500";
  const trendText = `${Math.abs(trend)}% ${trend > 0 ? "increase" : "decrease"}`;
  
  // Color classes based on card type
  const colorClasses = {
    amber: {
      border: "border-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-600 dark:text-amber-400",
      progress: "bg-amber-500 dark:bg-amber-400"
    },
    green: {
      border: "border-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
      progress: "bg-emerald-500 dark:bg-emerald-400"
    },
    red: {
      border: "border-rose-500",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      iconBg: "bg-rose-100 dark:bg-rose-900/30",
      text: "text-rose-600 dark:text-rose-400",
      progress: "bg-rose-500 dark:bg-rose-400"
    }
  };
  
  const classes = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${classes.border}`}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          </div>
          <motion.div 
            className={`p-3 rounded-xl ${classes.iconBg}`}
            variants={pulseVariants}
            animate="pulse"
          >
            {icon}
          </motion.div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-end justify-between">
            {loading ? (
              <div className="flex items-center justify-center w-full h-12">
                <Loader className="animate-spin h-5 w-5 text-gray-400" />
              </div>
            ) : (
              <>
                <motion.div 
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.4, 
                    type: "spring", 
                    stiffness: 100 
                  }}
                >
                  {count}
                </motion.div>
                
                {trend !== 0 && (
                  <div className={`flex items-center text-sm ${trendColor}`}>
                    <TrendIcon className="h-3 w-3 mr-1" />
                    <span>{trendText}</span>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Progress bar */}
          {!loading && (
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${classes.progress}`}
                variants={progressVariants}
                initial="hidden"
                animate="visible"
                custom={progress}
              />
            </div>
          )}
          
          {/* View details link */}
          {!loading && (
            <div className="pt-2">
              <a href="#" className={`text-sm font-medium ${classes.text} flex items-center hover:underline`}>
                View Details
                <ChevronRight className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface YearlyStatsData {
  month: string;
  created: number;
  approved: number;
  rejected: number;
}

export interface YearlyStatsResponse {
  year: number;
  data: YearlyStatsData[];
}

interface ApprovalStatusCardsProps {
  yearlyStats?: YearlyStatsResponse;
}

const ApprovalStatusCards: React.FC<ApprovalStatusCardsProps> = ({ yearlyStats }) => {
  const [stats, setStats] = useState<YearlyStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const api = useAxios();
  
  useEffect(() => {
    const fetchYearlyStats = async () => {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear();
        const response = await api.get<YearlyStatsResponse>(`/yearly-stats?year=${currentYear}`);
        console.log(response.data)
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching yearly stats:", error);
        // Fallback to current year with empty data
        setStats({
          year: new Date().getFullYear(),
          data: Array(12).fill(0).map((_, i) => ({
            month: new Date(0, i).toLocaleString('default', { month: 'long' }),
            created: 0,
            approved: 0,
            rejected: 0
          }))
        });
      } finally {
        setLoading(false);
      }
    };
    
    // Use passed data if available, otherwise fetch
    if (yearlyStats) {
      setStats(yearlyStats);
      setLoading(false);
    } else {
      fetchYearlyStats();
    }
  }, [yearlyStats]);

  // Get current month
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  // Find current month data, or fall back to most recent month with data
  let currentMonthData = stats?.data.find(
    month => month.month === currentMonth
  );
  
  // If current month has no data, find the most recent month with data
  let displayMonth = currentMonth;
  if (currentMonthData && (currentMonthData.created === 0 && currentMonthData.approved === 0 && currentMonthData.rejected === 0)) {
    // Find the most recent month with data (working backwards from current month)
    const currentMonthIndex = new Date().getMonth();
    for (let i = 0; i < 12; i++) {
      const checkIndex = (currentMonthIndex - i + 12) % 12;
      const monthData = stats?.data[checkIndex];
      if (monthData && (monthData.created > 0 || monthData.approved > 0 || monthData.rejected > 0)) {
        currentMonthData = monthData;
        displayMonth = monthData.month;
        break;
      }
    }
  }
  
  // Calculate totals
  const totalCreated = stats?.data.reduce(
    (sum, month) => sum + month.created, 0
  ) || 0;
  const totalApproved = stats?.data.reduce(
    (sum, month) => sum + month.approved, 0
  ) || 0;
  const totalRejected = stats?.data.reduce(
    (sum, month) => sum + month.rejected, 0
  ) || 0;

  // Calculate approval/rejection rates
  const approvalRate = totalCreated > 0 ? 
    Math.round((totalApproved / totalCreated) * 100) : 0;
  const rejectionRate = totalCreated > 0 ? 
    Math.round((totalRejected / totalCreated) * 100) : 0;
  
  // Calculate trends (month-over-month change)
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Find previous month data based on the display month
  const displayMonthIndex = stats?.data.findIndex(month => month.month === displayMonth) || 0;
  const previousMonthIndex = displayMonthIndex === 0 ? 11 : displayMonthIndex - 1;
  const previousMonthData = stats?.data[previousMonthIndex];
  
  // Create card data based on API response
  const cardData = [
    {
      title: displayMonth === currentMonth ? "Created This Month" : `Created in ${displayMonth}`,
      count: currentMonthData?.created || 0,
      description: displayMonth === currentMonth ? "Requests created this month" : `Requests created in ${displayMonth}`,
      icon: <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      color: "amber",
      trend: calculateTrend(
        currentMonthData?.created || 0,
        previousMonthData?.created || 0
      ),
      progress: Math.min(100, Math.round((currentMonthData?.created || 0) / 100))
    },
    {
      title: displayMonth === currentMonth ? "Approved This Month" : `Approved in ${displayMonth}`,
      count: currentMonthData?.approved || 0,
      description: displayMonth === currentMonth ? "Requests approved this month" : `Requests approved in ${displayMonth}`,
      icon: <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      color: "green",
      trend: calculateTrend(
        currentMonthData?.approved || 0,
        previousMonthData?.approved || 0
      ),
      progress: approvalRate
    },
    {
      title: displayMonth === currentMonth ? "Rejected This Month" : `Rejected in ${displayMonth}`,
      count: currentMonthData?.rejected || 0,
      description: displayMonth === currentMonth ? "Requests rejected this month" : `Requests rejected in ${displayMonth}`,
      icon: <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
      color: "red",
      trend: calculateTrend(
        currentMonthData?.rejected || 0,
        previousMonthData?.rejected || 0
      ),
      progress: rejectionRate
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {cardData.map((card, index) => (
        <StatusCard 
          key={index}
          title={card.title}
          count={card.count}
          description={card.description}
          icon={card.icon}
          color={card.color}
          trend={card.trend}
          progress={card.progress}
          loading={loading}
        />
      ))}
    </motion.div>
  );
};

export default ApprovalStatusCards;