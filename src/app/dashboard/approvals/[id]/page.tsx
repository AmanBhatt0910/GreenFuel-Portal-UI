"use client";

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, FileText, CheckCircle, XCircle, Clock, User, Building, Calendar, DollarSign, Package } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import useApprovalDetails from './hooks/useApprovalDetails';
import RequesterInfo from './components/RequesterInfo';
import ApprovalActions from './components/ApprovalActions';
import ChatSection from './components/ChatSection';
import LoadingState from './components/LoadingState';
import ApprovalDetails from './components/ApprovalDetails';

function ApprovalDetailsPage() {
  const params = useParams();
  const id = params?.id as string || '';
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("details");

  const {
    form,
    enrichedForm,
    loading,
    error,
    comments,
    newComment,
    setNewComment,
    rejectionReason,
    setRejectionReason,
    rejectionDialogOpen,
    setRejectionDialogOpen,
    handleApprove,
    handleReject,
    handleAddComment,
    isChatLoading,
    isApproving,
    isRejecting,
    assestDetails,
    attachments
  } = useApprovalDetails({ id });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setNewComment("");
  };

  const handleBack = () => {
    router.push("/dashboard/approvals");
  };


  // Get status styling
  const getStatusStyling = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-200',
          badge: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
        };
      case 'rejected':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
        };
      default:
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-800 dark:text-amber-200',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
        };
    }
  };

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-red-950/20">
        <div className="container max-w-7xl py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-4 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Error Loading Request</h1>
          </div>
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">Unable to Load Request</h3>
              <p className="text-red-600 dark:text-red-400 mb-4">{error.message}</p>
              <Button 
                variant="outline" 
                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const status = enrichedForm?.status || 'Pending';
  const statusStyling = getStatusStyling(status);
  const isPending = status.toLowerCase() === 'pending';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      <div className="container max-w-full py-8 px-6">
        <h1 className="sr-only">Approval Request Details - {form?.id}</h1>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Approvals
            </Button>
            
            {isPending && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isApproving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setRejectionDialogOpen(true)}
                  variant="destructive"
                  disabled={isRejecting}
                  className="shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </div>

          <Card className={`${statusStyling.bg} ${statusStyling.border} border-2 shadow-xl`}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    Budget ID: {enrichedForm?.budget_id || enrichedForm?.id || 'N/A'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    {enrichedForm?.title || 'Asset Approval Request'}
                  </p>
                </div>
                <Badge className={`${statusStyling.badge} text-lg px-4 py-2 font-semibold shadow-md`}>
                  {status === 'approved' && <CheckCircle className="h-5 w-5 mr-2" />}
                  {status === 'rejected' && <XCircle className="h-5 w-5 mr-2" />}
                  {status === 'pending' && <Clock className="h-5 w-5 mr-2" />}
                  {status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Requestor</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {enrichedForm?.requester_name || 
                       enrichedForm?.user_name || 
                       enrichedForm?.employee_name || 
                       enrichedForm?.name || 
                       'Loading...'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Building className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Department</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {enrichedForm?.department_name || 
                       enrichedForm?.department || 
                       'Loading...'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Submitted</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {enrichedForm?.formatted_date || 
                       enrichedForm?.submission_date || 
                       enrichedForm?.created_at || 
                       'Recently'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Amount</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₹{enrichedForm?.total?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Request Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs 
                  defaultValue="details" 
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  {/* Enhanced Tab Navigation */}
                  <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl shadow-inner h-14">
                    <TabsTrigger
                      value="details"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-300 font-semibold h-full flex items-center justify-center"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="assets"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-all duration-300 font-semibold h-full flex items-center justify-center"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Assets
                    </TabsTrigger>
                    <TabsTrigger
                      value="attachments"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-all duration-300 font-semibold h-full flex items-center justify-center"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Attachments ({attachments?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger
                      value="comments"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-lg transition-all duration-300 font-semibold h-full flex items-center justify-center"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Discussion ({comments?.length || 0})
                    </TabsTrigger>
                  </TabsList>

                  {/* Details Tab */}
                  <TabsContent value="details" className="mt-6">
                    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-blue-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <ApprovalDetails 
                        enrichedForm={enrichedForm} 
                        loading={loading} 
                        assestDetail={assestDetails} 
                        attachments={attachments}
                        showOnlyDetails={true}
                      />
                    </div>
                  </TabsContent>

                  {/* Assets Tab */}
                  <TabsContent value="assets" className="mt-6">
                    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-gray-800/50 dark:to-pink-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <ApprovalDetails 
                        enrichedForm={enrichedForm} 
                        loading={loading} 
                        assestDetail={assestDetails} 
                        attachments={attachments}
                        showOnlyAssets={true}
                      />
                    </div>
                  </TabsContent>

                  {/* Attachments Tab */}
                  <TabsContent value="attachments" className="mt-6">
                    <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-orange-900/20 dark:via-gray-800/50 dark:to-amber-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <ApprovalDetails 
                        enrichedForm={enrichedForm} 
                        loading={loading} 
                        assestDetail={assestDetails} 
                        attachments={attachments}
                        showOnlyAttachments={true}
                      />
                    </div>
                  </TabsContent>

                  {/* Discussion Tab */}
                  <TabsContent value="comments" className="mt-6">
                    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-900/20 dark:via-gray-800/50 dark:to-emerald-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <ChatSection
                        newComment={newComment}
                        setNewComment={setNewComment}
                        handleAddComment={handleAddComment}
                        isChatLoading={isChatLoading}
                        comments={comments}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Increased width */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <RequesterInfo enrichedForm={enrichedForm} loading={loading} />
            </div>
          </div>
        </div>

        {/* Keep the ApprovalActions component for the rejection dialog */}
        <div className="hidden">
          <ApprovalActions
            form={form}
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
            rejectionDialogOpen={rejectionDialogOpen}
            setRejectionDialogOpen={setRejectionDialogOpen}
            handleApprove={handleApprove}
            handleReject={handleReject}
            loading={loading}
            isApproving={isApproving}
            isRejecting={isRejecting}
          />
        </div>
      </div>
    </div>
  );
}

export default ApprovalDetailsPage;
