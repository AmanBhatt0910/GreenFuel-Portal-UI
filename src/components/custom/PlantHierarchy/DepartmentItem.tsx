'use client'
import React, { useState } from 'react';
import { FolderOpen, BriefcaseIcon, Eye, Plus , Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Designation, Department } from './types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAxios from "@/app/hooks/use-axios";
import { toast } from "@/lib/toast-util";

interface DepartmentItemProps {
  department: Department;
  isActive: boolean;
  onClick: () => void;
  onViewHierarchy: () => void;
  onAddDesignation: () => void;
  departments?: Department[];
  setDepartments?: (departments: Department[] | ((prevDepts: Department[]) => Department[])) => void;
  businessUnitId?: number | string;
}

export const DepartmentItem: React.FC<DepartmentItemProps> = ({
  department,
  isActive,
  onClick,
  onViewHierarchy,
  onAddDesignation,
  departments = [],
  setDepartments,
}) => {
  const designations = department.designations || [];
  const [editingName, setEditingName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const api = useAxios();

  // Start editing
  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingName(department.name);
    setIsEditing(true);
  };

  // Save edited department
  const saveEditedDepartment = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!editingName.trim()) {
      return;
    }

    try {
      setIsSaving(true);

      const response = await api.put(`/departments/${department.id}/`, {
        name: editingName,
        business_unit: department.business_unit
      });

      if (response.status === 200) {
        if (setDepartments) {
          // Create a new array with the updated department
          const updatedDepartments = departments.map((dept) =>
            dept.id === department.id ? { ...dept, name: editingName } : dept
          );
          
          // Pass the new array to the parent component
          setDepartments(updatedDepartments);
        }
        toast.success("Successfully updated department name");
        setIsEditing(false);
      } else {
        console.error("Failed to update the department:", response);
        toast.error("Failed to update department");
      }
    } catch (error) {
      console.error("Error updating the department:", error);
      toast.error("Error updating department");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  // Delete department
  const deleteDepartment = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this department? This will also delete all associated designations.")) {
      try {
        const response = await api.delete(`/departments/${department.id}/`);
        
        if (response.status === 200) {
          if (setDepartments) {
            // Create a new array without the deleted department
            const updatedDepartments = departments.filter((dept) => dept.id !== department.id);
            
            // Pass the new array to the parent component
            setDepartments(updatedDepartments);
          }
          toast.success("Successfully deleted department");
        } else {
          toast.error("Failed to delete department");
        }
      } catch (error) {
        console.error("Error deleting department:", error);
        toast.error("Error deleting department");
      }
    }
  };
  
  return (
    <Card 
      className={cn(
        'border border-gray-200 transition-all duration-100 relative',
        isActive ? 'border-green-500 bg-green-50/30' : 'hover:border-gray-300'
      )}
    >
      {/* Left indicator bar when active */}
      {isActive && (
        <div className="absolute top-0 left-0 w-0.5 h-full bg-green-500"></div>
      )}
      
      <div className="flex">
        {/* Left icon section */}
        <div className="w-12 flex items-center justify-center bg-gray-50 border-r border-gray-200">
          <FolderOpen className={`h-6 w-6 ${isActive ? 'text-green-600' : 'text-blue-600'}`} />
        </div>

        <div className="flex-1 cursor-pointer" onClick={isEditing ? undefined : onClick}>
          <CardContent>
            <div className="flex justify-between items-center">
              {isEditing ? (
                <div className="flex space-x-2 items-center flex-1">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white border-gray-300"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={saveEditedDepartment}
                    disabled={isSaving}
                    className={`h-9 w-9 ${
                      isSaving
                        ? "opacity-50 cursor-not-allowed"
                        : "text-green-600 hover:text-green-700 hover:bg-green-50"
                    }`}
                  >
                    {isSaving ? (
                      <svg
                        className="animate-spin h-4 w-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={cancelEditing}
                    className="h-9 w-9 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className={`text-lg font-medium ${isActive ? 'text-green-800' : 'text-gray-800'}`}>
                    {department.name}
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                      {designations.length} {designations.length === 1 ? 'Designation' : 'Designations'}
                    </Badge>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={startEditing}
                            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-3.5 w-3.5" />
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
                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete department</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </>
              )}
            </div>
            
            {!isEditing && (
              <>
                {designations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Department Designations</p>
                    <div className="flex flex-wrap gap-2">
                      {designations.map((designation) => (
                        <div key={designation.id} className="p-2 rounded bg-white border border-gray-200 flex items-center">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-1">
                            <BriefcaseIcon className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">{designation.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {designations.length === 0 && (
                  <div className="mt-2 text-sm text-gray-500 p-2 bg-gray-50 border border-gray-200 rounded">
                    No designations defined
                  </div>
                )}
              </>
            )}
          </CardContent>
        </div>
      </div>
      
      <CardFooter className="flex justify-between items-center p-2 bg-gray-50 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="h-8 text-sm border-gray-300 text-gray-700 hover:bg-gray-100"
          onClick={onViewHierarchy}
          size="sm"
        >
          <Eye className="h-3.5 w-3.5 mr-1" /> View Hierarchy
        </Button>
        
        <Button 
          variant="outline" 
          className="h-8 text-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          onClick={onAddDesignation}
          size="sm"
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Designation
        </Button>
      </CardFooter>
    </Card>
  );
};