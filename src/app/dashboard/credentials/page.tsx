"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/lib/toast-util";
import { 
  Credential, 
  CredentialFormData,
  Department,
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

// Sample data for demonstration
const sampleCredentials: Credential[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@greenfuel.com",
    employeeCode: "EMP-12345",
    department: "Engineering",
    designation: "Senior Developer",
    role: "Developer",
    status: "active",
    joiningDate: "2022-01-15",
    contactNumber: "+91 9876543210",
    dob: "1990-05-20",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@greenfuel.com",
    employeeCode: "EMP-23456",
    department: "Design",
    designation: "UI/UX Designer",
    role: "Designer",
    status: "active",
    joiningDate: "2022-03-10",
    contactNumber: "+91 9876543211",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@greenfuel.com",
    employeeCode: "EMP-34567",
    department: "Product",
    designation: "Product Manager",
    role: "Manager",
    status: "active",
    joiningDate: "2021-11-20",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@greenfuel.com",
    employeeCode: "EMP-45678",
    department: "Marketing",
    designation: "Marketing Specialist",
    role: "Specialist",
    status: "inactive",
    joiningDate: "2022-05-05",
  },
  {
    id: "5",
    name: "Robert Brown",
    email: "robert.brown@greenfuel.com",
    employeeCode: "EMP-56789",
    department: "HR",
    designation: "HR Manager",
    role: "Manager",
    status: "pending",
    joiningDate: "2022-06-15",
  },
];

// Sample departments for demonstration
const sampleDepartments: Department[] = [
  {
    id: "1",
    name: "Engineering",
    description: "Software development and technical operations"
  },
  {
    id: "2",
    name: "Design",
    description: "UI/UX and graphic design"
  },
  {
    id: "3",
    name: "Product",
    description: "Product management and strategy"
  },
  {
    id: "4",
    name: "Marketing",
    description: "Marketing and communications"
  },
  {
    id: "5",
    name: "HR",
    description: "Human resources and people operations"
  },
  {
    id: "6",
    name: "Finance",
    description: "Financial operations and accounting"
  },
];

// Sample roles for demonstration
const sampleRoles: Role[] = [
  {
    id: "1",
    name: "Developer",
    description: "Software developer",
    permissions: ["read", "write"]
  },
  {
    id: "2",
    name: "Designer",
    description: "UI/UX designer",
    permissions: ["read", "write"]
  },
  {
    id: "3",
    name: "Manager",
    description: "Team manager",
    permissions: ["read", "write", "manage"]
  },
  {
    id: "4",
    name: "Admin",
    description: "System administrator",
    permissions: ["read", "write", "manage", "admin"]
  },
  {
    id: "5",
    name: "Specialist",
    description: "Domain specialist",
    permissions: ["read"]
  },
];

export default function CredentialsPage() {
  // State
  const [credentials, setCredentials] = useState<Credential[]>(sampleCredentials);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Credential | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailUser, setDetailUser] = useState<Credential | null>(null);
  const [filter, setFilter] = useState({
    searchValue: "",
    department: "all",
    role: "all",
    status: "all"
  });

  // Handle filter changes
  const handleFilterChange = useCallback((name: string, value: string) => {
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // API integration will go here
  // useEffect(() => {
  //   // Fetch credentials from API
  //   async function fetchCredentials() {
  //     try {
  //       const response = await fetch('/api/credentials');
  //       const data = await response.json();
  //       setCredentials(data);
  //     } catch (error) {
  //       console.error('Error fetching credentials:', error);
  //       toast.error('Failed to load employee data');
  //     }
  //   }
  //   
  //   fetchCredentials();
  // }, []);

  const handleAddNew = useCallback(() => {
    setSelectedUser(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = (user: Credential) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setUserIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userIdToDelete) {
      // API call will go here
      // In the future, this will make an API call to delete the user
      // Example: await fetch(`/api/credentials/${userIdToDelete}`, { method: 'DELETE' });
      
      setCredentials((prev) => 
        prev.filter((user) => user.id !== userIdToDelete)
      );
      toast.success("Employee deleted successfully");
      setIsDeleteDialogOpen(false);
      setUserIdToDelete(null);
    }
  };

  const handleViewDetails = (user: Credential) => {
    setDetailUser(user);
    setShowDetails(true);
  };

  const handleResetPassword = (userId: string) => {
    // API call to trigger password reset email would go here
    // Example: await fetch(`/api/credentials/${userId}/reset-password`, { method: 'POST' });
    toast.success("Password reset link sent to user's email");
  };

  const handleFormSubmit = useCallback((formData: CredentialFormData) => {
    if (selectedUser) {
      // Update existing user
      // API call will go here
      // Example: await fetch(`/api/credentials/${selectedUser.id}`, { 
      //   method: 'PUT', 
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      setCredentials((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...formData,
              }
            : user
        )
      );
      toast.success("Employee updated successfully");
    } else {
      // Create new user
      // API call will go here
      // Example: await fetch('/api/credentials', { 
      //   method: 'POST', 
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // For now, create a temporary ID
      const newUser: Credential = {
        id: (credentials.length + 1).toString(),
        ...formData,
      };
      setCredentials((prev) => [...prev, newUser]);
      toast.success("Employee added successfully");
    }
    
    setIsFormOpen(false);
  }, [selectedUser, credentials.length]);

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
        <Button onClick={handleAddNew} className="md:w-auto w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
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
        <CredentialFilter 
          onFilterChange={handleFilterChange}
          departments={sampleDepartments} 
          roles={sampleRoles}
          status={filter.status}
          searchValue={filter.searchValue}
          department={filter.department}
          role={filter.role}
        />
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/90 rounded-xl shadow overflow-hidden">
        <CredentialTable
          credentials={credentials}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleViewDetails}
          onResetPassword={handleResetPassword}
          filter={filter}
        />
      </div>

      <CredentialForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        selectedUser={selectedUser}
        departments={sampleDepartments}
        roles={sampleRoles}
        onSubmit={handleFormSubmit}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        userId={userIdToDelete}
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
            />
          </div>
        </div>
      )}
    </div>
  );
}