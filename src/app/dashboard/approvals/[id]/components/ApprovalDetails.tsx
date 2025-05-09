import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { numberToWords } from '@/app/dashboard/approvals/components/utils';
import { InfoIcon, BarChart2, Package, IndianRupee, Calendar, FileText, Activity, Target } from 'lucide-react';
import AssetDetailsTable from '@/app/dashboard/approvals/components/AssetDetailsTable';

interface ApprovalDetailsProps {
  enrichedForm: any;
  loading: boolean;
  assestDetail: any;
}

export default function ApprovalDetails({ enrichedForm, loading, assestDetail}: ApprovalDetailsProps) {
  console.log(enrichedForm);

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
            <IndianRupee className="h-5 w-5 mr-2" />
            Budget Information
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
              <p className="text-sm font-semibold text-green-600/80 dark:text-green-500/70 mt-2 italic">
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
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Approval Category:</span>
                  <p className="text-lg font-semibold">{enrichedForm.approval_category || "Not specified"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Approval Type:</span>
                  <p className="text-lg font-semibold">{enrichedForm.approval_type || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payback Period */}
          {enrichedForm.payback_period && (
            <div className="p-4 border border-amber-100 dark:border-amber-900/20 rounded-lg bg-amber-50/50 dark:bg-amber-900/5">
              <h3 className="font-semibold text-base mb-2 flex items-center text-amber-700 dark:text-amber-400">
                <Target className="h-4 w-4 mr-2" />
                Payback Period
              </h3>
              <p className="text-lg font-semibold">{enrichedForm.payback_period}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assets Details */}
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-1.5" />
        <CardHeader className="bg-purple-50 dark:bg-purple-900/10 border-b">
          <CardTitle className="text-xl flex items-center text-purple-800 dark:text-purple-400">
            <Package className="h-5 w-5 mr-2" />
            Asset Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <AssetDetailsTable 
            assets={Array.isArray(assestDetail) ? assestDetail : assestDetail ? [assestDetail] : []} 
            isLoading={loading} 
          />
        </CardContent>
      </Card>

      {/* Request Details */}
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5" />
        <CardHeader className="bg-blue-50 dark:bg-blue-900/10 border-b">
          <CardTitle className="text-xl text-blue-800 dark:text-blue-400">Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Request Date */}
          {/* <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-base mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Request Date
            </h3>
            <p className="text-foreground">{formatDate(enrichedForm.date)}</p>
          </div> */}
          
          {/* Current Status */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-base mb-2 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Current Status
            </h3>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${
                enrichedForm.status === 'approved' ? 'bg-green-500' : 
                enrichedForm.status === 'pending' ? 'bg-amber-500' : 
                'bg-red-500'
              }`} />
              <span className={`font-medium ${
                enrichedForm.status === 'approved' ? 'text-green-700 dark:text-green-400' : 
                enrichedForm.status === 'pending' ? 'text-amber-700 dark:text-amber-400' : 
                'text-red-700 dark:text-red-400'
              }`}>
                {enrichedForm.current_status || enrichedForm.status.charAt(0).toUpperCase() + enrichedForm.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Approval Level: {enrichedForm.current_form_level} of {enrichedForm.form_max_level}
            </p>
          </div>

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
          
          {/* Document Enclosed Summary */}
          {enrichedForm.document_enclosed_summary && (
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold text-base mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Document Enclosed Summary
              </h3>
              <p className="text-foreground">{enrichedForm.document_enclosed_summary}</p>
            </div>
          )}

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
          {enrichedForm.rejected && enrichedForm.rejection_reason && enrichedForm.rejection_reason !== "null" && (
            <div className="p-4 border border-red-200 dark:border-red-900/30 rounded-lg bg-red-50/50 dark:bg-red-900/5">
              <h3 className="font-semibold text-base mb-2 text-red-700 dark:text-red-400">Rejection Reason</h3>
              <p className="text-red-700 dark:text-red-400">{enrichedForm.rejection_reason}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}