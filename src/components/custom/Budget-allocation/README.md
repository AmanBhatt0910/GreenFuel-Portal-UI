# Budget Allocation System Components

This document provides an overview of the components created for the Budget Allocation System feature.

## Structure

The Budget Allocation System has been refactored into modular components to improve maintainability and organization:

```
Budget-allocation/
├── types.ts - Type definitions used across components
├── BudgetHeader.tsx - Page header showing business units and departments
├── StatsCards.tsx - Overview statistics cards
├── AllocationForm.tsx - Form for creating new budget allocations
├── AllocationList.tsx - List of current budget allocations with progress indicators
├── AnalyticsCharts.tsx - Charts and visualizations for the analytics tab
├── TransactionList.tsx - Recent transactions list
├── ReportsView.tsx - Reports on department usage and budget alerts
└── TabManager.tsx - Tab navigation component
```

## Component Details

### `types.ts`
Contains all TypeScript interfaces used across the Budget Allocation components:
- `BusinessUnit`: Business unit structure
- `Department`: Department structure
- `BudgetAllocation`: Budget allocation data structure
- `Transaction`: Transaction record structure
- `FormData`: Form data for creating new allocations
- Additional data types for analytics and reporting

### `BudgetHeader.tsx`
Header component displaying the page title and key statistics on business units and departments.

**Props:**
- `businessUnits`: Array of business units
- `departments`: Array of departments

### `StatsCards.tsx`
Displays summary statistics about budget allocations in card format.

**Props:**
- `budgetAllocations`: Array of budget allocations

### `AllocationForm.tsx`
Form component for creating new budget allocations.

**Props:**
- `businessUnits`: Available business units
- `filteredDepartments`: Departments filtered by business unit
- `categories`: Available budget categories
- `formData`: Current form values
- `setFormData`: Function to update form values
- `loading`: Loading state for form submission
- `handleSubmit`: Function to handle form submission

### `AllocationList.tsx`
Displays a list of current budget allocations with progress indicators.

**Props:**
- `budgetAllocations`: Array of budget allocations

### `AnalyticsCharts.tsx`
Visualizes budget data through various charts and graphs.

**Props:**
- `monthlyTrend`: Monthly budget vs. spending data
- `getCategoryDistribution`: Function to get budget distribution by category
- `getDepartmentUsage`: Function to get department usage statistics

### `TransactionList.tsx`
Displays a list of recent transactions.

**Props:**
- `transactions`: Array of transaction records

### `ReportsView.tsx`
Shows budget usage reports and alerts for departments and categories.

**Props:**
- `departmentUsage`: Department usage statistics
- `overBudgetCategories`: Categories that are over or near budget limit

### `TabManager.tsx`
Manages tab navigation and URL synchronization.

**Props:**
- `activeTab`: Currently active tab
- `setActiveTab`: Function to update active tab
- `allocationsContent`: Content for the allocations tab
- `analyticsContent`: Content for the analytics tab
- `transactionsContent`: Content for the transactions tab
- `reportsContent`: Content for the reports tab

## Future Improvements

1. Add loading states for asynchronous operations
2. Implement proper form validation
3. Add pagination for long lists of allocations and transactions
4. Implement filtering and sorting capabilities
5. Add unit tests for components
6. Enhance error handling and user feedback
