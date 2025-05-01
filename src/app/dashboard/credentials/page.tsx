"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/lib/toast-util";
import {
  BusinessUnit,
  Credential,
  CredentialFormData,
  Department,
  Designation,
  Role,
} from "@/components/custom/CredentialsManagement/types";
import { CredentialTable } from "@/components/custom/CredentialsManagement/CredentialTable";
import CredentialForm from "@/components/custom/CredentialsManagement/CredentialForm";
import { DeleteDialog } from "@/components/custom/CredentialsManagement/DeleteDialog";
import { CredentialDetails } from "@/components/custom/CredentialsManagement/CredentialDetails";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomBreadcrumb } from "@/components/custom/ui/Breadcrumb.custom";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle, Info } from "lucide-react";
import useAxios from "@/app/hooks/use-axios";

export default function CredentialsPage() {
  // State
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Credential | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailUser, setDetailUser] = useState<Credential | null>(null);
  const [filter, setFilter] = useState({
    searchValue: "",
    business_unit: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const api = useAxios();

  // Fetch employees with filters applied
  const fetchCredentials = useCallback(async () => {
    // Only show loading state if we don't have any data yet
    if (credentials.length === 0) {
      setIsLoading(true);
    }

    try {
      // Build query parameters based on filters
      const params = new URLSearchParams();
      if (filter.searchValue) {
        params.append("search", filter.searchValue);
      }
      if (filter.business_unit) {
        params.append("business_unit", filter.business_unit);
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await api.get(`/userInfo/${queryString}`);
      setCredentials(response.data);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      // Only show error toast if we don't have any data to display
      if (credentials.length === 0) {
        toast.error("Failed to load employee data");
      }
    } finally {
      setIsLoading(false);
    }
  }, [filter.searchValue, filter.business_unit, credentials.length, api]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCredentials();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filter.searchValue, filter.business_unit]);

  const fetchCredentialById = useCallback(
    async (id: number) => {
      // We don't need to set global loading state for individual user fetches
      try {
        const response = await api.get(`/userInfo/${id}/`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching credential with ID ${id}:`, error);
        // Only show error toast for critical operations
        return null;
      }
    },
    [api]
  );

  const handleAddNew = useCallback(() => {
    setSelectedUser(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = async (user: Credential) => {
    // Open the form immediately with the data we have
    setSelectedUser(user);
    setIsFormOpen(true);

    // Then fetch the latest data in the background
    try {
      const freshUserData = await api.get(`/userInfo/${user.id}/`);
      // Only update if we got valid data and the form is still open for the same user
      if (freshUserData.data && isFormOpen && selectedUser?.id === user.id) {
        setSelectedUser(freshUserData.data);
      }
    } catch (error) {
      console.error(`Error fetching updated credential data:`, error);
      // No need to show an error toast as we're already displaying the form
    }
  };

  useEffect(() => {
    const fetchMasterData = async () => {
      // Only show loading if we don't have any master data yet
      const needsLoading =
        businessUnits.length === 0 ||
        departments.length === 0 ||
        designations.length === 0;

      if (needsLoading) {
        setIsLoading(true);
      }

      try {
        const [businessUnitsRes, departmentsRes, designationsRes] =
          await Promise.all([
            api.get("/business-units/"),
            api.get("/departments/"),
            api.get("/designations/"),
          ]);

        setBusinessUnits(businessUnitsRes.data);
        setDepartments(departmentsRes.data);
        setDesignations(designationsRes.data);
      } catch (error) {
        console.error("Error fetching master data:", error);
        // Only show error if we don't have any data
        if (needsLoading) {
          toast.error("Failed to load configuration data");
        }
      } finally {
        if (needsLoading) {
          setIsLoading(false);
        }
      }
    };

    fetchMasterData();
  }, [api, businessUnits.length, departments.length, designations.length]);

  const handleDelete = (id: number) => {
    setUserIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userIdToDelete) {
      try {
        // Optimistically update UI first for better user experience
        setCredentials((prev) =>
          prev.filter((user) => user.id !== userIdToDelete)
        );

        // Close the dialog immediately
        setIsDeleteDialogOpen(false);

        // Show a loading toast that we'll update with the result
        const toastId = toast.loading("Deleting employee...");

        // Make the API call in the background
        await api.put(`/userInfo/${userIdToDelete}/`, { is_deleted: true });

        // Update the toast on success
        toast.success("Employee deleted successfully", { id: toastId });
      } catch (error) {
        console.error("Error deleting employee:", error);

        // If there was an error, fetch the data again to restore the deleted item
        toast.error("Failed to delete employee");
        fetchCredentials();
      } finally {
        setUserIdToDelete(null);
      }
    }
  };

  const handleViewDetails = async (user: Credential) => {
    // Show the details immediately with the data we already have
    setDetailUser(user);
    setShowDetails(true);

    // Then fetch the latest data in the background and update if needed
    try {
      const freshUserData = await api.get(`/userInfo/${user.id}/`);
      // Only update if we got valid data and the modal is still open for the same user
      if (freshUserData.data && showDetails && detailUser?.id === user.id) {
        setDetailUser(freshUserData.data);
      }
    } catch (error) {
      console.error(`Error fetching updated credential data:`, error);
      // No need to show an error toast as we're already displaying data
    }
  };

  const handleResetPassword = async (email: string) => {
    // Show a loading toast that we'll update with the result
    const toastId = toast.loading("Sending password reset link...");

    try {
      await api.post(`forgot-password/`, { email: email });
      toast.success("Password reset link sent to user's email", {
        id: toastId,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to send password reset link", { id: toastId });
    }
  };

  const handleFormSubmit = useCallback(
    async (formData: CredentialFormData) => {
      try {
        setIsLoading(true);

        if (selectedUser?.id) {
          // Update existing user
          const response = await api.put(
            `/userInfo/${selectedUser.id}/`,
            formData
          );
          const updatedUser = response.data as Credential;
          // Update the local state instead of re-fetching
          setCredentials((prev) =>
            prev.map((user) =>
              user.id === selectedUser.id ? updatedUser : user
            )
          );
          toast.success("Employee updated successfully");
        } else {
          // Create new user
          const response = await api.post("/register/", formData);
          const newUser = response.data as Credential;

          // Add the new user to the list without re-fetching or reloading
          // Fetch the complete user data to ensure we have all fields
          try {
            const completeUserData = await api.get(`/userInfo/${newUser.id}/`);
            setCredentials((prev) => [...prev, completeUserData.data]);
          } catch (err) {
            // If fetching complete data fails, still add the partial data we have
            setCredentials((prev) => [...prev, newUser]);
          }

          toast.success("Employee added successfully");
        }

        setIsFormOpen(false);
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(
          selectedUser
            ? "Failed to update employee"
            : "Failed to create employee"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [selectedUser, api]
  );

  return (
    <div className="container py-4 mx-auto max-w-[95%] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <CustomBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Credentials", href: "/dashboard/credentials" },
        ]}
      />

      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6 mt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Credentials Management
          </h1>
          <p className="text-green-700 dark:text-green-400 text-sm font-medium mt-1">
            Manage credentials securely
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button
            onClick={handleAddNew}
            className="md:w-auto w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
          <Button
            onClick={handleAddNew}
            className="md:w-auto w-full bg-gradient-to-r from-green-800 to-green-500 hover:from-green-700 hover:to-green-800 text-white transition-colors duration-300 ease-in-out"
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" /> Add MD
          </Button>
        </div>
      </div>

      <Alert className="mb-6 bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Security Notice</AlertTitle>
        <AlertDescription>
          All changes to employee records are logged for security purposes. We
          recommend enabling two-factor authentication for administrative
          accounts.
        </AlertDescription>
      </Alert>

      {/* <div className="mb-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/90 p-5 rounded-xl shadow">
        <BusinessUnitFilter 
          onFilterChange={handleFilterChange}
          businessUnits={businessUnits}
          searchValue={filter.searchValue}
          business_unit={filter.business_unit}
        />
      </div> */}

      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/90 rounded-xl shadow overflow-hidden">
        <CredentialTable
          credentials={credentials}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleViewDetails}
          onResetPassword={handleResetPassword}
          isLoading={isLoading}
          designations={designations}
          departments={departments}
          businessUnits={businessUnits}
        />
      </div>

      <CredentialForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        selectedUser={selectedUser}
        departments={departments}
        businessUnits={businessUnits}
        designations={designations}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        userId={userIdToDelete}
        isLoading={isLoading}
      />

      {showDetails && detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-lg">
            <CredentialDetails
              designations={designations}
              departments={departments}
              businessUnits={businessUnits}
              selectedUser={detailUser}
              onClose={() => setShowDetails(false)}
              onEdit={(user) => {
                setShowDetails(false);
                handleEdit(user);
              }}
              onReset={handleResetPassword}
            />
          </div>
        </div>
      )}
    </div>
  );
}
