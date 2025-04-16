export interface User {
  id: number;
  name: string;
  email?: string;
}

export interface BusinessUnit {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  business_unit: number;
}

export interface Approver {
  id?: number;
  user: number;
  business_unit: number;
  department: number;
  level: number;
  user_details?: User;
  business_unit_details?: BusinessUnit;
  department_details?: Department;
}
