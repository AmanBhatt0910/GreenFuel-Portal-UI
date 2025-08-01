export interface BudgetRequest {
  id: number;
  budget_id: string;
  date: string;
  total: string;
  reason: string;
  policy_agreement: boolean;
  current_status: string;
  benefit_to_organisation: string;
  payback_period: string;
  document_enclosed_summary: string;
  approval_category: string;
  current_level: number;
  max_level: number;
  rejected: boolean;
  rejection_reason: string | null;
  user: number;
  business_unit: number;
  department: number;
  designation: number;
  initiate_dept: number | null;
  notify_to: number;
}

export interface ApprovalLevel {
  level: number;
  title: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  comments: string | null;
}

export interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  url: string;
}

export interface ApiDocument {
  id: number;
  url: string;
  type: string;
  uploaded_at: string;
  file: string;
}

export interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  read : string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  approval_level: number;
  designation: number;
}

export interface StatusBadge {
  color: string;
  icon: React.ReactNode;
  bgColor: string;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  timestamp: string;
  fromLevel: number;
  toLevel: number;
}

export interface EntityInfo {
  id: number;
  name: string;
}

export interface Designation extends EntityInfo {
  level: number;
  department_name?: string;
  department?: number;
}