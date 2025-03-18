"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, FileText } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import useApprovalDetails from './hooks/useApprovalDetails';
import ApprovalHeader from './components/ApprovalHeader';
import ApprovalDetails from './components/ApprovalDetails';
import RequesterInfo from './components/RequesterInfo';
import ApprovalActions from './components/ApprovalActions';
import ChatSection from './components/ChatSection';
import LoadingState from './components/LoadingState';

/**
 * ApprovalDetailsPage Component
 * 
 * This component displays detailed information about a specific approval request.
 * It serves as the main view for reviewing and taking action on approval requests.
 * 
 * Key features:
 * - Displays comprehensive information about the approval request
 * - Provides approve/reject functionality for pending requests
 * - Shows requester information with details about who submitted the request
 * - Includes a chat system for communication with the requester
 * - Tabbed interface to separate details from communication
 * 
 * URL structure: /dashboard/approvals/[id] - where [id] is the approval request ID
 */
function ApprovalDetailsPage() {
  // Extract the approval ID from the URL parameters
  const params = useParams();
  const id = params?.id as string || '';
  
  const router = useRouter();
  // Track the currently active tab (details or chat)
  const [activeTab, setActiveTab] = useState<string>("details");
  
  // Use custom hook to fetch and manage approval details
  // This hook handles data fetching, state management, and actions
  const {
    form,                  // Original form data from API
    enrichedForm,          // Enhanced form data with additional information
    loading,               // Loading state indicator
    error,                 // Error state if any
    comments,              // Comment history for this approval
    newComment,            // Current comment being drafted
    setNewComment,         // Function to update the draft comment
    rejectionReason,       // Reason for rejection if rejecting
    setRejectionReason,    // Function to update rejection reason
    rejectionDialogOpen,   // State of rejection dialog
    setRejectionDialogOpen,// Function to toggle rejection dialog
    handleApprove,         // Function to approve this request
    handleReject,          // Function to reject this request
    handleAddComment,      // Function to add a new comment
    chatRoom,              // Chat room data if exists
    chatMessages,          // Messages in the chat
    isChatLoading,         // Loading state for chat
    handleStartChat,       // Function to initiate a new chat
    handleSendMessage,     // Function to send a chat message
  } = useApprovalDetails({ id });

  /**
   * Handle tab change between details and chat
   * Clears any draft comment when switching tabs
   * 
   * @param value - The tab value to switch to
   */
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setNewComment(""); // Clear comment input when switching tabs
  };

  /**
   * Navigate back to the approvals dashboard
   */
  const handleBack = () => {
    router.push("/dashboard/approvals");
  };

  // Show loading state while data is being fetched
  if (loading) {
    return <LoadingState />;
  }

  // Show error state if data fetching failed
  if (error) {
    return (
      <div className="container max-w-7xl py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Error</h1>
        </div>
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          <p>Failed to load approval details: {error.message}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-6 pb-32">
      {/* Page Title (for screen readers and accessibility) */}
      <h1 className="sr-only">Approval Request Details - {form?.id}</h1>
      
      {/* Back Button - allows navigation back to the dashboard */}
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Approvals
        </Button>
      </div>

      {/* Header - displays key information about the approval request */}
      <ApprovalHeader 
        enrichedForm={enrichedForm} 
        loading={loading} 
      />

      {/* Main Content - Two-column layout on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column (wider) - Contains approval details and chat */}
        <div className="md:col-span-2">
          <Tabs 
            defaultValue="details" 
            value={activeTab}
            onValueChange={handleTabChange}
            className="mb-6"
          >
            {/* Tab navigation */}
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
            </TabsList>
            
            {/* Details Tab - Shows financial and request details */}
            <TabsContent value="details" className="space-y-6 mt-6">
              <ApprovalDetails 
                enrichedForm={enrichedForm} 
                loading={loading} 
              />
            </TabsContent>
            
            {/* Chat Tab - Shows communication history and live chat */}
            <TabsContent value="comments" className="space-y-6 mt-6">
              <ChatSection 
                chatRoom={chatRoom}
                chatMessages={chatMessages}
                newComment={newComment}
                setNewComment={setNewComment}
                handleStartChat={handleStartChat}
                handleSendMessage={handleSendMessage}
                isChatLoading={isChatLoading}
                comments={comments}
                handleAddComment={handleAddComment}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column (narrower) - Contains requester information */}
        <div className="md:col-span-1">
          <RequesterInfo 
            enrichedForm={enrichedForm} 
            loading={loading} 
          />
        </div>
      </div>

      {/* Approval Actions - Sticky footer with approve/reject buttons */}
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
