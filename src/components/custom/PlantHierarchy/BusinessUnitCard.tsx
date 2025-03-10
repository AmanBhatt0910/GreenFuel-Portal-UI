'use client'
import React, { useState } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BusinessUnit, BusinessUnitActionsProps } from './types';

interface BusinessUnitCardProps extends BusinessUnitActionsProps {
  businessUnit: BusinessUnit;
}

export const BusinessUnitCard: React.FC<BusinessUnitCardProps> = ({ 
  businessUnit, 
  businessUnits, 
  setBusinessUnits, 
  activeBusinessUnitId, 
  setActiveBusinessUnitId, 
  setActiveTab 
}) => {
  const [editingName, setEditingName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Start editing
  const startEditing = () => {
    setEditingName(businessUnit.name);
    setIsEditing(true);
  };

  // Save edited business unit
  const saveEditedBusinessUnit = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!editingName.trim()) {
      return; // Don't save empty names
    }
    
    setBusinessUnits(
      businessUnits.map((bu) =>
        bu.id === businessUnit.id
          ? { ...bu, name: editingName }
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

  // Delete business unit
  const deleteBusinessUnit = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this business unit? This will also delete all associated departments and designations.')) {
      setBusinessUnits(businessUnits.filter((bu) => bu.id !== businessUnit.id));
      
      // If this was the active business unit, clear the selection
      if (activeBusinessUnitId === businessUnit.id) {
        setActiveBusinessUnitId('');
      }
    }
  };

  // Select business unit and go to departments tab
  const selectBusinessUnit = () => {
    setActiveBusinessUnitId(businessUnit.id || '');
    setActiveTab('departments');
  };

  // Count total designations across all departments
  const getTotalDesignations = () => {
    return businessUnit.departments?.reduce(
      (sum, dept) => sum + (dept.designations?.length || 0),
      0
    ) || 0;
  };

  return (
    <Card 
      className={`
        transition-all duration-200 ease-in-out cursor-pointer hover:shadow-md
        ${activeBusinessUnitId === businessUnit.id 
          ? 'border-green-500 dark:border-green-700 shadow-green-100 dark:shadow-none' 
          : 'border-gray-200 dark:border-gray-700'}
      `}
      onClick={selectBusinessUnit}
    >
      <CardHeader className="pb-2">
        {isEditing ? (
          <div className="flex space-x-2">
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-700"
              autoFocus
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={saveEditedBusinessUnit}
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
            {businessUnit.name}
          </CardTitle>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>ID: {businessUnit.id}</span>
          </div>
          
          <div className="flex space-x-2">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              {businessUnit.departments?.length || 0} Departments
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              {getTotalDesignations()} Designations
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-end border-t border-gray-100 dark:border-gray-800 mt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing();
                }}
                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit business unit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={deleteBusinessUnit}
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete business unit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}; 