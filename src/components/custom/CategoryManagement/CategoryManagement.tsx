import React, { useEffect, useState } from "react";
import useAxios from "@/app/hooks/use-axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Category, Approver, User, BusinessUnit, Department } from "./types";
import AddCategoryForm from "./AddCategoryForm";
import CategoriesList from "./CategoriesList";
import ApproversList from "./ApproversList";

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const api = useAxios();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch categories from API
      const categoriesRes = await api.get("/approval-request-category/");
      const categoriesRes2 = await api.get("/approval-request-category/2");
      console.log("Category API response:", categoriesRes2.data);
      
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

      // Fetch business units
      const businessUnitsResponse = await api.get("/business-units/");
      const businessUnits: BusinessUnit[] = businessUnitsResponse.data;

      // Fetch all departments for all business units
      const allDepartmentsPromises = businessUnits.map(
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
            business_unit_details: businessUnits.find(
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
    
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  };

  return (
    <div className="space-y-6">
      <AddCategoryForm onCategoryAdded={handleCategoryAdded} />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <CategoriesList
            categories={categories}
            onCategoryUpdated={handleCategoryUpdated}
            onCategoryDeleted={handleCategoryDeleted}
          />
        )}
      </div>
      
      {/* Approvers Section */}
      <Card className="shadow-sm mt-8">
        <CardHeader>
          <CardTitle>Approvers by Category</CardTitle>
          <CardDescription>
            Users with form access permissions by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ApproversList approvers={approvers} categories={categories} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManagement; 