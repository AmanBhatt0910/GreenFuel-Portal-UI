'use client';

import React, { useState, useEffect, useRef } from 'react';
import useAxios from '@/app/hooks/use-axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast-util';
import { ChevronDown, Search, X, Check, UserPlus, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Approver, BusinessUnit, Department, User } from './types';

// Type definitions

const ApprovalAccessPage = () => {
  const api = useAxios();
  
  // State for user selection dropdown
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<{
    user: number | null;
    business_unit: number | null;
    department: number | null;
    level: number | null;
  }>({
    user: null,
    business_unit: null,
    department: null,
    level: null
  });

  // Form state
  const [formData, setFormData] = useState<Approver>({
    user: 0,
    business_unit: 0,
    department: 0,
    level: 1
  });

  // Selected user for display
  const selectedUser = users.find(u => u.id === formData.user);
  
  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        
        const usersResponse = await api.get('/userInfo/');

        const userData = Array.isArray(usersResponse.data) 
          ? usersResponse.data 
          : [usersResponse.data];
        
        const formattedUsers = userData.map(user => ({
          id: user.id,
          name: user.name || user.username || `User ${user.id}`,
          email: user.email
        }));
        
        setUsers(formattedUsers);
        
        const businessUnitsResponse = await api.get('/business-units/');
        setBusinessUnits(businessUnitsResponse.data);
        
        const allDepartmentsPromises = businessUnitsResponse.data.map(async (bu: BusinessUnit) => {
          try {
            const deptResponse = await api.get(`/departments/?business_unit=${bu.id}`);
            return deptResponse.data;
          } catch (error) {
            console.error(`Error fetching departments for business unit ${bu.id}:`, error);
            return [];
          }
        });
        
        const allDepartmentsArrays = await Promise.all(allDepartmentsPromises);
        const allDepartments = allDepartmentsArrays.flat();

        
        const approversResponse = await api.get('/approver/' , {
          params: {
            type: "approver"
          }
        });
       
        // Enrich approvers with user, business unit, and department details
        const enrichedApprovers = Array.isArray(approversResponse.data) 
          ? approversResponse.data.map(approver => ({
              ...approver,
              user_details: formattedUsers.find(u => u.id === approver.user),
              business_unit_details: businessUnitsResponse.data.find((bu: BusinessUnit) => bu.id === approver.business_unit),
              department_details: allDepartments.find((dept: Department) => dept.id === approver.department)
            }))
          : [];

        setApprovers(enrichedApprovers);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Update departments when business unit changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!formData.business_unit) return;
      
      setLoading(true);
      try {
        const response = await api.get(`/departments/?business_unit=${formData.business_unit}`);
        setDepartments(response.data);
        
        setFormData(prev => ({
          ...prev,
          department: 0,
          level: 1 
        }));
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
  }, [formData.business_unit]);
  
  useEffect(() => {
    if (!formData.department || formData.department === 0) return;
    
    // Find all approvers for this department
    const departmentApprovers = approvers.filter(
      a => a.department === formData.department
    );
    
    if (departmentApprovers.length > 0) {
      const highestLevel = Math.max(...departmentApprovers.map(a => a.level));
      setFormData(prev => ({
        ...prev,
        level: highestLevel + 1
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        level: 1
      }));
    }
  }, [formData.department, approvers]);
  const handleSubmit = async () => {
    if (!formData.user) {
      toast.error('Please select a user');
      return;
    }
    
    if (!formData.business_unit) {
      toast.error('Please select a business unit');
      return;
    }
    
    if (!formData.department) {
      toast.error('Please select a department');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/approver/', formData);
      
      const selectedUser = users.find(u => u.id === formData.user);
      const selectedBusinessUnit = businessUnits.find(bu => bu.id === formData.business_unit);
      
      const selectedDepartment = departments.find(dept => dept.id === formData.department);
      
      if (!selectedDepartment) {
        console.warn('Department not found in local state, fetching again');
        try {
          const deptResponse = await api.get(`/departments/${formData.department}/`);
          
          setApprovers(prev => [
            ...prev, 
            {
              ...response.data,
              user_details: selectedUser,
              business_unit_details: selectedBusinessUnit,
              department_details: deptResponse.data
            }
          ]);
        } catch (deptError) {
          console.error('Error fetching department details:', deptError);
          setApprovers(prev => [
            ...prev, 
            {
              ...response.data,
              user_details: selectedUser,
              business_unit_details: selectedBusinessUnit
            }
          ]);
        }
      } else {
        setApprovers(prev => [
          ...prev, 
          {
            ...response.data,
            user_details: selectedUser,
            business_unit_details: selectedBusinessUnit,
            department_details: selectedDepartment
          }
        ]);
      }
      setFormData({
        user: 0,
        business_unit: 0,
        department: 0,
        level: 1
      });
      
      toast.success('Approver added successfully');
    } catch (error) {
      console.error('Error adding approver:', error);
      toast.error('Failed to add approver. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveApprover = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this approver?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/approver/${id}/`);
      
      setApprovers(prev => prev.filter(a => a.id !== id));
      
      toast.success('Approver removed successfully');
    } catch (error) {
      console.error('Error removing approver:', error);
      toast.error('Failed to remove approver. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleUserSelect = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      user: userId
    }));
    setIsUserDropdownOpen(false);
    setSearchTerm('');
  };
  
  // Clear user selection
  const clearUserSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData(prev => ({
      ...prev,
      user: 0
    }));
  };

  // Apply a filter
  const applyFilter = (filterName: keyof typeof filters, value: number | null) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      user: null,
      business_unit: null,
      department: null,
      level: null
    });
  };

  // Get filtered approvers
  const filteredApprovers = approvers.filter(approver => {
    if (filters.user !== null && approver.user !== filters.user) return false;
    if (filters.business_unit !== null && approver.business_unit !== filters.business_unit) return false;
    if (filters.department !== null && approver.department !== filters.department) return false;
    if (filters.level !== null && approver.level !== filters.level) return false;
    return true;
  });

  // Get unique values for filters
  const uniqueValues = {
    user: [...new Set(approvers.map(a => a.user))],
    business_unit: [...new Set(approvers.map(a => a.business_unit))],
    department: [...new Set(approvers.map(a => a.department))],
    level: [...new Set(approvers.map(a => a.level))]
  };

  return (
    <div className="container mx-auto py-6 px-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Approval Access Management</CardTitle>
          <CardDescription>Add and manage users who can access the form system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* User Selection */}
            <div className="space-y-2">
              <Label htmlFor="user">User <span className="text-red-500">*</span></Label>
              <Popover open={isUserDropdownOpen} onOpenChange={setIsUserDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isUserDropdownOpen}
                    className="w-full justify-between h-10"
                  >
                    {selectedUser ? (
                      <div className="flex items-center gap-2 w-full overflow-hidden">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                            {selectedUser.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{selectedUser.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">Select User</span>
                    )}
                    <ChevronDown size={16} className={`ml-auto shrink-0 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={4}>
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users..."
                        className="w-full pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto py-2">
                    {loading ? (
                      <div className="py-6 flex flex-col items-center justify-center text-sm text-gray-500">
                        <div className="animate-spin h-5 w-5 text-blue-500 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                        <span>Loading users...</span>
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="py-6 flex flex-col items-center justify-center text-sm text-gray-500">
                        <Search className="h-5 w-5 mb-2 text-gray-400 opacity-50" />
                        <p>No users found matching "{searchTerm}"</p>
                        {searchTerm && (
                          <button 
                            className="mt-2 text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => setSearchTerm('')}
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        {filteredUsers.map((person) => (
                          <div
                            key={person.id}
                            className={`px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                              formData.user === person.id ? 'bg-blue-50 dark:bg-gray-600' : ''
                            }`}
                            onClick={() => {
                              handleUserSelect(person.id);
                              setIsUserDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center">
                              <Avatar className="h-7 w-7 shrink-0 mr-2">
                                <AvatarFallback className={`text-xs ${
                                  formData.user === person.id 
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                }`}>
                                  {person.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col overflow-hidden">
                                <span className={`text-sm truncate ${
                                  formData.user === person.id ? 'font-medium' : ''
                                }`}>
                                  {person.name}
                                </span>
                                {person.email && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {person.email}
                                  </span>
                                )}
                              </div>
                              {formData.user === person.id && (
                                <div className="ml-auto">
                                  <Check size={16} className="text-blue-500" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedUser && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-xs text-gray-500 hover:text-red-600 justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearUserSelection(e);
                          setIsUserDropdownOpen(false);
                        }}
                      >
                        <X size={14} className="mr-1" />
                        Clear selection
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Business Unit Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="business_unit">Business Unit <span className="text-red-500">*</span></Label>
              <Select
                value={formData.business_unit ? formData.business_unit.toString() : "0"}
                onValueChange={(value) => setFormData(prev => ({ ...prev, business_unit: parseInt(value) }))}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Business Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0" disabled>Select Business Unit</SelectItem>
                  {businessUnits.map((bu) => (
                    <SelectItem key={bu.id} value={bu.id.toString()}>
                      {bu.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Department Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
              <Select
                value={formData.department ? formData.department.toString() : "0"}
                onValueChange={(value) => setFormData(prev => ({ ...prev, department: parseInt(value) }))}
                disabled={!formData.business_unit || formData.business_unit === 0}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={!formData.business_unit || formData.business_unit === 0 ? "Select Business Unit first" : "Select Department"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0" disabled>Select Department</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                  {departments.length === 0 && formData.business_unit && formData.business_unit !== 0 && (
                    <div className="px-2 py-4 text-sm text-gray-500 text-center">
                      No departments available for the selected business unit
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {/* Level Input */}
            <div className="space-y-2">
              <Label htmlFor="level">Access Level <span className="text-red-500">*</span></Label>
              <Input
                id="level"
                type="number"
                min="1"
                max="10"
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                className="h-10"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={loading || !formData.user || !formData.business_unit || !formData.department}
              className="flex items-center gap-2"
            >
              <UserPlus size={16} />
              Add Approver
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Approvers List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Approvers</CardTitle>
              <CardDescription>Users with form access permissions</CardDescription>
            </div>
            {Object.values(filters).some(f => f !== null) && (
              <div className="flex items-center space-x-2">
                <div className="flex flex-wrap gap-2">
                  {filters.user !== null && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span>User: {users.find(u => u.id === filters.user)?.name || `ID: ${filters.user}`}</span>
                      <button 
                        className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                        onClick={() => applyFilter('user', null)}
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  )}
                  {filters.business_unit !== null && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span>Business Unit: {businessUnits.find(bu => bu.id === filters.business_unit)?.name || `ID: ${filters.business_unit}`}</span>
                      <button 
                        className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                        onClick={() => applyFilter('business_unit', null)}
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  )}
                  {filters.department !== null && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span>Department: {
                        // Find department name from existing approvers first
                        (() => {
                          const approverWithDept = approvers.find(a => a.department === filters.department && a.department_details?.name);
                          return approverWithDept?.department_details?.name || 
                            (filters.department === 10 ? "Production" :
                            filters.department === 11 ? "Quality" :
                            filters.department === 23 ? "Engineering" :
                            `ID: ${filters.department}`)
                        })()
                      }</span>
                      <button 
                        className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                        onClick={() => applyFilter('department', null)}
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  )}
                  {filters.level !== null && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <span>Level: {filters.level}</span>
                      <button 
                        className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                        onClick={() => applyFilter('level', null)}
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredApprovers.length === 0 ? (
            <div className="text-center p-8 text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
              {approvers.length === 0 
                ? "No approvers have been added yet."
                : "No approvers match the current filters."
              }
              {approvers.length > 0 && Object.values(filters).some(f => f !== null) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex items-center cursor-pointer">
                            <span>User</span>
                            <ChevronDown size={14} className={`ml-1 ${filters.user !== null ? 'text-blue-500' : 'text-gray-400'}`} />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuItem 
                            className="flex items-center justify-between"
                            onClick={clearFilters}
                          >
                            <span className="text-sm font-medium">Show All</span>
                            {Object.values(filters).every(f => f === null) && <Check size={14} className="text-blue-500" />}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <div className="max-h-60 overflow-auto">
                            {uniqueValues.user.map(userId => {
                              const user = users.find(u => u.id === userId);
                              return (
                                <DropdownMenuItem 
                                  key={userId}
                                  className="flex items-center justify-between"
                                  onClick={() => applyFilter('user', userId)}
                                >
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                        {user?.name.charAt(0).toUpperCase() || '?'}
                                      </span>
                                    </div>
                                    <span className="text-sm">{user?.name || `User ID: ${userId}`}</span>
                                  </div>
                                  {filters.user === userId && <Check size={14} className="text-blue-500" />}
                                </DropdownMenuItem>
                              );
                            })}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex items-center cursor-pointer">
                            <span>Business Unit</span>
                            <ChevronDown size={14} className={`ml-1 ${filters.business_unit !== null ? 'text-blue-500' : 'text-gray-400'}`} />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuItem 
                            className="flex items-center justify-between"
                            onClick={clearFilters}
                          >
                            <span className="text-sm font-medium">Show All</span>
                            {Object.values(filters).every(f => f === null) && <Check size={14} className="text-blue-500" />}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <div className="max-h-60 overflow-auto">
                            {uniqueValues.business_unit.map(buId => {
                              const bu = businessUnits.find(b => b.id === buId);
                              return (
                                <DropdownMenuItem 
                                  key={buId}
                                  className="flex items-center justify-between"
                                  onClick={() => applyFilter('business_unit', buId)}
                                >
                                  <span className="text-sm">{bu?.name || `ID: ${buId}`}</span>
                                  {filters.business_unit === buId && <Check size={14} className="text-blue-500" />}
                                </DropdownMenuItem>
                              );
                            })}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex items-center cursor-pointer">
                            <span>Department</span>
                            <ChevronDown size={14} className={`ml-1 ${filters.department !== null ? 'text-blue-500' : 'text-gray-400'}`} />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuItem 
                            className="flex items-center justify-between"
                            onClick={clearFilters}
                          >
                            <span className="text-sm font-medium">Show All</span>
                            {Object.values(filters).every(f => f === null) && <Check size={14} className="text-blue-500" />}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <div className="max-h-60 overflow-auto">
                            {uniqueValues.department.map(deptId => {
                              // Find department name from existing approvers first
                              const approverWithDept = approvers.find(a => a.department === deptId && a.department_details?.name);
                              const deptName = approverWithDept?.department_details?.name || 
                                (deptId === 10 ? "Production" :
                                 deptId === 11 ? "Quality" :
                                 deptId === 23 ? "Engineering" :
                                 `ID: ${deptId}`);
                              
                              return (
                                <DropdownMenuItem 
                                  key={deptId}
                                  className="flex items-center justify-between"
                                  onClick={() => applyFilter('department', deptId)}
                                >
                                  <span className="text-sm">{deptName}</span>
                                  {filters.department === deptId && <Check size={14} className="text-blue-500" />}
                                </DropdownMenuItem>
                              );
                            })}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex items-center cursor-pointer">
                            <span>Level</span>
                            <ChevronDown size={14} className={`ml-1 ${filters.level !== null ? 'text-blue-500' : 'text-gray-400'}`} />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                          <DropdownMenuItem 
                            className="flex items-center justify-between"
                            onClick={clearFilters}
                          >
                            <span className="text-sm font-medium">Show All</span>
                            {Object.values(filters).every(f => f === null) && <Check size={14} className="text-blue-500" />}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <div className="max-h-60 overflow-auto">
                            {uniqueValues.level.map(level => (
                              <DropdownMenuItem 
                                key={level}
                                className="flex items-center justify-between"
                                onClick={() => applyFilter('level', level)}
                              >
                                <span className="text-sm">Level {level}</span>
                                {filters.level === level && <Check size={14} className="text-blue-500" />}
                              </DropdownMenuItem>
                            ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovers.map((approver) => (
                    <TableRow key={approver.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                              {approver.user_details?.name.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {approver.user_details?.name || `User ID: ${approver.user}`}
                            </div>
                            {approver.user_details?.email && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {approver.user_details.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {approver.business_unit_details?.name || `ID: ${approver.business_unit}`}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {approver.department_details?.name || (
                          approver.department === 10 ? "Production" :
                          approver.department === 11 ? "Quality" :
                          approver.department === 23 ? "Engineering" :
                          `ID: ${approver.department}`
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        <Badge variant="secondary">
                          Level {approver.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                          onClick={() => approver.id && handleRemoveApprover(approver.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalAccessPage;