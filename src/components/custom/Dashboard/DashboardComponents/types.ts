// Types for the dashboard components
export interface FormStat {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  weekChange: number;
}

export interface WeeklyDataPoint {
  name: string;
  submitted: number;
  approved: number;
  rejected: number;
}

export interface StatusLevel {
  name: string;
  approved: number;
  pending: number;
  rejected: number;
}

export interface RecentForm {
  id: string;
  submitter: string;
  department: string;
  status: string;
  level: number;
  updatedAt: string;
}

export interface DashboardHeaderProps {
  currentDate: string;
  onRefresh: () => void;
}

export interface WeeklyActivityChartProps {
  data: WeeklyDataPoint[];
  isLoaded: boolean;
}

export interface ApprovalStatusChartProps {
  data: StatusLevel[];
  isLoaded: boolean;
}

export interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  change?: number;
  valueColor?: string;
  icon: React.ReactNode;
  isLoaded: boolean;
}
