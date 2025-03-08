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
import { CredentialForm } from "@/components/custom/CredentialsManagement/CredentialForm"; 
import { DeleteDialog } from "@/components/custom/CredentialsManagement/DeleteDialog";
import { CredentialDetails } from "@/components/custom/CredentialsManagement/CredentialDetails";
import { CredentialFilter } from "@/components/custom/CredentialsManagement/CredentialFilter";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomBreadcrumb } from '@/components/custom/ui/Breadcrumb.custom';
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle, Info } from "lucide-react";
import useAxios from "@/app/hooks/use-axios";


export default function CredentialsPage() {
  // State
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [departments, setDepartments] = useState<Department[]>([
    { id: "1", name: "Human Resources" },
    { id: "2", name: "Engineering" },
    { id: "3", name: "Sales" },
    { id: "4", name: "Marketing" },
    { id: "5", name: "Finance" },
    { id: "6", name: "Customer Support" },
    { id: "7", name: "IT & Security" },
    { id: "8", name: "Legal" },
    { id: "9", name: "Operations" },
    { id: "10", name: "Product Management" },
  ]);
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
    department: "all",
    business_unit: "all",
    role: "all",
    status: "all",
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

  // Fetch employees
  const fetchCredentials = useCallback(async () => {
    try {
      const response = await api.get('/userInfo/');
      console.log('Fetched:', response.data);
      setCredentials(response.data);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      toast.error('Failed to load employee data');
    }
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const handleAddNew = useCallback(() => {
    setSelectedUser(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = (user: Credential) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [designationsResponse, businessUnitsResponse] = await Promise.all([
        //   fetch('/api/designations/'),
        //   fetch('/api/business-units/')
        // ]);
        
        // if (designationsResponse.ok && businessUnitsResponse.ok) {
        //   const designationsData = await designationsResponse.json();
        //   const businessUnitsData = await businessUnitsResponse.json();
          
        //   setDesignations(designationsData);
        //   setBusinessUnits(businessUnitsData);
        // }
        const res = await api.get('designations/');
        console.log("designations" , res.data)
        setDesignations(res.data);
        const response = await api.get('business-units/')
        console.log("business" , response.data);
        setBusinessUnits(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    setUserIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userIdToDelete) {
      try {
        setIsLoading(true);
        // Uncomment when API endpoint is ready
        // await api.delete(`userInfo/${userIdToDelete}`);
        
        // setCredentials((prev) => 
        //   prev.filter((user) => user.id !== userIdToDelete)
        // );

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

  const handleViewDetails = (user: Credential) => {
    setDetailUser(user);
    setShowDetails(true);
  };
  
  const handleResetPassword = async (userId: number) => {
    try {
      setIsLoading(true);
      // Uncomment when API endpoint is ready
      // await api.post(`userInfo/${userId}/reset-password`);
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
      console.log('Form data submitted:', formData);
      
      if (selectedUser) {
        // Update existing user
        // await api.put(`userInfo/${selectedUser.id}/`, formData);
        
        // setCredentials((prev) =>
        //   prev.map((user) =>
        //     user.id === selectedUser.id
        //       ? {
        //           ...user,
        //           ...formData,
        //         }
        //       : user
        //   )
        // );
        toast.success("Employee updated successfully");
      } else {
        // Create new user
        const response = await api.post('/register/', formData);
        console.log('New user created:', response.data);
        
        // Add the new user to the list
        await fetchCredentials(); // Refresh the entire list to get proper data
        toast.success("Employee added successfully");
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(selectedUser ? 'Failed to update employee' : 'Failed to create employee');
    } finally {
      setIsLoading(false);
    }
  }, [selectedUser, api, fetchCredentials]);

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

      <div className="mb-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/90 p-5 rounded-xl shadow">
        {/* <CredentialFilter 
          onFilterChange={handleFilterChange}
          departments={departments} 
          roles={roles}
          status={filter.status}
          searchValue={filter.searchValue}
          department={filter.department}
          role={filter.role}
        /> */}
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/90 rounded-xl shadow overflow-hidden">
        <CredentialTable
          credentials={credentials}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleViewDetails}
          onResetPassword={handleResetPassword}
          filter={filter}
          designations={designations}
      businessUnits={businessUnits}
          // isLoading={isLoading}
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
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        userId={userIdToDelete}
        // isLoading={isLoading}
      />

      {showDetails && detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-lg">
            <CredentialDetails
              selectedUser={detailUser}
              onClose={() => setShowDetails(false)}
              onEdit={(user) => {
                setShowDetails(false);
                handleEdit(user);
              }}
              onReset={handleResetPassword}
              // isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}