import React from "react";
import { motion } from "framer-motion";
import { FileText, Users, BarChart3, Bell } from "lucide-react";

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

const QuickActions: React.FC = () => {
  return (
    <motion.div 
      className="bg-white  dark:bg-gray-800 rounded-xl shadow-sm p-6"
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
            delay: 0.3,
            type: "spring",
            stiffness: 100
          }
        }}
      >
        Quick Actions
      </motion.h3>
      <motion.div 
        className="grid grid-cols-2 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.button 
          className="flex flex-col items-center justify-center p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition-colors"
          variants={cardVariants}
          whileHover={{ 
            y: -5,
            backgroundColor: "rgba(238, 242, 255, 1)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="bg-indigo-100 dark:bg-indigo-800/50 p-3 rounded-full mb-4"
            whileHover={{ 
              rotate: 10,
              scale: 1.1,
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 10 
              }
            }}
          >
            <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            New Request
          </span>
        </motion.button>

        <motion.button 
          className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
          variants={cardVariants}
          whileHover={{ 
            y: -5,
            backgroundColor: "rgba(236, 253, 245, 1)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="bg-green-100 dark:bg-green-800/50 p-3 rounded-full mb-4"
            whileHover={{ 
              rotate: 10,
              scale: 1.1,
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 10 
              }
            }}
          >
            <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
          </motion.div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Team
          </span>
        </motion.button>

        <motion.button 
          className="flex flex-col items-center justify-center p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-colors"
          variants={cardVariants}
          whileHover={{ 
            y: -5,
            backgroundColor: "rgba(254, 243, 199, 1)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="bg-amber-100 dark:bg-amber-800/50 p-3 rounded-full mb-4"
            whileHover={{ 
              rotate: 10,
              scale: 1.1,
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 10 
              }
            }}
          >
            <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </motion.div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Reports
          </span>
        </motion.button>

        <motion.button 
          className="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
          variants={cardVariants}
          whileHover={{ 
            y: -5,
            backgroundColor: "rgba(239, 246, 255, 1)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="bg-blue-100 dark:bg-blue-800/50 p-3 rounded-full mb-4"
            whileHover={{ 
              rotate: 10,
              scale: 1.1,
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 10 
              }
            }}
          >
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
              <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </motion.div>
          </motion.div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Notifications
          </span>
        </motion.button>
      </motion.div>

      {/* <motion.div 
        className="mt-6"
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
        <motion.h4 
          className="text-sm font-medium text-gray-900 dark:text-white mb-4"
          initial={{ opacity: 0, y: -5 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              delay: 0.9,
              type: "spring",
              stiffness: 100
            }
          }}
        >
          Pending Tasks
        </motion.h4>
        <motion.div 
          className="space-y-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            variants={cardVariants}
            whileHover={{ 
              x: 5,
              backgroundColor: "rgba(250, 250, 250, 1)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex items-center">
              <motion.div 
                className="w-2 h-2 bg-yellow-500 rounded-full mr-3"
                animate={{ 
                  scale: [1, 1.3, 1],
                  transition: { 
                    repeat: Infinity, 
                    repeatDelay: 2,
                    duration: 0.5
                  }
                }}
              ></motion.div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Complete monthly report
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Due tomorrow
            </span>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            variants={cardVariants}
            whileHover={{ 
              x: 5,
              backgroundColor: "rgba(250, 250, 250, 1)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex items-center">
              <motion.div 
                className="w-2 h-2 bg-red-500 rounded-full mr-3"
                animate={{ 
                  scale: [1, 1.3, 1],
                  transition: { 
                    repeat: Infinity, 
                    repeatDelay: 1.5,
                    duration: 0.5
                  }
                }}
              ></motion.div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Review budget proposals
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Overdue by 2 days
            </span>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            variants={cardVariants}
            whileHover={{ 
              x: 5,
              backgroundColor: "rgba(250, 250, 250, 1)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex items-center">
              <motion.div 
                className="w-2 h-2 bg-green-500 rounded-full mr-3"
                animate={{ 
                  scale: [1, 1.3, 1],
                  transition: { 
                    repeat: Infinity, 
                    repeatDelay: 2.5,
                    duration: 0.5
                  }
                }}
              ></motion.div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Schedule team meeting
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Due in 3 days
            </span>
          </motion.div>
        </motion.div>
      </motion.div> */}
      
    </motion.div>
  );
};

export default QuickActions;