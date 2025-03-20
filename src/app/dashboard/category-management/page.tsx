/**
 * Category Management Page
 * 
 * This page allows administrators to:
 * 1. Create, edit, and delete approval request categories
 * 2. View and manage approvers assigned to each category
 * 3. Filter and search through categories and approvers
 */

"use client";

import React, { useState, useEffect } from "react";
// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CustomBreadcrumb } from "@/components/custom/PlantHierarchy";
// Table Components
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
// Dropdown Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Icons
import { Trash2, Edit, Plus, Search, X, ChevronDown, Check } from "lucide-react";
// API Hook
import useAxios from "@/app/hooks/use-axios";

/**
 * Interface for Category data structure
 */
interface Category {
  id: number;
  name: string;
}

/**
 * Interface for Approver data structure
 * Represents a user who has approval permissions for specific categories
 */
interface Approver {
  id: number;
  user: number;
  business_unit: number;
  department: number;
  level: number;
  user_details?: {
    name: string;
    email?: string;
  };
  business_unit_details?: {
    name: string;
  };
  department_details?: {
    name: string;
  };
  approver_request_category?: number | null;
  category_details?: {
    name: string;
  };
}

/**
 * CategoryManagement Component
 * Main component for managing approval request categories and their approvers
 */
const CategoryManagement: React.FC = () => {
  // Category State Management
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    name: string | null;
  }>({
    name: null
  });

  // Approver State Management
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [approverFilters, setApproverFilters] = useState<{
    user: number | null;
    business_unit: number | null;
    department: number | null;
    level: number | null;
    category: number | null;
  }>({
    user: null,
    business_unit: null,
    department: null,
    level: null,
    category: null
  });

  const api = useAxios();

  /**
   * Fetch initial data for categories and approvers
   * Runs on component mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories from API
        const categoriesRes = await api.get('/approval-request-category/');
        const transformedCategories = categoriesRes.data.map((cat: any) => ({
          id: cat.id,
          name: cat.name
        }));
        setCategories(transformedCategories);
        
        // Fetch approvers from API
        const approversRes = await api.get('/approver/');
        setApprovers(approversRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Handle adding a new category
   * Validates input and makes API call to create category
   */
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/approval-request-category/', {
        name: newCategoryName.trim()
      });

      const newCategory: Category = {
        id: response.data.id,
        name: response.data.name
      };

      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      toast.success("Category added successfully!");
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle updating an existing category
   * Validates input and makes API call to update category
   */
  const handleUpdateCategory = async () => {
    if (!editCategory || !editCategory.name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.put(`/approval-request-category/${editCategory.id}/`, {
        name: editCategory.name.trim()
      });

      setCategories(categories.map((cat) => 
        cat.id === editCategory.id ? response.data : cat
      ));
      setEditCategory(null);
      setIsDialogOpen(false);
      toast.success("Category updated successfully!");
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle deleting a category
   * Makes API call to delete category and updates local state
   */
  const handleDeleteCategory = async (id: number) => {
    try {
      setIsLoading(true);
      await api.delete(`/approval-request-category/${id}/`);
      setCategories(categories.filter((cat) => cat.id !== id));
      setIsDeleteDialogOpen(false);
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Apply a filter to the categories list
   * @param filterName - Name of the filter to apply
   * @param value - Value to set for the filter
   */
  const applyCategoryFilter = (filterName: keyof typeof filters, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  /**
   * Apply a filter to the approvers list
   * @param filterName - Name of the filter to apply
   * @param value - Value to set for the filter
   */
  const applyApproverFilter = (filterName: keyof typeof approverFilters, value: number | null) => {
    setApproverFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  /**
   * Clear all category filters
   */
  const clearCategoryFilters = () => {
    setFilters({
      name: null
    });
  };

  /**
   * Clear all approver filters
   */
  const clearApproverFilters = () => {
    setApproverFilters({
      user: null,
      business_unit: null,
      department: null,
      level: null,
      category: null
    });
  };

  /**
   * Filter categories based on search query and filters
   */
  const filteredCategories = categories.filter(category => {
    if (filters.name !== null && category.name !== filters.name) return false;
    return category.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  /**
   * Filter approvers based on selected filters
   */
  const filteredApprovers = approvers.filter(approver => {
    if (approverFilters.user !== null && approver.user !== approverFilters.user) return false;
    if (approverFilters.business_unit !== null && approver.business_unit !== approverFilters.business_unit) return false;
    if (approverFilters.department !== null && approver.department !== approverFilters.department) return false;
    if (approverFilters.level !== null && approver.level !== approverFilters.level) return false;
    if (approverFilters.category !== null && approver.approver_request_category !== approverFilters.category) return false;
    return true;
  });

  /**
   * Get unique values for category filters
   */
  const uniqueValues = {
    name: [...new Set(categories.map(cat => cat.name))]
  };

  /**
   * Get unique values for approver filters
   */
  const uniqueApproverValues = {
    user: [...new Set(approvers.map(a => a.user))],
    business_unit: [...new Set(approvers.map(a => a.business_unit))],
    department: [...new Set(approvers.map(a => a.department))],
    level: [...new Set(approvers.map(a => a.level))],
    category: [...new Set(approvers.map(a => a.approver_request_category).filter(c => c !== null) as number[])]
  };

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <CustomBreadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Category Management", href: "/dashboard/category-management" },
          ]}
          aria-label="Breadcrumb Navigation"
        />
      </div>

      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Category Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Add, edit and organize your categories</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="bg-red-50 border-red-200 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Add New Category Form */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
            <CardDescription>Create a new category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category Name"
                className="flex-1"
              />
              <Button 
                onClick={handleAddCategory} 
                disabled={!newCategoryName.trim() || isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Manage your existing categories</CardDescription>
              </div>
              {/* Search Input */}
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search categories..."
                    className="pl-10 pr-4 w-full md:w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Categories Table */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* Category Name Column with Filter */}
                    <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex items-center cursor-pointer">
                            <span>Category Name</span>
                            <ChevronDown size={14} className={`ml-1 ${filters.name !== null ? 'text-blue-500' : 'text-gray-400'}`} />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuItem 
                            className="flex items-center justify-between"
                            onClick={clearCategoryFilters}
                          >
                            <span className="text-sm font-medium">Show All</span>
                            {Object.values(filters).every(f => f === null) && <Check size={14} className="text-blue-500" />}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <div className="max-h-60 overflow-auto">
                            {uniqueValues.name.map(name => (
                              <DropdownMenuItem 
                                key={name}
                                className="flex items-center justify-between"
                                onClick={() => applyCategoryFilter('name', name)}
                              >
                                <span className="text-sm">{name}</span>
                                {filters.name === name && <Check size={14} className="text-blue-500" />}
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
                  {/* Empty State */}
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {searchQuery || filters.name !== null
                          ? "No categories match your filters" 
                          : "No categories added yet. Add your first category above."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Categories List
                    filteredCategories.map((category) => (
                      <TableRow 
                        key={category.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <TableCell>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                {category.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {category.name}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {/* Action Buttons */}
                          <div className="flex justify-end space-x-2">
                            {/* Edit Dialog */}
                            <Dialog open={isDialogOpen && editCategory?.id === category.id} onOpenChange={setIsDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditCategory(category);
                                    setIsDialogOpen(true);
                                  }}
                                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogTitle>Edit Category</DialogTitle>
                                <div className="py-4">
                                  <Input
                                    value={editCategory?.name || ""}
                                    onChange={(e) =>
                                      setEditCategory({ ...editCategory!, name: e.target.value })
                                    }
                                    placeholder="Category Name"
                                  />
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleUpdateCategory} 
                                    className="bg-primary hover:bg-primary/90"
                                    disabled={!editCategory?.name.trim()}
                                  >
                                    Update
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            {/* Delete Dialog */}
                            <Dialog open={isDeleteDialogOpen && categoryToDelete === category.id} onOpenChange={setIsDeleteDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setCategoryToDelete(category.id);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogTitle>Delete Category</DialogTitle>
                                <div className="py-4">
                                  <p className="text-gray-500 dark:text-gray-400">
                                    Are you sure you want to delete <span className="font-semibold">{category.name}</span>? 
                                    This action cannot be undone.
                                  </p>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteCategory(categoryToDelete!)}
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Approvers List */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Approvers by Category</CardTitle>
                <CardDescription>Users with form access permissions by category</CardDescription>
              </div>
              {/* Active Filters Display */}
              {Object.values(approverFilters).some(f => f !== null) && (
                <div className="flex items-center space-x-2">
                  <div className="flex flex-wrap gap-2">
                    {/* User Filter Badge */}
                    {approverFilters.user !== null && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <span>User: {approvers.find(a => a.user === approverFilters.user)?.user_details?.name || `ID: ${approverFilters.user}`}</span>
                        <button 
                          className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                          onClick={() => applyApproverFilter('user', null)}
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    )}
                    {/* Business Unit Filter Badge */}
                    {approverFilters.business_unit !== null && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <span>Business Unit: {approvers.find(a => a.business_unit === approverFilters.business_unit)?.business_unit_details?.name || `ID: ${approverFilters.business_unit}`}</span>
                        <button 
                          className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                          onClick={() => applyApproverFilter('business_unit', null)}
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    )}
                    {/* Department Filter Badge */}
                    {approverFilters.department !== null && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <span>Department: {approvers.find(a => a.department === approverFilters.department)?.department_details?.name || `ID: ${approverFilters.department}`}</span>
                        <button 
                          className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                          onClick={() => applyApproverFilter('department', null)}
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    )}
                    {/* Level Filter Badge */}
                    {approverFilters.level !== null && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <span>Level: {approverFilters.level}</span>
                        <button 
                          className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                          onClick={() => applyApproverFilter('level', null)}
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    )}
                    {/* Category Filter Badge */}
                    {approverFilters.category !== null && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <span>Category: {categories.find(c => c.id === approverFilters.category)?.name || `ID: ${approverFilters.category}`}</span>
                        <button 
                          className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                          onClick={() => applyApproverFilter('category', null)}
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    )}
                  </div>
                  {/* Clear All Filters Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearApproverFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Empty State */}
            {filteredApprovers.length === 0 ? (
              <div className="text-center p-8 text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
                {approvers.length === 0 
                  ? "No approvers have been added yet."
                  : "No approvers match the current filters."
                }
                {approvers.length > 0 && Object.values(approverFilters).some(f => f !== null) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearApproverFilters}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              {/* Approvers Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {/* User Column with Filter */}
                      <TableHead>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div className="flex items-center cursor-pointer">
                              <span>User</span>
                              <ChevronDown size={14} className={`ml-1 ${approverFilters.user !== null ? 'text-blue-500' : 'text-gray-400'}`} />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem 
                              className="flex items-center justify-between"
                              onClick={clearApproverFilters}
                            >
                              <span className="text-sm font-medium">Show All</span>
                              {Object.values(approverFilters).every(f => f === null) && <Check size={14} className="text-blue-500" />}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="max-h-60 overflow-auto">
                              {uniqueApproverValues.user.map(userId => {
                                const approver = approvers.find(a => a.user === userId);
                                return (
                                  <DropdownMenuItem 
                                    key={userId}
                                    className="flex items-center justify-between"
                                    onClick={() => applyApproverFilter('user', userId)}
                                  >
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                          {approver?.user_details?.name?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                      </div>
                                      <span className="text-sm">{approver?.user_details?.name || `User ID: ${userId}`}</span>
                                    </div>
                                    {approverFilters.user === userId && <Check size={14} className="text-blue-500" />}
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
                              <span>Business Unit</span>
                              <ChevronDown size={14} className={`ml-1 ${approverFilters.business_unit !== null ? 'text-blue-500' : 'text-gray-400'}`} />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem 
                              className="flex items-center justify-between"
                              onClick={clearApproverFilters}
                            >
                              <span className="text-sm font-medium">Show All</span>
                              {Object.values(approverFilters).every(f => f === null) && <Check size={14} className="text-blue-500" />}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="max-h-60 overflow-auto">
                              {uniqueApproverValues.business_unit.map(buId => {
                                const approver = approvers.find(a => a.business_unit === buId);
                                return (
                                  <DropdownMenuItem 
                                    key={buId}
                                    className="flex items-center justify-between"
                                    onClick={() => applyApproverFilter('business_unit', buId)}
                                  >
                                    <span className="text-sm">{approver?.business_unit_details?.name || `ID: ${buId}`}</span>
                                    {approverFilters.business_unit === buId && <Check size={14} className="text-blue-500" />}
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
                              <span>Department</span>
                              <ChevronDown size={14} className={`ml-1 ${approverFilters.department !== null ? 'text-blue-500' : 'text-gray-400'}`} />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem 
                              className="flex items-center justify-between"
                              onClick={clearApproverFilters}
                            >
                              <span className="text-sm font-medium">Show All</span>
                              {Object.values(approverFilters).every(f => f === null) && <Check size={14} className="text-blue-500" />}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="max-h-60 overflow-auto">
                              {uniqueApproverValues.department.map(deptId => {
                                const approver = approvers.find(a => a.department === deptId);
                                return (
                                  <DropdownMenuItem 
                                    key={deptId}
                                    className="flex items-center justify-between"
                                    onClick={() => applyApproverFilter('department', deptId)}
                                  >
                                    <span className="text-sm">{approver?.department_details?.name || `ID: ${deptId}`}</span>
                                    {approverFilters.department === deptId && <Check size={14} className="text-blue-500" />}
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
                              <span>Level</span>
                              <ChevronDown size={14} className={`ml-1 ${approverFilters.level !== null ? 'text-blue-500' : 'text-gray-400'}`} />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-40">
                            <DropdownMenuItem 
                              className="flex items-center justify-between"
                              onClick={clearApproverFilters}
                            >
                              <span className="text-sm font-medium">Show All</span>
                              {Object.values(approverFilters).every(f => f === null) && <Check size={14} className="text-blue-500" />}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="max-h-60 overflow-auto">
                              {uniqueApproverValues.level.map(level => (
                                <DropdownMenuItem 
                                  key={level}
                                  className="flex items-center justify-between"
                                  onClick={() => applyApproverFilter('level', level)}
                                >
                                  <span className="text-sm">Level {level}</span>
                                  {approverFilters.level === level && <Check size={14} className="text-blue-500" />}
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
                              <span>Category</span>
                              <ChevronDown size={14} className={`ml-1 ${approverFilters.category !== null ? 'text-blue-500' : 'text-gray-400'}`} />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem 
                              className="flex items-center justify-between"
                              onClick={clearApproverFilters}
                            >
                              <span className="text-sm font-medium">Show All</span>
                              {Object.values(approverFilters).every(f => f === null) && <Check size={14} className="text-blue-500" />}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="max-h-60 overflow-auto">
                              {uniqueApproverValues.category.map(categoryId => {
                                const category = categories.find(c => c.id === categoryId);
                                return (
                                  <DropdownMenuItem 
                                    key={categoryId}
                                    className="flex items-center justify-between"
                                    onClick={() => applyApproverFilter('category', categoryId)}
                                  >
                                    <span className="text-sm">{category?.name || `ID: ${categoryId}`}</span>
                                    {approverFilters.category === categoryId && <Check size={14} className="text-blue-500" />}
                                  </DropdownMenuItem>
                                );
                              })}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Approvers List */}
                    {filteredApprovers.map((approver) => (
                      <TableRow key={approver.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        {/* User Cell */}
                        <TableCell>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                {approver.user_details?.name?.charAt(0).toUpperCase() || '?'}
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
                        {/* Business Unit Cell */}
                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                          {approver.business_unit_details?.name || `ID: ${approver.business_unit}`}
                        </TableCell>
                        {/* Department Cell */}
                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                          {approver.department_details?.name || `ID: ${approver.department}`}
                        </TableCell>
                        {/* Level Cell */}
                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                          <Badge variant="secondary">
                            Level {approver.level}
                          </Badge>
                        </TableCell>
                        {/* Category Cell */}
                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                          {approver.category_details?.name || 'No Category'}
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
    </div>
  );
};

export default CategoryManagement;