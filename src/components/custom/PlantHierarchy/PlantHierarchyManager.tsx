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
    department: 0,
    level: 1
  });

  // Load data on initial render
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all business units
        const businessUnitsData = await fetchBusinessUnits(api);
        
        // For each business unit, fetch its departments
        const businessUnitsWithDepartments = await Promise.all(
          businessUnitsData.map(async (bu) => {
            // Only fetch departments if business unit has an ID
            if (bu.id) {
              const departments = await fetchDepartments(api, Number(bu.id));
              
              // For each department, fetch designations
              const departmentsWithDesignations = await Promise.all(
                departments.map(async (dept) => {
                  if (dept.id) {
                    const designations = await fetchDesignations(api, Number(dept.id));
                    return { ...dept, designations };
                  }
                  return dept;
                })
              );
              
              return { ...bu, departments: departmentsWithDesignations };
            }
            return bu;
          })
        );
        
        setBusinessUnits(businessUnitsWithDepartments);
      } catch (err) {
        console.error("Failed to load initial data", err);
        setError("Failed to load data from the server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

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
  const handleAddDesignation = async (name: string, departmentId: number, level: number) => {
    try {
      setError(null);
      const newDesignationObj = await createDesignation(api, {
        name,
        department: departmentId,
        level
      });
      
      // Update local state
      setBusinessUnits(
        businessUnits.map(bu => ({
          ...bu,
          departments: bu.departments?.map(dept =>
            dept.id === departmentId
              ? { 
                  ...dept, 
                  designations: [...(dept.designations || []), newDesignationObj] 
                }
              : dept
          )
        }))
      );
      
      return newDesignationObj;
    } catch (err) {
      console.error("Failed to add designation", err);
      setError("Failed to add designation. Please try again.");
      return null;
    }
  };

  return (
    <div
      className="container mx-auto"
      data-component="plant-hierarchy-management"
    >
      {/* Main container */}
      <div className="container py-4 mx-auto max-w-[95%] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
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
              Business Units Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage your organization's business units, departments, and designations hierarchy
            </p>
          </div>
        </div>

        {/* Error messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
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
        <Tabs defaultValue="plants" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="plants">Business Units</TabsTrigger>
            <TabsTrigger 
              value="departments" 
              disabled={!activeBusinessUnitId}
            >
              Departments
            </TabsTrigger>
            <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
          </TabsList>

          {/* Business Units Tab */}
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

          {/* Departments Tab */}
          <TabsContent value="departments">
            <DepartmentsTab
              businessUnits={businessUnits}
              setBusinessUnits={setBusinessUnits}
              activeBusinessUnitId={activeBusinessUnitId}
              setActiveBusinessUnitId={setActiveBusinessUnitId}
              setActiveTab={setActiveTab}
              expandedDepartments={expandedDepartments}
              setExpandedDepartments={setExpandedDepartments}
              selectedDepartmentId={selectedDepartmentId}
              setSelectedDepartmentId={setSelectedDepartmentId}
              setIsAddDesignationDialogOpen={setIsAddDesignationDialogOpen}
              setError={setError}
              onAddDepartment={handleAddDepartment}
            />
          </TabsContent>

          {/* Hierarchy Tab */}
          <TabsContent value="hierarchy">
            <HierarchyTab businessUnits={businessUnits} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Employee/Designation Dialog */}
      <EmployeeDialog
        isOpen={isAddDesignationDialogOpen}
        setIsOpen={setIsAddDesignationDialogOpen}
        newEmployee={newDesignation}
        setNewEmployee={setNewDesignation}
        businessUnits={businessUnits}
        setBusinessUnits={setBusinessUnits}
        activeBusinessUnitId={activeBusinessUnitId}
        selectedDepartmentId={selectedDepartmentId}
        error={error}
        setError={setError}
        onAddDesignation={handleAddDesignation}
      />
    </div>
  );
}; 