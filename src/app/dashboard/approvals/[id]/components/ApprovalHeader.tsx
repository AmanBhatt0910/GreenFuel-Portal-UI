import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from '@/app/dashboard/approvals/components/utils';
import { Clock, Landmark, Calendar, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

/**
 * ApprovalHeader Component
 * 
 * This component displays the header section of the approval details page,
 * showing key information about the approval request in a concise format.
 * 
 * Features:
 * - Shows the approval request title/ID
 * - Displays the current status with appropriate visual indicators
 * - Shows submission date and processing time
 * - Provides department information
 * - Uses color-coded badges to indicate status (approved, rejected, pending)
 * 
 * @param {Object} props - Component props
 * @param {Object} props.enrichedForm - The enhanced form data with all details
 * @param {boolean} props.loading - Whether data is still loading
 */
interface ApprovalHeaderProps {
  enrichedForm: any;
  loading: boolean;
}

export default function ApprovalHeader({ enrichedForm, loading }: ApprovalHeaderProps) {
  // Display a skeleton loading state when data is being fetched
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

  /**
   * Get the appropriate status icon based on status value
   * @param {string} status - The current status (approved, rejected, pending)
   * @returns {JSX.Element} The icon component with appropriate styling
   */
  const getStatusIcon = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === 'approved') return <CheckCircle className="h-4 w-4 mr-2 text-green-500" />;
    if (lowerStatus === 'rejected') return <XCircle className="h-4 w-4 mr-2 text-red-500" />;
    return <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />;
  };

  // Display formatted date, use fallbacks if missing
  const formattedDate = enrichedForm.submission_date 
    ? formatDate(enrichedForm.submission_date)
    : enrichedForm.date 
      ? formatDate(enrichedForm.date)
      : enrichedForm.formatted_date || enrichedForm.created_at 
        ? formatDate(enrichedForm.created_at)
        : "Recently submitted";

  // Get processing time with fallback
  const processingTime = enrichedForm.processing_time || 
    (enrichedForm.submission_date ? "Processing" : "Awaiting processing");

  return (
    <Card className="mb-6 overflow-hidden">
      {/* Status indicator bar */}
      <div className={`h-1.5 ${
        enrichedForm.status?.toLowerCase() === 'approved' 
          ? 'bg-green-500' 
          : enrichedForm.status?.toLowerCase() === 'rejected'
            ? 'bg-red-500' 
            : 'bg-amber-500'
      }`}></div>
      <CardContent className="py-6">
        {/* Title and status section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold leading-tight">
            {enrichedForm.title || `Request #${enrichedForm.id}`}
          </h2>
          <div className="flex items-center">
            <Badge 
              variant={
                enrichedForm.status?.toLowerCase() === 'approved' 
                  ? 'secondary' 
                  : enrichedForm.status?.toLowerCase() === 'rejected'
                    ? 'destructive'
                    : 'default'
              }
              className={`text-sm py-1 px-3 flex items-center ${
                enrichedForm.status?.toLowerCase() === 'approved' 
                  ? 'bg-green-100 hover:bg-green-100/90 text-green-800 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40'
                  : enrichedForm.status?.toLowerCase() === 'pending'
                    ? 'bg-amber-100 hover:bg-amber-100/90 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/40'
                    : ''
              }`}
            >
              {getStatusIcon(enrichedForm.status)}
              {enrichedForm.status || "Unknown"}
            </Badge>
          </div>
        </div>
        
        {/* Additional information section with icons */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Landmark className="h-4 w-4 mr-2 text-blue-500" />
            <span>Department: <span className="font-medium">{enrichedForm.department_name || "Unknown"}</span></span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-green-500" />
            <span>Submitted: <span className="font-medium">{formattedDate}</span></span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-indigo-500" />
            <span>Processing Time: <span className="font-medium">{processingTime}</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 