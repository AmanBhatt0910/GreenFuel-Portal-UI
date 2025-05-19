import React, { useMemo } from "react";
import {
  Bookmark,
  CalendarDays,
  CheckCircle,
  Clock,
  Info,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../AssetDetailsTable/AssetDetailsTable";

const formatCurrency = (
  amount: number | string,
  locale = "en-IN",
  currency = "INR"
): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "₹0.00";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(num);
};

interface RequestHeaderProps {
  request: any;
}

const COLORS = {
  primary: {
    light: "#e0f2fe", // Light blue
    medium: "#38bdf8", // Medium blue
    default: "#0284c7", // Default blue
    dark: "#0369a1", // Dark blue
  },
  secondary: {
    light: "#f0fdf4", // Light green
    medium: "#4ade80", // Medium green
    default: "#16a34a", // Default green
    dark: "#166534", // Dark green
  },
  tertiary: {
    light: "#fef3c7", // Light amber
    medium: "#fbbf24", // Medium amber
    default: "#d97706", // Default amber
    dark: "#b45309", // Dark amber
  },
  quaternary: {
    light: "#e0e7ff", // Light indigo
    medium: "#818cf8", // Medium indigo
    default: "#4f46e5", // Default indigo
    dark: "#4338ca", // Dark indigo
  },
  status: {
    pending: { bg: "#fef3c7", text: "#d97706", icon: "#f59e0b" },
    approved: { bg: "#dcfce7", text: "#16a34a", icon: "#22c55e" },
    rejected: { bg: "#fee2e2", text: "#dc2626", icon: "#ef4444" },
    neutral: { bg: "#f3f4f6", text: "#4b5563", icon: "#6b7280" },
  },
};

const StatusBadgeIcon: React.FC<{ status: string }> = React.memo(
  ({ status }) => {
    const badgeInfo = useMemo(() => {
      if (!status) {
        return {
          color: "text-gray-500",
          icon: <Info className="h-4 w-4" />,
          bgColor: "bg-gray-100",
        };
      }

      switch (status.toLowerCase()) {
        case "pending":
          return {
            color: `text-${COLORS.status.pending.text}`,
            icon: (
              <Clock
                className="h-4 w-4"
                style={{ color: COLORS.status.pending.icon }}
              />
            ),
            bgColor: `bg-${COLORS.status.pending.bg}`,
          };
        case "approved":
          return {
            color: `text-${COLORS.status.approved.text}`,
            icon: (
              <CheckCircle
                className="h-4 w-4"
                style={{ color: COLORS.status.approved.icon }}
              />
            ),
            bgColor: `bg-${COLORS.status.approved.bg}`,
          };
        case "rejected":
          return {
            color: `text-${COLORS.status.rejected.text}`,
            icon: (
              <XCircle
                className="h-4 w-4"
                style={{ color: COLORS.status.rejected.icon }}
              />
            ),
            bgColor: `bg-${COLORS.status.rejected.bg}`,
          };
        default:
          return {
            color: `text-${COLORS.status.neutral.text}`,
            icon: (
              <Info
                className="h-4 w-4"
                style={{ color: COLORS.status.neutral.icon }}
              />
            ),
            bgColor: `bg-${COLORS.status.neutral.bg}`,
          };
      }
    }, [status]);

    return (
      <Badge
        className={`px-3 py-1.5 text-sm font-medium ${badgeInfo.bgColor} ${badgeInfo.color} rounded-md shadow-sm`}
      >
        <span className="flex items-center">
          {badgeInfo.icon}
          <span className="ml-1.5">{status}</span>
        </span>
      </Badge>
    );
  }
);

StatusBadgeIcon.displayName = "StatusBadgeIcon";

const RequestHeader: React.FC<RequestHeaderProps> = React.memo(
  ({ request }) => {
    return (
      <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 rounded-xl shadow-md p-6 mb-6 border-l-4 border-indigo-500 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Bookmark className="mr-2 h-6 w-6 text-indigo-600" />
              Budget Request {request.budget_id}
            </h1>
            <div className="flex items-center flex-wrap gap-3">
              <StatusBadgeIcon status={request.current_status} />
              <span className="text-sm text-gray-600 flex items-center bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-200">
                <CalendarDays className="h-4 w-4 mr-1.5 text-indigo-600" />
                {formatDate(request.date)}
              </span>
              <span className="text-md text-gray-600 flex items-center bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-200">
                {/* <IndianRupee className="h-4 w-4 mr-1.5 text-indigo-600" /> */}
                {formatCurrency(request.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

RequestHeader.displayName = "RequestHeader";

export default RequestHeader;
