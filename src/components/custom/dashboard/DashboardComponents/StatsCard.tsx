import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
  color: "red" | "blue" | "green" | "purple";
  label?: string;
}

// Animation variants
const cardVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
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

const iconVariants = {
  hidden: { opacity: 0, rotate: -10, scale: 0.8 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 10 
    }
  },
  hover: { 
    rotate: 15, 
    scale: 1.2,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 10 
    }
  }
};

const getColorClasses = (color: string) => {
  switch (color) {
    case "red":
      return {
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-100 dark:border-red-800/30",
        iconBg: "bg-red-100 dark:bg-red-800/30",
        iconColor: "text-red-600 dark:text-red-400",
        changeColor: "text-red-600 dark:text-red-400"
      };
    case "blue":
      return {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-100 dark:border-blue-800/30",
        iconBg: "bg-blue-100 dark:bg-blue-800/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        changeColor: "text-blue-600 dark:text-blue-400"
      };
    case "green":
      return {
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-100 dark:border-green-800/30",
        iconBg: "bg-green-100 dark:bg-green-800/30",
        iconColor: "text-green-600 dark:text-green-400",
        changeColor: "text-green-600 dark:text-green-400"
      };
    case "purple":
      return {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-purple-100 dark:border-purple-800/30",
        iconBg: "bg-purple-100 dark:bg-purple-800/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        changeColor: "text-purple-600 dark:text-purple-400"
      };
    default:
      return {
        bg: "bg-gray-50 dark:bg-gray-900/20",
        border: "border-gray-100 dark:border-gray-800/30",
        iconBg: "bg-gray-100 dark:bg-gray-800/30",
        iconColor: "text-gray-600 dark:text-gray-400",
        changeColor: "text-gray-600 dark:text-gray-400"
      };
  }
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  label = "Today"
}) => {
  const colorClasses = getColorClasses(color);

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      className={`${colorClasses.bg} p-6 rounded-xl border ${colorClasses.border} shadow-sm`}
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div
          className={`${colorClasses.iconBg} p-3 rounded-lg`}
          variants={iconVariants}
          whileHover="hover"
          initial="hidden"
          animate="visible"
        >
          {icon}
        </motion.div>
        <motion.span 
          className={`text-xs font-medium px-2 py-1 rounded-full bg-white dark:bg-gray-800 ${colorClasses.iconColor} border ${colorClasses.border}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: {
              delay: 0.3,
              type: "spring",
              stiffness: 200
            }
          }}
          whileHover={{ 
            scale: 1.1,
            transition: { 
              type: "spring", 
              stiffness: 400, 
              damping: 10 
            }
          }}
        >
          {label}
        </motion.span>
      </div>
      <motion.h3 
        className="text-3xl font-bold text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: 0.2, 
            type: "spring",
            stiffness: 100,
            damping: 10
          }
        }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { 
              delay: 0.4, 
              type: "spring",
              stiffness: 100
            }
          }}
        >
          {value}
        </motion.span>
      </motion.h3>
      <div className="flex items-center justify-between mt-2">
        <motion.p 
          className="text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { delay: 0.5 }
          }}
        >
          {title}
        </motion.p>
        <motion.div 
          className={`flex items-center ${colorClasses.changeColor} text-sm`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            transition: { 
              delay: 0.6,
              type: "spring",
              stiffness: 100
            }
          }}
        >
          <motion.div
            animate={{ 
              y: [0, -3, 0],
              transition: { 
                repeat: Infinity, 
                duration: 1.5,
                repeatType: "mirror"
              }
            }}
          >
            <ArrowUpRight className="h-3 w-3 mr-1" />
          </motion.div>
          <span>{change}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatsCard;