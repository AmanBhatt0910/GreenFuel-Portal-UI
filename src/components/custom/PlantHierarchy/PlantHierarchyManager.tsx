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
import { DesignationDialog } from './DesignationDialog';
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
  
  // Department and Designation selection state
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [isAddDesignationDialogOpen, setIsAddDesignationDialogOpen] = useState(false);
  
  // New designation data
  const [newDesignation, setNewDesignation] = useState<NewDesignation>({
    name: '',
    department: 0
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
        
        // Process each department to load its designations
        const departmentsWithDesignations = await Promise.all(departments.map(async (dept: Department) => {
          try {
            // Fetch designations for this department
            const designationsResponse = await api.get(`/designations/?department=${dept.id}`);
            console.log(`Designations for department ${dept.id} (${dept.name}):`, designationsResponse.data);
            
            // Return department with its designations
            return { 
              ...dept, 
              designations: designationsResponse.data || []
            };
          } catch (err) {
            console.error(`Failed to load designations for department ${dept.id}:`, err);
            // Return department without designations in case of error
            return {
              ...dept,
              designations: []
            };
          }
        }));
        
        // Update the business units with the new departments data including designations
        setBusinessUnits(prevBusinessUnits => 
          prevBusinessUnits.map(bu => 
            bu.id === activeBusinessUnitId
              ? { ...bu, departments: departmentsWithDesignations }
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

  // Handle adding a new designation
  const handleAddDesignation = async (designation: NewDesignation) => {
    try {
      setError(null);
      const newDesignation = await createDesignation(api, designation);
      
      // Update local state with the new designation
      setBusinessUnits(prevBusinessUnits => 
        prevBusinessUnits.map(bu => ({
          ...bu,
          departments: (bu.departments || []).map(dept => 
            dept.id === designation.department
              ? { 
                  ...dept, 
                  designations: [...(dept.designations || []), newDesignation] 
                }
              : dept
          )
        }))
      );
      
      return newDesignation;
    } catch (err) {
      console.error("Failed to add designation", err);
      setError("Failed to add designation. Please try again.");
      throw err;
    }
  };

  return (
    <div
      className="container mx-auto"
      data-component="plant-hierarchy-management"
    >
      {/* Main container */}
      <div className="container py-4 mx-auto max-w-[95%] bg-transparent">
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
              Department Management
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your organization's departments and designations
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
              setIsAddDesignationDialogOpen={setIsAddDesignationDialogOpen}
            />
          </TabsContent>

          <TabsContent value="hierarchy">
            <HierarchyTab
              businessUnits={businessUnits}
              activeBusinessUnitId={activeBusinessUnitId}
              selectedDepartmentId={selectedDepartmentId}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Designation Dialog */}
      <DesignationDialog
        isOpen={isAddDesignationDialogOpen}
        onClose={() => setIsAddDesignationDialogOpen(false)}
        onAddDesignation={handleAddDesignation}
        selectedDepartmentId={selectedDepartmentId}
        businessUnits={businessUnits}
      />
    </div>
  );
}; 