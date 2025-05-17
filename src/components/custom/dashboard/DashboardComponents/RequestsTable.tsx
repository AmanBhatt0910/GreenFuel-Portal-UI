import React from "react";
import { motion } from "framer-motion";
import { 
  Filter, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  MoreHorizontal 
} from "lucide-react";
import Link from "next/link";

// Define global status configuration object
const STATUS_CONFIG = {
  approved: {
    bgColor: "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700",
    textColor: "text-white",
    icon: CheckCircle,
    animation: {
      scale: [1, 1.2, 1],
      transition: { 
        repeat: Infinity, 
        repeatDelay: 3,
        duration: 0.5
      }
    }
  },
  rejected: {
    bgColor: "from-red-500 to-red-600 dark:from-red-600 dark:to-red-700",
    textColor: "text-white",
    icon: XCircle,
    animation: {
      rotate: [0, 10, 0, -10, 0],
      transition: { 
        repeat: Infinity, 
        repeatDelay: 3,
        duration: 0.5
      }
    }
  },
  pending: {
    bgColor: "from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600",
    textColor: "text-white",
    icon: Clock,
    animation: {
      rotate: 360,
      transition: { 
        repeat: Infinity, 
        duration: 3,
        ease: "linear"
      }
    }
  }
};

interface RequestType {
  id: number;
  budget_id: string;
  date: string;
  total: string;
  reason: string;
  policy_agreement: boolean;
  status: "pending" | "approved" | "rejected";
  benefit_to_organisation: string;
  approval_category: string;
  approval_type: string;
  current_form_level: number;
  form_max_level: number;
  rejected: boolean;
  rejection_reason: string;
  payback_period: string;
  document_enclosed_summary: string;
  current_status: string;
  user: number;
  business_unit: number;
  department: number;
  designation: number;
  concerned_department: number;
  notify_to: number;
}

interface RequestsTableProps {
  requests: RequestType[];
  formatDate: (date: string) => string;
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -30, height: 0 },
  visible: {
    opacity: 1,
    x: 0,
    height: "auto",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 0.8
    },
  },
  hover: {
    backgroundColor: "rgba(243, 244, 246, 0.7)",
    transition: { duration: 0.2 }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 15 
    }
  },
  hover: { 
    scale: 1.05,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  },
  tap: { 
    scale: 0.95,
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

const isHighAmount = (totalStr: string): boolean => {
  const amount = parseFloat(totalStr);
  return amount >= 5000000; // 50 lakh (5,000,000)
};

// Function to determine the correct status configuration
const getStatusConfig = (request: RequestType) => {
  if (request.status === "approved" || request.current_status === "Approved") {
    return STATUS_CONFIG.approved;
  } else if (request.status === "rejected" || request.rejected || request.current_status === "Rejected") {
    return STATUS_CONFIG.rejected;
  } else {
    return STATUS_CONFIG.pending;
  }
};

const RequestsTable: React.FC<RequestsTableProps> = ({ requests, formatDate }) => {
  
  const sortedRequests = [...requests].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const displayRequests = sortedRequests.slice(0, 5);
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3 }
      }}
    >
      <motion.div 
        className="flex justify-between items-center mb-6"
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
          Recent Budget Requests
        </motion.h3>
        
        <motion.a
          href="/dashboard/requests"
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
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
          whileHover={{ 
            x: 5,
            transition: { duration: 0.2 }
          }}
        >
          See All
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.a>
        
      </motion.div>

      <motion.div 
        className="overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { delay: 0.5 }
        }}
      >
        <table className="w-full">
          <motion.thead
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: 0.6,
                type: "spring",
                stiffness: 100
              }
            }}
          >
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <th className="w-[130px] py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Budget ID
              </th>
              <th className="w-[150px] py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="w-[150px] py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="w-[150px] py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="w-[150px] py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="w-[110px] py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Level
              </th>
              <th className="w-[110px] py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="w-[100px] py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </motion.thead>
          <motion.tbody 
            className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {displayRequests.length > 0 ? (
              displayRequests.map((request, index) => {
                const statusConfig = getStatusConfig(request);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <motion.tr
                    key={request.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    variants={tableRowVariants}
                    custom={index}
                    whileHover={{
                      backgroundColor: "rgba(243, 244, 246, 0.7)",
                      transition: { duration: 0.2 }
                    }}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      delay: 0.1 * index,
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {request.budget_id}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(request.date)}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <motion.span 
                        className={`${
                          isHighAmount(request.total) 
                            ? "font-semibold text-amber-600 dark:text-amber-400" 
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                        whileHover={isHighAmount(request.total) ? {
                          scale: 1.05,
                          transition: { duration: 0.2 }
                        } : {}}
                      >
                        {isHighAmount(request.total) && (
                          <span className="inline-block h-2 w-2 mr-1 rounded-full bg-amber-500 animate-pulse"></span>
                        )}
                        ₹{parseFloat(request.total).toLocaleString()}
                      </motion.span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                      {request.approval_category}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                      {request.approval_type}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                      {request.current_form_level} of {request.form_max_level}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <motion.div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${statusConfig.bgColor} ${statusConfig.textColor}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          transition: { 
                            delay: 0.7 + (0.05 * index),
                            type: "spring",
                            stiffness: 200
                          }
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 2px 10px 0 rgba(0,0,0,0.12)",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.div animate={statusConfig.animation}>
                          <StatusIcon className="h-3 w-3 mr-1.5" />
                        </motion.div>
                        {request.current_status}
                      </motion.div>
                    </td>
                    <td className="py-4 px-4 text-sm text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/dashboard/requests/${request.id}`}>
                          <motion.button 
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                            variants={buttonVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            whileTap="tap"
                            title="View Request Details"
                          >
                            <motion.div variants={iconVariants} whileHover="hover">
                              <Eye className="h-4 w-4" />
                            </motion.div>
                          </motion.button>
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No recent budget requests found
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </motion.div>

      {/* No pagination needed for dashboard preview */}
    </motion.div>
  );
};

export default RequestsTable;