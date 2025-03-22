/**
 * Category Management Page
 * 
 * This page allows administrators to:
 * 1. Create, edit, and delete approval request categories
 * 2. Add and manage departments for business units 
 * 3. Add and manage approvers with their access level, department, and business unit
 * 4. Assign approvers to specific categories
 * 5. Filter and search through categories and approvers
 * 
 * Layout:
 * - Statistics dashboard at the top for key metrics
 * - Two column layout in first row for Categories and Departments
 * - Full width section for Approvers management in second row
 * - Floating action menu for quick access to key actions
 */

"use client";

import React from "react";
import { CustomBreadcrumb } from "@/components/custom/PlantHierarchy";
import { CategoryManagementContent } from "@/components/custom/CategoryManagement";
import { Layers } from "lucide-react";

const CategoryManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <CustomBreadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            {
              label: "Category Management",
              href: "/dashboard/category-management",
            },
          ]}
          aria-label="Breadcrumb Navigation"
        />
      </div>

      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full flex-shrink-0">
              <Layers className="h-6 w-6 text-blue-700 dark:text-blue-300" />
            </div>
              <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Category Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage approval request categories and approvers in one place. Create, edit, and assign 
                approvers with appropriate access levels for each category.
              </p>
            </div>
                            </div>
                          </div>

        {/* Main Content */}
        <CategoryManagementContent />
      </div>
    </div>
  );
};

export default CategoryManagementPage;
