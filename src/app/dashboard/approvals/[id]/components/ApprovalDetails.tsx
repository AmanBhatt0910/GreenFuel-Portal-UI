import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { numberToWords } from '@/app/dashboard/approvals/components/utils';
import { InfoIcon, DollarSign, BarChart2 } from 'lucide-react';

interface ApprovalDetailsProps {
  enrichedForm: any;
  loading: boolean;
  assestDetail : any;
}

export default function ApprovalDetails({ enrichedForm, loading , assestDetail}: ApprovalDetailsProps) {

  console.log(assestDetail);

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

  const amountInWords = numberToWords(Number(enrichedForm.total));
  const formattedTotal = enrichedForm.formatted_total || new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(enrichedForm.total));

  return (
    <>
      {/* Financial Information */}
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-1.5" />
        <CardHeader className="bg-green-50 dark:bg-green-900/10 border-b">
          <CardTitle className="text-xl flex items-center text-green-800 dark:text-green-400">
            <DollarSign className="h-5 w-5 mr-2" />
            Financial Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Amount */}
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

            {/* Budget Information */}
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
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Budget Status: Allocated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Within Budget: Yes</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Details */}
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5" />
        <CardHeader className="bg-blue-50 dark:bg-blue-900/10 border-b">
          <CardTitle className="text-xl text-blue-800 dark:text-blue-400">Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Reason */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-base mb-2">Reason for Request</h3>
            <p className="text-foreground">{enrichedForm.reason || "No reason provided"}</p>
          </div>

          {/* Benefit */}
          <div className="p-4 border border-blue-100 dark:border-blue-900/20 rounded-lg bg-blue-50/30 dark:bg-blue-900/5">
            <h3 className="font-semibold text-base mb-2 text-blue-800 dark:text-blue-400">Benefit to Organization</h3>
            <p className="text-foreground">{enrichedForm.benefit_to_organisation || "No benefit information provided"}</p>
          </div>

          {/* Policy Agreement */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-base mb-2">Policy Agreement</h3>
            <p className="text-foreground">
              {enrichedForm.policy_agreement
                ? "User has agreed to the organization's policies regarding this request."
                : "User has NOT agreed to the organization's policies."}
            </p>
          </div>

          {/* Rejection Reason (Conditional) */}
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
