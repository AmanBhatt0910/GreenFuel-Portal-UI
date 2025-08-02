"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// Custom hooks
import useApprovals from "./hooks/useApprovals";


// Components
import ApprovalHeader from "./components/ApprovalHeader";
import ApprovalFilters from "./components/ApprovalFilters";
import ApprovalTable from "./components/ApprovalTable";
import ApprovalList from "./components/ApprovalList";
import NoResults from "./components/NoResults";
import LoadingState from "./components/LoadingState";
import BasicPagination from "@/components/ui/paginations";

/**
 * ApprovalDashboard Component
 * 
 * This component serves as the main dashboard for approval requests.
 * It displays a list of approval requests in either a table (desktop) or list (mobile) format.
 * 
 * Key features:
 * - Fetches and displays all approval requests
 * - Provides filtering and search capabilities
 * - Displays different stats in the header (total, pending, approved, rejected)
 * - Responsive design with table view for desktop and list view for mobile
 * - Navigation to individual approval details
 */
const ApprovalDashboard: React.FC = () => {
  const router = useRouter();
  
  // Get approval data and related functionality from the custom hook
  // This hook handles data fetching, filtering, search functionality, and pagination
  const { 
    forms,           // All approval forms/requests
    loading,         // Loading state indicator
    error,           // Error state if any
    filter,          // Current active filter (status filter)
    setFilter,       // Function to update the filter
    searchTerm,      // Current search term
    setSearchTerm,   // Function to update search term
    filteredForms,   // Forms after applying filters and search
    // Pagination properties
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    // Pagination functions
    nextPage,
    previousPage,
    goToPage
  } = useApprovals();

  /**
   * Navigate to the details page for a specific approval
   * @param id - The ID of the approval request to view
   */
  const navigateToDetails = (id: string) => {
    router.push(`/dashboard/approvals/${id}`);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="p-4 md:p-6">
          {/* Header section - displays approval count stats */}
          <ApprovalHeader forms={forms} />

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Filters section - contains search and status filters */}
            <ApprovalFilters 
              filter={filter}
              setFilter={setFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            {/* Content section */}
            <div className="px-4 pb-4">
              {/* Conditional rendering based on loading and data state */}
              {loading ? (
                // Display loading state when data is being fetched
                <LoadingState />
              ) : filteredForms.length === 0 ? (
                // Display no results message when filters return empty
                <NoResults searchTerm={searchTerm} />
              ) : (
                <div>
                  {/* Desktop view - Table format with columns */}
                  <ApprovalTable 
                    forms={filteredForms} 
                    onViewDetails={navigateToDetails} 
                  />
                  
                  {/* Mobile view - Stacked list format */}
                  <ApprovalList 
                    forms={filteredForms} 
                    onViewDetails={navigateToDetails} 
                  />
                  
                  {/* Pagination Section */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
                        Showing page {currentPage} of {totalPages} ({totalCount} total approvals)
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Pagination controls */}
                        <BasicPagination
                          totalPages={totalPages}
                          initialPage={currentPage}
                          onPageChange={goToPage}
                          className="ml-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalDashboard;
