import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCardProps } from "./types";

export const statCardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1,
      duration: 0.5,
    },
  },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  valueColor,
  icon,
  isLoaded,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={statCardVariants}
    >
      <Card className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg shadow-md p-6 hover:border-blue-500 dark:hover:border-blue-300 border-2 border-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-start">
            <div>
              <div
                className={`text-3xl font-bold ${
                  valueColor || "text-gray-900 dark:text-white"
                }`}
              >
                {value}
              </div>
              <div className="flex items-center mt-1">
                {change ? (
                  <>
                    <Badge
                      variant={change > 0 ? "default" : "destructive"}
                      className={
                        change > 0
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }
                    >
                      {change > 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(change)}%
                    </Badge>
                  </>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {subtitle}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center rounded-lg p-3 hover:bg-blue-50 dark:hover:bg-slate-700">
              {icon}
            </div>
          </div>
        </CardContent>
        {/* Decorative bottom line that animates in */}
        <motion.div
          className={`h-1 ${
            title === "Total Forms"
              ? "bg-blue-500"
              : title === "Approved"
              ? "bg-green-500"
              : title === "Rejected"
              ? "bg-red-500"
              : "bg-amber-500"
          }`}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
      </Card>
    </motion.div>
  );
};

export default StatCard;
