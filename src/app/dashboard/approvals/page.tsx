"use client";

import React from "react";
import { useRouter } from "next/navigation";

import useApprovals from "./hooks/useApprovals";

import ApprovalHeader from "./components/ApprovalHeader";
import ApprovalFilters from "./components/ApprovalFilters";
import ApprovalTable from "./components/ApprovalTable";
import ApprovalList from "./components/ApprovalList";
import NoResults from "./components/NoResults";
import LoadingState from "./components/LoadingState";

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
    forms, // All approval forms/requests
    loading, // Loading state indicator
    filter, // Current active filter (status filter)
    setFilter, // Function to update the filter
    searchTerm, // Current search term
    setSearchTerm, // Function to update search term
    filteredForms, // Forms after applying filters and search
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

                  <ApprovalList
                    forms={filteredForms}
                    onViewDetails={navigateToDetails}
                  />
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
