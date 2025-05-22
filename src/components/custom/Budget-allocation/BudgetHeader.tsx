import { Building, Users } from 'lucide-react';
import { BusinessUnit, Department } from './types';

interface HeaderProps {
  businessUnits: BusinessUnit[];
  departments: Department[];
}

export const BudgetHeader = ({ businessUnits, departments }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Budget Allocation System</h1>
        <p className="text-gray-600 mt-1">Manage department budgets and track spending across categories</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Building size={16} />
        <span>{businessUnits.length} Business Units</span>
        <Users size={16} className="ml-4" />
        <span>{departments.length} Departments</span>
      </div>
    </div>
  );
};
