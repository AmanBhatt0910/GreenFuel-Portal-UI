'use client'
import React from 'react';
import { FolderOpen, Settings, User, Building, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BusinessUnit, BusinessUnitActionsProps, Approver } from './types';

interface HierarchyTabProps extends BusinessUnitActionsProps {}

export const HierarchyTab: React.FC<HierarchyTabProps> = ({
  businessUnits,
  activeBusinessUnitId,
}) => {
  // Get active business unit
  const activeBusinessUnit = businessUnits.find(bu => bu.id === activeBusinessUnitId) || null;

  // Generate hierarchy data
  const generateHierarchyData = () => {
    if (!activeBusinessUnit) return [];

    const hierarchyItems: {
      business_unit: string;
      department: string;
      level: number;
      user_name: string;
      user_id: number;
    }[] = [];

    activeBusinessUnit.departments?.forEach(department => {
      if (department.approvers && department.approvers.length > 0) {
        department.approvers
          .sort((a, b) => a.level - b.level)
          .forEach(approver => {
            hierarchyItems.push({
              business_unit: activeBusinessUnit.name,
              department: department.name,
              level: approver.level,
              user_name: approver.user_name || `User #${approver.user}`,
              user_id: approver.user
            });
          });
      }
    });

    return hierarchyItems.sort((a, b) => a.level - b.level);
  };
  
  const hierarchyData = generateHierarchyData();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Approval Hierarchy Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {hierarchyData.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/40 border-b">
                    <th className="text-left p-3 font-medium text-sm text-gray-600 w-16">Level</th>
                    <th className="text-left p-3 font-medium text-sm text-gray-600">Approver</th>
                    <th className="text-left p-3 font-medium text-sm text-gray-600">Department</th>
                    <th className="text-left p-3 font-medium text-sm text-gray-600">Business Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {hierarchyData.map((item, index) => (
                    <React.Fragment key={`${item.department}-${item.user_id}-${item.level}`}>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-sm text-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                            {item.level}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-800 block">{item.user_name}</span>
                              <span className="text-xs text-gray-500">ID: {item.user_id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                              <FolderOpen className="h-3 w-3 text-gray-600" />
                            </div>
                            <span className="text-gray-700">{item.department}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                              <Building className="h-3 w-3 text-gray-600" />
                            </div>
                            <span className="text-gray-700">{item.business_unit}</span>
                          </div>
                        </td>
                      </tr>
                      {index < hierarchyData.length - 1 && item.level < hierarchyData[index + 1].level && (
                        <tr className="bg-gray-50">
                          <td colSpan={4} className="py-1 text-center">
                            <ArrowDown className="h-4 w-4 text-gray-400 mx-auto" />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <FolderOpen className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No Approval Hierarchy Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Please set up departments and approvers to build your hierarchy
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval flow visualization */}
      {hierarchyData.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Approval Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex flex-col items-center">
                {hierarchyData.map((item, index) => (
                  <React.Fragment key={`flow-${item.department}-${item.user_id}-${item.level}`}>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm w-64 text-center">
                      <div className="flex justify-center mb-1">
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          Level {item.level}
                        </Badge>
                      </div>
                      <div className="font-medium">{item.user_name}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.department}</div>
                    </div>
                    {index < hierarchyData.length - 1 && (
                      <div className="h-8 flex items-center justify-center">
                        <ArrowDown className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};