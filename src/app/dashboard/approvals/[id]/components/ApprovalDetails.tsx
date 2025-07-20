import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { numberToWords } from '@/app/dashboard/approvals/components/utils';
import { InfoIcon, BarChart2, Package, IndianRupee, Calendar, FileText, Activity, Target, Download, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import AssetDetailsTable from '@/app/dashboard/approvals/components/AssetDetailsTable';

interface ApprovalDetailsProps {
  enrichedForm: any;
  loading: boolean;
  assestDetail: any;
  attachments?: any[];
  showOnlyDetails?: boolean;
  showOnlyAssets?: boolean;
  showOnlyAttachments?: boolean;
}

export default function ApprovalDetails({ 
  enrichedForm, 
  loading, 
  assestDetail, 
  attachments,
  showOnlyDetails = false,
  showOnlyAssets = false,
  showOnlyAttachments = false
}: ApprovalDetailsProps) {
  console.log('ApprovalDetails - enrichedForm:', enrichedForm);
  console.log('ApprovalDetails - attachments:', attachments);

  const handleDownload = async (attachment: any) => {
    try {
      const fileUrl = attachment.file || attachment.upload_url;
      
      if (!fileUrl) {
        console.error('No file URL available for this attachment');
        return;
      }

      const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}${fileUrl}`;

      const link = document.createElement('a');
      
      const pathParts = fileUrl.split('/');
      const filename = pathParts[pathParts.length - 1] || attachment.original_name || attachment.name || 'document';
      
      try {
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(blobUrl);
      } catch (fetchError) {
        console.error('Fetch failed, trying direct download:', fetchError);
        link.href = fullUrl;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

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
      {/* Financial Information - Show only in Details tab */}
      {(showOnlyDetails || (!showOnlyDetails && !showOnlyAssets && !showOnlyAttachments)) && (
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-1.5" />
          <CardHeader className="bg-green-50 dark:bg-green-900/10 border-b">
            <CardTitle className="text-xl flex items-center text-green-800 dark:text-green-400">
              <IndianRupee className="h-5 w-5 mr-2" />
              Budget Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Amount - Compact */}
              <div className="p-3 border border-green-100 dark:border-green-900/20 rounded-lg bg-green-50/50 dark:bg-green-900/5">
                <h3 className="font-medium text-sm mb-1 flex items-center text-green-700 dark:text-green-400">
                  <BarChart2 className="h-3 w-3 mr-1" />
                  Total Amount
                </h3>
                <p className="text-xl font-bold text-green-700 dark:text-green-400">{formattedTotal}</p>
                <p className="text-xs text-green-600/80 dark:text-green-500/70 mt-1 italic">
                  {amountInWords} Rupees Only
                </p>
              </div>

              {/* Budget ID */}
              <div className="p-3 border border-blue-100 dark:border-blue-900/20 rounded-lg bg-blue-50/50 dark:bg-blue-900/5">
                <h3 className="font-medium text-sm mb-1 flex items-center text-blue-700 dark:text-blue-400">
                  <InfoIcon className="h-3 w-3 mr-1" />
                  Budget ID
                </h3>
                <p className="text-lg font-semibold">{enrichedForm.budget_id || "Not specified"}</p>
              </div>

              {/* Category */}
              <div className="p-3 border border-purple-100 dark:border-purple-900/20 rounded-lg bg-purple-50/50 dark:bg-purple-900/5">
                <h3 className="font-medium text-sm mb-1 flex items-center text-purple-700 dark:text-purple-400">
                  <Target className="h-3 w-3 mr-1" />
                  Category
                </h3>
                <p className="text-lg font-semibold">{enrichedForm.approval_category || "Not specified"}</p>
              </div>
            </div>
            
            {/* Additional Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border border-gray-100 dark:border-gray-900/20 rounded-lg bg-gray-50/50 dark:bg-gray-900/5">
                <span className="text-xs text-gray-500 dark:text-gray-400">Approval Type:</span>
                <p className="text-sm font-semibold">{enrichedForm.approval_type || "Not specified"}</p>
              </div>
              
              {enrichedForm.payback_period && (
                <div className="p-3 border border-amber-100 dark:border-amber-900/20 rounded-lg bg-amber-50/50 dark:bg-amber-900/5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Payback Period:</span>
                  <p className="text-sm font-semibold">{enrichedForm.payback_period}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assets Details - Show only in Assets tab */}
      {(showOnlyAssets || (!showOnlyDetails && !showOnlyAssets && !showOnlyAttachments)) && (
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
      )}

      {/* Attachments - Show only in Attachments tab */}
      {(showOnlyAttachments || (!showOnlyDetails && !showOnlyAssets && !showOnlyAttachments)) && (
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 h-1.5" />
        <CardHeader className="bg-orange-50 dark:bg-orange-900/10 border-b">
          <CardTitle className="text-xl flex items-center text-orange-800 dark:text-orange-400">
            <FileText className="h-5 w-5 mr-2" />
            Attachments ({attachments?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {attachments && attachments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attachments.map((attachment, index) => (
                <div 
                  key={index}
                  className="p-4 border border-orange-100 dark:border-orange-900/20 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-3">
                    {/* Header with icon and title */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                          {attachment.original_name || attachment.name || `Document ${index + 1}`}
                        </h4>
                      </div>
                    </div>

                    {/* File info */}
                    <div className="pl-11 space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {attachment.type || 'Document'}
                      </p>
                      {attachment.size && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                      {attachment.uploaded_at && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(attachment.uploaded_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    {/* Action buttons - Left aligned */}
                    {(attachment.file || attachment.upload_url) && (
                      <div className="flex gap-2">
                        {/* View button */}
                        <button
                          onClick={() => {
                            const fileUrl = attachment.file || attachment.upload_url;
                            const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}${fileUrl}`;
                            window.open(fullUrl, '_blank');
                          }}
                          className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-md font-medium transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        
                        {/* Download button */}
                        <button
                          onClick={() => handleDownload(attachment)}
                          className="inline-flex items-center px-3 py-1.5 text-xs bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-md font-medium transition-colors"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </button>
                      </div>
                    )}
                    
                    {!(attachment.file || attachment.upload_url) && (
                      <div className="flex">
                        <span className="inline-flex items-center px-3 py-1.5 text-xs bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-400 rounded-md">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          No file URL
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="p-4 bg-gray-100 dark:bg-gray-900/30 rounded-lg inline-block mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No attachments found for this request.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Request Details - Show only in Details tab */}
      {(showOnlyDetails || (!showOnlyDetails && !showOnlyAssets && !showOnlyAttachments)) && (
      <Card className="mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5" />
        <CardHeader className="bg-blue-50 dark:bg-blue-900/10 border-b">
          <CardTitle className="text-xl flex items-center text-blue-800 dark:text-blue-400">
            <FileText className="h-5 w-5 mr-2" />
            Request Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Status */}
            <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  enrichedForm.status === 'approved' 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : enrichedForm.status === 'pending' 
                    ? 'bg-amber-100 dark:bg-amber-900/30' 
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  <Activity className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Current Status</h3>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-3 w-3 rounded-full ${
                  enrichedForm.status === 'approved' ? 'bg-green-500' : 
                  enrichedForm.status === 'pending' ? 'bg-amber-500' : 
                  'bg-red-500'
                }`} />
                <span className={`font-semibold ${
                  enrichedForm.status === 'approved' ? 'text-green-700 dark:text-green-400' : 
                  enrichedForm.status === 'pending' ? 'text-amber-700 dark:text-amber-400' : 
                  'text-red-700 dark:text-red-400'
                }`}>
                  {enrichedForm.current_status || enrichedForm.status?.charAt(0).toUpperCase() + enrichedForm.status?.slice(1)}
                </span>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Approval Level: <span className="text-blue-600 dark:text-blue-400 font-semibold">{enrichedForm.current_form_level} of {enrichedForm.form_max_level}</span>
                </p>
              </div>
            </div>

            {/* Reason for Request */}
            <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Reason for Request</h3>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border-l-3 border-purple-400">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {enrichedForm.reason || "No reason provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Benefit to Organization - Full Width */}
          <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-400">Benefit to Organization</h3>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-md border-l-3 border-blue-400">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {enrichedForm.benefit_to_organisation || "No benefit information provided"}
              </p>
            </div>
          </div>

          {/* Document Enclosed Summary - Conditional */}
          {enrichedForm.document_enclosed_summary && (
            <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Document Enclosed Summary</h3>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border-l-3 border-teal-400">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {enrichedForm.document_enclosed_summary}
                </p>
              </div>
            </div>
          )}

          {/* Policy Agreement */}
          <div className="mt-6 p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${
                enrichedForm.policy_agreement 
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {enrichedForm.policy_agreement ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Policy Agreement</h3>
            </div>
            
            <div className={`p-4 rounded-md border-l-3 ${
              enrichedForm.policy_agreement 
                ? 'bg-green-50 dark:bg-green-900/10 border-green-400'
                : 'bg-red-50 dark:bg-red-900/10 border-red-400'
            }`}>
              <p className={`font-medium leading-relaxed ${
                enrichedForm.policy_agreement 
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {enrichedForm.policy_agreement
                  ? "User has agreed to the organization's policies regarding this request."
                  : "User has NOT agreed to the organization's policies."}
              </p>
            </div>
          </div>

          {/* Rejection Reason - Conditional */}
          {enrichedForm.rejected && enrichedForm.rejection_reason && enrichedForm.rejection_reason !== "null" && (
            <div className="mt-6 p-5 border border-red-200 dark:border-red-800 rounded-lg bg-red-50/50 dark:bg-red-900/10 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-lg text-red-700 dark:text-red-400">Rejection Reason</h3>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-md border-l-3 border-red-400">
                <p className="text-red-700 dark:text-red-300 leading-relaxed font-medium">
                  {enrichedForm.rejection_reason}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      )}
    </>
  );
}