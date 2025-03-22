import React, { useEffect, useState } from "react";
import useAxios from "@/app/hooks/use-axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category, Approver, User, BusinessUnit, Department } from "./types";
import { formatDate } from "./utils";
import { 
  LayersIcon, 
  UsersIcon, 
  Plus, 
  Settings2, 
  ActivitySquare, 
  UserPlus, 
  ListFilter,
  RefreshCw,
  HelpCircle,
  ChevronUpIcon,
  Search
} from "lucide-react";
import CategoryForm from "./CategoryForm";
import CategoriesList from "./CategoriesList";
import ApproverForm from "./ApproverForm";
import ApproversList from "./ApproversList";
import { Input } from "@/components/ui/input";

const CategoryManagementContent: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalApprovers: 0,
    uniqueUsers: 0,
    businessUnits: 0,
  });
  const api = useAxios();

  // Add state for scroll to top button
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // State management for search functionality
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [approverSearchTerm, setApproverSearchTerm] = useState('');
  
  // Filtered categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );
  
  // Filtered approvers based on search term
  const filteredApproversForList = approvers.filter(approver => 
    (approver.user_details?.name || '').toLowerCase().includes(approverSearchTerm.toLowerCase()) ||
    (approver.business_unit_details?.name || '').toLowerCase().includes(approverSearchTerm.toLowerCase()) ||
    (approver.department_details?.name || '').toLowerCase().includes(approverSearchTerm.toLowerCase()) ||
    (approver.category_details?.name || '').toLowerCase().includes(approverSearchTerm.toLowerCase())
  );

  // Check if we should show the scroll to top button
  useEffect(() => {
    const checkScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch categories from API
      const categoriesRes = await api.get("/approval-request-category/");
      
      if (categoriesRes.data.length > 0) {
        console.log("Sample created_at format:", categoriesRes.data[0].created_at);
      }
      
      const transformedCategories: Category[] = categoriesRes.data.map(
        (cat: any) => {
          console.log(`Category ${cat.id} created_at:`, cat.created_at);
          return {
            id: cat.id,
            name: cat.name,
            created_at: cat.created_at,
          };
        }
      );
      setCategories(transformedCategories);

      // Fetch users
      const usersResponse = await api.get("/userInfo/");
      const userData = Array.isArray(usersResponse.data)
        ? usersResponse.data
        : [usersResponse.data];
      const formattedUsers: User[] = userData.map((user: any) => ({
        id: user.id,
        name: user.name || user.username || `User ${user.id}`,
        email: user.email,
      }));
      
      setUsers(formattedUsers);

      // Fetch business units
      const businessUnitsResponse = await api.get("/business-units/");
      const businessUnitsData: BusinessUnit[] = businessUnitsResponse.data;
      
      setBusinessUnits(businessUnitsData);

      // Fetch all departments for all business units
      const allDepartmentsPromises = businessUnitsData.map(
        async (bu: BusinessUnit) => {
          try {
            const deptResponse = await api.get(
              `/departments/?business_unit=${bu.id}`
            );
            return deptResponse.data;
          } catch (error) {
            console.error(
              `Error fetching departments for business unit ${bu.id}:`,
              error
            );
            return [];
          }
        }
      );

      const allDepartmentsArrays = await Promise.all(allDepartmentsPromises);
      const allDepartments: Department[] = allDepartmentsArrays.flat();
      
      // Store all departments for reference
      setDepartments(allDepartments);

      // Fetch approvers from API
      const approversRes = await api.get("/approver/", {
        params: { type: "category" },
      });

      console.log("Approvers API response:", approversRes.data);

      // Enrich approvers with user, business unit, and department details
      const enrichedApprovers: Approver[] = Array.isArray(approversRes.data)
        ? approversRes.data.map((approver: any) => ({
            ...approver,
            user_details: formattedUsers.find((u) => u.id === approver.user),
            business_unit_details: businessUnitsData.find(
              (bu: BusinessUnit) => bu.id === approver.business_unit
            ),
            department_details: allDepartments.find(
              (dept: Department) => dept.id === approver.department
            ),
            category_details: approver.approver_request_category
              ? transformedCategories.find(
                  (c) => c.id === approver.approver_request_category
                )
              : undefined,
          }))
        : [];

      setApprovers(enrichedApprovers);
      
      // Set statistics
      setStats({
        totalCategories: transformedCategories.length,
        totalApprovers: enrichedApprovers.length,
        uniqueUsers: new Set(enrichedApprovers.map(a => a.user)).size,
        businessUnits: new Set(enrichedApprovers.map(a => a.business_unit)).size,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryAdded = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory]);
    setStats(prev => ({ ...prev, totalCategories: prev.totalCategories + 1 }));
    toast.success(`Category "${newCategory.name}" added successfully`);
  };

  const handleCategoryUpdated = (updatedCategory: Category) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
    
    // Update the category details in approvers
    setApprovers((prev) =>
      prev.map((approver) => {
        if (approver.approver_request_category === updatedCategory.id) {
          return {
            ...approver,
            category_details: {
              name: updatedCategory.name,
            },
          };
        }
        return approver;
      })
    );
    
    toast.success(`Category "${updatedCategory.name}" updated successfully`);
  };

  const handleCategoryDeleted = (categoryId: number) => {
    // Check if there are approvers using this category
    const approversWithCategory = approvers.filter(
      (approver) => approver.approver_request_category === categoryId
    );

    if (approversWithCategory.length > 0) {
      toast.error(
        `Cannot delete category. It is assigned to ${approversWithCategory.length} approver(s).`
      );
      return;
    }
    
    const categoryName = categories.find(c => c.id === categoryId)?.name || '';
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    setStats(prev => ({ ...prev, totalCategories: prev.totalCategories - 1 }));
    toast.success(`Category "${categoryName}" deleted successfully`);
  };
  
  const handleApproverAdded = (newApprover: Approver) => {
    setApprovers((prev) => [...prev, newApprover]);
    setStats(prev => ({ 
      ...prev, 
      totalApprovers: prev.totalApprovers + 1,
      uniqueUsers: new Set([...approvers, newApprover].map(a => a.user)).size
    }));
    toast.success(`Approver added successfully`);
  };
  
  const handleApproverDeleted = (id: number) => {
    setApprovers(prev => prev.filter(a => a.id !== id));
    setStats(prev => ({ ...prev, totalApprovers: prev.totalApprovers - 1 }));
    toast.success('Approver removed successfully');
    // Note: We'd need to recalculate uniqueUsers here in a real implementation
  };

  return (
    <div>
      {/* Statistics Section - Wrapped in Card */}
      <Card className="border shadow-sm mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 pb-2">
          <CardTitle className="text-xl">Dashboard</CardTitle>
          <CardDescription>Overview of category and approver management</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 transition-all hover:shadow-md">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <LayersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Categories</p>
                        <h3 className="text-2xl font-bold">{isLoading ? '...' : stats.totalCategories}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Total number of approval request categories available in the system</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-emerald-500 transition-all hover:shadow-md">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full">
                        <UsersIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Approvers</p>
                        <h3 className="text-2xl font-bold">{isLoading ? '...' : stats.totalApprovers}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Total number of approver assignments across all categories</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-purple-500 transition-all hover:shadow-md">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                        <UserPlus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Users</p>
                        <h3 className="text-2xl font-bold">{isLoading ? '...' : stats.uniqueUsers}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Number of distinct users with approver permissions</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="bg-white dark:bg-gray-800 border-l-4 border-l-amber-500 transition-all hover:shadow-md">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                        <Settings2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Units</p>
                        <h3 className="text-2xl font-bold">{isLoading ? '...' : stats.businessUnits}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Number of business units with assigned approvers</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
      
      {/* Categories Section - Full Width */}
      <Card className="border shadow-sm mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-900/20">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 px-3 py-1 rounded-md">
              <LayersIcon className="w-4 h-4 mr-1" />
              Categories
            </Badge>
            <CardTitle className="text-xl">Manage Categories</CardTitle>
          </div>
          <CardDescription>
            Create, edit and manage approval request categories
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div id="add-category-form">
              <CategoryForm onCategoryAdded={handleCategoryAdded} />
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories List</h3>
                <div className="relative w-64">
                  <Input
                    placeholder="Search categories..."
                    value={categorySearchTerm}
                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                    className="h-8 pr-8"
                  />
                  <Search className="absolute right-2 top-1.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto border rounded-md">
                  <CategoriesList
                    categories={filteredCategories}
                    onCategoryUpdated={handleCategoryUpdated}
                    onCategoryDeleted={handleCategoryDeleted}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Approvers section */}
      <Card className="border shadow-sm mb-8">
        <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-emerald-100/50 dark:from-emerald-900/10 dark:to-emerald-900/20">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 px-3 py-1 rounded-md">
              <UsersIcon className="w-4 h-4 mr-1" />
              Approvers
            </Badge>
            <CardTitle className="text-xl">Manage Approvers</CardTitle>
          </div>
          <CardDescription>
            Assign users to categories with appropriate access levels
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div id="add-approver-form">
                <ApproverForm 
                  users={users}
                  businessUnits={businessUnits}
                  categories={categories}
                  onApproverAdded={handleApproverAdded}
                />
              </div>
            )}
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ListFilter className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Approvers List</h3>
                </div>
                
                <div className="relative w-64">
                  <Input
                    placeholder="Search approvers..."
                    value={approverSearchTerm}
                    onChange={(e) => setApproverSearchTerm(e.target.value)}
                    className="h-8 pr-8"
                  />
                  <Search className="absolute right-2 top-1.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="max-h-[450px] overflow-y-auto border rounded-md">
                  <ApproversList 
                    approvers={filteredApproversForList} 
                    categories={categories}
                    onDeleteApprover={handleApproverDeleted}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {showScrollToTop && (
          <Button
            size="icon"
            className="rounded-full shadow-lg bg-primary text-white w-12 h-12 hover:bg-primary/90"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ChevronUpIcon className="h-6 w-6" />
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon" 
              className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white w-14 h-14"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mb-2">
            <DropdownMenuItem onClick={() => document.getElementById('add-category-form')?.scrollIntoView({ behavior: 'smooth' })}>
              <LayersIcon className="h-4 w-4 mr-2 text-blue-600" />
              <span>Add Category</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => document.getElementById('add-approver-form')?.scrollIntoView({ behavior: 'smooth' })}>
              <UserPlus className="h-4 w-4 mr-2 text-emerald-600" />
              <span>Add Approver</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2 text-gray-600" />
              <span>Refresh Data</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CategoryManagementContent; 