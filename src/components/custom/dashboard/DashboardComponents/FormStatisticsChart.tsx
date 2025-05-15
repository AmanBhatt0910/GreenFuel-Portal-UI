import React from "react";
import { motion } from "framer-motion";
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

interface FormStatisticsChartProps {
  data: Array<{
    name: string;
    created: number;
    approved: number;
    rejected: number;
  }>;
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

const chartVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: [0, 0.71, 0.2, 1.01]
    }
  }
};

const FormStatisticsChart: React.FC<FormStatisticsChartProps> = ({ data }) => {
  return (
    <motion.div 
      className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 overflow-hidden"
      variants={cardVariants}
      whileHover={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3 }
      }}
    >
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: 0.2,
            type: "spring",
            stiffness: 100
          }
        }}
      >
        <motion.h3 
          className="text-lg font-semibold text-gray-900 dark:text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            transition: { 
              delay: 0.3,
              type: "spring",
              stiffness: 100
            }
          }}
        >
          Form Statistics
        </motion.h3>
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            transition: { 
              delay: 0.4,
              type: "spring",
              stiffness: 100
            }
          }}
        >
          <motion.button 
            className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(243, 244, 246, 1)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            Weekly
          </motion.button>
          <motion.button 
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(37, 99, 235, 1)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            Monthly
          </motion.button>
          <motion.button 
            className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(243, 244, 246, 1)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            Yearly
          </motion.button>
        </motion.div>
      </motion.div>
      <motion.div 
        className="h-80"
        variants={chartVariants}
        initial="hidden"
        animate="visible"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                color: "#f9fafb",
              }}
              animationDuration={300}
              animationEasing="ease-out"
            />
            <Legend 
              wrapperStyle={{
                paddingTop: "10px"
              }}
            />
            <Bar
              dataKey="created"
              name="Forms Created"
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <Bar
              dataKey="approved"
              name="Approved"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-in-out"
              animationBegin={300}
            />
            <Bar
              dataKey="rejected"
              name="Rejected"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-in-out"
              animationBegin={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default FormStatisticsChart;