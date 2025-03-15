import React, { useState, useEffect } from 'react';
import useAxios from '@/app/hooks/use-axios';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { BusinessUnit, Department, Designation, NewDesignation } from './types';
import { CustomBreadcrumb } from './CustomBreadcrumb';
import { PlantsTab } from './PlantsTab';
import { DepartmentsTab } from './DepartmentsTab';
import { HierarchyTab } from './HierarchyTab';
import { EmployeeDialog } from './EmployeeDialog';
import { ApproverDialog } from './ApproverDialog';
import { 
  fetchBusinessUnits, 
  fetchDepartments, 
  fetchDesignations,
  createBusinessUnit,
  createDepartment,
  createDesignation 
} from './api';

export const PlantHierarchyManager: React.FC = () => {
  // Get API client
  const api = useAxios();
  
  // State
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [activeBusinessUnitId, setActiveBusinessUnitId] = useState<string | number>('');
  const [activeTab, setActiveTab] = useState('plants');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Expanded departments tracking
  const [expandedDepartments, setExpandedDepartments] = useState<Record<string, boolean>>({});
  
  // Department and Approver selection state
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [isAddApproverDialogOpen, setIsAddApproverDialogOpen] = useState(false);
  
  // New designation data
  const [newDesignation, setNewDesignation] = useState<NewDesignation>({
    name: '',
    department: 0,
    level: 1
  });

  // Load data on initial render
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching business units...");
        // Fetch all business units directly
        const businessUnitsResponse = await api.get('/business-units/');
        const businessUnitsData = businessUnitsResponse.data;
        console.log("Business units data:", businessUnitsData);
        
        // Set business units without fetching departments yet
        setBusinessUnits(businessUnitsData.map((bu: BusinessUnit) => ({
          ...bu,
          departments: []
        })));
      } catch (err) {
        console.error("Failed to load initial data", err);
        setError("Failed to load data from the server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load departments when a business unit is selected
  useEffect(() => {
    if (!activeBusinessUnitId) return;

    const loadDepartments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching departments for business unit ${activeBusinessUnitId}...`);
        // Fetch departments for the active business unit
        const response = await api.get(`/departments/?business_unit=${activeBusinessUnitId}`);
        const departments = response.data;
        console.log("Departments data:", departments);
        
        // Get users data for populating approver names
        let usersData: any[] = [];
        try {
          const usersResponse = await api.get('/userInfo/');
          if (usersResponse.data && Array.isArray(usersResponse.data)) {
            usersData = usersResponse.data;
          }
        } catch (err) {
          console.error("Failed to load users for approver names:", err);
        }
        
        // Process each department to load its approvers
        const departmentsWithApprovers = await Promise.all(departments.map(async (dept: Department) => {
          try {
            // Fetch approvers directly for this department using the dedicated endpoint
            const approversResponse = await api.get(`/approver/?department=${dept.id}`);
            console.log(`Approvers for department ${dept.id} (${dept.name}):`, approversResponse.data);
            
            // Add user name information to approvers if available
            const approversWithNames = Array.isArray(approversResponse.data) 
              ? approversResponse.data.map(approver => {
                  const user = usersData.find(u => u.id === approver.user);
                  return {
                    ...approver,
                    user_name: user ? user.name : `User #${approver.user}`
                  };
                })
              : [];
            
            // Return department with its approvers
            return { 
              ...dept, 
              approvers: approversWithNames 
            };
          } catch (err) {
            console.error(`Failed to load approvers for department ${dept.id}:`, err);
            // Return department without approvers in case of error
            return {
              ...dept,
              approvers: []
            };
          }
        }));
        
        // Update the business units with the new departments data including approvers
        setBusinessUnits(prevBusinessUnits => 
          prevBusinessUnits.map(bu => 
            bu.id === activeBusinessUnitId
              ? { ...bu, departments: departmentsWithApprovers }
              : bu
          )
        );
      } catch (err) {
        console.error("Failed to load departments", err);
        setError("Failed to load departments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, [activeBusinessUnitId]);

  // Save to API whenever data changes
  useEffect(() => {
    if (businessUnits.length > 0) {
      // We could implement auto-save here if needed
      // For now, we'll rely on specific save actions in child components
    }
  }, [businessUnits]);

  // Handle adding a new business unit
  const handleAddBusinessUnit = async (name: string) => {
    try {
      setError(null);
      const newBusinessUnit = await createBusinessUnit(api, { name });
      setBusinessUnits([...businessUnits, { ...newBusinessUnit, departments: [] }]);
      return newBusinessUnit;
    } catch (err) {
      console.error("Failed to add business unit", err);
      setError("Failed to add business unit. Please try again.");
      return null;
    }
  };

  // Handle adding a new department
  const handleAddDepartment = async (name: string, businessUnitId: number) => {
    try {
      setError(null);
      const newDepartment = await createDepartment(api, { 
        name, 
        business_unit: businessUnitId 
      });
      
      // Update local state
      setBusinessUnits(
        businessUnits.map(bu => 
          bu.id === businessUnitId
            ? { 
                ...bu, 
                departments: [...(bu.departments || []), { ...newDepartment, designations: [] }] 
              }
            : bu
        )
      );
      
      // Auto-expand the new department
      if (newDepartment.id) {
        setExpandedDepartments({
          ...expandedDepartments,
          [newDepartment.id]: true
        });
      }
      
      return newDepartment;
    } catch (err) {
      console.error("Failed to add department", err);
      setError("Failed to add department. Please try again.");
      return null;
    }
  };

  // Handle approver creation
  const handleAddApprover = async (approverData: any) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log("Creating new approver with data:", approverData);
      
      // Create approver through API
      const response = await api.post('/approver/', approverData);
      console.log("Approver creation response:", response.data);
      
      if (response.data) {
        // After successfully adding the approver, fetch updated approvers for this department
        try {
          const departmentId = approverData.department;
          console.log(`Refreshing approvers for department ${departmentId}`);
          
          // Get all users for mapping names
          let usersData: any[] = [];
          try {
            const usersResponse = await api.get('/userInfo/');
            if (usersResponse.data && Array.isArray(usersResponse.data)) {
              usersData = usersResponse.data;
            }
          } catch (userErr) {
            console.error("Failed to fetch users:", userErr);
          }
          
          // Fetch approvers for this specific department
          const departmentApproversResponse = await api.get(`/approver/?department=${departmentId}`);
          
          if (departmentApproversResponse.data && Array.isArray(departmentApproversResponse.data)) {
            // Add user names to the approvers
            const approversWithNames = departmentApproversResponse.data.map(approver => {
              const user = usersData.find((u: any) => u.id === approver.user);
              return {
                ...approver,
                user_name: user ? user.name : `User #${approver.user}`
              };
            });
            
            // Update the state with the refreshed approvers for this department
            setBusinessUnits(prevBusinessUnits => 
              prevBusinessUnits.map(bu => {
                if (bu.id === approverData.business_unit) {
                  return {
                    ...bu,
                    departments: bu.departments?.map(dept => {
                      if (dept.id?.toString() === departmentId.toString()) {
                        return {
                          ...dept,
                          approvers: approversWithNames
                        };
                      }
                      return dept;
                    })
                  };
                }
                return bu;
              })
            );
            
            console.log("Department approvers updated:", approversWithNames);
          }
        } catch (refreshErr) {
          console.error("Failed to refresh department approvers:", refreshErr);
          // Even if refresh fails, we still show success since the approver was created
        }
      }
      
      return response.data;
    } catch (err) {
      console.error("Failed to add approver:", err);
      setError("Failed to add approver. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container mx-auto"
      data-component="plant-hierarchy-management"
    >
      {/* Main container */}
      <div className="container py-4 mx-auto max-w-[95%] bg-white">
        {/* Breadcrumb navigation */}
        <CustomBreadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Business Units", href: "/dashboard/business-units" },
          ]}
          aria-label="Breadcrumb Navigation"
        />

        {/* Page header */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6 mt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Approval Hierarchy Management
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your organization's approval hierarchy for budget requests
            </p>
          </div>
        </div>

        {/* Error messages */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading indicator */}
        {loading && (
          <Card className="mb-6">
            <CardContent className="py-6">
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <span className="ml-3">Loading...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs navigation */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as string)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plants">Business Units</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
          </TabsList>

          <TabsContent value="plants">
            <PlantsTab
              businessUnits={businessUnits}
              setBusinessUnits={setBusinessUnits}
              activeBusinessUnitId={activeBusinessUnitId}
              setActiveBusinessUnitId={setActiveBusinessUnitId}
              setActiveTab={setActiveTab}
              setError={setError}
              onAddBusinessUnit={handleAddBusinessUnit}
            />
          </TabsContent>

          <TabsContent value="departments">
            <DepartmentsTab
              businessUnits={businessUnits}
              setBusinessUnits={setBusinessUnits}
              activeBusinessUnitId={activeBusinessUnitId}
              setActiveBusinessUnitId={setActiveBusinessUnitId}
              setActiveTab={setActiveTab}
              selectedDepartmentId={selectedDepartmentId}
              setSelectedDepartmentId={setSelectedDepartmentId}
              setIsAddApproverDialogOpen={setIsAddApproverDialogOpen}
            />
          </TabsContent>

          <TabsContent value="hierarchy">
            <HierarchyTab
              businessUnits={businessUnits}
              setBusinessUnits={setBusinessUnits}
              activeBusinessUnitId={activeBusinessUnitId}
              setActiveBusinessUnitId={setActiveBusinessUnitId}
              setActiveTab={setActiveTab}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Approver Dialog */}
      <ApproverDialog
        isOpen={isAddApproverDialogOpen}
        onClose={() => setIsAddApproverDialogOpen(false)}
        onAddApprover={handleAddApprover}
        businessUnit={businessUnits.find(bu => bu.id === activeBusinessUnitId)}
        selectedDepartmentId={selectedDepartmentId}
      />
    </div>
  );
}; 