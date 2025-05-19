"use client"

import React, { useState, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ArrowUpDown,
  ChevronDown,
  Download,
  Filter,
  Calendar,
  ArrowRight,
  ArrowRightCircle,
} from "lucide-react";

import { RequestType } from "../types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface RequestsTableProps {
  requests: RequestType[];
  formatDate: (date: string) => string;
}

const isHighAmount = (totalStr: string): boolean => {
  const amount = parseFloat(totalStr);
  return amount >= 5000000; // 50 lakh (5,000,000)
};

const formatCurrency = (amount: string): string => {
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numAmount);
};

const getRequestStatus = (request: RequestType): string => {
  if (request.status === "approved" || request.current_status === "Approved") {
    return "Approved";
  } else if (
    request.status === "rejected" ||
    request.rejected ||
    request.current_status === "Rejected"
  ) {
    return "Rejected";
  } else {
    return "Pending";
  }
};

const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
  formatDate,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof RequestType | 'level'; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
  const [filters, setFilters] = useState({
    budget_id: '',
    date: '',
    total: '',
    approval_category: '',
    approval_type: '',
    level: '',
    current_status: ''
  });

  // Handle sorting
  const handleSort = (key: keyof RequestType | 'level') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle filtering
  const handleFilterChange = (key: keyof typeof filters, value: string): void => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...requests];
    
    // Apply filters
    if (filters.budget_id) {
      result = result.filter(item => item.budget_id.toLowerCase().includes(filters.budget_id.toLowerCase()));
    }
    if (filters.date) {
      result = result.filter(item => formatDate(item.date).toLowerCase().includes(filters.date.toLowerCase()));
    }
    if (filters.total) {
      result = result.filter(item => item.total.toString().includes(filters.total));
    }
    if (filters.approval_category) {
      result = result.filter(item => item.approval_category?.toLowerCase().includes(filters.approval_category.toLowerCase()));
    }
    if (filters.approval_type) {
      result = result.filter(item => item.approval_type?.toLowerCase().includes(filters.approval_type.toLowerCase()));
    }
    if (filters.level) {
      result = result.filter(item => `${item.current_form_level} of ${item.form_max_level}`.includes(filters.level));
    }
    if (filters.current_status) {
      result = result.filter(item => getRequestStatus(item).toLowerCase().includes(filters.current_status.toLowerCase()));
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Special handling for level which is a computed field
        if (sortConfig.key === 'level') {
          const levelA = `${a.current_form_level} of ${a.form_max_level}`;
          const levelB = `${b.current_form_level} of ${b.form_max_level}`;
          
          if (levelA < levelB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (levelA > levelB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        }
        
        let valueA = a[sortConfig.key as keyof RequestType];
        let valueB = b[sortConfig.key as keyof RequestType];
        
        // Special handling for date
        if (sortConfig.key === 'date') {
          valueA = new Date(valueA as string).getTime();
          valueB = new Date(valueB as string).getTime();
        }
        // Special handling for total (as it's a string)
        else if (sortConfig.key === 'total') {
          valueA = parseFloat(valueA as string);
          valueB = parseFloat(valueB as string);
        }
        
        if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // Limit to 10 items
    return result.slice(0, 10);
  }, [requests, sortConfig, filters, formatDate]);

  const getStatusIcon = (request: RequestType) => {
    const status = getRequestStatus(request);
    switch(status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusStyles = (request: RequestType) => {
    const status = getRequestStatus(request);
    switch(status.toLowerCase()) {
      case 'approved':
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
      case 'rejected':
        return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
      case 'pending':
      default:
        return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200";
    }
  };

  const getRowStyles = (request: RequestType) => {
    const status = getRequestStatus(request);
    switch(status.toLowerCase()) {
      case 'approved':
        return "bg-green-50 hover:bg-green-100";
      case 'rejected':
        return "bg-red-50 hover:bg-red-100";
      default:
        return "hover:bg-gray-100";
    }
  };

  interface Column {
    key: keyof typeof filters;
    sortKey?: keyof RequestType | 'level';
    label: string;
    presetFilters?: string[];
  }



  const renderFilterMenu = (column: Column): JSX.Element => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter {column.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Input
            placeholder={`Filter ${column.label.toLowerCase()}...`}
            value={filters[column.key]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(column.key, e.target.value)}
            className="h-8"
          />
        </div>
        {column.presetFilters && (
          <>
            <DropdownMenuSeparator />
            {column.presetFilters.map((filter: string, idx: number) => (
              <DropdownMenuItem 
                key={idx}
                onClick={() => handleFilterChange(column.key, filter)}
              >
                {filter}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const columns: Column[] = [
    { key: 'budget_id', label: 'S.No.' },
    { key: 'budget_id', sortKey: 'budget_id', label: 'Budget ID' },
    { key: 'date', sortKey: 'date', label: 'Date' },
    { key: 'total', sortKey: 'total', label: 'Amount' },
    { 
      key: 'approval_category', 
      sortKey: 'approval_category',
      label: 'Category',
      presetFilters: ['Opex', 'Capex', 'Service', 'Hardware']
    },
    { 
      key: 'approval_type', 
      sortKey: 'approval_type',
      label: 'Type',
      presetFilters: ['Opex', 'Capex']
    },
    { key: 'level', sortKey: 'level', label: 'Level' },
    { 
      key: 'current_status', 
      sortKey: 'current_status',
      label: 'Status',
      presetFilters: ['Pending', 'Approved', 'Rejected']
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Recent Budget Requests</CardTitle>
        <div className="flex items-center space-x-2">
          
          <Button 
            variant="default" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => window.location.href = "/dashboard/requests"}
          >
            See All
            <ArrowRightCircle className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead 
                    key={`${column.key}-${index}`} 
                    className={`px-4 py-3 text-center ${index === 0 ? 'w-12 bg-gray-50' : ''}`}
                  >
                    <div className="flex items-center justify-center">
                      {index === 0 ? (
                        <span className="font-bold">{column.label}</span>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            className="p-0 font-medium h-7 hover:bg-transparent"
                            onClick={() => column.sortKey && handleSort(column.sortKey)}
                          >
                            {column.label}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                          {renderFilterMenu(column)}
                        </>
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.length > 0 ? (
                filteredAndSortedData.map((request, index) => (
                  <TableRow 
                    key={request.id}
                    className={getRowStyles(request)}
                  >
                    <TableCell className="font-bold text-center w-12 bg-gray-50">{index + 1}</TableCell>
                    <TableCell className="font-medium text-center">
                      <div className="flex items-center justify-center gap-1">
                  
                        {request.budget_id}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {formatDate(request.date)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {isHighAmount(request.total) && (
                          <span className="inline-block h-2 w-2 mr-2 rounded-full bg-amber-500 animate-pulse"></span>
                        )}
                        <span className={isHighAmount(request.total) ? "font-semibold text-amber-600" : ""}>
                          {formatCurrency(request.total)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{request.approval_category}</TableCell>
                    <TableCell className="text-center">{request.approval_type}</TableCell>
                    <TableCell className="text-center">{request.current_form_level} of {request.form_max_level}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge 
                          variant="outline" 
                          className={`flex items-center gap-1 ${getStatusStyles(request)}`}
                        >
                          {getStatusIcon(request)}
                          {getRequestStatus(request)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => window.location.href = `/dashboard/requests/${request.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default RequestsTable;
