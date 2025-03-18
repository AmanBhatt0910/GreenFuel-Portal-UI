import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ApprovalForm, EnrichedApprovalForm } from './interfaces';
import { getStatusColor, formatDate } from './utils';

interface ApprovalListProps {
  forms: EnrichedApprovalForm[];
  onViewDetails: (id: string) => void;
}

export default function ApprovalList({ forms, onViewDetails }: ApprovalListProps) {
  // Define a helper function to render the status icon
  const renderStatusIcon = (status: string) => {
    if (status.toLowerCase() === 'approved') {
      return <span className="w-4 h-4 mr-1 text-green-600">✓</span>;
    } else if (status.toLowerCase() === 'rejected') {
      return <span className="w-4 h-4 mr-1 text-red-600">✗</span>;
    } else if (status.toLowerCase() === 'pending') {
      return <span className="w-4 h-4 mr-1 text-yellow-600">⏱</span>;
    }
    return null;
  };

  return (
    <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
      {forms.map((form) => (
        <div 
          key={form.id}
          className="py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
          onClick={() => onViewDetails(form.id)}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {form.id}
              </div>
              <div className="mt-1">
                <div className="text-sm font-medium">{form.user_name || form.user}</div>
                <div className="text-xs text-gray-500">{form.user_email || "No email available"}</div>
                <div className="text-xs text-gray-500 mt-1">{form.department_name || form.department}</div>
              </div>
            </div>
            <Badge
              className={`${getStatusColor(form.status)} flex items-center px-2 py-0.5`}
            >
              {renderStatusIcon(form.status)}
              {form.status}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500">
              <div>{form.approval_category}</div>
              <div className="text-xs text-gray-400 mt-1">{form.formatted_date || formatDate(form.date)}</div>
            </div>
            <div className="flex items-center text-blue-600">
              <span className="mr-1">View details</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 