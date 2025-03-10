import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BusinessUnit, NewDesignation, Designation } from './types';
import { getNextLevel } from './utils';

interface EmployeeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newEmployee: NewDesignation;
  setNewEmployee: React.Dispatch<React.SetStateAction<NewDesignation>>;
  businessUnits: BusinessUnit[];
  setBusinessUnits: React.Dispatch<React.SetStateAction<BusinessUnit[]>>;
  activeBusinessUnitId: string | number;
  selectedDepartmentId: string;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onAddDesignation?: (name: string, departmentId: number, level: number) => Promise<Designation | null>;
}

export const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
  isOpen,
  setIsOpen,
  newEmployee,
  setNewEmployee,
  businessUnits,
  activeBusinessUnitId,
  selectedDepartmentId,
  error,
  setError,
  onAddDesignation,
}) => {
  // Set initial level when dialog opens
  useEffect(() => {
    if (isOpen && selectedDepartmentId) {
      // Find the active business unit
      const businessUnit = businessUnits.find((bu) => bu.id === activeBusinessUnitId);
      if (businessUnit) {
        // Find the selected department
        const department = businessUnit.departments?.find((d) => d.id === selectedDepartmentId);
        if (department) {
          // Auto-increment level for new designation
          const nextLevel = department.designations?.length 
            ? getNextLevel(department.designations) 
            : 1;
          
          setNewEmployee({
            ...newEmployee,
            department: Number(selectedDepartmentId),
            level: nextLevel,
          });
        }
      }
    }
  }, [isOpen, selectedDepartmentId, businessUnits, activeBusinessUnitId]);

  // Handle input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmployee({
      ...newEmployee,
      name: e.target.value,
    });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const level = parseInt(e.target.value, 10);
    if (!isNaN(level) && level > 0) {
      setNewEmployee({
        ...newEmployee,
        level,
      });
    }
  };

  // Add new designation
  const addNewDesignation = async () => {
    // Validation
    if (!newEmployee.name.trim()) {
      setError("Designation name is required");
      return;
    }

    if (onAddDesignation) {
      const result = await onAddDesignation(
        newEmployee.name,
        Number(selectedDepartmentId),
        newEmployee.level
      );
      
      if (result) {
        // Reset form and close dialog
        setNewEmployee({
          name: '',
          department: 0,
          level: 1,
        });
        setIsOpen(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Designation</DialogTitle>
          <DialogDescription>
            Create a new designation (role) for this department. Higher level numbers represent
            higher positions in the hierarchy.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Designation Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="designation-name" className="text-right">
              Name
            </Label>
            <Input
              id="designation-name"
              value={newEmployee.name}
              onChange={handleNameChange}
              className="col-span-3"
              placeholder="Manager, Developer, etc."
            />
          </div>

          {/* Hierarchy Level */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">
              Level
            </Label>
            <Input
              id="level"
              type="number"
              min="1"
              value={newEmployee.level}
              onChange={handleLevelChange}
              className="col-span-3"
            />
            <div className="col-span-4 text-xs text-gray-500 dark:text-gray-400 pl-[calc(25%+16px)]">
              Higher numbers indicate higher positions in the hierarchy
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setError(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={addNewDesignation}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
          >
            Add Designation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 