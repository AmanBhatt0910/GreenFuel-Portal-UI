'use client'
import React from 'react';
import { FolderOpen, BriefcaseIcon, Eye, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Designation, Department } from './types';

interface DepartmentItemProps {
  department: Department;
  isActive: boolean;
  onClick: () => void;
  onViewHierarchy: () => void;
  onAddDesignation: () => void;
}

export const DepartmentItem: React.FC<DepartmentItemProps> = ({
  department,
  isActive,
  onClick,
  onViewHierarchy,
  onAddDesignation,
}) => {
  // Get department designations
  const designations = department.designations || [];
  
  return (
    <Card 
      className={cn(
        'border border-gray-200 transition-all duration-100',
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

        <div className="flex-1 cursor-pointer" onClick={onClick}>
          <CardContent>
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-medium ${isActive ? 'text-green-800' : 'text-gray-800'}`}>
                {department.name}
              </h3>
              
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                {designations.length} {designations.length === 1 ? 'Designation' : 'Designations'}
              </Badge>
            </div>
            
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