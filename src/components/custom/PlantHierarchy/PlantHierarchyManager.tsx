import React, { useState, useEffect } from 'react';
import useAxios from '@/app/hooks/use-axios';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { BusinessUnit, Department, NewDesignation } from './types';
import { CustomBreadcrumb } from './CustomBreadcrumb';
import { PlantsTab } from './PlantsTab';
import { DepartmentsTab } from './DepartmentsTab';
import { HierarchyTab } from './HierarchyTab';
import { DesignationDialog } from './DesignationDialog';
import { 
  createBusinessUnit,
  createDesignation 
} from './api';
import { toast } from "@/lib/toast-util";


export const PlantHierarchyManager: React.FC = () => {
  // Get API client
  const api = useAxios();
  
  // State
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [activeBusinessUnitId, setActiveBusinessUnitId] = useState<string | number>('');
  const [activeTab, setActiveTab] = useState('plants');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Department and Designation selection state
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [isAddDesignationDialogOpen, setIsAddDesignationDialogOpen] = useState(false);

  // Load data on initial render
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      
      try {

        const businessUnitsResponse = await api.get('/business-units/');
        const businessUnitsData = businessUnitsResponse.data;
        // console.log("Business units data:", businessUnitsData);
        
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

  useEffect(() => {
    if (!activeBusinessUnitId) return;

    const loadDepartments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        
        const response = await api.get(`/departments/?business_unit=${activeBusinessUnitId}`);
        const departments = response.data;
        
        const departmentsWithDesignations = await Promise.all(departments.map(async (dept: Department) => {
          try {
            const designationsResponse = await api.get(`/designations/?department=${dept.id}`);
            
            return { 
              ...dept, 
              designations: designationsResponse.data || []
            };
          } catch (err) {
            console.error(`Failed to load designations for department ${dept.id}:`, err);
            return {
              ...dept,
              designations: []
            };
          }
        }));
        
        setBusinessUnits(prevBusinessUnits => 
          prevBusinessUnits.map(bu => 
            bu.id === activeBusinessUnitId
              ? { ...bu, departments: departmentsWithDesignations }
              : bu
          )
        );
      } catch (err) {
        setError("Failed to load departments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, [activeBusinessUnitId]);

  const handleAddBusinessUnit = async (name: string) => {
    try {
      setError(null);
      const newBusinessUnit = await createBusinessUnit(api, { name });
      if (!newBusinessUnit) {
        toast.error("Failed to create business unit. Please try again.");
        return null;
      }
      toast.success("Business unit created successfully.");

      setBusinessUnits([...businessUnits, { ...newBusinessUnit, departments: [] }]);
      return newBusinessUnit;
    } catch (err) {
      console.error("Failed to add business unit", err);
      setError("Failed to add business unit. Please try again.");
      return null;
    }
  };

  const handleAddDesignation = async (designation: NewDesignation) => {
    try {
      setError(null);
      const newDesignation = await createDesignation(api, designation);
      
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
      <div className="container py-4 mx-auto max-w-[95%] bg-transparent">
        <CustomBreadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Business Units", href: "/dashboard/business-units" },
          ]}
          aria-label="Breadcrumb Navigation"
        />

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

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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