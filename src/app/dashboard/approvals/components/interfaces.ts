// User information
export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

// Department information
export interface Department {
  id: number;
  name: string;
}

// Business Unit information
export interface BusinessUnit {
  id: number;
  name: string;
}

// Designation information
export interface Designation {
  id: number;
  name: string;
}

// Approval Form
export interface ApprovalForm {
  id: string;
  user: string | number;
  business_unit: string | number;
  department: string | number;
  designation: string | number;
  date: string;
  total: number;
  reason: string;
  policy_agreement: boolean;
  initiate_dept: string | number;
  status: string;
  benefit_to_organisation: string;
  approval_category: string;
  approval_type: string;
  notify_to: string | number;
  current_level: number;
  max_level: number;
  rejected: boolean;
  rejection_reason: string | null;
  budget_id: string;
}

// Enriched Approval Form with additional display properties
export interface EnrichedApprovalForm extends ApprovalForm {
  user_name?: string;
  user_email?: string;
  department_name?: string;
  business_unit_name?: string;
  designation_name?: string;
  formatted_date?: string;
  formatted_total?: string;
}

// Comment
export interface Comment {
  id: number;
  user: string;
  userRole?: string;
  userInitials?: string;
  text: string;
  timestamp: string;
  read?: string;
  author?: string; // For backward compatibility
}

// Chat Room
export interface ChatRoom {
  id: string;
  user1: number; // requester
  user2: number; // approver
}

// Chat Message
export interface ChatMessage {
  id: string;
  chatroom: string;
  sender: number;
  message: string;
  timestamp: string;
  read: boolean;
}

// Cache interfaces
export interface UserCache {
  [key: string]: UserInfo;
}

export interface DepartmentCache {
  [key: string]: Department;
}

export interface BusinessUnitCache {
  [key: string]: BusinessUnit;
}

export interface DesignationCache {
  [key: string]: Designation;
}

// Filter options
export interface FilterOptions {
  status: string[];
  category: string[];
  type: string[];
  department: string[];
}

// Approval Filter State
export interface ApprovalFilterState {
  status: string | null;
  category: string | null;
  type: string | null;
  department: string | null;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  search: string;
} 