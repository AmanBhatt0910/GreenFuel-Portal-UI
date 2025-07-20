import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ApprovalForm, EnrichedApprovalForm } from './interfaces';
import { getStatusColor, formatDate } from './utils';

interface ApprovalTableProps {
  forms: EnrichedApprovalForm[];
  onViewDetails: (id: string) => void;
}

export default function ApprovalTable({ forms, onViewDetails }: ApprovalTableProps) {
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
    <div className="hidden md:block overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800/50">
            <TableHead className="w-[130px]">Budget ID</TableHead>
            <TableHead className="w-[220px]">Requester</TableHead>
            <TableHead className="w-[180px]">Department</TableHead>
            <TableHead className="w-[150px]">Category</TableHead>
            <TableHead className="w-[180px]">Date</TableHead>
            <TableHead className="w-[110px]">Status</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <TableRow
              key={form.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <TableCell className="font-medium text-gray-900 dark:text-white">
                {form.budget_id || form.id}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-gray-900 dark:text-white">{form.user_name || form.user}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">{form.user_email || "No email available"}</div>
                </div>
              </TableCell>
              <TableCell>{form.department_name || form.department}</TableCell>
              <TableCell>{form.approval_category}</TableCell>
              <TableCell>{form.formatted_date || formatDate(form.date)}</TableCell>
              <TableCell>
                <Badge
                  className={`${getStatusColor(
                    form.status
                  )} flex w-fit items-center px-2 py-0.5`}
                >
                  {renderStatusIcon(form.status)}
                  {form.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-900/30 dark:hover:bg-blue-900/20"
                  onClick={() => onViewDetails(form.id)}
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 