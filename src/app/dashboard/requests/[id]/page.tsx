"use client";
import React, { useState, useCallback, useContext, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  FileText,
  AlertCircle,
  MessageSquare,
  Paperclip,
  BarChart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { GFContext } from "@/context/AuthContext";
import AssetDetailsTable from "./components/AssetDetailsTable";
import CommentsList from "./components/chat/CommentsList";
import CommentInput from "./components/chat/CommentInput";
import { formatDate } from "../../approvals/components/utils";
import { useApprovalRequest } from "./components/hooks/useApprovalRequest";
import DocumentsList from "./components/Documents/DocumentList";
import RequestHeader from "./components/Header/RequestHeader";
import RequestDetailsSection from "./components/RequestDetails/Detail";
import BasicInfoSection from "./components/RequestDetails/BasicDetail";
import OrganizationalSection from "./components/RequestDetails/Organization";

const LoadingIndicator: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-sky-50">
    <div className="text-center">
      <div className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-sky-700 font-medium">Loading request details...</p>
      <p className="text-sky-500 text-sm mt-1">Please wait</p>
    </div>
  </div>
);

const ErrorAlert: React.FC<{ error: string }> = React.memo(({ error }) => (
  <Alert
    variant="destructive"
    className="max-w-4xl mx-auto mt-8 border border-red-200 shadow-md"
  >
    <AlertCircle className="h-5 w-5" />
    <AlertTitle className="text-lg">Error</AlertTitle>
    <AlertDescription className="mt-2">{error}</AlertDescription>
  </Alert>
));

ErrorAlert.displayName = "ErrorAlert";

const NotFoundAlert: React.FC = React.memo(() => (
  <div className="max-w-4xl mx-auto mt-8">
    <Alert className="border border-sky-200 bg-sky-50 shadow-md">
      <AlertCircle className="h-5 w-5 text-sky-600" />
      <AlertTitle className="text-sky-700">Not Found</AlertTitle>
      <AlertDescription className="text-sky-600 mt-1">
        The requested budget request was not found.
      </AlertDescription>
    </Alert>
  </div>
));

NotFoundAlert.displayName = "NotFoundAlert";

const RequestDetailsPage: React.FC = () => {
  const params = useParams();
  const requestId = params.id as string;

  const [currentTab, setCurrentTab] = useState<string>("details");

  const { userInfo } = useContext(GFContext);
  const userIdParam = userInfo?.id ? userInfo.id.toString() : undefined;

  const {
    request,
    comments,
    documents,
    assestDetails,
    loading,
    error,
    getEntityName,
    getUserName,
    handleAddComment,
    businessUnitMap,
    departmentMap,
  } = useApprovalRequest(requestId, userIdParam);

  if (loading && !request) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  if (!request) {
    return <NotFoundAlert />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">

      {/* Header */}
      <RequestHeader request={request} />

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs
            defaultValue="details"
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start mb-6 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-100 data-[state=active]:to-indigo-100 data-[state=active]:text-sky-700 transition-all duration-300 rounded-md"
              >
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-100 data-[state=active]:to-indigo-100 data-[state=active]:text-sky-700 transition-all duration-300 rounded-md"
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-100 data-[state=active]:to-indigo-100 data-[state=active]:text-sky-700 transition-all duration-300 rounded-md"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-0">
              <Card className="border border-gray-200 shadow-md overflow-hidden rounded-xl">
                <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-sky-50 to-indigo-50">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-sky-600 mr-2" />
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Budget Request Details
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 mt-1">
                    Complete information about this budget request
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BasicInfoSection request={request} />

                    <OrganizationalSection
                      request={request}
                      getUserName={getUserName}
                      getEntityName={getEntityName}
                      businessUnitMap={businessUnitMap}
                      departmentMap={departmentMap}
                    />
                  </div>

                  <Separator className="my-6" />

                  <RequestDetailsSection request={request} />

                  <div className="mt-6 p-5 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
                    <h3 className="font-medium text-emerald-800 mb-4 text-lg flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-emerald-600" />
                      Asset Details
                    </h3>
                    <AssetDetailsTable
                      assets={
                        Array.isArray(assestDetails)
                          ? assestDetails
                          : assestDetails
                          ? [assestDetails]
                          : []
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                  <CardDescription>
                    Files and documents related to this budget request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentsList documents={documents} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    Discussions and feedback about this request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <CommentsList comments={comments} formatDate={formatDate} />
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <CommentInput onAddComment={handleAddComment} />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
