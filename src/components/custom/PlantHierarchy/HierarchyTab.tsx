'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BusinessUnit, HierarchyItem } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface HierarchyTabProps {
  businessUnits: BusinessUnit[];
}

export const HierarchyTab: React.FC<HierarchyTabProps> = ({ businessUnits }) => {
  const [isHierarchyGenerated, setIsHierarchyGenerated] = useState(false);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const validateHierarchy = () => {
    setIsHierarchyGenerated(true);
    if (businessUnits.length > 0) {
      setExpandedUnit(businessUnits[0].name);
    }
  };

  const toggleUnit = (unitName: string) => {
    setExpandedUnit(expandedUnit === unitName ? null : unitName);
    setExpandedDept(null);
  };

  const toggleDepartment = (deptName: string) => {
    setExpandedDept(expandedDept === deptName ? null : deptName);
  };

  const getLevelBadgeColor = (level: number) => {
    const colors = [
      'bg-blue-50 text-blue-600',      // Level 1
      'bg-purple-50 text-purple-600',  // Level 2
      'bg-green-50 text-green-600',    // Level 3
      'bg-amber-50 text-amber-600',    // Level 4
      'bg-red-50 text-red-600',        // Level 5+
    ];
    return level <= 5 ? colors[level - 1] : colors[4];
  };

  return (
    <div className="space-y-6">
      {!isHierarchyGenerated ? (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Organization Hierarchy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={validateHierarchy}
              >
                Generate Hierarchy View
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {businessUnits.map((unit) => (
              <Card key={unit.name} className="shadow-sm overflow-hidden">
                <div 
                  className="flex items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleUnit(unit.name)}
                >
                  <Folder className="h-5 w-5 text-purple-500 mr-2" />
                  <CardTitle className="text-base font-medium flex-1">{unit.name}</CardTitle>
                  <div className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {unit.departments?.reduce((count, dept) => {
                      return count + (dept.designations?.length || 0);
                    }, 0)} Designations
                  </div>
                  {expandedUnit === unit.name ? (
                    <ChevronDown className="h-5 w-5 ml-2 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 ml-2 text-gray-500" />
                  )}
                </div>
                
                <AnimatePresence>
                  {expandedUnit === unit.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="p-0">
                        {unit.departments?.map((department) => (
                          <div key={department.name} className="border-t border-gray-100">
                            <div 
                              className="flex items-center p-3 pl-6 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toggleDepartment(department.name)}
                            >
                              <CardTitle className="text-sm font-medium flex-1">{department.name}</CardTitle>
                              <div className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                                {department.designations?.length || 0} Designations
                              </div>
                              {expandedDept === department.name ? (
                                <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 ml-2 text-gray-500" />
                              )}
                            </div>
                            
                            <AnimatePresence>
                              {expandedDept === department.name && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="px-4 pb-4">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="w-[100px]">Hierarchy Level</TableHead>
                                          <TableHead>Designation</TableHead>
                                          <TableHead className="text-right">Role Path</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {department.designations
                                          ?.sort((a, b) => a.level - b.level)
                                          .map((designation) => (
                                            <TableRow key={designation.name}>
                                              <TableCell>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getLevelBadgeColor(designation.level)}`}>
                                                  {designation.level}
                                                </div>
                                              </TableCell>
                                              <TableCell className="font-medium">{designation.name}</TableCell>
                                              <TableCell className="text-right text-gray-500">
                                                {unit.name} → {department.name}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};