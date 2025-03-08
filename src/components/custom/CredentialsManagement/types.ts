export interface Credential {
  id: number;
  password: string;
  last_login: string | null;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  email: string;
  name: string;
  dob: string | null;
  employee_code: string ;
  department: string | null;
  contact: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  status: boolean;
  designation: string | null;
  business_unit: string | null;
  groups: any[];
  user_permissions: any[];
}

export interface Department {
  id: string;
  name: string;
}

export interface BusinessUnit {
  id: number;
  name: string;
}

export interface Designation {
  id: number;
  name: string;
  business_unit_name:string
}

export interface Role {
  id: string;
  name: string;
}

export interface CredentialFormData {
  username: string;
  email: string;
  name: string;
  employee_code: string;
  department: string | null;
  designation: string | null;
  business_unit: string | null;
  status: boolean;
  dob: string | null;
  first_name: string;
  last_name: string;
  contact: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface CredentialFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: Credential | null;
  onSubmit: (formData: CredentialFormData) => void;
  departments: Department[];
  businessUnits?: BusinessUnit[];
  designations?: Designation[];
}

export interface CredentialDetailsProps {
  selectedUser: Credential | null;
  onClose: () => void;
  onEdit: (user: Credential) => void;
  onReset: (id: number) => void;
}

export interface CredentialTableProps {
  credentials: Credential[];
  onEdit: (user: Credential) => void;
  onDelete: (id: number) => void;
  designations : Designation[];
  businessUnits : BusinessUnit[];
  onView: (user: Credential) => void;
  onResetPassword: (id: number) => void;
  filter?: {
    searchValue?: string;
    department?: string;
    business_unit?: string;
    role?: string;
    status?: boolean;
  };
}

export interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userId?: number | null;
}

export interface CredentialFilterProps {
  onFilterChange: (name: string, value: string | boolean) => void;
  departments: Department[];
  businessUnits?: BusinessUnit[];
  roles: Role[];
  searchValue?: string;
  department?: string;
  business_unit?: string;
  role?: string;
  status?: boolean;
}

export interface CredentialStatsProps {
  credentials: Credential[];
}