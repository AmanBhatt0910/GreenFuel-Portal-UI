// Types for Plant Hierarchy Management

export interface BusinessUnit {
  id?: string | number;
  name: string;
  departments?: Department[];
}

export interface Department {
  id?: string | number;
  name: string;
  business_unit: number;
  approvers?: Approver[];
  designations?: Designation[];
}

export interface Designation {
  id?: string | number;
  name: string;
  department: number;
}

export interface NewBusinessUnit {
  name: string;
}

export interface NewDepartment {
  name: string;
  business_unit: number;
}

export interface NewDesignation {
  name: string;
  department: number;
}

export interface HierarchyItem {
  level: number;
  businessUnitName: string;
  departmentName: string;
  designationName: string;
}

// Common props that will be passed down to child components
export interface BusinessUnitActionsProps {
  businessUnits: BusinessUnit[];
  setBusinessUnits: React.Dispatch<React.SetStateAction<BusinessUnit[]>>;
  activeBusinessUnitId: string | number;
  setActiveBusinessUnitId: React.Dispatch<React.SetStateAction<string | number>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

// Department level props
export interface DepartmentActionsProps extends BusinessUnitActionsProps {
  expandedDepartments: Record<string, boolean>;
  setExpandedDepartments: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

// Designation level props
export interface DesignationActionsProps extends DepartmentActionsProps {
  selectedDepartmentId: string;
  setSelectedDepartmentId: React.Dispatch<React.SetStateAction<string>>;
  setIsAddDesignationDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Helper function to generate unique IDs (for frontend use before API saves)
export const generateId = () => Math.random().toString(36).substr(2, 9);

export interface Approver {
  id?: string | number;
  user: number;
  user_name?: string;
  business_unit: number;
  department: number;
  level: number;
}

export interface NewApprover {
  user: number;
  business_unit: number;
  department: number;
  level: number;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  employee_code?: string;
  department?: number;
  business_unit?: number;
} 