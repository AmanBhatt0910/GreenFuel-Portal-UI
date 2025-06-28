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
  FormData, 
  DepartmentStats,
  CategoryStats,
  DepartmentUsage,
  CategoryDistribution,
  MonthlyTrend
} from '@/components/custom/Budget-allocation/types';

const BudgetAllocationSystem = () => {    // API data states
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  // const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("allocations");
  const [error, setError] = useState<string | null>(null);

  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[]>([
    { id: 1, department_id: 1, department_name: 'Software Development', category: 'Equipment & Hardware', allocated_budget: 50000, spent_budget: 32000, status: 'active' },
    { id: 2, department_id: 1, department_name: 'Software Development', category: 'Software & Licenses', allocated_budget: 30000, spent_budget: 28500, status: 'warning' },
    { id: 3, department_id: 3, department_name: 'Digital Marketing', category: 'Marketing & Advertising', allocated_budget: 75000, spent_budget: 45000, status: 'active' },
    { id: 4, department_id: 5, department_name: 'Recruitment', category: 'Training & Development', allocated_budget: 25000, spent_budget: 26000, status: 'over_budget' },
  ]);

  const [transactions] = useState<Transaction[]>([
    { id: 1, department: 'Software Development', category: 'Equipment & Hardware', amount: 5000, date: '2024-01-15', description: 'New laptops for developers', type: 'expense' },
    { id: 2, department: 'Digital Marketing', category: 'Marketing & Advertising', amount: 12000, date: '2024-01-14', description: 'Q1 campaign launch', type: 'expense' },
    { id: 3, department: 'Software Development', category: 'Software & Licenses', amount: 3500, date: '2024-01-13', description: 'Annual IDE licenses', type: 'expense' },
    { id: 4, department: 'Recruitment', category: 'Training & Development', amount: 2500, date: '2024-01-12', description: 'HR certification program', type: 'expense' },
    { id: 5, department: 'IT Infrastructure', category: 'Utilities & Maintenance', amount: 8000, date: '2024-01-11', description: 'Server maintenance', type: 'expense' },
  ]);

  const [formData, setFormData] = useState<FormData>({
    business_unit: 0,
    department: 0,
    category: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const api = useAxios();  // Read tab from URL when component mounts
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const tabParam = url.searchParams.get('tab');
      
      // Valid tab values
      const validTabs = ['allocations', 'analytics', 'transactions', 'reports'];
      
      // Set active tab if it's valid
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Fetch business units and categories on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch business units
        const businessUnitsResponse = await api.get('/business-units/');
        setBusinessUnits(businessUnitsResponse.data);
        
        // Fetch categories
        const categoriesRes = await api.get("/approval-request-category/");
        if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
          // Extract category names from the response
          const categoryNames = categoriesRes.data.map((cat: {name?: string; category_name?: string}) => 
            cat.name || cat.category_name || '');
          setCategories(categoryNames);
        }      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to load business units and categories. Please try refreshing the page.');
      }
    };
    
    fetchInitialData();
  }, []);

  // Fetch departments when business unit changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!formData.business_unit) {
        setFilteredDepartments([]);
        return;
      }
      
      try {
        const response = await api.get(`/departments/?business_unit=${formData.business_unit}`);
        setFilteredDepartments(response.data);
        setFormData(prev => ({ ...prev, department: 0 }));      } catch (error) {
        console.error('Error fetching departments:', error);
        setFilteredDepartments([]);
        setError('Failed to load departments for the selected business unit.');
      }
    };
    
    fetchDepartments();
  }, [formData.business_unit]);
  const handleSubmit = async () => {
    if (!formData.business_unit || !formData.department || !formData.category || !formData.budget) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      // Prepare data for API
      const allocationData = {
        department: formData.department,
        category: formData.category,
        allocated_budget: parseInt(formData.budget),
        spent_budget: 0,
        status: 'active'
      };

      // NOTE: Uncomment the API call when backend endpoint is ready
      // const response = await api.post('/budget-allocations/', allocationData);
      // const newAllocation = response.data;
      
      // For now, simulate API response
      const departmentName = filteredDepartments.find(d => d.id === formData.department)?.name || '';
      const newAllocation: BudgetAllocation = {
        id: budgetAllocations.length + 1,
        department_id: formData.department,
        department_name: departmentName,
        category: formData.category,
        allocated_budget: parseInt(formData.budget),
        spent_budget: 0,
        status: 'active'
      };

      setBudgetAllocations(prev => [...prev, newAllocation]);
      setFormData({ business_unit: 0, department: 0, category: '', budget: '' });      alert('Budget allocation created successfully!');
    } catch (error) {
      console.error('Error creating budget allocation:', error);
      setError('Failed to create budget allocation. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // Status functions now moved to AllocationList component

  const calculateTotalBudget = () => {
    return budgetAllocations.reduce((sum, allocation) => sum + allocation.allocated_budget, 0);
  };

  const calculateTotalSpent = () => {
    return budgetAllocations.reduce((sum, allocation) => sum + allocation.spent_budget, 0);
  };

  const getDepartmentUsage = (): DepartmentUsage[] => {
    const departmentStats: DepartmentStats = {};
    budgetAllocations.forEach(allocation => {
      if (!departmentStats[allocation.department_name]) {
        departmentStats[allocation.department_name] = {
          allocated: 0,
          spent: 0,
          categories: 0
        };
      }
      departmentStats[allocation.department_name].allocated += allocation.allocated_budget;
      departmentStats[allocation.department_name].spent += allocation.spent_budget;
      departmentStats[allocation.department_name].categories += 1;
    });

    return Object.entries(departmentStats).map(([name, stats]) => ({
      name,
      allocated: stats.allocated,
      spent: stats.spent,
      utilization: (stats.spent / stats.allocated) * 100,
      categories: stats.categories
    }));
  };

  const getCategoryDistribution = (): CategoryDistribution[] => {
    const categoryStats: CategoryStats = {};
    budgetAllocations.forEach(allocation => {
      if (!categoryStats[allocation.category]) {
        categoryStats[allocation.category] = 0;
      }
      categoryStats[allocation.category] += allocation.allocated_budget;
    });

    return Object.entries(categoryStats).map(([name, value]) => ({ name, value }));
  };

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
      <BudgetHeader businessUnits={businessUnits} departments={filteredDepartments} />

      <StatsCards budgetAllocations={budgetAllocations} />
      <TabManager
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allocationsContent={
          <>
            <AllocationForm 
              businessUnits={businessUnits}
              filteredDepartments={filteredDepartments}
              categories={categories}
              formData={formData}
              setFormData={setFormData}
              loading={loading}
              handleSubmit={handleSubmit}
            />
            <AllocationList budgetAllocations={budgetAllocations} />
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
            overBudgetCategories={budgetAllocations
              .filter(a => (a.spent_budget / a.allocated_budget) > 0.8)
              .map(a => ({
                name: a.category,
                allocated: a.allocated_budget,
                spent: a.spent_budget,
                overspend: a.spent_budget - a.allocated_budget
              }))
            } 
          />
        }
      />
    </div>
  );
};

export default BudgetAllocationSystem;