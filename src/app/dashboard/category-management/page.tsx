"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CustomBreadcrumb } from "@/components/custom/PlantHierarchy";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Trash2, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BusinessUnit {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  unitId: string;
}

interface Category {
  id: string;
  name: string;
  departmentId: string;
}

const dummyBusinessUnits: BusinessUnit[] = [
  { id: "1", name: "Finance" },
  { id: "2", name: "HR" },
  { id: "3", name: "IT" },
];

const dummyDepartments: Department[] = [
  { id: "d1", name: "Accounting", unitId: "1" },
  { id: "d2", name: "Recruitment", unitId: "2" },
  { id: "d3", name: "Software Development", unitId: "3" },
];

const dummyCategories: Category[] = [
  { id: "c1", name: "Payroll Processing", departmentId: "d1" },
  { id: "c2", name: "Job Posting", departmentId: "d2" },
  { id: "c3", name: "Frontend Development", departmentId: "d3" },
];

const CategoryManagement: React.FC = () => {
  // State
  const [businessUnits] = useState(dummyBusinessUnits);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>(dummyCategories);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedUnit) {
      setDepartments(dummyDepartments.filter((dept) => dept.unitId === selectedUnit));
    } else {
      setDepartments([]);
    }
    setSelectedDepartment(""); 
  }, [selectedUnit]);

  useEffect(() => {
    if (selectedDepartment) {
      setCategories(dummyCategories.filter((cat) => cat.departmentId === selectedDepartment));
    } else {
      setCategories([]);
    }
  }, [selectedDepartment]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }
    const newCategory: Category = {
      id: `c${Math.random().toString(36).substring(2, 9)}`,
      name: newCategoryName,
      departmentId: selectedDepartment,
    };
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    toast.success("Category added successfully!");
  };

  const handleUpdateCategory = () => {
    if (!editCategory || !editCategory.name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    setCategories(categories.map((cat) => (cat.id === editCategory.id ? editCategory : cat)));
    setEditCategory(null);
    setIsDialogOpen(false);
    toast.success("Category updated successfully!");
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    setIsDeleteDialogOpen(false);
    toast.success("Category deleted successfully!");
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <CustomBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Category Management", href: "/dashboard/categories" },
        ]}
        aria-label="Breadcrumb Navigation"
      />

      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6 mt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-gray-500 mt-2">
            Manage your organization's categories
          </p>
        </div>
      </div>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value="categories">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Select onValueChange={setSelectedUnit}>
                  <SelectTrigger className="w-full md:w-1/3">
                    <SelectValue placeholder="Select Business Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={setSelectedDepartment}
                  disabled={!selectedUnit}
                >
                  <SelectTrigger className="w-full md:w-1/3">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New Category Name"
                  className="w-full md:w-auto"
                />
                <Button onClick={handleAddCategory} disabled={!newCategoryName.trim() || !selectedDepartment}>
                  Add
                </Button>
              </div>

              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full md:w-1/3 mb-4"
              />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setEditCategory(category);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogTitle>Edit Category</DialogTitle>
                            <Input
                              value={editCategory?.name || ""}
                              onChange={(e) =>
                                setEditCategory({ ...editCategory!, name: e.target.value })
                              }
                            />
                            <DialogFooter>
                              <Button onClick={handleUpdateCategory}>Update</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                setCategoryToDelete(category.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogTitle>Delete Category</DialogTitle>
                            <p>Are you sure you want to delete this category?</p>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryManagement;