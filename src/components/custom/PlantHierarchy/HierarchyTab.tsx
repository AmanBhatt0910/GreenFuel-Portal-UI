'use client'
import React, { useState, useEffect } from 'react';
import { 
  Building, 
  FolderOpen, 
  Briefcase, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  PieChart, 
  BarChart3,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BusinessUnit } from './types';
import { cn } from '@/lib/utils';

interface HierarchyTabProps {
  businessUnits: BusinessUnit[];
  activeBusinessUnitId?: string | number;
  selectedDepartmentId?: string;
}

export const HierarchyTab: React.FC<HierarchyTabProps> = ({
  businessUnits,
  activeBusinessUnitId,
  selectedDepartmentId,
}) => {
  // State for collapsible sections and search
  const [expandedBusinessUnits, setExpandedBusinessUnits] = useState<Record<string | number, boolean>>({});
  const [expandedDepartments, setExpandedDepartments] = useState<Record<string | number, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize all business units as expanded by default
  useEffect(() => {
    if (!businessUnits?.length) return;
    
    const initialExpandedState: Record<string | number, boolean> = {};
    businessUnits.forEach(bu => {
      if (bu.id !== undefined) {
        initialExpandedState[bu.id] = true;
      }
    });
    setExpandedBusinessUnits(initialExpandedState);
    
    // Also expand the active business unit if provided
    if (activeBusinessUnitId) {
      setExpandedBusinessUnits(prev => ({
        ...prev,
        [activeBusinessUnitId]: true
      }));
    }
    
    // Expand the department if selected department ID is provided
    if (selectedDepartmentId) {
      setExpandedDepartments(prev => ({
        ...prev,
        [selectedDepartmentId]: true
      }));
    }
  }, [businessUnits, activeBusinessUnitId, selectedDepartmentId]);

  // Toggle expansion of business unit
  const toggleBusinessUnit = (id: string | number) => {
    setExpandedBusinessUnits(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle expansion of department
  const toggleDepartment = (id: string | number) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter business units, departments, and designations based on search term
  const filteredBusinessUnits = React.useMemo(() => {
    if (!searchTerm.trim() || !businessUnits) return businessUnits || [];
    
    return businessUnits.map(bu => {
      // Check if business unit name matches
      const buMatches = bu.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter departments
      const filteredDepartments = (bu.departments || []).map(dept => {
        // Check if department name matches
        const deptMatches = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter designations
        const filteredDesignations = (dept.designations || []).filter(
          designation => designation.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Include department if it matches or has matching designations
        return {
          ...dept,
          designations: filteredDesignations,
          _matches: deptMatches || filteredDesignations.length > 0
        };
      }).filter(dept => dept._matches || buMatches);
      
      // Include business unit if it matches or has matching departments
      return {
        ...bu,
        departments: filteredDepartments,
        _matches: buMatches || filteredDepartments.length > 0
      };
    }).filter(bu => bu._matches);
  }, [businessUnits, searchTerm]);

  // Calculate statistics
  const totalDepartments = React.useMemo(() => 
    businessUnits?.reduce((acc, bu) => acc + (bu.departments?.length || 0), 0) || 0, 
    [businessUnits]
  );
  
  const totalDesignations = React.useMemo(() => 
    businessUnits?.reduce((acc, bu) => 
      acc + (bu.departments?.reduce((dAcc, dept) => 
        dAcc + (dept.designations?.length || 0), 0) || 0), 0) || 0, 
    [businessUnits]
  );
  
  const avgDesignationsPerDept = totalDepartments ? 
    (totalDesignations / totalDepartments).toFixed(1) : '0';

  if (!businessUnits || businessUnits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
        <Building className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Business Units Found</h3>
        <p className="text-center text-gray-500 max-w-md">
          Please add business units and departments to view the organizational hierarchy.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-5 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Organizational Hierarchy</h2>
          <p className="text-gray-500 text-sm mt-1">
            Complete overview of your organizational structure
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search hierarchy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-gray-300 pr-8"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-1 hover:bg-gray-100 rounded-full"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-50/30 shadow-sm overflow-hidden">
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700 font-medium">Business Units</p>
                <h3 className="text-2xl font-bold text-blue-900 mt-1">{businessUnits.length}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 shadow-inner">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-green-50/30 shadow-sm overflow-hidden">
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-700 font-medium">Departments</p>
                <h3 className="text-2xl font-bold text-green-900 mt-1">{totalDepartments}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center border border-green-200 shadow-inner">
                <FolderOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-50/30 shadow-sm overflow-hidden">
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-700 font-medium">Designations</p>
                <h3 className="text-2xl font-bold text-amber-900 mt-1">{totalDesignations}</h3>
                <p className="text-xs text-amber-600 mt-1">
                  {avgDesignationsPerDept} avg per department
                </p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center border border-amber-200 shadow-inner">
                <Briefcase className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search results indicator */}
      {searchTerm && (
        <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm shadow-sm">
          {filteredBusinessUnits.length > 0 ? (
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                Showing results for "<strong>{searchTerm}</strong>" 
                ({filteredBusinessUnits.length} business unit{filteredBusinessUnits.length > 1 ? 's' : ''} found)
              </span>
            </div>
          ) : (
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>No results found for "<strong>{searchTerm}</strong>"</span>
            </div>
          )}
        </div>
      )}
      
      {/* Hierarchy Tree */}
      <div className="space-y-5">
        {filteredBusinessUnits.length > 0 ? (
          filteredBusinessUnits.map((businessUnit) => (
            <Card 
              key={businessUnit.id} 
              className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-300 shadow-sm"
            >
              <CardHeader
                className={cn(
                  "py-4 px-5 cursor-pointer",
                  businessUnit.id !== undefined && expandedBusinessUnits[businessUnit.id] 
                    ? "bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-200" 
                    : "bg-gradient-to-r from-gray-50 to-gray-100/30"
                )}
                onClick={() => businessUnit.id !== undefined && toggleBusinessUnit(businessUnit.id)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-blue-800 text-lg">
                    <div className="h-8 w-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center mr-3 shadow-sm">
                      <Building className="h-4 w-4 text-blue-600" />
                    </div>
                    {businessUnit.name}
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-0.5 shadow-sm">
                      {businessUnit.departments?.length || 0} dept{businessUnit.departments?.length !== 1 ? 's' : ''}
                    </Badge>
                    {businessUnit.id !== undefined && expandedBusinessUnits[businessUnit.id] ? (
                      <ChevronDown className="h-5 w-5 text-blue-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {businessUnit.id !== undefined && expandedBusinessUnits[businessUnit.id] && (
                <CardContent className="p-0 divide-y divide-gray-100">
                  {(!businessUnit.departments || businessUnit.departments.length === 0) ? (
                    <div className="p-5 text-center text-gray-500">
                      No departments found in this business unit
                    </div>
                  ) : (
                    businessUnit.departments.map((department) => (
                      <div key={department.id} className="transition-all duration-200">
                        {/* Department header */}
                        <div 
                          className={cn(
                            "px-5 py-3.5 cursor-pointer hover:bg-gray-50/80",
                            department.id !== undefined && expandedDepartments[department.id] 
                              ? "bg-gradient-to-r from-green-50/70 to-green-100/30" 
                              : ""
                          )}
                          onClick={() => department.id !== undefined && toggleDepartment(department.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center mr-3 border border-green-200 shadow-sm">
                                <FolderOpen className="h-4 w-4 text-green-600" />
                              </div>
                              <h3 className="font-medium text-green-800">{department.name}</h3>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2.5 py-0.5 shadow-sm">
                                {department.designations?.length || 0} designation{department.designations?.length !== 1 ? 's' : ''}
                              </Badge>
                              {department.id !== undefined && expandedDepartments[department.id] ? (
                                <ChevronDown className="h-4 w-4 text-green-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Designations */}
                        {department.id !== undefined && expandedDepartments[department.id] && department.designations && department.designations.length > 0 && (
                          <div className="mx-5 mb-4 mt-2 p-3 bg-gray-50 border border-gray-100 rounded-lg shadow-inner">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {department.designations.map((designation) => (
                                <div 
                                  key={designation.id} 
                                  className="flex items-center p-2.5 rounded-md bg-white border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all duration-150"
                                >
                                  <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mr-2.5 border border-amber-200 shadow-sm">
                                    <Briefcase className="h-3 w-3 text-amber-600" />
                                  </div>
                                  <span className="text-sm font-medium text-amber-800">
                                    {designation.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {department.id !== undefined && expandedDepartments[department.id] && (!department.designations || department.designations.length === 0) && (
                          <div className="mx-5 mb-4 mt-2 p-3 bg-gray-50 border border-gray-100 rounded-lg shadow-inner">
                            <p className="text-sm text-gray-500 italic text-center">
                              No designations assigned
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <div className="p-10 text-center bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-3 opacity-70" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No matching results</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm ? (
                <>No items match your search criteria. Try different keywords.</>
              ) : (
                <>No business units or departments found. Please add them to build your hierarchy.</>
              )}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                className="mt-5"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      {filteredBusinessUnits.length > 0 && (
        <Card className="border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50/30 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-base font-medium mb-4 text-gray-700">Hierarchy Legend</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center bg-white p-2.5 rounded-md border border-gray-100 shadow-sm">
                <div className="h-7 w-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center mr-3 shadow-inner">
                  <Building className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Business Unit</span>
              </div>
              <div className="flex items-center bg-white p-2.5 rounded-md border border-gray-100 shadow-sm">
                <div className="h-7 w-7 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mr-3 shadow-inner">
                  <FolderOpen className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Department</span>
              </div>
              <div className="flex items-center bg-white p-2.5 rounded-md border border-gray-100 shadow-sm">
                <div className="h-7 w-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center mr-3 shadow-inner">
                  <Briefcase className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Designation</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};