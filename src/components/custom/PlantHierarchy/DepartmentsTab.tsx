'use client'
import React, { useState } from 'react';
import { FolderOpen, Settings, User, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BusinessUnit, BusinessUnitActionsProps } from './types';
import { DepartmentItem } from './DepartmentItem';

interface DepartmentsTabProps extends BusinessUnitActionsProps {
  selectedDepartmentId: string;
  setSelectedDepartmentId: React.Dispatch<React.SetStateAction<string>>;
  setIsAddApproverDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DepartmentsTab: React.FC<DepartmentsTabProps> = ({
  businessUnits,
  setBusinessUnits,
  activeBusinessUnitId,
  setActiveBusinessUnitId,
  setActiveTab,
  selectedDepartmentId,
  setSelectedDepartmentId,
  setIsAddApproverDialogOpen,
}) => {
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDepartmentDialogOpen, setIsAddDepartmentDialogOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  // Get active business unit
  const activeBusinessUnit = businessUnits.find(bu => bu.id === activeBusinessUnitId) || null;

  const handleAddDepartment = () => {
    if (!newDepartmentName.trim() || !activeBusinessUnitId) return;
    
    setIsLoading(true);
    
    // Add department to the active business unit
    const updatedBusinessUnits = businessUnits.map(bu => {
      if (bu.id === activeBusinessUnitId) {
        const newDepartment = {
          id: (Math.random() * 1000).toString(), // Temporary ID, replace with actual from API
          name: newDepartmentName,
          business_unit: Number(activeBusinessUnitId),
          approvers: []
        };
        
        return {
          ...bu,
          departments: [...(bu.departments || []), newDepartment],
        };
      }
      return bu;
    });
    
    setBusinessUnits(updatedBusinessUnits);
    setNewDepartmentName('');
    setIsLoading(false);
  };

  const validateHierarchy = () => {
    if (!activeBusinessUnit || !selectedDepartmentId) return;
    
    const currentDepartment = activeBusinessUnit.departments?.find(
      d => d.id?.toString() === selectedDepartmentId
    );
    
    if (!currentDepartment) {
      setValidationMessage({
        message: "Department not found",
        type: "error"
      });
      return;
    }
    
    const approvers = currentDepartment.approvers || [];
    
    if (approvers.length === 0) {
      setValidationMessage({
        message: "No approvers found. Please add at least one approver.",
        type: "warning"
      });
      return;
    }
    
    // Sort approvers by level
    const sortedApprovers = [...approvers].sort((a, b) => a.level - b.level);
    
    // Check for sequential levels (no gaps)
    const levels = sortedApprovers.map(a => a.level);
    
    // Check if levels start at 1
    if (levels[0] !== 1) {
      setValidationMessage({
        message: "Hierarchy should start at level 1",
        type: "error"
      });
      return;
    }
    
    // Check for gaps in levels
    let hasGaps = false;
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] !== levels[i-1] + 1) {
        hasGaps = true;
        break;
      }
    }
    
    if (hasGaps) {
      setValidationMessage({
        message: "Approval hierarchy has gaps in levels. Please ensure levels are sequential.",
        type: "error"
      });
      return;
    }
    
    // Check for duplicate levels
    const uniqueLevels = new Set(levels);
    if (uniqueLevels.size !== levels.length) {
      setValidationMessage({
        message: "Duplicate approval levels found. Each level should have exactly one approver.",
        type: "error"
      });
      return;
    }
    
    // All checks passed
    setValidationMessage({
      message: "Hierarchy validation successful! The approval structure is correctly configured.",
      type: "success"
    });
  };

  return (
    <>
      {/* Add Department Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Department Name"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              disabled={!activeBusinessUnitId || isLoading}
            />
            <Button
              onClick={handleAddDepartment}
              disabled={!newDepartmentName.trim() || !activeBusinessUnitId || isLoading}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Departments list */}
      {activeBusinessUnit?.departments && activeBusinessUnit.departments.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 mt-3">
          {activeBusinessUnit.departments.map(department => (
            <DepartmentItem
              key={department.id}
              department={department}
              isActive={selectedDepartmentId === department.id?.toString()}
              onClick={() => setSelectedDepartmentId(department.id?.toString() || '')}
              onViewHierarchy={() => {
                setSelectedDepartmentId(department.id?.toString() || '');
                setActiveTab('hierarchy');
              }}
              onAddApprover={() => {
                setSelectedDepartmentId(department.id?.toString() || '');
                setIsAddApproverDialogOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border rounded-md bg-gray-50 mt-3">
          <p className="text-gray-500">No departments found in this business unit.</p>
          <Button 
            variant="link" 
            className="text-blue-600" 
            onClick={() => setIsAddDepartmentDialogOpen(true)}
          >
            Create your first department
          </Button>
        </div>
      )}

      {/* Validation message */}
      {validationMessage && (
        <Alert 
          className={`mt-4 ${
            validationMessage.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : validationMessage.type === 'warning'
                ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {validationMessage.type === 'success' 
            ? <CheckCircle className="h-4 w-4 text-green-600" /> 
            : <AlertCircle className="h-4 w-4 text-red-600" />
          }
          <AlertDescription>
            {validationMessage.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Approvers table */}
      {/* {activeBusinessUnit && selectedDepartmentId && (
        <Card className="mt-6">
          <CardHeader className="pb-3 flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">
                Approval Hierarchy Table
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Department: {activeBusinessUnit.departments?.find(d => d.id?.toString() === selectedDepartmentId)?.name}
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => validateHierarchy()}
            >
              Validate Hierarchy
            </Button>
          </CardHeader>
          <div className="border-t">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40">
                  <th className="text-left p-3 font-medium text-sm text-gray-600 w-20">Level</th>
                  <th className="text-left p-3 font-medium text-sm text-gray-600">Employee</th>
                  <th className="text-left p-3 font-medium text-sm text-gray-600">Department</th>
                  <th className="text-left p-3 font-medium text-sm text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeBusinessUnit.departments
                  ?.find(d => d.id?.toString() === selectedDepartmentId)
                  ?.approvers
                  ?.sort((a, b) => a.level - b.level)
                  .map(approver => (
                    <tr key={approver.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-sm text-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          {approver.level}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-800 block">{approver.user_name || `User #${approver.user}`}</span>
                            <span className="text-xs text-gray-500">ID: {approver.user}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {activeBusinessUnit.departments?.find(d => d.id?.toString() === selectedDepartmentId)?.name}
                      </td>
                      <td className="p-3">
                        <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))
                }
                {(!activeBusinessUnit.departments?.find(d => d.id?.toString() === selectedDepartmentId)?.approvers?.length) && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      <p>No approval levels defined.</p>
                      <Button 
                        variant="link" 
                        className="text-blue-600 mt-1"
                        onClick={() => setIsAddApproverDialogOpen(true)}
                      >
                        Add your first approval level
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <CardContent className="pt-3 pb-4 flex justify-between">
            <div className="text-sm text-gray-500">
              {activeBusinessUnit.departments
                ?.find(d => d.id?.toString() === selectedDepartmentId)
                ?.approvers?.length || 0} approver(s) configured
            </div>
            <Button 
              onClick={() => setIsAddApproverDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Approval Level
            </Button>
          </CardContent>
        </Card>
      )} */}
    </>
  );
};