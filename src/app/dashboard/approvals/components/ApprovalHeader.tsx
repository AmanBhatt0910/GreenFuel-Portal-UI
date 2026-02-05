import { useMemo } from "react";
import { EnrichedApprovalForm } from "./interfaces";
import { Clock, CheckCircle, XCircle, FileText } from "lucide-react";

interface ApprovalHeaderProps {
  forms: EnrichedApprovalForm[];
}

export default function ApprovalHeader({ forms }: ApprovalHeaderProps) {
  const { pendingCount, approvedCount, rejectedCount, totalCount } =
    useMemo(() => {
      return {
        pendingCount: forms.filter((f) => f.status.toLowerCase() === "pending")
          .length,
        approvedCount: forms.filter(
          (f) => f.status.toLowerCase() === "approved",
        ).length,
        rejectedCount: forms.filter(
          (f) => f.status.toLowerCase() === "rejected",
        ).length,
        totalCount: forms.length,
      };
    }, [forms]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Approval Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage request approvals and feedback
            </p>
          </div>

          {/* Compact Stats */}
          <div className="flex items-center gap-4">
            {/* Total */}
            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-3 min-w-[80px] h-[60px] flex items-center gap-3">
              <div className="p-1.5 bg-gray-100 dark:bg-gray-600 rounded-md">
                <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {totalCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3 min-w-[80px] h-[60px] flex items-center gap-3">
              <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                  {pendingCount}
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400">
                  Pending
                </div>
              </div>
            </div>

            {/* Approved */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg p-3 min-w-[80px] h-[60px] flex items-center gap-3">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                  {approvedCount}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  Approved
                </div>
              </div>
            </div>

            {/* Rejected */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-3 min-w-[80px] h-[60px] flex items-center gap-3">
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-md">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-red-700 dark:text-red-300">
                  {rejectedCount}
                </div>
                <div className="text-xs text-red-600 dark:text-red-400">
                  Rejected
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
