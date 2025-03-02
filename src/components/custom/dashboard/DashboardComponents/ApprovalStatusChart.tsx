import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ApprovalStatusChartProps } from "./types";
import { cardVariants } from "./WeeklyActivityChart";

const ApprovalStatusChart: React.FC<ApprovalStatusChartProps> = ({
  data,
  isLoaded,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={cardVariants}
    >
      <Card className="dark:bg-[#2D2D3A] dark:border-gray-700 overflow-hidden">
        <CardHeader>
          <CardTitle>Approval Status by Level</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Form status distribution across all approval levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "currentColor" }}
                  className="text-gray-500 dark:text-gray-400"
                />
                <YAxis
                  tick={{ fill: "currentColor" }}
                  className="text-gray-500 dark:text-gray-400"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2D2D3A",
                    borderColor: "#4B5563",
                    color: "#F9FAFB",
                  }}
                />
                <Legend />
                <Bar dataKey="approved" stackId="a" fill="#10B981" />
                <Bar dataKey="pending" stackId="a" fill="#F59E0B" />
                <Bar dataKey="rejected" stackId="a" fill="#EF4444" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ApprovalStatusChart;
