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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { WeeklyActivityChartProps } from "./types";

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
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
          <CardTitle>Weekly Form Activity</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Overview of submissions, approvals and rejections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorSubmitted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6552D0" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6552D0" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorApproved"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorRejected"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "currentColor" }}
                  className="text-gray-500 dark:text-gray-400"
                />
                <YAxis
                  tick={{ fill: "currentColor" }}
                  className="text-gray-500 dark:text-gray-400"
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2D2D3A",
                    borderColor: "#4B5563",
                    color: "#F9FAFB",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="submitted"
                  stroke="#6552D0"
                  fillOpacity={1}
                  fill="url(#colorSubmitted)"
                />
                <Area
                  type="monotone"
                  dataKey="approved"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorApproved)"
                />
                <Area
                  type="monotone"
                  dataKey="rejected"
                  stroke="#EF4444"
                  fillOpacity={1}
                  fill="url(#colorRejected)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeeklyActivityChart;
