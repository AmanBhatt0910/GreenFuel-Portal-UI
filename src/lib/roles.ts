export type RoleType = "ADMIN" | "APPROVER" | "MD" | "EMPLOYEE" | "all";

export interface Role {
  id: string;
  name: string;
}

export interface UserData {
  id: number;
  last_login: string;
  username: string;
  is_staff: boolean;
  date_joined: string;
  email: string;
  name: string;
  dob: string;
  employee_code: string;
  contact: string;
  address: string;
  city: string;
  state: string;
  country: string;
  role: RoleType;
  status: boolean;
  is_budget_requester: boolean;
  is_deleted: boolean;
  business_unit: string | null;
  department: string | null;
  designation: string | null;
}

export const ROLES: Role[] = [
  { id: "ADMIN", name: "ADMIN" },
  { id: "APPROVER", name: "APPROVER" },
  { id: "MD", name: "MD" },
  { id: "EMPLOYEE", name: "EMPLOYEE" }
];

export const roleProtectedRoutes: { [key: string]: RoleType[] } = {
  // "/dashboard": ["ADMIN", "APPROVER", "MD", "EMPLOYEE"],
  "/dashboard/approvals": ["APPROVER", "ADMIN"],
  "/dashboard/form": ["APPROVER","EMPLOYEE"],
  "/dashboard/requests": ["APPROVER", "ADMIN","EMPLOYEE"],
  "/dashboard/credentials": ["ADMIN", "MD"],
  "/dashboard/business-units": ["ADMIN", "MD"],
  "/dashboard/category-management": ["ADMIN", "MD"],
  "/dashboard/approval-access": ["ADMIN", "MD"],
  "/dashboard/manage-md": ["ADMIN"], 
};


// Helper function to check if a user has access to a specific route
export const hasRouteAccess = (pathname: string, userRole: RoleType): boolean => {
  for (const route in roleProtectedRoutes) {
    if (pathname.startsWith(route)) {
      const allowedRoles = roleProtectedRoutes[route];
      return allowedRoles.includes(userRole);
    }
  }
  return true; // If route is not protected, allow access
};

export default ROLES;