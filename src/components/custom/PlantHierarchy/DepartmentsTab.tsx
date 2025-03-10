'use client'
import React, { useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BusinessUnit, BusinessUnitActionsProps } from './types';
import { DepartmentItem } from './DepartmentItem';

interface DepartmentsTabProps extends BusinessUnitActionsProps {
  expandedDepartments: Record<string, boolean>;
  setExpandedDepartments: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedDepartmentId: string;
  setSelectedDepartmentId: React.Dispatch<React.SetStateAction<string>>;
  setIsAddDesignationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onAddDepartment?: (name: string, businessUnitId: number) => Promise<any>;
}

export const DepartmentsTab: React.FC<DepartmentsTabProps> = ({
  businessUnits,
  setBusinessUnits,
  activeBusinessUnitId,
  setActiveBusinessUnitId,
  setActiveTab,
  expandedDepartments,
  setExpandedDepartments,
  selectedDepartmentId,
  setSelectedDepartmentId,
  setIsAddDesignationDialogOpen,
  setError,
  onAddDepartment,
}) => {
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get active business unit
  const activeBusinessUnit = businessUnits.find(
    (bu) => bu.id === activeBusinessUnitId
  );

  // Handle adding a new department
  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim()) {
      setError('Department name is required');
      return;
    }

    if (!activeBusinessUnitId) {
      setError('Please select a business unit first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (onAddDepartment) {
        await onAddDepartment(newDepartmentName, Number(activeBusinessUnitId));
      } else {
        // Local state management (fallback if no API function provided)
        const newDepartment = {
          id: String(Date.now()),
          name: newDepartmentName,
          business_unit: Number(activeBusinessUnitId),
          designations: [],
        };

        setBusinessUnits(
          businessUnits.map((bu) =>
            bu.id === activeBusinessUnitId
              ? {
                  ...bu,
                  departments: [...(bu.departments || []), newDepartment],
                }
              : bu
          )
        );

        // Auto-expand the new department
        setExpandedDepartments({
          ...expandedDepartments,
          [newDepartment.id]: true,
        });
      }

      // Reset form
      setNewDepartmentName('');
    } catch (error) {
      console.error('Error adding department:', error);
      setError('Failed to add department. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If no business unit is selected
  if (!activeBusinessUnitId) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <FolderOpen className="w-12 h-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No Business Unit Selected</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please select a business unit from the Business Units tab
        </p>
        <Button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setActiveTab('plants')}
        >
          Go to Business Units
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Department Info Header */}
      <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-gray-100">
            Departments for {activeBusinessUnit?.name || "Selected Business Unit"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Department Name"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              className="bg-white dark:bg-gray-700 flex-1"
            />
            <Button
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              onClick={handleAddDepartment}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Department'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Departments List */}
      {activeBusinessUnit?.departments && activeBusinessUnit.departments.length > 0 ? (
        <div className="space-y-4">
          {activeBusinessUnit.departments.map((department) => (
            <DepartmentItem
              key={department.id}
              department={department}
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
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <FolderOpen className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No Departments Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first department using the form above
          </p>
        </div>
      )}
    </>
  );
}; 