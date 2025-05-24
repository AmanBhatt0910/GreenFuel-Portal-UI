import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from '@/app/dashboard/approvals/components/utils';
import { Clock, Landmark, Calendar, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ApprovalHeaderProps {
  enrichedForm: any;
  loading: boolean;
}

// Utility to get status color classes
const getStatusClasses = (status: string | undefined) => {
  const lowerStatus = status?.toLowerCase();
  switch (lowerStatus) {
    case 'approved':
      return {
        bar: 'bg-green-500',
        badge: 'bg-green-100 hover:bg-green-100/90 text-green-800 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40',
        icon: <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
      };
    case 'rejected':
      return {
        bar: 'bg-red-500',
        badge: 'bg-red-100 hover:bg-red-100/90 text-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/40',
        icon: <XCircle className="h-4 w-4 mr-2 text-red-500" />
      };
    default:
      return {
        bar: 'bg-amber-500',
        badge: 'bg-amber-100 hover:bg-amber-100/90 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/40',
        icon: <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
      };
  }
};

export default function ApprovalHeader({ enrichedForm, loading }: ApprovalHeaderProps) {
  if (loading || !enrichedForm) {
    return (
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const status = enrichedForm.status || 'Pending';
  const statusClasses = getStatusClasses(status);

  const formattedDate =
    enrichedForm.submission_date ? formatDate(enrichedForm.submission_date) :
    enrichedForm.date ? formatDate(enrichedForm.date) :
    enrichedForm.formatted_date ? formatDate(enrichedForm.formatted_date) :
    enrichedForm.created_at ? formatDate(enrichedForm.created_at) :
    "Recently submitted";

  const processingTime =
    enrichedForm.processing_time ||
    (enrichedForm.submission_date ? "Processing" : "Awaiting processing");

  return (
    <Card className="mb-6 overflow-hidden">
      {/* Status Indicator Bar */}
      <div className={`h-1.5 ${statusClasses.bar}`} />

      <CardContent className="py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold leading-tight">
            {enrichedForm.title || `Request #${enrichedForm.id}`}
          </h2>
          <Badge
            variant={
              status.toLowerCase() === 'approved'
                ? 'secondary'
                : status.toLowerCase() === 'rejected'
                  ? 'destructive'
                  : 'default'
            }
            className={`text-sm py-1 px-3 flex items-center ${statusClasses.badge}`}
          >
            {statusClasses.icon}
            {status}
          </Badge>
        </div>

        {/* Details Section */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Landmark className="h-4 w-4 mr-2 text-blue-500" />
            <span>
              Department: <span className="font-medium">{enrichedForm.department_name || "Unknown"}</span>
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-green-500" />
            <span>
              Submitted: <span className="font-medium">{formattedDate}</span>
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-indigo-500" />
            <span>
              Processing Time: <span className="font-medium">{processingTime}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}