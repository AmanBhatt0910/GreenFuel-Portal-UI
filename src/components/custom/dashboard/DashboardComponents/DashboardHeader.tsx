import React from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeaderProps } from "./types";

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
}) => {
  return (
    <motion.div
      className="flex justify-between items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Greenfuel Dashboard
      </h1>
      <div className="flex space-x-2">
      
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="dark:border-gray-700 dark:text-gray-300 cursor-pointer"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
