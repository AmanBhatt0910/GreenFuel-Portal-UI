"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Pencil, Trash2, KeyRound, Eye, MoreHorizontal, Building } from "lucide-react";
import { Credential, CredentialTableProps } from "./types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";

export function CredentialTable({
  credentials,
  onEdit,
  onDelete,
  onView,
  onResetPassword,
  filter = {},
  designations = [],
  departments = [],
  businessUnits = [],
  isLoading = false
}: CredentialTableProps) {
  // Ensure credentials is an array
  const credentialsArray: Credential[] = Array.isArray(credentials) ? credentials : [];

  // Create lookup maps for designations and business units
  const designationMap = useMemo(() => {
    const map = new Map<number, string>();
    designations.forEach(designation => {
      map.set(designation.id, designation.name); 
    });
    return map;
  }, [designations]);

  const departmentMap = useMemo(() => {
    const map = new Map<number, string>();
    departments.forEach(department => {
      map.set(department.id, department.name);
    });
    return map;
  }, [departments]);

  const businessUnitMap = useMemo(() => {
    const map = new Map<number, string>();
    businessUnits.forEach(unit => {
      map.set(unit.id, unit.name);
    });
    return map;
  }, [businessUnits]);

  const getDesignationName = (id: number | null) => {
    if (id === null) return '-';
    return designationMap.get(id) || '-';
  };

  const getBusinessUnitName = (id: number | null) => {
    if (id === null) return '-';
    return businessUnitMap.get(id) || '-';
  };

  const getDepartmentName = (id: number | null) => {
    if (id === null) return '-';
    return departmentMap.get(id) || '-';
  };

  const filteredCredentials = credentialsArray.filter((cred) => {
    const searchValue = filter.searchValue?.toLowerCase() || "";

    // Handle department filter
    if (filter.department && filter.department !== "all" && 
        cred.department?.toString() !== filter.department) {
      return false;
    }
    
    // Handle business unit filter (now comparing with mapped name)
    if (filter.business_unit && filter.business_unit !== "all") {
      const unitName = getBusinessUnitName(cred.business_unit);
      if (unitName !== filter.business_unit) {
        return false;
      }
    }

    // Search filtering
    if (searchValue) {
      const designationName = getDesignationName(cred.designation);
      const businessUnitName = getBusinessUnitName(cred.business_unit);
      
      return [
        cred.name, 
        cred.email, 
        cred.employee_code, 
        cred.department, 
        designationName, 
        businessUnitName
      ].some(field => field?.toString().includes(searchValue));
    }
    
    return true;
  });

  return (
    <ScrollArea className="h-[calc(100vh-280px)] rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead>ID</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Business Unit</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
            </TableRow>
          ) : filteredCredentials.length > 0 ? (
            filteredCredentials.map((user , index) => (
              <motion.tr
                key={user.id || user.email || index+1}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="hover:bg-muted/50 border-b"
              >
                <TableCell className="font-mono text-xs text-muted-foreground">{user.employee_code || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium cursor-pointer hover:text-primary" onClick={() => onView(user)}>
                        {user.name || "Unknown"}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.email || "N/A"}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getDepartmentName(user.department)}</TableCell>
                <TableCell>
                  {user.business_unit !== null ? (
                    <Badge variant="outline">
                      <Building className="h-3 w-3 mr-1" />
                      {getBusinessUnitName(user.business_unit)}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{getDesignationName(user.designation)}</TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <div className="flex justify-end items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><span>View Details</span></TooltipContent>
                      </Tooltip>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onEdit(user)}><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onResetPassword(user.email)}><KeyRound className="h-4 w-4 mr-2" />Reset Password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => onDelete(user.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </motion.tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No matching records found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
