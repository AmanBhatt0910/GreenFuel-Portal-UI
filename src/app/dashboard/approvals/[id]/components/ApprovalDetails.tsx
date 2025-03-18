import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { numberToWords } from '@/app/dashboard/approvals/components/utils';
import { InfoIcon, DollarSign, BarChart2 } from 'lucide-react';

/**
 * ApprovalDetails Component
 * 
 * This component displays the detailed information about an approval request,
 * focusing on financial data and request-specific information.
 * 
 * Features:
 * - Displays financial information with amount in numbers and words
 * - Shows budget information and allocation status
 * - Presents request reasons, benefits to organization
 * - Displays policy agreement status
 * - Shows rejection reason if applicable
 * - Uses visually distinct sections for different types of information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.enrichedForm - The enhanced form data with all details
 * @param {boolean} props.loading - Whether data is still loading
 */
interface ApprovalDetailsProps {
  enrichedForm: any;
  loading: boolean;
}

export default function ApprovalDetails({ enrichedForm, loading }: ApprovalDetailsProps) {
  // Display a skeleton loading state when data is being fetched
  if (loading || !enrichedForm) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format financial information for display
  // Calculate amount in words for better readability and verification
  const amountInWords = numberToWords(Number(enrichedForm.total));
  const formattedTotal = enrichedForm.formatted_total || new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(enrichedForm.total));

  return (
    <>
      {/* Financial Information Section */}
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-1.5"></div>
        <CardHeader className="bg-green-50 dark:bg-green-900/10 border-b">
          <CardTitle className="text-xl flex items-center text-green-800 dark:text-green-400">
            <DollarSign className="h-5 w-5 mr-2" />
            Financial Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Amount Section */}
            <div className="p-4 border border-green-100 dark:border-green-900/20 rounded-lg bg-green-50/50 dark:bg-green-900/5">
              <h3 className="font-semibold text-base mb-2 flex items-center text-green-700 dark:text-green-400">
                <BarChart2 className="h-4 w-4 mr-2" />
                Total Amount
              </h3>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">{formattedTotal}</p>
              <p className="text-sm text-green-600/70 dark:text-green-500/70 mt-2 italic">
                {amountInWords} Rupees Only
              </p>
            </div>
            {/* Budget Information Section */}
            <div className="p-4 border border-blue-100 dark:border-blue-900/20 rounded-lg bg-blue-50/50 dark:bg-blue-900/5">
              <h3 className="font-semibold text-base mb-2 flex items-center text-blue-700 dark:text-blue-400">
                <InfoIcon className="h-4 w-4 mr-2" />
                Budget Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Budget ID:</span>
                  <p className="text-lg font-semibold">{enrichedForm.budget_id || "Not specified"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Budget Status: Allocated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Within Budget: Yes</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Details Section */}
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5"></div>
        <CardHeader className="bg-blue-50 dark:bg-blue-900/10 border-b">
          <CardTitle className="text-xl text-blue-800 dark:text-blue-400">Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Reason Section - Why the request was made */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-base mb-2">Reason for Request</h3>
            <p className="text-foreground">{enrichedForm.reason || "No reason provided"}</p>
          </div>
          
          {/* Benefit Section - Business value/justification */}
          <div className="p-4 border border-blue-100 dark:border-blue-900/20 rounded-lg bg-blue-50/30 dark:bg-blue-900/5">
            <h3 className="font-semibold text-base mb-2 text-blue-800 dark:text-blue-400">Benefit to Organization</h3>
            <p className="text-foreground">{enrichedForm.benefit_to_organisation || "No benefit information provided"}</p>
          </div>
          
          {/* Policy Agreement Section - Compliance confirmation */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-base mb-2">Policy Agreement</h3>
            <p className="text-foreground">
              {enrichedForm.policy_agreement 
                ? "User has agreed to the organization's policies regarding this request." 
                : "User has NOT agreed to the organization's policies."}
            </p>
          </div>
          
          {/* Rejection Reason - Only shown if request was rejected */}
          {enrichedForm.rejected && (
            <div className="p-4 border border-red-200 dark:border-red-900/30 rounded-lg bg-red-50/50 dark:bg-red-900/5">
              <h3 className="font-semibold text-base mb-2 text-red-700 dark:text-red-400">Rejection Reason</h3>
              <p className="text-red-700 dark:text-red-400">{enrichedForm.rejection_reason || "No reason provided"}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
} 