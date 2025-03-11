export interface Credential {
  id: number;
  username: string;
  email: string;
  name?: string;
  employee_code?: string;
  department: number | null; // Ensure this is number | null, not string | null
  designation: number | null; // Ensure this is number | null, not string | null
  business_unit: number | null; // Ensure this is number | null, not string | null
  status?: boolean;
  dob?: string | null;
  contact?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
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

export interface Designation {
  id: number;
  name: string;
  department: number;
}

export interface Role {
  id: string;
  name: string;
}

export interface CredentialFormData {
  username: string;
  email: string;
  name: string;
  employee_code?: string;
  department: number | null;
  designation: number | null;
  business_unit: number | null;
  status?: boolean;
  dob?: string | null;
  contact?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  first_name: string;
  last_name: string;
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
  businessUnits: BusinessUnit[];
  designations: Designation[];
  isLoading: boolean;
}

export interface CredentialDetailsProps {
  selectedUser: Credential | null;
  onClose: () => void;
  onEdit: (user: Credential) => void;
  onReset: (email: string) => void;
  designations : Designation[];
  departments : Department[];
  businessUnits : BusinessUnit[];
}

export interface CredentialTableProps {
  credentials: Credential[];
  onEdit: (user: Credential) => void;
  onDelete: (id: number) => void;
  designations : Designation[];
  departments : Department[];
  businessUnits : BusinessUnit[];
  onView: (user: Credential) => void;
  onResetPassword: (email: string) => void;
  filter?: {
    searchValue?: string;
    department?: string;
    designation?: string;

    business_unit?: string;
    role?: string;
    status?: boolean;
  };
  isLoading: boolean;
}

export interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userId?: number | null;
  isLoading: boolean;
}

export interface CredentialFilter {
  searchValue: string;
  department: string;
  business_unit: string;
  role: string;
  status: string;
}

export interface CredentialStatsProps {
  credentials: Credential[];
}

export interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
}