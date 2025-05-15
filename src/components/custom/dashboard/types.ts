// User interface based on provided data
export interface UserInfoType {
  id: number;
  last_login: string | null;
  is_superuser?: boolean;
  username: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_active?: boolean;
  date_joined: string;
  email: string;
  name: string;
  dob: string | null;
  department: number | string | null;
  employee_code: string | null;
  designation: number | string | null;
  groups?: any[];
  user_permissions?: any[];
  // Additional fields from your current data
  contact?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status?: boolean;
  is_budget_requester?: boolean;
  is_deleted?: boolean;
  business_unit?: number | string;
  role?: string;
}

export interface BusinessUnitType {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface DepartmentType {
  id: number;
  name: string;
  code: string;
  business_unit: number;
  description?: string;
}

export interface DesignationType {
  id: number;
  name: string;
  code?: string;
  description?: string;
}

export interface RequestType {
  id: string;
  requester: string;
  department: string;
  category: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

export interface FormDataType {
  name: string;
  created: number;
  approved: number;
  rejected: number;
}

export interface NotificationType {
  id: number;
  message: string;
  time: string;
  read: boolean;
}