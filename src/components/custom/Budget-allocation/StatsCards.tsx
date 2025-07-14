import { DollarSign, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BudgetAllocation } from './types';

interface StatsCardsProps {
  budgetAllocations: BudgetAllocation[];
}

export const StatsCards = ({ budgetAllocations }: StatsCardsProps) => {
  const calculateTotalBudget = () => {
    return budgetAllocations.reduce((sum, allocation) => sum + allocation.allocated_budget, 0);
  };

  const calculateTotalSpent = () => {
    return budgetAllocations.reduce((sum, allocation) => sum + allocation.spent_budget, 0);
  };

  const totalBudget = calculateTotalBudget();
  const totalSpent = calculateTotalSpent();
  const totalRemaining = totalBudget - totalSpent;
  const utilizationPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalBudget.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign size={16} className="text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp size={16} className="text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRemaining.toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Target size={16} className="text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{utilizationPercentage.toFixed(1)}%</p>
            </div>
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <BarChart3 size={16} className="text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
