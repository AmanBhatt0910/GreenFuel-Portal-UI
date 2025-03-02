// Credential management types
export interface Credential {
  id: string;
  name: string;
  email: string;
  employeeCode: string;
  department: string;
  designation: string;
  role: string;
  status: string;
  joiningDate: string;
  dob?: string;
  contactNumber?: string;
  emergencyContact?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  notes?: string;
  reportingManager?: string;
  lastLogin?: string;
  lastModified?: string;
  modifiedBy?: string;
  accessLevel?: number;
  permissions?: string[];
  teamMembers?: number;
  profileImage?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

export interface CredentialFormData {
  name: string;
  email: string;
  employeeCode: string;
  department: string;
  designation: string;
  role: string;
  status: string;
  joiningDate: string;
  dob: string;
  contactNumber: string;
  emergencyContact: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  notes: string;
  reportingManager: string;
}

export interface CredentialFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: Credential | null;
  onSubmit: (formData: CredentialFormData) => void;
  departments: Department[];
  roles: Role[];
}

export interface CredentialDetailsProps {
  selectedUser: Credential | null;
  onClose: () => void;
  onEdit: (user: Credential) => void;
  onReset: (id: string) => void;
}

export interface CredentialTableProps {
  credentials: Credential[];
  onEdit: (user: Credential) => void;
  onDelete: (id: string) => void;
  onView: (user: Credential) => void;
  onResetPassword: (id: string) => void;
  filter?: {
    searchValue?: string;
    department?: string;
    role?: string;
    status?: string;
  };
}

export interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userId?: string | null;
}

export interface CredentialFilterProps {
  onFilterChange: (name: string, value: string) => void;
  departments: Department[];
  roles: Role[];
  searchValue?: string;
  department?: string;
  role?: string;
  status?: string;
}

export interface CredentialStatsProps {
  credentials: Credential[];
}
