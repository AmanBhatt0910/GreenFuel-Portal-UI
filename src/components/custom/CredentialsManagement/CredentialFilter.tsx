"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { CredentialFilterProps } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback } from "react";

export function CredentialFilter({
  onFilterChange,
  departments,
  roles,
  searchValue = "",
  department = "",
  role = "",
  status = "",
}: CredentialFilterProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [localDepartment, setLocalDepartment] = useState(department);
  const [localRole, setLocalRole] = useState(role);
  const [localStatus, setLocalStatus] = useState(status);
  
  // Initialize local state from props
  useEffect(() => {
    setLocalSearch(searchValue);
    setLocalDepartment(department);
    setLocalRole(role);
    setLocalStatus(status);
  }, [searchValue, department, role, status]);
  
  const hasActiveFilters = localStatus !== "all" && localStatus || localDepartment !== "all" && localDepartment || localRole !== "all" && localRole;
  
  // Memoize the filter change function to prevent re-renders
  const applyFilters = useCallback(() => {
    if (typeof onFilterChange === 'function') {
      onFilterChange('searchValue', localSearch);
      onFilterChange('department', localDepartment === "all" ? "" : localDepartment);
      onFilterChange('role', localRole === "all" ? "" : localRole);
      onFilterChange('status', localStatus === "all" ? "" : localStatus);
    }
  }, [localSearch, localDepartment, localRole, localStatus, onFilterChange]);
  
  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  
  const clearFilters = () => {
    setLocalDepartment("all");
    setLocalRole("all");
    setLocalStatus("all");
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 items-center">
      <div className="relative flex-1 w-full md:max-w-md">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, employee code..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-9 w-full border-gray-300 h-10 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-100 dark:focus:border-blue-100"
        />
        {localSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full aspect-square rounded-l-none"
            onClick={() => setLocalSearch("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto">
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 px-4 gap-1.5 dark:bg-gray-900">
              <Filter className="h-4 w-4 " />
              <span>Filters</span>
              {hasActiveFilters && (
                <Badge variant="default" className="ml-1 rounded-full px-1.5 py-px text-xs">
                  {(localStatus !== "all" ? 1 : 0) +
                    (localDepartment !== "all" ? 1 : 0) +
                    (localRole !== "all" ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 bg-gray-900" align="end">
            <div className="space-y-4 p-1 ">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Status</h4>
                <Select value={localStatus} onValueChange={setLocalStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Department</h4>
                <Select value={localDepartment} onValueChange={setLocalDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900">
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.filter(dept => dept.name && dept.name.trim() !== "").map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Role</h4>
                <Select value={localRole} onValueChange={setLocalRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900">
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.filter(role => role.name && role.name.trim() !== "").map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    clearFilters();
                    setIsFiltersOpen(false);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
