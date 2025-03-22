import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, Check, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category, Approver, ApproverFilters } from "./types";

interface ApproversListProps {
  approvers: Approver[];
  categories: Category[];
  onEditApprover?: (id: number) => void;
  onDeleteApprover?: (id: number) => void;
}

const ApproversList: React.FC<ApproversListProps> = ({ 
  approvers, 
  categories,
  onEditApprover,
  onDeleteApprover 
}) => {
  const [approverFilters, setApproverFilters] = useState<ApproverFilters>({
    user: null,
    business_unit: null,
    department: null,
    level: null,
    category: null,
  });

  // Apply a filter to the approvers list
  const applyApproverFilter = (
    filterName: keyof ApproverFilters,
    value: number | null
  ) => {
    setApproverFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Clear all approver filters
  const clearApproverFilters = () => {
    setApproverFilters({
      user: null,
      business_unit: null,
      department: null,
      level: null,
      category: null,
    });
  };

  // Filter approvers based on selected filters
  const filteredApprovers = approvers.filter((approver) => {
    if (approverFilters.user !== null && approver.user !== approverFilters.user)
      return false;
    if (
      approverFilters.business_unit !== null &&
      approver.business_unit !== approverFilters.business_unit
    )
      return false;
    if (
      approverFilters.department !== null &&
      approver.department !== approverFilters.department
    )
      return false;
    if (
      approverFilters.level !== null &&
      approver.level !== approverFilters.level
    )
      return false;
    if (
      approverFilters.category !== null &&
      approver.approver_request_category !== approverFilters.category
    )
      return false;
    return true;
  });

  // Get unique values for approver filters
  const uniqueApproverValues = {
    user: [...new Set(approvers.map((a) => a.user))],
    business_unit: [...new Set(approvers.map((a) => a.business_unit))],
    department: [...new Set(approvers.map((a) => a.department))],
    level: [...new Set(approvers.map((a) => a.level))],
    category: [
      ...new Set(
        approvers
          .map((a) => a.approver_request_category)
          .filter((c) => c !== null) as number[]
      ),
    ],
  };

  // Handle edit approver action
  const handleEditApprover = (id: number) => {
    if (onEditApprover) {
      onEditApprover(id);
    }
  };

  // Handle delete approver action
  const handleDeleteApprover = (id: number) => {
    if (onDeleteApprover) {
      onDeleteApprover(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Filters Display */}
      {Object.values(approverFilters).some((f) => f !== null) && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {/* User Filter Badge */}
            {approverFilters.user !== null && (
              <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
                <span>
                  User:{" "}
                  {approvers.find((a) => a.user === approverFilters.user)?.user_details?.name ||
                    `ID: ${approverFilters.user}`}
                </span>
                <button
                  className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                  onClick={() => applyApproverFilter("user", null)}
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
            {/* Business Unit Filter Badge */}
            {approverFilters.business_unit !== null && (
              <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
                <span>
                  Business Unit:{" "}
                  {approvers.find(
                    (a) => a.business_unit === approverFilters.business_unit
                  )?.business_unit_details?.name || `ID: ${approverFilters.business_unit}`}
                </span>
                <button
                  className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                  onClick={() => applyApproverFilter("business_unit", null)}
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
            {/* Department Filter Badge */}
            {approverFilters.department !== null && (
              <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
                <span>
                  Department:{" "}
                  {approvers.find(
                    (a) => a.department === approverFilters.department
                  )?.department_details?.name || `ID: ${approverFilters.department}`}
                </span>
                <button
                  className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                  onClick={() => applyApproverFilter("department", null)}
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
            {/* Level Filter Badge */}
            {approverFilters.level !== null && (
              <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
                <span>Level: {approverFilters.level}</span>
                <button
                  className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                  onClick={() => applyApproverFilter("level", null)}
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
            {/* Category Filter Badge */}
            {approverFilters.category !== null && (
              <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
                <span>
                  Category:{" "}
                  {categories.find((c) => c.id === approverFilters.category)?.name || 
                   `ID: ${approverFilters.category}`}
                </span>
                <button
                  className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                  onClick={() => applyApproverFilter("category", null)}
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
          </div>
          {/* Clear All Filters Button */}
          <Button variant="outline" size="sm" onClick={clearApproverFilters} className="text-xs">
            Clear All
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredApprovers.length === 0 ? (
        <div className="text-center p-8 text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
          {approvers.length === 0
            ? "No approvers have been added yet."
            : "No approvers match the current filters."}
          {approvers.length > 0 && Object.values(approverFilters).some((f) => f !== null) && (
            <Button variant="outline" size="sm" onClick={clearApproverFilters} className="mt-4">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                {/* User Column with Filter */}
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center cursor-pointer">
                        <span className="font-medium">User</span>
                        <ChevronDown
                          size={14}
                          className={`ml-1 ${
                            approverFilters.user !== null
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem
                        className="flex items-center justify-between"
                        onClick={clearApproverFilters}
                      >
                        <span className="text-sm font-medium">Show All</span>
                        {Object.values(approverFilters).every((f) => f === null) && (
                          <Check size={14} className="text-blue-500" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <div className="max-h-60 overflow-auto">
                        {uniqueApproverValues.user.map((userId) => {
                          const approver = approvers.find((a) => a.user === userId);
                          return (
                            <DropdownMenuItem
                              key={userId}
                              className="flex items-center justify-between"
                              onClick={() => applyApproverFilter("user", userId)}
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                    {approver?.user_details?.name?.charAt(0).toUpperCase() || "?"}
                                  </span>
                                </div>
                                <span className="text-sm">
                                  {approver?.user_details?.name || `User ID: ${userId}`}
                                </span>
                              </div>
                              {approverFilters.user === userId && (
                                <Check size={14} className="text-blue-500" />
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
                {/* Business Unit Column with Filter */}
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center cursor-pointer">
                        <span className="font-medium">Business Unit</span>
                        <ChevronDown
                          size={14}
                          className={`ml-1 ${
                            approverFilters.business_unit !== null
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem
                        className="flex items-center justify-between"
                        onClick={clearApproverFilters}
                      >
                        <span className="text-sm font-medium">Show All</span>
                        {Object.values(approverFilters).every((f) => f === null) && (
                          <Check size={14} className="text-blue-500" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <div className="max-h-60 overflow-auto">
                        {uniqueApproverValues.business_unit.map((buId) => {
                          const approver = approvers.find((a) => a.business_unit === buId);
                          return (
                            <DropdownMenuItem
                              key={buId}
                              className="flex items-center justify-between"
                              onClick={() => applyApproverFilter("business_unit", buId)}
                            >
                              <span className="text-sm">
                                {approver?.business_unit_details?.name || `ID: ${buId}`}
                              </span>
                              {approverFilters.business_unit === buId && (
                                <Check size={14} className="text-blue-500" />
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
                {/* Department Column with Filter */}
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center cursor-pointer">
                        <span className="font-medium">Department</span>
                        <ChevronDown
                          size={14}
                          className={`ml-1 ${
                            approverFilters.department !== null
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem
                        className="flex items-center justify-between"
                        onClick={clearApproverFilters}
                      >
                        <span className="text-sm font-medium">Show All</span>
                        {Object.values(approverFilters).every((f) => f === null) && (
                          <Check size={14} className="text-blue-500" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <div className="max-h-60 overflow-auto">
                        {uniqueApproverValues.department.map((deptId) => {
                          const approver = approvers.find((a) => a.department === deptId);
                          return (
                            <DropdownMenuItem
                              key={deptId}
                              className="flex items-center justify-between"
                              onClick={() => applyApproverFilter("department", deptId)}
                            >
                              <span className="text-sm">
                                {approver?.department_details?.name || `ID: ${deptId}`}
                              </span>
                              {approverFilters.department === deptId && (
                                <Check size={14} className="text-blue-500" />
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
                {/* Level Column with Filter */}
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center cursor-pointer">
                        <span className="font-medium">Level</span>
                        <ChevronDown
                          size={14}
                          className={`ml-1 ${
                            approverFilters.level !== null
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                      <DropdownMenuItem
                        className="flex items-center justify-between"
                        onClick={clearApproverFilters}
                      >
                        <span className="text-sm font-medium">Show All</span>
                        {Object.values(approverFilters).every((f) => f === null) && (
                          <Check size={14} className="text-blue-500" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <div className="max-h-60 overflow-auto">
                        {uniqueApproverValues.level.map((level) => (
                          <DropdownMenuItem
                            key={level}
                            className="flex items-center justify-between"
                            onClick={() => applyApproverFilter("level", level)}
                          >
                            <span className="text-sm">Level {level}</span>
                            {approverFilters.level === level && (
                              <Check size={14} className="text-blue-500" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
                {/* Category Column with Filter */}
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center cursor-pointer">
                        <span className="font-medium">Category</span>
                        <ChevronDown
                          size={14}
                          className={`ml-1 ${
                            approverFilters.category !== null
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem
                        className="flex items-center justify-between"
                        onClick={clearApproverFilters}
                      >
                        <span className="text-sm font-medium">Show All</span>
                        {Object.values(approverFilters).every((f) => f === null) && (
                          <Check size={14} className="text-blue-500" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <div className="max-h-60 overflow-auto">
                        {uniqueApproverValues.category.map((categoryId) => {
                          const category = categories.find((c) => c.id === categoryId);
                          return (
                            <DropdownMenuItem
                              key={categoryId}
                              className="flex items-center justify-between"
                              onClick={() => applyApproverFilter("category", categoryId)}
                            >
                              <span className="text-sm">
                                {category?.name || `ID: ${categoryId}`}
                              </span>
                              {approverFilters.category === categoryId && (
                                <Check size={14} className="text-blue-500" />
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
                {/* Actions Column */}
                <TableHead>
                  <span className="font-medium">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Approvers List */}
              {filteredApprovers.map((approver) => (
                <TableRow key={approver.id} className="hover:bg-muted/20">
                  {/* User Cell */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          {approver.user_details?.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {approver.user_details?.name || `User ID: ${approver.user}`}
                        </span>
                        {approver.user_details?.email && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {approver.user_details.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  {/* Business Unit Cell */}
                  <TableCell>
                    {approver.business_unit_details?.name || `ID: ${approver.business_unit}`}
                  </TableCell>
                  {/* Department Cell */}
                  <TableCell>
                    {approver.department_details?.name || `ID: ${approver.department}`}
                  </TableCell>
                  {/* Level Cell */}
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-medium">
                      Level {approver.level}
                    </Badge>
                  </TableCell>
                  {/* Category Cell */}
                  <TableCell>
                    {approver.category_details?.name || "No Category"}
                  </TableCell>
                  {/* Actions Cell */}
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-500 dark:hover:text-blue-400 dark:hover:bg-blue-950/30"
                        onClick={() => approver.id !== undefined && handleEditApprover(approver.id)}
                      >
                        <span className="sr-only">Edit</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-950/30"
                        onClick={() => approver.id !== undefined && handleDeleteApprover(approver.id)}
                      >
                        <span className="sr-only">Delete</span>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ApproversList; 