'use client'
import React, { useEffect, useState } from 'react';
import useAxios from '@/app/hooks/use-axios';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import components
import { BudgetHeader } from '@/components/custom/Budget-allocation/BudgetHeader';
import { StatsCards } from '@/components/custom/Budget-allocation/StatsCards';
import { AllocationForm } from '@/components/custom/Budget-allocation/AllocationForm';
import { AllocationList } from '@/components/custom/Budget-allocation/AllocationList';
import { AnalyticsCharts } from '@/components/custom/Budget-allocation/AnalyticsCharts';
import { TransactionList } from '@/components/custom/Budget-allocation/TransactionList';
import { ReportsView } from '@/components/custom/Budget-allocation/ReportsView';
import { TabManager } from '@/components/custom/Budget-allocation/TabManager';

// Import types
import { 
  BusinessUnit, 
  Department, 
  BudgetAllocation, 
  Transaction, 
  FormData as ChildFormData,
  DepartmentStats,
  CategoryStats,
  DepartmentUsage,
  CategoryDistribution,
  MonthlyTrend
} from '@/components/custom/Budget-allocation/types';

// Define local types to fix missing exports
interface Category {
  id: number;
  name: string;
}

interface ApiBudgetAllocation {
  id: number;
  budget: string;
  remaining_budget: string;
  business_unit: number;
  department: number;
  category: number;
}

