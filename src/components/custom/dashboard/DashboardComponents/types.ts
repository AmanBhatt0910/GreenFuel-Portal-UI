import { UserInfoType } from "@/context/AuthContext";

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

export interface ProfileCardProps {
  userInfo: UserInfoType;
  department: any;
  designation: any;
  businessUnit: any;
}

export type TabType = "weekly" | "monthly" | "yearly";

export interface DataItem {
  name: string;
  created: number;
  approved: number;
  rejected: number;
}

export interface SampleDataType {
  weekly: DataItem[];
  monthly: DataItem[];
  yearly: DataItem[];
}

export const iconVariants = {
  hidden: { opacity: 0, rotate: -10, scale: 0.8 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 10 
    }
  },
  hover: { 
    rotate: 15, 
    scale: 1.2,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 10 
    }
  }
};

export const badgeVariants = {
  inactive: {
    backgroundColor: "rgb(243, 244, 246)",
    color: "rgb(75, 85, 99)",
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  active: {
    backgroundColor: "rgb(209, 250, 229)",
    color: "rgb(6, 95, 70)",
    transition: { 
      duration: 0.3,
      ease: "easeInOut" 
    }
  },
  budget: {
    backgroundColor: "rgb(224, 231, 255)",
    color: "rgb(67, 56, 202)",
    transition: { 
      duration: 0.3,
      ease: "easeInOut" 
    }
  },
  noBudget: {
    backgroundColor: "rgb(254, 242, 242)",
    color: "rgb(153, 27, 27)",
    transition: { 
      duration: 0.3,
      ease: "easeInOut" 
    }
  }
};

export const pulseBadge = {
  pulse: {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 0 0 rgba(79, 70, 229, 0)",
      "0 0 0 8px rgba(79, 70, 229, 0.2)",
      "0 0 0 0 rgba(79, 70, 229, 0)"
    ],
    transition: {
      repeat: Infinity,
      repeatType: "loop" as "loop",
      duration: 2,
      ease: "easeInOut"
    }
  }
};

export const cardVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 15 
    }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    },
  },
};

export const tableRowVariants = {
  hidden: { opacity: 0, x: -30, height: 0 },
  visible: {
    opacity: 1,
    x: 0,
    height: "auto",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 0.8
    },
  },
  hover: {
    backgroundColor: "rgba(243, 244, 246, 0.7)",
    transition: { duration: 0.2 }
  }
};

export const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 15 
    }
  },
  hover: { 
    scale: 1.05,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 } 
  }
};
