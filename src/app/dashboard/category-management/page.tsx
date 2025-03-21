/**
 * Category Management Page
 *
 * This page allows administrators to:
 * 1. Create, edit, and delete approval request categories
 * 2. View and manage approvers assigned to each category
 * 3. Filter and search through categories and approvers
 */

"use client";

import React from "react";
import { CustomBreadcrumb } from "@/components/custom/PlantHierarchy";
import { CategoryManagement } from "@/components/custom/CategoryManagement";

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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Category Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Add, edit and organize your categories
            </p>
          </div>
        </div>

        {/* Category Management Component */}
        <CategoryManagement />
      </div>
    </div>
  );
};

export default CategoryManagementPage;
