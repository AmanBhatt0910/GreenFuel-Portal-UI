"use client";

import { useState } from "react";
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
import { Pencil, Trash2, KeyRound, Eye, MoreHorizontal, ShieldAlert, Shield } from "lucide-react";
import { Credential, CredentialTableProps } from "./types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export function CredentialTable({
  credentials,
  onEdit,
  onDelete,
  onView,
  onResetPassword,
  filter = {},
}: CredentialTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "destructive";
      case "Manager":
        return "default";
      case "Developer":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <ShieldAlert className="h-3 w-3 mr-1" />;
      case "Manager":
        return <Shield className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  // Apply filters to credentials
  const filteredCredentials = credentials.filter((cred) => {
    const searchValue = filter.searchValue?.toLowerCase() || "";
    
    // If no search value and all filters are set to default, return all credentials
    if (!searchValue && 
        (!filter.department || filter.department === "" || filter.department === "all") && 
        (!filter.role || filter.role === "" || filter.role === "all") && 
        (!filter.status || filter.status === "" || filter.status === "all")) return true;

    // Check department filter (skip if "all" or empty)
    if (filter.department && filter.department !== "all" && filter.department !== "" && 
        cred.department?.toLowerCase() !== filter.department?.toLowerCase()) return false;
    
    // Check role filter (skip if "all" or empty)
    if (filter.role && filter.role !== "all" && filter.role !== "" && 
        cred.role?.toLowerCase() !== filter.role?.toLowerCase()) return false;
    
    // Check status filter (skip if "all" or empty)
    if (filter.status && filter.status !== "all" && filter.status !== "" && 
        cred.status?.toLowerCase() !== filter.status?.toLowerCase()) return false;

    // Check if search value matches any field
    if (searchValue) {
      return (
        (cred.name || "").toLowerCase().includes(searchValue) ||
        (cred.email || "").toLowerCase().includes(searchValue) ||
        (cred.employeeCode || "").toLowerCase().includes(searchValue) ||
        (cred.department || "").toLowerCase().includes(searchValue) ||
        (cred.designation || "").toLowerCase().includes(searchValue) ||
        (cred.notes || "").toLowerCase().includes(searchValue)
      );
    }

    return true;
  });

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900">
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-280px)] rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCredentials.length > 0 ? (
            filteredCredentials.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="hover:bg-muted/50 border-b"
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {user.employeeCode}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {user.profileImage ? (
                        <AvatarImage src={user.profileImage} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div 
                        className="font-medium cursor-pointer hover:text-primary"
                        onClick={() => onView(user)}
                      >
                        {user.name}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.designation}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)} className="flex w-fit items-center">
                    {getRoleIcon(user.role)}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {renderStatusBadge(user.status)}
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <div className="flex justify-end items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onView(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details</p>
                        </TooltipContent>
                      </Tooltip>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onResetPassword(user.id)}>
                            <KeyRound className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => onDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No matching records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
