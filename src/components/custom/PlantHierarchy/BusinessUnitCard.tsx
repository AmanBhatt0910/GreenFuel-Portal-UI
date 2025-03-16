'use client'
import React, { useState } from 'react';
import { Edit, Trash2, Check, X, Building2, Layers, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  const [isHovered, setIsHovered] = useState(false);

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

  const isActive = activeBusinessUnitId === businessUnit.id;
  const deptCount = businessUnit.departments?.length || 0;
  const desigCount = getTotalDesignations();

  return (
    <Card 
      className={`
        transition-all duration-200 ease-in-out cursor-pointer relative overflow-hidden
        ${isActive 
          ? 'border-green-500 dark:border-green-600' 
          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}
      `}
      onClick={selectBusinessUnit}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-0 left-0 w-0.5 h-full bg-green-500 dark:bg-green-400"></div>
      )}
      
      <div className="flex items-stretch">
        {/* Left icon section */}
        <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800/30">
          <Building2 className={`h-9 w-9 ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
        </div>
        
        <div className="flex-1">
          <CardHeader className="pb-3 pt-3">
            {isEditing ? (
              <div className="flex space-x-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={saveEditedBusinessUnit}
                  className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={cancelEditing}
                  className="h-9 w-9 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-semibold ${isActive ? 'text-green-800 dark:text-green-300' : 'text-gray-800 dark:text-gray-200'}`}>
                  {businessUnit.name}
                </h3>
                
                <div className="flex space-x-1">
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
                          className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Edit className="h-3.5 w-3.5" />
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
                          className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete business unit</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="pb-4">
            <div className="space-y-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ID: {businessUnit.id}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center px-3 py-1.5 rounded-full text-sm bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  <Layers className="h-3.5 w-3.5 mr-1.5" />
                  <span className="font-medium">{deptCount}</span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">Departments</span>
                </div>
                
                <div className="flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  <Layers className="h-3.5 w-3.5 mr-1.5" />
                  <span className="font-medium">{desigCount}</span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">Designations</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
        
        {/* Right chevron indicator */}
        <div className={`flex items-center pr-2 ${isActive ? 'text-green-500' : 'text-gray-400'}`}>
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}; 