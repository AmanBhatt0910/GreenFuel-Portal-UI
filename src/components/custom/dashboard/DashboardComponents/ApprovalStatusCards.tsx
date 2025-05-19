import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, ChevronDown, FileText, Loader2Icon } from "lucide-react";
import { ApprovalStatusChartProps, cardVariants, staggerContainer } from "./types";

const ApprovalStatusCards: React.FC<ApprovalStatusChartProps> = ({statData}) => {

  if(!statData) return <div><Loader2Icon className="size-5 animate-spin" /></div>

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-t-4 border-yellow-500"
        variants={cardVariants}
        whileHover={{
          y: -5,
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Total Form Created
          </h3>
          <motion.div
            className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 5, duration: 1 }}
          >
            <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </motion.div>
        </div>

        <div className="flex items-center justify-between">
          <motion.span
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            {statData?.form_count}
          </motion.span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Requests awaiting review
          </span>
        </div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-t-4 border-yellow-500"
        variants={cardVariants}
        whileHover={{
          y: -5,
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pending Approval
          </h3>
          <motion.div
            className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 5, duration: 1 }}
          >
            <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </motion.div>
        </div>

        <div className="flex items-center justify-between">
          <motion.span
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            {statData?.pending_count}
          </motion.span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Requests awaiting review
          </span>
        </div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-t-4 border-green-500"
        variants={cardVariants}
        whileHover={{
          y: -5,
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Accepted Approval
          </h3>
          <motion.div
            className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.5 }}
          >
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </motion.div>
        </div>
        <div className="flex items-center justify-between">
          <motion.span
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            {statData?.approved_count}
          </motion.span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Requests approved this month
          </span>
        </div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-t-4 border-red-500"
        variants={cardVariants}
        whileHover={{
          y: -5,
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Rejected Approval
          </h3>
          <motion.div
            className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg"
            animate={{ rotate: [0, 45, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.5 }}
          >
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </motion.div>
        </div>
        <div className="flex items-center justify-between">
          <motion.span
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          >
            {statData?.rejected_count}
          </motion.span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Requests rejected this month
          </span>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default ApprovalStatusCards;
