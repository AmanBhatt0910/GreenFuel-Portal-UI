import React from "react";
import { motion } from "framer-motion";

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

const ActivityTimeline: React.FC = () => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 overflow-hidden"
      variants={cardVariants}
      whileHover={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3 }
      }}
    >
      <motion.h3 
        className="text-lg font-semibold text-gray-900 dark:text-white mb-6"
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
        Recent Activity
      </motion.h3>
      <motion.div 
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex"
          variants={cardVariants}
          whileHover={{ 
            x: 5,
            transition: { duration: 0.2 }
          }}
        >
          <div className="flex-shrink-0 mr-4">
            <motion.div 
              className="mt-1 bg-blue-600 h-4 w-4 rounded-full"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200
                }
              }}
              whileHover={{ 
                scale: 1.3,
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
                transition: { duration: 0.2 }
              }}
            ></motion.div>
            <motion.div 
              className="h-full w-0.5 bg-gray-200 dark:bg-gray-700 mx-auto"
              initial={{ height: 0 }}
              animate={{ 
                height: "100%",
                transition: { 
                  delay: 0.4,
                  duration: 0.5
                }
              }}
            ></motion.div>
          </div>
          <motion.div
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
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              New budget request submitted
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Today at 2:15 PM
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              You've submitted a new budget request for ₹1,500 for the
              Marketing department.
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex"
          variants={cardVariants}
          whileHover={{ 
            x: 5,
            transition: { duration: 0.2 }
          }}
        >
          <div className="flex-shrink-0 mr-4">
            <motion.div 
              className="mt-1 bg-green-600 h-4 w-4 rounded-full"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { 
                  delay: 0.5,
                  type: "spring",
                  stiffness: 200
                }
              }}
              whileHover={{ 
                scale: 1.3,
                boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.3)",
                transition: { duration: 0.2 }
              }}
            ></motion.div>
            <motion.div 
              className="h-full w-0.5 bg-gray-200 dark:bg-gray-700 mx-auto"
              initial={{ height: 0 }}
              animate={{ 
                height: "100%",
                transition: { 
                  delay: 0.6,
                  duration: 0.5
                }
              }}
            ></motion.div>
          </div>
          <motion.div
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
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Request approved
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Yesterday at 9:32 AM
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Your request for new office equipment has been approved by
              Finance.
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex"
          variants={cardVariants}
          whileHover={{ 
            x: 5,
            transition: { duration: 0.2 }
          }}
        >
          <div className="flex-shrink-0 mr-4">
            <motion.div 
              className="mt-1 bg-yellow-500 h-4 w-4 rounded-full"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { 
                  delay: 0.7,
                  type: "spring",
                  stiffness: 200
                }
              }}
              whileHover={{ 
                scale: 1.3,
                boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.3)",
                transition: { duration: 0.2 }
              }}
            ></motion.div>
            <motion.div 
              className="h-full w-0.5 bg-gray-200 dark:bg-gray-700 mx-auto"
              initial={{ height: 0 }}
              animate={{ 
                height: "100%",
                transition: { 
                  delay: 0.8,
                  duration: 0.5
                }
              }}
            ></motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              transition: { 
                delay: 0.8,
                type: "spring",
                stiffness: 100
              }
            }}
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Request needs revision
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              May 12, 2023 at 3:45 PM
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Your travel request needs additional documentation. Please
              provide receipts.
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex"
          variants={cardVariants}
          whileHover={{ 
            x: 5,
            transition: { duration: 0.2 }
          }}
        >
          <div className="flex-shrink-0 mr-4">
            <motion.div 
              className="mt-1 bg-red-600 h-4 w-4 rounded-full"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { 
                  delay: 0.9,
                  type: "spring",
                  stiffness: 200
                }
              }}
              whileHover={{ 
                scale: 1.3,
                boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.3)",
                transition: { duration: 0.2 }
              }}
            ></motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              transition: { 
                delay: 1.0,
                type: "spring",
                stiffness: 100
              }
            }}
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Request rejected
            </h4>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              May 10, 2023 at 11:20 AM
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Your request for additional software licenses has been
              rejected due to budget constraints.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: 1.1,
            type: "spring",
            stiffness: 100
          }
        }}
      >
        <motion.button 
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          View all activity
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ActivityTimeline;