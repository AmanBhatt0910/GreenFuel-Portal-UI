"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, FileText } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import useApprovalDetails from './hooks/useApprovalDetails';
import ApprovalHeader from './components/ApprovalHeader';
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
    assestDetails
  } = useApprovalDetails({ id });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setNewComment("");
  };

  const handleBack = () => {
    router.push("/dashboard/approvals");
  };

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="container max-w-7xl py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4 text-indigo-500 hover:bg-indigo-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
        </div>
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          <p>Failed to load approval details: {error.message}</p>
          <Button 
            variant="outline" 
            className="mt-4 text-indigo-500 border-indigo-500 hover:bg-indigo-50"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-full py-6 px-4 pb-32">
      <h1 className="sr-only">Approval Request Details - {form?.id}</h1>

      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="rounded-full text-indigo-500 hover:bg-indigo-50">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Approvals
        </Button>
      </div>

      {/* Header */}
      <ApprovalHeader enrichedForm={enrichedForm} loading={loading} />

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-3">
        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs 
            defaultValue="details" 
            value={activeTab}
            onValueChange={handleTabChange}
            className="mb-6"
          >
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-2 gap-2 bg-muted rounded-md">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-indigo-500/80 data-[state=active]:text-white text-indigo-500 hover:bg-indigo-100 rounded-2xl"
              >
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="data-[state=active]:bg-green-500 bg-green-200/40 data-[state=active]:text-white text-green-500 hover:bg-green-100 rounded-2xl"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6 mt-6">
              <ApprovalDetails enrichedForm={enrichedForm} loading={loading} assestDetail = {assestDetails}/>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="comments" className="space-y-6 mt-6">
              <ChatSection
                newComment={newComment}
                setNewComment={setNewComment}
                handleAddComment={handleAddComment}
                isChatLoading={isChatLoading}
                comments={comments}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Requester Info */}
        <div className="md:col-span-1">
          <RequesterInfo enrichedForm={enrichedForm} loading={loading} />
        </div>
      </div>

      {/* Sticky Footer Actions */}
      <ApprovalActions
        form={form}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        rejectionDialogOpen={rejectionDialogOpen}
        setRejectionDialogOpen={setRejectionDialogOpen}
        handleApprove={handleApprove}
        handleReject={handleReject}
        loading={loading}
      />
    </div>
  );
}

export default ApprovalDetailsPage;
