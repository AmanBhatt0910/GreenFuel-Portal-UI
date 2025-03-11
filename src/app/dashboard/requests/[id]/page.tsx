"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  CalendarDays,
  AlertCircle,
  Building,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import useAxios from '@/app/hooks/use-axios';

// Define TypeScript interfaces for the data structure
interface BudgetRequest {
  id: number;
  budget_id: string;
  date: string;
  total: string;
  reason: string;
  policy_agreement: boolean;
  current_status: string;
  benefit_to_organisation: string;
  approval_category: string;
  approval_type: string;
  current_level: number;
  max_level: number;
  rejected: boolean;
  rejection_reason: string | null;
  user: number;
  business_unit: number;
  department: number;
  designation: number;
  initiate_dept: number | null;
  notify_to: number;
}

interface ApprovalLevel {
  level: number;
  title: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  comments: string | null;
}

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  url: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  approval_level: number;
}

interface StatusBadge {
  color: string;
  icon: React.ReactNode;
}

const RequestDetailsPage = () => {
  const params = useParams();
  const requestId = params.id as string;
  
  const [request, setRequest] = useState<BudgetRequest | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [approvalLevels, setApprovalLevels] = useState<ApprovalLevel[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectionDialog, setShowRejectionDialog] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("details");
  const [formValid, setFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const api = useAxios();

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/userInfo/");
        setUserInfo(response.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to load user information");
      }
    };
    
    fetchUserInfo();
  }, [api]);

  // Fetch request data
  useEffect(() => {
    if (requestId) {
      const fetchRequestData = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/approval-requests/${requestId}/`);
          const requestData = response.data;
          console.log("requestData" , requestData);
          setRequest(requestData);
          
          // If your API returns approval levels, documents, and comments in the same response
          // Extract them here. If they come from separate endpoints, add those API calls.
          if (requestData.approval_levels) {
            setApprovalLevels(requestData.approval_levels);
          }
          
          if (requestData.documents) {
            setDocuments(requestData.documents);
          }
          
          if (requestData.comments) {
            setComments(requestData.comments);
          }
          
          setError(null);
        } catch (err) {
          console.error("Error fetching request data:", err);
          setError("Failed to load request data");
        } finally {
          setLoading(false);
        }
      };
      
      fetchRequestData();
    }
  }, []);

  // Validate rejection form
  useEffect(() => {
    setFormValid(rejectionReason.trim().length >= 10);
  }, [rejectionReason]);

  // Handle approval action
  const handleApprove = async () => {
    if (!request) return;
    
    try {
      setLoading(true);
      
      // Send approval to API
      await api.post(`/approval-requests/${requestId}/approve/`, {
        level: userInfo?.approval_level,
        comments: "Approved"
      });
      
      // Refresh data after approval
      const response = await api.get(`/approval-requests/${requestId}/`);
      setRequest(response.data);
      
      // Update other data as needed
      if (response.data.approval_levels) {
        setApprovalLevels(response.data.approval_levels);
      }
      
    } catch (err) {
      console.error("Error approving request:", err);
      setError("Failed to approve request");
    } finally {
      setLoading(false);
    }
  };

  // Handle rejection submission
  const handleReject = async () => {
    if (!formValid || !request) return;
    
    try {
      setLoading(true);
      
      // Send rejection to API
      await api.post(`/approval-requests/${requestId}/reject/`, {
        level: userInfo?.approval_level,
        rejection_reason: rejectionReason
      });
      
      // Refresh data after rejection
      const response = await api.get(`/approval-requests/${requestId}/`);
      setRequest(response.data);
      
      // Update other data as needed
      if (response.data.approval_levels) {
        setApprovalLevels(response.data.approval_levels);
      }
      
      setShowRejectionDialog(false);
      setRejectionReason("");
      
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError("Failed to reject request");
    } finally {
      setLoading(false);
    }
  };

  // Check if the current user can take action on this request
  const canTakeAction = (): boolean => {
    if (!request || !userInfo) return false;
    
    // Determine if user can take action based on their role and approval level
    return userInfo.approval_level === request.current_level && !request.rejected;
  };

  // Get status badge color and icon
  const getStatusBadge = (status: string): StatusBadge => {
    switch (status.toLowerCase()) {
      case 'approved':
        return { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-4 w-4 mr-1" /> };
      case 'rejected':
        return { color: "bg-red-100 text-red-800", icon: <XCircle className="h-4 w-4 mr-1" /> };
      case 'pending':
      default:
        return { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-4 w-4 mr-1" /> };
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading && !request) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Notice:</strong>
          <span className="block sm:inline"> No request data available.</span>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(request.current_status);

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>Processing...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Dismiss</span>
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Request Details</h1>
          <p className="text-sm text-gray-500">
            ID: {request.budget_id} | Date: {formatDate(request.date)}
          </p>
        </div>
        <Badge className={`${statusBadge.color} flex items-center px-3 py-1 text-sm font-medium`}>
          {statusBadge.icon}
          {request.current_status.charAt(0).toUpperCase() + request.current_status.slice(1)}
        </Badge>
      </div>

      <div className="mb-8">
        {/* You can implement a process tracker component here if needed */}
        <div className="bg-gray-100 p-3 rounded-lg">
          <p>Current Level: {request.current_level} of {request.max_level}</p>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full" onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">Approval History</TabsTrigger>
          {documents.length > 0 && <TabsTrigger value="documents">Documents</TabsTrigger>}
          {comments.length > 0 && <TabsTrigger value="comments">Comments</TabsTrigger>}
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>{request.approval_type} - {request.approval_category}</CardTitle>
              <CardDescription>{request.reason}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Total Amount:</span>
                  <span>{request.total}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Date Submitted:</span>
                  <span>{formatDate(request.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Department ID:</span>
                  <span>{request.department}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Current Approval Level:</span>
                  <span>Level {request.current_level} of {request.max_level}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Benefit to Organization</h3>
                <p className="text-gray-700">
                  {request.benefit_to_organisation}
                </p>
              </div>
              
              {request.rejected && request.rejection_reason && (
                <div className="bg-red-50 p-4 rounded-md border border-red-100">
                  <h3 className="font-medium mb-2 text-red-700">Rejection Reason</h3>
                  <p className="text-red-700">
                    {request.rejection_reason}
                  </p>
                </div>
              )}
            </CardContent>

            {/* Action buttons for approvers at current level */}
            {canTakeAction() && (
              <CardFooter className="flex justify-end space-x-4 bg-gray-50 rounded-b-lg">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRejectionDialog(true)}
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Approval History</CardTitle>
              <CardDescription>Track the progress of this request through approval stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvalLevels.length > 0 ? (
                  approvalLevels.map((level) => {
                    const statusBadge = getStatusBadge(level.status);
                    return (
                      <div key={level.level} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Level {level.level}: {level.title}</h3>
                          <Badge className={`${statusBadge.color} flex items-center px-2 py-1 text-xs`}>
                            {statusBadge.icon}
                            {level.status.charAt(0).toUpperCase() + level.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          {level.status.toLowerCase() !== "pending" ? (
                            <>
                              <p><span className="font-medium">Reviewed by:</span> {level.approvedBy}</p>
                              <p><span className="font-medium">Date:</span> {formatDate(level.approvedAt)}</p>
                              {level.comments && (
                                <div className="mt-2">
                                  <p className="font-medium">Comments:</p>
                                  <p className="bg-gray-50 p-2 rounded mt-1">{level.comments}</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="italic">Awaiting review</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No approval history available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {documents.length > 0 && (
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Associated Documents</CardTitle>
                <CardDescription>Files and documents related to this request</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {documents.map((doc) => (
                    <li key={doc.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <span>{doc.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{doc.size}</span>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">View</a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} download>Download</a>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {comments.length > 0 && (
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Comments & Discussion</CardTitle>
                <CardDescription>Communication regarding this request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="font-medium">{comment.author}</p>
                        <p className="text-xs text-gray-500">{formatDate(comment.timestamp)}</p>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Textarea
                    placeholder="Add a comment..."
                    className="min-h-[100px]"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button>Post Comment</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Reject Request
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be visible to the requester.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please specify why this request is being rejected..."
              className="min-h-[150px]"
            />
            {rejectionReason.trim().length > 0 && rejectionReason.trim().length < 10 && (
              <p className="text-red-500 text-sm mt-2">
                Please provide a more detailed explanation (minimum 10 characters)
              </p>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRejectionDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              disabled={!formValid}
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestDetailsPage;