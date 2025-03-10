'use client'
import React, { useState } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { BusinessUnit, Department, Designation } from './types';
import { getLevelColor } from './utils';

interface DesignationCardProps {
  designation: Designation;
  department: Department;
  businessUnits: BusinessUnit[];
  setBusinessUnits: React.Dispatch<React.SetStateAction<BusinessUnit[]>>;
  activeBusinessUnitId: string | number;
}

export const DesignationCard: React.FC<DesignationCardProps> = ({
  designation,
  department,
  businessUnits,
  setBusinessUnits,
  activeBusinessUnitId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(designation.name);
  const [editingLevel, setEditingLevel] = useState(designation.level);

  // Start editing designation
  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingName(designation.name);
    setEditingLevel(designation.level);
    setIsEditing(true);
  };

  // Save edited designation
  const saveEditedDesignation = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!editingName.trim()) {
      return; // Don't save empty names
    }
    
    if (editingLevel < 1) {
      return; // Don't save invalid levels
    }
    
    setBusinessUnits(
      businessUnits.map((bu) =>
        bu.id === activeBusinessUnitId
          ? {
              ...bu,
              departments: bu.departments?.map((dept) =>
                dept.id === department.id
                  ? {
                      ...dept,
                      designations: dept.designations?.map((des) =>
                        des.id === designation.id
                          ? { ...des, name: editingName, level: editingLevel }
                          : des
                      ),
                    }
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

  // Delete designation
  const deleteDesignation = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this designation?')) {
      setBusinessUnits(
        businessUnits.map((bu) =>
          bu.id === activeBusinessUnitId
            ? {
                ...bu,
                departments: bu.departments?.map((dept) =>
                  dept.id === department.id
                    ? {
                        ...dept,
                        designations: dept.designations?.filter(
                          (des) => des.id !== designation.id
                        ),
                      }
                    : dept
                ),
              }
            : bu
        )
      );
    }
  };

  return (
    <Card 
      className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <CardContent className="p-3 flex justify-between items-center">
        {isEditing ? (
          <div className="flex-1 flex flex-col sm:flex-row gap-2">
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="bg-white dark:bg-gray-700 flex-1"
              placeholder="Designation Name"
              autoFocus
            />
            <Input
              type="number"
              min="1"
              value={editingLevel}
              onChange={(e) => setEditingLevel(parseInt(e.target.value) || 1)}
              className="bg-white dark:bg-gray-700 w-24"
              placeholder="Level"
            />
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={saveEditedDesignation}
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
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Badge
                className={`${getLevelColor(designation.level)} text-sm flex items-center justify-center w-8 h-8 rounded-full`}
              >
                {designation.level}
              </Badge>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {designation.name}
              </span>
            </div>
            
            <div className="flex gap-1">
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
                    <p>Edit designation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={deleteDesignation}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete designation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}; 