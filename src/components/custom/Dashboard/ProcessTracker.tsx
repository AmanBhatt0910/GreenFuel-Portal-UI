import React, { JSX } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProcessTrackerProps {
  processData: ProcessData[];
  title?: string;
  description?: string;
}

export interface ProcessData {
  id: string;
  name: string;
  stage: number;
  totalStages: number;
  status: "completed" | "in-progress" | "pending";
  updatedAt: string;
}

const processVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.2 },
  },
};

const getStatusColorClass = (status: string): string => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "in-progress":
      return "bg-amber-500";
    case "pending":
      return "bg-gray-300 dark:bg-gray-600";
    default:
      return "bg-gray-300 dark:bg-gray-600";
  }
};

const getStatusBadge = (status: string): JSX.Element => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          Completed
        </Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
          In Progress
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          Pending
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          Unknown
        </Badge>
      );
  }
};

const ProcessTracker: React.FC<ProcessTrackerProps> = ({
  title = "Asset Request Process Status",
  description,
  processData,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate={processData.length > 0 ? "visible" : "hidden"}
      variants={processVariants}
    >
      <Card className="dark:bg-[#2D2D3A] dark:border-gray-700 overflow-hidden">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && (
            <CardDescription className="dark:text-gray-400">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {processData.map((process) => (
            <div key={process.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium dark:text-white">{process.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Updated {process.updatedAt}
                  </p>
                </div>
                <div>{getStatusBadge(process.status)}</div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Stage {process.stage} of {process.totalStages}</span>
                  <span>{Math.round((process.stage / process.totalStages) * 100)}%</span>
                </div>
                <Progress
                  value={(process.stage / process.totalStages) * 100}
                  className={`h-2 ${getStatusColorClass(process.status)}`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProcessTracker;
