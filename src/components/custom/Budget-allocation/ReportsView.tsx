import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { DepartmentUsage } from './types';

interface ReportsViewProps {
  departmentUsage: DepartmentUsage[];
  overBudgetCategories: { name: string; allocated: number; spent: number; overspend: number }[];
}

export const ReportsView = ({ 
  departmentUsage,
  overBudgetCategories
}: ReportsViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>High Usage Departments</CardTitle>
          <CardDescription>Departments with highest budget utilization rates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead className="text-right">Allocated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentUsage
                .sort((a, b) => b.utilization - a.utilization)
                .slice(0, 5)
                .map((dept) => (
                  <TableRow key={dept.name}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={dept.utilization} className="h-2" />
                        <span className={`text-xs font-medium ${
                          dept.utilization > 90 ? 'text-red-600' : 
                          dept.utilization > 75 ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {dept.utilization.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${dept.allocated.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Over-Budget Categories</CardTitle>
          <CardDescription>Categories that have exceeded their allocated budget</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Overspend</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overBudgetCategories
                .sort((a, b) => b.overspend - a.overspend)
                .map((category) => (
                  <TableRow key={category.name}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-red-600">${category.overspend.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                        {((category.spent / category.allocated) * 100).toFixed(1)}% of Budget
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
