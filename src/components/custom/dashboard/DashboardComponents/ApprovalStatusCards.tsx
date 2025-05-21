import React from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";

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
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  count,
  description,
  icon,
  color,
  trend = 0,
  progress = 0
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
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${classes.progress}`}
              variants={progressVariants}
              initial="hidden"
              animate="visible"
              custom={progress}
            />
          </div>
          
          {/* View details link */}
          <div className="pt-2">
            <a href="#" className={`text-sm font-medium ${classes.text} flex items-center hover:underline`}>
              View Details
              <ChevronRight className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ApprovalStatusCards: React.FC = () => {
  // Example data - in a real app, this would come from props or API
  const cardData = [
    {
      title: "Pending Approval",
      count: 12,
      description: "Requests awaiting review",
      icon: <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      color: "amber",
      trend: 8,
      progress: 65
    },
    {
      title: "Approved Requests",
      count: 28,
      description: "Requests approved this month",
      icon: <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      color: "green",
      trend: 12,
      progress: 78
    },
    {
      title: "Rejected Requests",
      count: 7,
      description: "Requests rejected this month",
      icon: <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
      color: "red",
      trend: -5,
      progress: 40
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
        />
      ))}
    </motion.div>
  );
};

export default ApprovalStatusCards;