import React from 'react';
import { ApprovalForm } from './interfaces';

interface EnrichedApprovalForm extends ApprovalForm {
  user_name?: string;
  user_email?: string;
  department_name?: string;
  formatted_date?: string;
}

interface ApprovalHeaderProps {
  forms: EnrichedApprovalForm[];
}

export default function ApprovalHeader({ forms }: ApprovalHeaderProps) {
  const pendingCount = forms.filter(f => f.status.toLowerCase() === "pending").length;
  const approvedCount = forms.filter(f => f.status.toLowerCase() === "approved").length;
  const rejectedCount = forms.filter(f => f.status.toLowerCase() === "rejected").length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Approval Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage request approvals and feedback</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4 lg:mt-0">
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {pendingCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Pending</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {approvedCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Approved</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {rejectedCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Rejected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 