const BudgetAllocationSystem = () => {
  // API data states
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>("allocations");
  const [error, setError] = useState<string | null>(null);
  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Form state for AllocationForm
  const [childFormData, setChildFormData] = useState<ChildFormData>({
    business_unit: 0,
    department: 0,
    category: '',
    budget: ''
  });
  
  // Additional form state for API
  const [apiFormData, setApiFormData] = useState({
    transaction_type: 'CREDIT' as 'CREDIT' | 'DEBIT',
    remarks: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const api = useAxios();

  // Format currency in INR
  const formatINR = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Read tab from URL when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const tabParam = url.searchParams.get('tab');
      const validTabs = ['allocations', 'analytics', 'transactions', 'reports'];
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setError(null);
        
        // Fetch business units
        const businessUnitsResponse = await api.get('/business-units/');
        setBusinessUnits(businessUnitsResponse.data);
        
        // Fetch departments
        const departmentsResponse = await api.get('/departments/');
        setDepartments(departmentsResponse.data);
        
        // Fetch categories
        const categoriesRes = await api.get("/approval-request-category/");
        setCategories(categoriesRes.data);
        
        // Fetch budget allocations
        await fetchBudgetAllocations();
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to load data. Please try refreshing the page.');
      }
    };
    
    fetchInitialData();
  }, []);

  // Map API allocation to UI type
  const mapApiAllocationToUi = (apiAllocation: ApiBudgetAllocation): BudgetAllocation => {
    const allocated = parseFloat(apiAllocation.budget);
    const spent = allocated - parseFloat(apiAllocation.remaining_budget);
    const department = departments.find(d => d.id === apiAllocation.department);
    const category = categories.find(c => c.id === apiAllocation.category);
    
    return {
      id: apiAllocation.id,
      department_id: apiAllocation.department,
      department_name: department?.name || `Department ${apiAllocation.department}`,
      category: category?.name || `Category ${apiAllocation.category}`,
      allocated_budget: allocated,
      spent_budget: spent,
      status: spent > allocated ? 'over_budget' : 
              spent >= allocated * 0.8 ? 'warning' : 'active'
    };
  };

  // Fetch budget allocations
  const fetchBudgetAllocations = async () => {
    try {
      const response = await api.get('/budget-allocation/?all=true');
      const apiAllocations: ApiBudgetAllocation[] = response.data;
      
      // Map to UI type
      const uiAllocations = apiAllocations.map(mapApiAllocationToUi);
      setBudgetAllocations(uiAllocations);
    } catch (error) {
      console.error('Error fetching budget allocations:', error);
      setError('Failed to load budget allocations');
    }
  };

  // Filter departments when business unit changes
  useEffect(() => {
    if (!childFormData.business_unit) {
      setFilteredDepartments([]);
      return;
    }
    setFilteredDepartments(
      departments.filter(d => d.business_unit === childFormData.business_unit)
    );
    setChildFormData(prev => ({ ...prev, department: 0 }));
  }, [childFormData.business_unit, departments]);

  const handleSubmit = async () => {
    if (!childFormData.business_unit || !childFormData.department || 
        !childFormData.category || !childFormData.budget) {
      alert('Please fill all required fields');
      return;
    }

    // Validate budget amount
    const budgetAmount = parseFloat(childFormData.budget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    setLoading(true);
    try {
      // Find category ID from name
      const categoryId = categories.find(c => c.name === childFormData.category)?.id;
      if (!categoryId) {
        throw new Error('Invalid category selected');
      }

      const allocationData = {
        business_unit: childFormData.business_unit,
        department: childFormData.department,
        category: categoryId,
        amount: budgetAmount, // Use the validated number
        transaction_type: apiFormData.transaction_type,
        remarks: apiFormData.remarks || `Budget ${apiFormData.transaction_type === 'CREDIT' ? 'allocated' : 'deducted'}`
      };

      // Log current budget state for debugging
      const currentAllocation = budgetAllocations.find(a => 
        a.department_id === childFormData.department && 
        a.category === childFormData.category
      );

      await api.post('/budget-allocation/', allocationData);
      await fetchBudgetAllocations();
      
      // Reset form
      setChildFormData({
        business_unit: childFormData.business_unit, // Keep same business unit
        department: 0,
        category: '',
        budget: ''
      });
      
      setApiFormData({
        transaction_type: 'CREDIT',
        remarks: ''
      });
      
      alert('Budget operation completed successfully!');
    } catch (error: any) {
      console.error('Error creating budget allocation:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to perform budget operation. Please try again.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.amount) {
          // Handle field-specific errors
          errorMessage = `Amount error: ${Array.isArray(errorData.amount) ? errorData.amount[0] : errorData.amount}`;
        }
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const calculateTotalBudget = () => {
    return budgetAllocations.reduce((sum, allocation) => 
      sum + allocation.allocated_budget, 0);
  };

  const calculateTotalSpent = () => {
    return budgetAllocations.reduce((sum, allocation) => 
      sum + allocation.spent_budget, 0);
  };

  const getDepartmentUsage = (): DepartmentUsage[] => {
    const departmentStats: Record<number, { allocated: number; spent: number; categories: number }> = {};
    
    budgetAllocations.forEach(allocation => {
      const deptId = allocation.department_id;
      
      if (!departmentStats[deptId]) {
        departmentStats[deptId] = {
          allocated: 0,
          spent: 0,
          categories: 0
        };
      }
      
      departmentStats[deptId].allocated += allocation.allocated_budget;
      departmentStats[deptId].spent += allocation.spent_budget;
      departmentStats[deptId].categories += 1;
    });

    return Object.entries(departmentStats).map(([id, stats]) => {
      const department = departments.find(d => d.id === parseInt(id));
      return {
        name: department?.name || `Department ${id}`,
        allocated: stats.allocated,
        spent: stats.spent,
        utilization: stats.allocated > 0 ? 
          (stats.spent / stats.allocated) * 100 : 0,
        categories: stats.categories
      };
    });
  };

  const getCategoryDistribution = (): CategoryDistribution[] => {
    const categoryStats: Record<string, number> = {};
    
    budgetAllocations.forEach(allocation => {
      const categoryName = allocation.category;
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = 0;
      }
      categoryStats[categoryName] += allocation.allocated_budget;
    });

    return Object.entries(categoryStats).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Sample data - replace with actual API data when available
  const monthlyTrend: MonthlyTrend[] = [
    { month: 'Jan', budget: 180000, spent: 145000 },
    { month: 'Feb', budget: 185000, spent: 152000 },
    { month: 'Mar', budget: 190000, spent: 148000 },
    { month: 'Apr', budget: 195000, spent: 165000 },
    { month: 'May', budget: 200000, spent: 178000 },
  ];

  return (
    <div className="p-6 space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Header */}
      <BudgetHeader businessUnits={businessUnits} departments={departments} />

      {/* Quick Stats */}
      <StatsCards budgetAllocations={budgetAllocations} />
      
      <TabManager
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allocationsContent={
          <>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <AllocationForm 
                businessUnits={businessUnits}
                filteredDepartments={filteredDepartments}
                categories={categories.map(c => c.name)}
                formData={childFormData}
                setFormData={setChildFormData}
                loading={loading}
                handleSubmit={handleSubmit}
              />
              
              {/* Additional form fields for API */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="transaction_type"
                        value="CREDIT"
                        checked={apiFormData.transaction_type === 'CREDIT'}
                        onChange={() => setApiFormData({...apiFormData, transaction_type: 'CREDIT'})}
                      />
                      <span className="ml-2">Credit</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="transaction_type"
                        value="DEBIT"
                        checked={apiFormData.transaction_type === 'DEBIT'}
                        onChange={() => setApiFormData({...apiFormData, transaction_type: 'DEBIT'})}
                      />
                      <span className="ml-2">Debit</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={apiFormData.remarks}
                    onChange={(e) => setApiFormData({...apiFormData, remarks: e.target.value})}
                    placeholder="Enter remarks for this transaction"
                  />
                </div>
              </div>
            </div>
            
            <AllocationList 
              budgetAllocations={budgetAllocations}
            />
          </>
        }
        analyticsContent={
          <AnalyticsCharts 
            monthlyTrend={monthlyTrend}
            getCategoryDistribution={getCategoryDistribution}
            getDepartmentUsage={getDepartmentUsage}
          />
        }
        transactionsContent={
          <TransactionList transactions={transactions} />
        }
        reportsContent={
          <ReportsView 
            departmentUsage={getDepartmentUsage()} 
            overBudgetCategories={getDepartmentUsage()
              .filter(a => a.utilization > 80)
              .map(a => ({
                name: a.name,
                allocated: a.allocated,
                spent: a.spent,
                overspend: a.spent - a.allocated
              }))
            }
          />
        }
      />
    </div>
  );
};

export default BudgetAllocationSystem;