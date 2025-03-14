'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, UserPlus, Settings } from 'lucide-react';
import { BusinessUnitActionsProps } from './types';

interface DepartmentItemProps extends BusinessUnitActionsProps {
  department: any;
  selectedDepartmentId: string;
  setSelectedDepartmentId: React.Dispatch<React.SetStateAction<string>>;
  setIsAddDesignationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DepartmentItem: React.FC<DepartmentItemProps> = ({
  department,
  businessUnits,
  setBusinessUnits,
  activeBusinessUnitId,
  selectedDepartmentId,
  setSelectedDepartmentId,
  setIsAddDesignationDialogOpen,
}) => {
  // Handle designation selection
  const handleAddDesignation = () => {
    setSelectedDepartmentId(department.id);
    setIsAddDesignationDialogOpen(true);
  };

  return (
    <Card 
      className={`border-l-4 transition-all duration-200 ${
        selectedDepartmentId === department.id 
          ? 'border-l-blue-600 shadow-md dark:border-l-blue-500' 
          : 'border-l-gray-200 dark:border-l-gray-700'
      }`}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-medium">{department.name}</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            {department.designations?.length || 0} Designation{department.designations?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          onClick={handleAddDesignation}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Add Designation
        </Button>
      </CardHeader>
      
      <CardContent>
        {department.designations && department.designations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {department.designations.map((designation: any) => (
              <div 
                key={designation.id} 
                className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 flex items-center justify-between border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">{designation.name}</p>
                    <Badge 
                      variant="outline" 
                      className="mt-1 text-xs bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                    >
                      Level {designation.level}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">No designations found</p>
            <Button 
              variant="link" 
              className="text-blue-600 dark:text-blue-400 mt-1 p-0"
              onClick={handleAddDesignation}
            >
              Add your first designation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};