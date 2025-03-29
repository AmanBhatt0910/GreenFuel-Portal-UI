"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/lib/toast-util";
import { 
  BusinessUnit,
  Credential, 
  CredentialFormData,
  Department,
  Designation,
  Role
} from "@/components/custom/CredentialsManagement/types";
import { CredentialTable } from "@/components/custom/CredentialsManagement/CredentialTable";
import CredentialForm from "@/components/custom/CredentialsManagement/CredentialForm"; 
import { DeleteDialog } from "@/components/custom/CredentialsManagement/DeleteDialog";
import { CredentialDetails } from "@/components/custom/CredentialsManagement/CredentialDetails";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomBreadcrumb } from '@/components/custom/ui/Breadcrumb.custom';
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle, Info } from "lucide-react";
import useAxios from "@/app/hooks/use-axios";
import { BusinessUnitFilter } from "@/components/custom/CredentialsManagement/CredentialFilter";

export default function CredentialsPage() {
  // State
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
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

  // Handle filter changes
  const handleFilterChange = useCallback((name: string, value: string) => {
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Fetch employees with filters applied
  const fetchCredentials = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build query parameters based on filters
      const params = new URLSearchParams();
      if (filter.searchValue) {
        params.append('search', filter.searchValue);
      }
      if (filter.business_unit) {
        params.append('business_unit', filter.business_unit);
      }
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await api.get(`/userInfo/${queryString}`);
      setCredentials(response.data);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      toast.error('Failed to load employee data');
    } finally {
      setIsLoading(false);
    }
  }, [filter.searchValue, filter.business_unit]);

  // Re-fetch only when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCredentials();
    }, 300); // Add a small delay to prevent rapid re-fetches

    return () => clearTimeout(debounceTimer);
  }, [filter.searchValue, filter.business_unit]);

  // Fetch a single credential by ID
  const fetchCredentialById = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/userInfo/${id}/`);
      const userData = response.data;
      
      return userData;
    } catch (error) {
      console.error(`Error fetching credential with ID ${id}:`, error);
      toast.error('Failed to load employee details');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddNew = useCallback(() => {
    setSelectedUser(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = async (user: Credential) => {
    // Fetch the latest user data by ID to ensure we have the most up-to-date information
    const freshUserData = await fetchCredentialById(user.id);
    if (freshUserData) {
      setSelectedUser(freshUserData);
      setIsFormOpen(true);
    }
  };

  // Add API calls to fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setIsLoading(true);
        const [businessUnitsRes, departmentsRes, designationsRes] = await Promise.all([
          api.get('/business-units/'),
          api.get('/departments/'),
          api.get('/designations/')
        ]);
        
        setBusinessUnits(businessUnitsRes.data);
        setDepartments(departmentsRes.data);
        setDesignations(designationsRes.data);
      } catch (error) {
        console.error('Error fetching master data:', error);
        toast.error('Failed to load configuration data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMasterData();
  }, []);

  const handleDelete = (id: number) => {
    setUserIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userIdToDelete) {
      try {
        setIsLoading(true);
        await api.put(`/userInfo/${userIdToDelete}/` , {is_deleted:true});
        
        setCredentials(prev => 
          prev.filter((user) => user.id !== userIdToDelete)
        );

        toast.success("Employee deleted successfully");
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      } finally {
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        setUserIdToDelete(null);
      }
    }
  };

  const handleViewDetails = async (user: Credential) => {
    // Fetch the latest user data by ID with enriched name data
    const freshUserData = await fetchCredentialById(user.id);
    if (freshUserData) {
      setDetailUser(freshUserData);
      setShowDetails(true);
    }
  };
  
  const handleResetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await api.post(`forgot-password/`, { email: email });
      toast.success("Password reset link sent to user's email");
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to send password reset link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = useCallback(async (formData: CredentialFormData) => {
    try {
      setIsLoading(true);
      
      if (selectedUser?.id) {
        // Update existing user
        const response = await api.put(`/userInfo/${selectedUser.id}/`, formData);
        const updatedUser = response.data as Credential;
        // Update the local state instead of re-fetching
        setCredentials(prev => 
          prev.map(user => 
            user.id === selectedUser.id ? updatedUser : user
          )
        );
        toast.success("Employee updated successfully");
      } else {
        // Create new user
        const response = await api.post('/register/', formData);
        const newUser = response.data as Credential;
        // Add the new user to the list without re-fetching
        setCredentials(prev => [...prev, newUser]);
        toast.success("Employee added successfully");
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(selectedUser ? 'Failed to update employee' : 'Failed to create employee');
    } finally {
      setIsLoading(false);
    }
  }, [selectedUser]);

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
          <h1 className="text-3xl font-bold tracking-tight">Credentials Management</h1>
          <p className="text-green-700 dark:text-green-400 text-sm font-medium mt-1">
            Manage your API keys and credentials securely
          </p>
        </div>
        <Button 
          onClick={handleAddNew} 
          className="md:w-auto w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      <Alert className="mb-6 bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Security Notice</AlertTitle>
        <AlertDescription>
          All changes to employee records are logged for security purposes. We recommend enabling two-factor authentication for administrative accounts.
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