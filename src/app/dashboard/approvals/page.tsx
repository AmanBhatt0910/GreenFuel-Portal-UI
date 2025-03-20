"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Custom hooks
import useApprovals from "./hooks/useApprovals";

// Components
import ApprovalHeader from "./components/ApprovalHeader";
import ApprovalFilters from "./components/ApprovalFilters";
import ApprovalTable from "./components/ApprovalTable";
import ApprovalList from "./components/ApprovalList";
import ApprovalTracker from "./components/ApprovalTracker";
import NoResults from "./components/NoResults";
import LoadingState from "./components/LoadingState";
import useAxios from "@/app/hooks/use-axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, BarChart } from "lucide-react";

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
 * - Tracker view to visualize approval stages and current level
 */
const ApprovalDashboard: React.FC = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState("list");
  
  // Get approval data and related functionality from the custom hook
  // This hook handles data fetching, filtering, and search functionality
  const { 
    forms,           // All approval forms/requests
    loading,         // Loading state indicator
    error,           // Error state if any
    filter,          // Current active filter (status filter)
    setFilter,       // Function to update the filter
    searchTerm,      // Current search term
    setSearchTerm,   // Function to update search term
    filteredForms    // Forms after applying filters and search
  } = useApprovals();

  /**
   * Navigate to the details page for a specific approval
   * @param id - The ID of the approval request to view
   */
  const navigateToDetails = (id: string) => {
    router.push(`/dashboard/approvals/${id}`);
  };
  const api = useAxios();

  useEffect(() => {
    const fetchApprovalLogs = async () => {
      const response = await api.get('approval-logs/');
      console.log(response);
    };
    fetchApprovalLogs();
  }, []);

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

            {/* View selector tabs */}
            <div className="px-4 pb-4">
              <Tabs defaultValue={activeView} onValueChange={setActiveView} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="list" className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    <span>Table View</span>
                  </TabsTrigger>
                  {/* <TabsTrigger value="cards" className="flex items-center">
                    <ListFilter className="h-4 w-4 mr-2" />
                    <span>Card View</span>
                  </TabsTrigger> */}
                  <TabsTrigger value="tracker" className="flex items-center">
                    <BarChart className="h-4 w-4 mr-2" />
                    <span>Tracker</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="mt-6 w-full">
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
                    </div>
                  )}
                </TabsContent>

                {/* <TabsContent value="cards" className="mt-6 w-full"> */}
                  {/* Card view - Stacked list format (always visible, including desktop) */}
                  {/* {loading ? (
                    <LoadingState />
                  ) : filteredForms.length === 0 ? (
                    <NoResults searchTerm={searchTerm} />
                  ) : (
                    <div className="md:block">
                      <ApprovalList 
                        forms={filteredForms} 
                        onViewDetails={navigateToDetails} 
                      />
                    </div>
                  )}
                </TabsContent> */}

                <TabsContent value="tracker" className="mt-6 w-full">
                  {/* Tracker view - Visual representation of approval progress */}
                  {loading ? (
                    <LoadingState />
                  ) : filteredForms.length === 0 ? (
                    <NoResults searchTerm={searchTerm} />
                  ) : (
                    <div className="p-4">
                      <ApprovalTracker forms={filteredForms} />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalDashboard;
