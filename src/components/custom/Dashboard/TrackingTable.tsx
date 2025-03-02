import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormStat, RecentForm } from "./DashboardComponents/types";

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

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.3 },
  },
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
  // Filter the forms based on search term and filter
  const filteredForms = recentForms.filter((form) => {
    // Apply search filter
    const searchMatch =
      form.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.submitter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.department.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply status filter
    const statusMatch =
      filter === "all" || form.status.toLowerCase().includes(filter.toLowerCase());

    return searchMatch && statusMatch;
  });

  return (
    <motion.div
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={tableVariants}
    >
      <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-950/90 ">
        <CardHeader>
          <CardTitle>Recent Form Submissions</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:bg-[#222231] dark:border-[#444654] border-[#E5E7EB] text-slate-700 dark:text-slate-300"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-40 dark:bg-[#222231] dark:border-[#444654] border-[#E5E7EB] text-slate-700 dark:text-slate-300">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#222231] border-[#E5E7EB] text-slate-700 dark:text-slate-300">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border dark:border-[#444654] border-[#E5E7EB]">
            <Table className="dark:bg-[#2D2D3A] dark:border-[#444654] border-[#E5E7EB] bg-white shadow-sm">
              <TableHeader className="bg-gray-100 dark:bg-[#222231]">
                <TableRow className="hover:bg-gray-200 dark:hover:bg-[#292938]">
                  <TableHead className="w-[120px]">Form ID</TableHead>
                  <TableHead>Submitter</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody >
                {filteredForms.map((form) => (
                  <TableRow
                    key={form.id}
                    className="dark:bg-[#2D2D3A] dark:border-[#444654] border-[#E5E7EB] bg-white shadow-sm"
                  >
                    <TableCell className="font-medium">{form.id}</TableCell>
                    <TableCell>{form.submitter}</TableCell>
                    <TableCell>{form.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(form.status)}
                        <span className={getStatusColor(form.status)}>
                          {form.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full h-2 bg-gray-200 dark:bg-[#444654] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColorClass(
                              form.status
                            )}`}
                            style={{
                              width: `${(form.level / 5) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {form.level}/5
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{form.updatedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrackingTable;
