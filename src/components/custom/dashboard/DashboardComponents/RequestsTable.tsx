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

interface RequestType {
  id: string;
  requester: string;
  department: string;
  category: string;
  date: string;
  status: "pending" | "approved" | "rejected";
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

const RequestsTable: React.FC<RequestsTableProps> = ({ requests, formatDate }) => {
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
          Recent Requests
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
            className="flex items-center px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(243, 244, 246, 1)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              variants={iconVariants}
              whileHover="hover"
            >
              <Filter className="h-4 w-4 mr-2" />
            </motion.div>
            Filter
          </motion.button>
          <motion.button 
            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(37, 99, 235, 1)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              variants={iconVariants}
              whileHover="hover"
            >
              <Download className="h-4 w-4 mr-2" />
            </motion.div>
            Export
          </motion.button>
        </motion.div>
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
                Request ID
              </th>
              <th className="w-[220px] py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Requester
              </th>
              <th className="w-[180px] py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Department
              </th>
              <th className="w-[150px] py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="w-[180px] py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
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
            {requests.map((request, index) => (
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
                  {request.id}
                </td>
                <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {request.requester}
                </td>
                <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {request.department}
                </td>
                <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {request.category}
                </td>
                <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(request.date)}
                </td>
                <td className="py-4 px-4 text-sm">
                  <motion.span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : request.status === "rejected"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
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
                      scale: 1.1,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {request.status === "approved" && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          transition: { 
                            repeat: Infinity, 
                            repeatDelay: 3,
                            duration: 0.5
                          }
                        }}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                      </motion.div>
                    )}
                    {request.status === "rejected" && (
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, 0, -10, 0],
                          transition: { 
                            repeat: Infinity, 
                            repeatDelay: 3,
                            duration: 0.5
                          }
                        }}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                      </motion.div>
                    )}
                    {request.status === "pending" && (
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          transition: { 
                            repeat: Infinity, 
                            duration: 3,
                            ease: "linear"
                          }
                        }}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                      </motion.div>
                    )}
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </motion.span>
                </td>
                <td className="py-4 px-4 text-sm text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <motion.button 
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      whileHover={{ 
                        scale: 1.2,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                    <motion.button 
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                      whileHover={{ 
                        scale: 1.2,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>

      <motion.div 
        className="flex items-center justify-between mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: 0.8,
            type: "spring",
            stiffness: 100
          }
        }}
      >
        <motion.p 
          className="text-sm text-gray-600 dark:text-gray-400"
          whileHover={{ 
            color: "rgba(79, 70, 229, 1)",
            transition: { duration: 0.2 }
          }}
        >
          Showing <motion.span 
            className="font-medium"
            initial={{ fontWeight: 500 }}
            whileHover={{ 
              scale: 1.1,
              fontWeight: 700,
              transition: { duration: 0.2 }
            }}
          >1</motion.span> to{" "}
          <motion.span 
            className="font-medium"
            initial={{ fontWeight: 500 }}
            whileHover={{ 
              scale: 1.1,
              fontWeight: 700,
              transition: { duration: 0.2 }
            }}
          >7</motion.span> of{" "}
          <motion.span 
            className="font-medium"
            initial={{ fontWeight: 500 }}
            whileHover={{ 
              scale: 1.1,
              fontWeight: 700,
              transition: { duration: 0.2 }
            }}
          >42</motion.span> results
        </motion.p>
        <motion.div 
          className="flex items-center space-x-2"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.button 
            className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50"
            variants={buttonVariants}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(243, 244, 246, 1)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            Previous
          </motion.button>
          <motion.button 
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg"
            variants={buttonVariants}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: "rgba(37, 99, 235, 1)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            1
          </motion.button>
          <motion.button 
            className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
            variants={buttonVariants}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(243, 244, 246, 1)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            2
          </motion.button>
          <motion.button 
            className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
            variants={buttonVariants}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(243, 244, 246, 1)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            3
          </motion.button>
          <motion.button 
            className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
            variants={buttonVariants}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(243, 244, 246, 1)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default RequestsTable;