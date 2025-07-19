import React from 'react';
import { Edit2, Trash2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BudgetAllocation } from './types';

interface AllocationListProps {
  budgetAllocations: BudgetAllocation[];
}

export const AllocationList = ({ budgetAllocations }: AllocationListProps) => {
  const getStatusBadge = (allocation: BudgetAllocation) => {
    const utilization = (allocation.spent_budget / allocation.allocated_budget) * 100;
    
    if (utilization > 100) {
      return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle size={12} />Over Budget</Badge>;
    } else if (utilization > 80) {
      return <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800"><Clock size={12} />Warning</Badge>;
    } else {
      return <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800"><CheckCircle size={12} />On Track</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Allocations</CardTitle>
        <CardDescription>Manage existing budget allocations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgetAllocations.map((allocation) => (
            <div key={allocation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{allocation.department_name}</h3>
                    <Badge variant="outline">{allocation.category}</Badge>
                    {getStatusBadge(allocation)}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Allocated</p>
                      <p className="font-semibold">₹{allocation.allocated_budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Spent</p>
                      <p className="font-semibold">₹{allocation.spent_budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Remaining</p>
                      <p className="font-semibold">₹{(allocation.allocated_budget - allocation.spent_budget).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{((allocation.spent_budget / allocation.allocated_budget) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (allocation.spent_budget / allocation.allocated_budget) > 1 
                            ? 'bg-red-500' 
                            : (allocation.spent_budget / allocation.allocated_budget) > 0.8 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, (allocation.spent_budget / allocation.allocated_budget) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Edit2 size={14} />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
