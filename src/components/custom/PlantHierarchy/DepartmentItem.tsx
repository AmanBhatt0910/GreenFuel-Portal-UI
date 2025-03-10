"use client"
import React, { useState } from 'react';
import { Edit, Trash2, ChevronDown, ChevronRight, Plus, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Department, DepartmentActionsProps } from './types';
import { DesignationCard } from './DesignationCard';

interface DepartmentItemProps extends DepartmentActionsProps {
  department: Department;
  selectedDepartmentId: string;
  setSelectedDepartmentId: React.Dispatch<React.SetStateAction<string>>;
  setIsAddDesignationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DepartmentItem: React.FC<DepartmentItemProps> = ({
  department,
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
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(department.name);

  // Toggle department expansion
  const toggleExpanded = () => {
    setExpandedDepartments({
      ...expandedDepartments,
      [department.id || '']: !expandedDepartments[department.id || ''],
    });
  };

  // Start editing department name
  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingName(department.name);
    setIsEditing(true);
  };

  // Save edited department name
  const saveEditedDepartment = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!editingName.trim()) {
      return; // Don't save empty names
    }
    
    setBusinessUnits(
      businessUnits.map((bu) =>
        bu.id === activeBusinessUnitId
          ? {
              ...bu,
              departments: bu.departments?.map((dept) =>
                dept.id === department.id
                  ? { ...dept, name: editingName }
                  : dept
              ),
            }
          : bu
      )
    );
    
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  // Delete department
  const deleteDepartment = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this department? This will also delete all associated designations.')) {
      setBusinessUnits(
        businessUnits.map((bu) =>
          bu.id === activeBusinessUnitId
            ? {
                ...bu,
                departments: bu.departments?.filter(
                  (dept) => dept.id !== department.id
                ),
              }
            : bu
        )
      );
      
      // If this was the selected department, clear the selection
      if (selectedDepartmentId === department.id) {
        setSelectedDepartmentId('');
      }
    }
  };

  // Add designation to department
  const addDesignation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDepartmentId(department.id?.toString() || '');
    setIsAddDesignationDialogOpen(true);
  };

  // Check if department is expanded
  const isExpanded = department.id ? expandedDepartments[department.id] : false;

  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-200 
        ${isExpanded ? 'shadow-md' : 'shadow-sm'}
        ${
          selectedDepartmentId === department.id
            ? 'border-blue-500 dark:border-blue-700'
            : 'border-gray-200 dark:border-gray-700'
        }
      `}
      onClick={toggleExpanded}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
          
          {isEditing ? (
            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="bg-white dark:bg-gray-700"
                autoFocus
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={saveEditedDepartment}
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save changes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={cancelEditing}
                      className="h-8 w-8 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cancel</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
              {department.name}
            </CardTitle>
          )}
        </div>
        
        <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
          <Badge variant="outline" className="mr-2">
            {department.designations?.length || 0} Designations
          </Badge>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={addDesignation}
                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add designation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={startEditing}
                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit department</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={deleteDepartment}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete department</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-2">
          {department.designations && department.designations.length > 0 ? (
            <div className="space-y-2">
              {department.designations.map((designation) => (
                <DesignationCard
                  key={designation.id}
                  designation={designation}
                  department={department}
                  businessUnits={businessUnits}
                  setBusinessUnits={setBusinessUnits}
                  activeBusinessUnitId={activeBusinessUnitId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No designations added yet. Click the "+" button to add a designation.
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}; 