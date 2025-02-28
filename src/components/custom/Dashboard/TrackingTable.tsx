import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RecentForm {
  id: string;
  submitter: string;
  department: string;
  status: string;
  level: number;
  updatedAt: string;
}

interface FormStat {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  weekChange: number;
}

interface TrackingTableProps {
  formStats: FormStat;
  recentForms: RecentForm[];
  isLoaded: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getProgressColorClass: (status: string) => string;
}

// Animation variants for the component
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

const TrackingTable: React.FC<TrackingTableProps> = ({
  formStats,
  recentForms,
  isLoaded,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  getStatusIcon,
  getStatusColor,
  getProgressColorClass,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={cardVariants}
    >
      <Card className="dark:bg-[#2D2D3A] dark:border-gray-700 overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Form Tracking</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Track approval status across all levels
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Search forms..."
                  className="w-64 pl-10 dark:bg-[#252533] dark:border-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-36 dark:bg-[#252533] dark:border-gray-700 dark:text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#252533] dark:border-gray-700">
                  <SelectItem value="all">All Forms</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-400">Form ID</TableHead>
                  <TableHead className="dark:text-gray-400">
                    Submitter
                  </TableHead>
                  <TableHead className="dark:text-gray-400">
                    Department
                  </TableHead>
                  <TableHead className="dark:text-gray-400">Status</TableHead>
                  <TableHead className="dark:text-gray-400">
                    Approval Level
                  </TableHead>
                  <TableHead className="dark:text-gray-400">
                    Last Updated
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentForms.map((form, index) => (
                  <motion.tr
                    key={form.id}
                    custom={index}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    variants={tableRowVariants}
                    className="dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="font-medium dark:text-white">
                      {form.id}
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      {form.submitter}
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      {form.department}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(form.status)}
                        <span className={`ml-2 ${getStatusColor(form.status)}`}>
                          {form.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Level {form.level}/5</span>
                          <span>{form.level * 20}%</span>
                        </div>
                        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`absolute top-0 left-0 h-full ${getProgressColorClass(
                              form.status
                            )}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${form.level * 20}%` }}
                            transition={{
                              delay: 0.3 + index * 0.1,
                              duration: 0.7,
                              ease: "easeOut",
                            }}
                          ></motion.div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {form.updatedAt}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {recentForms.length} of {formStats.total} forms
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="dark:border-gray-700 dark:text-gray-300 flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="dark:border-gray-700 dark:text-gray-300 flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TrackingTable;
