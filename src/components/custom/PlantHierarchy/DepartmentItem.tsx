'use client'
import React from 'react';
import { FolderIcon, User, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Approver, Department } from './types';

interface DepartmentItemProps {
  department: Department;
  isActive: boolean;
  onClick: () => void;
  onViewHierarchy: () => void;
  onAddApprover?: () => void;
}

export const DepartmentItem: React.FC<DepartmentItemProps> = ({
  department,
  isActive,
  onClick,
  onViewHierarchy,
  onAddApprover,
}) => {
  // Sort approvers by level
  const sortedApprovers = department.approvers?.sort((a, b) => a.level - b.level) || [];
  
  return (
    <Card 
      className={cn(
        'mb-3 transition-all hover:bg-slate-50',
        isActive ? 'border-blue-400 bg-blue-50/50' : ''
      )} 
    >
      <CardContent className="p-4" onClick={onClick}>
        <div className="flex items-center mb-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <FolderIcon className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium">{department.name}</h3>
        </div>
        
        {sortedApprovers.length > 0 && (
          <div className="mt-2">
            <div className="text-sm text-gray-500 mb-2">Approval Chain:</div>
            <div className="overflow-hidden rounded-md border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-2 px-3 text-left font-medium text-gray-600">Level</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-600">Approver</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-600">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedApprovers.map((approver: Approver) => (
                    <tr key={approver.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 px-3 w-16">
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          {approver.level}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <User className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="font-medium">{approver.user_name || `User #${approver.user}`}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-gray-600">
                        {department.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sortedApprovers.length === 0 && (
          <div className="text-sm text-gray-500 mt-2 p-2 bg-gray-50 rounded-md border border-gray-100">
            No approval levels defined
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between p-3 bg-gray-50 border-t">
        <Button 
          variant="outline" 
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
          onClick={onViewHierarchy}
          size="sm"
        >
          <Eye className="h-4 w-4 mr-1" /> View Hierarchy
        </Button>
        
        <Button 
          variant="outline" 
          className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          onClick={onAddApprover}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Approval Level
        </Button>
      </CardFooter>
    </Card>
  );
};