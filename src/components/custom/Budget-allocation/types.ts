export interface BusinessUnit {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  business_unit: number;
}

export interface BudgetAllocation {
  id: number;
  department_id: number;
  department_name: string;
  category: string;
  allocated_budget: number;
  spent_budget: number;
  status: 'active' | 'warning' | 'over_budget';
}

/**
 * OLD / GENERIC UI TRANSACTION (keep if used elsewhere)
 */
export interface Transaction {
  id: number;
  department: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  type: 'expense' | 'income';
}

/**
 * BACKEND: /budget-history/ response
 */
export interface BudgetHistoryTransaction {
  id: number;
  transaction_type: 'CREDIT' | 'DEBIT';
  amount: string;               // backend sends string
  remarks: string | null;
  created_at: string;
}

export interface FormData {
  business_unit: number;
  department: number;
  category: string;
  budget: string;
}

export interface DepartmentStats {
  [key: string]: {
    allocated: number;
    spent: number;
    categories: number;
  };
}

export interface CategoryStats {
  [key: string]: number;
}

export interface DepartmentUsage {
  name: string;
  allocated: number;
  spent: number;
  utilization: number;
  categories: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
}

export interface MonthlyTrend {
  month: string;
  budget: number;
  spent: number;
}
