import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BusinessUnit, HierarchyItem } from './types';
import { getLevelColor } from './utils';

interface HierarchyTabProps {
  businessUnits: BusinessUnit[];
}

export const HierarchyTab: React.FC<HierarchyTabProps> = ({ businessUnits }) => {
  const [hierarchyItems, setHierarchyItems] = useState<HierarchyItem[]>([]);
  const [isHierarchyGenerated, setIsHierarchyGenerated] = useState(false);

  const validateHierarchy = () => {
    const hierarchyData: HierarchyItem[] = [];

    businessUnits.forEach((businessUnit) => {
      businessUnit.departments?.forEach((department) => {
        department.designations?.forEach((designation) => {
          hierarchyData.push({
            level: designation.level,
            businessUnitName: businessUnit.name,
            departmentName: department.name,
            designationName: designation.name
          });
        });
      });
    });

    // Sort by level (lower level numbers = higher in hierarchy)
    const sortedHierarchy = [...hierarchyData].sort((a, b) => a.level - b.level);
    
    setHierarchyItems(sortedHierarchy);
    setIsHierarchyGenerated(true);
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <CardTitle>Organization Hierarchy</CardTitle>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            onClick={validateHierarchy}
          >
            Generate Hierarchy View
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isHierarchyGenerated && hierarchyItems.length > 0 ? (
          <ScrollArea className="h-[600px] w-full">
            <div className="p-6 space-y-6">
              {hierarchyItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm"
                >
                  {/* Level indicator */}
                  <div className={`flex items-center justify-center h-12 w-12 rounded-full ${getLevelColor(item.level)}`}>
                    <span className="text-lg font-semibold">{item.level}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {item.designationName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        <span className="font-medium">
                          {item.businessUnitName}
                        </span>{" "}
                        &rsaquo; {item.departmentName}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <LayoutGrid
              className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              Hierarchy Not Generated
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Click the "Generate Hierarchy View" button to see your
              organization's structure.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 