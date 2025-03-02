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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ProcessTracker from "@/components/custom/dashboard/ProcessTracker";

// Define TypeScript interfaces for the data structure
interface ApprovalLevel {
  level: number;
  title: string;
  status: 'approved' | 'rejected' | 'pending';
  approvedBy: string | null;
  approvedAt: string | null;
  comments: string | null;
}

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

interface RequestData {
  id: string;
  title: string;
  description: string;
  status: 'approved' | 'rejected' | 'pending';
  createdBy: string;
  createdAt: string;
  department: string;
  currentLevel: number;
  levels: ApprovalLevel[];
  documents: Document[];
  comments: Comment[];
}

interface UserRole {
  role: 'approver' | 'employee';
  level: number;
  name: string;
  department: string;
}

interface StatusBadge {
  color: string;
  icon: React.ReactNode;
}

// Mock data for development - would be replaced with API calls
const mockRequest: RequestData = {
  id: "REQ-001",
  title: "Fuel Purchase Approval",
  description: "Request for approval to purchase 5000 gallons of biodiesel fuel",
  status: "pending",
  createdBy: "John Doe",
  createdAt: "2025-02-28T10:30:00",
  department: "Operations",
  currentLevel: 2,
  levels: [
    {
      level: 1,
      title: "Manager Review",
      status: "approved",
      approvedBy: "Jane Smith",
      approvedAt: "2025-03-01T09:15:00",
      comments: "Quantities align with our needs"
    },
    {
      level: 2,
      title: "Finance Review",
      status: "pending",
      approvedBy: null,
      approvedAt: null,
      comments: null
    },
    {
      level: 3,
      title: "Executive Approval",
      status: "pending",
      approvedBy: null,
      approvedAt: null,
      comments: null
    }
  ],
  documents: [
    { id: 1, name: "Quote.pdf", type: "pdf", size: "1.2 MB" },
    { id: 2, name: "Specifications.docx", type: "docx", size: "840 KB" }
  ],
  comments: [
    {
      id: 1,
      author: "John Doe",
      text: "Submitted as discussed in last week's meeting",
      timestamp: "2025-02-28T10:35:00"
    },
    {
      id: 2,
      author: "Jane Smith",
      text: "Approved at manager level. Please proceed with finance review.",
      timestamp: "2025-03-01T09:17:00"
    }
  ]
};

// Mock user role for development
const mockUserRole: UserRole = {
  role: "approver", // or "employee"
  level: 2, // Finance review level in this example
  name: "Michael Johnson",
  department: "Finance"
};

const RequestDetailsPage = () => {
  const params = useParams();
  const requestId = params.id as string;
  
  const [request, setRequest] = useState<RequestData>(mockRequest);
  const [userRole, setUserRole] = useState<UserRole>(mockUserRole);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [showRejectionDialog, setShowRejectionDialog] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("details");
  const [formValid, setFormValid] = useState<boolean>(false);

  // For demo purposes - in a real app, this would fetch data from an API
  useEffect(() => {
    // Mock API call to get request details
    console.log(`Fetching details for request: ${requestId}`);
    // setRequest would be updated with real data from API
  }, [requestId]);

  // Validate rejection form
  useEffect(() => {
    setFormValid(rejectionReason.trim().length >= 10);
  }, [rejectionReason]);

  // Handle approval action
  const handleApprove = () => {
    // In a real app, this would call an API to update the request status
    const updatedLevels = [...request.levels];
    const currentLevelIndex = updatedLevels.findIndex(l => l.level === userRole.level);
    
    if (currentLevelIndex !== -1) {
      updatedLevels[currentLevelIndex] = {
        ...updatedLevels[currentLevelIndex],
        status: "approved",
        approvedBy: userRole.name,
        approvedAt: new Date().toISOString(),
        comments: "Approved"
      };
      
      // Determine if we need to update the currentLevel
      let newCurrentLevel = request.currentLevel;
      if (currentLevelIndex + 1 < updatedLevels.length) {
        newCurrentLevel = updatedLevels[currentLevelIndex + 1].level;
      }
      
      setRequest({
        ...request,
        levels: updatedLevels,
        currentLevel: newCurrentLevel,
        status: currentLevelIndex + 1 === updatedLevels.length ? "approved" : "pending"
      });
    }
  };

  // Handle rejection submission
  const handleReject = () => {
    if (formValid) {
      // In a real app, this would call an API to update the request status
      const updatedLevels = [...request.levels];
      const currentLevelIndex = updatedLevels.findIndex(l => l.level === userRole.level);
      
      if (currentLevelIndex !== -1) {
        updatedLevels[currentLevelIndex] = {
          ...updatedLevels[currentLevelIndex],
          status: "rejected",
          approvedBy: userRole.name,
          approvedAt: new Date().toISOString(),
          comments: rejectionReason
        };
        
        setRequest({
          ...request,
          levels: updatedLevels,
          status: "rejected"
        });
      }
      
      setShowRejectionDialog(false);
      setRejectionReason("");
    }
  };

  // Get status badge color and icon
  const getStatusBadge = (status: string): StatusBadge => {
    switch (status) {
      case 'approved':
        return { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-4 w-4 mr-1" /> };
      case 'rejected':
        return { color: "bg-red-100 text-red-800", icon: <XCircle className="h-4 w-4 mr-1" /> };
      case 'pending':
        return { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-4 w-4 mr-1" /> };
      default:
        return { color: "bg-gray-100 text-gray-800", icon: <Clock className="h-4 w-4 mr-1" /> };
    }
  };

  // Check if the current user can take action on this request
  const canTakeAction = (): boolean => {
    if (userRole.role === "employee") {
      // Employees can only view the request status
      return false;
    }
    
    // Approvers can only act on current level matching their level
    return userRole.role === "approver" && userRole.level === request.currentLevel;
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

  const statusBadge = getStatusBadge(request.status);

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>
          <p className="text-sm text-gray-500">
            ID: {request.id} | Submitted by: {request.createdBy} | {formatDate(request.createdAt)}
          </p>
        </div>
        <Badge className={`${statusBadge.color} flex items-center px-3 py-1 text-sm font-medium`}>
          {statusBadge.icon}
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </Badge>
      </div>

      <div className="mb-8">
        {/* <ProcessTracker currentStep={request.currentLevel - 1} steps={request.levels.map(l => l.title)} /> */}
      </div>

      <Tabs defaultValue="details" className="w-full" onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>{request.title}</CardTitle>
              <CardDescription>{request.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Requester:</span>
                  <span>{request.createdBy}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Date Submitted:</span>
                  <span>{formatDate(request.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Department:</span>
                  <span>{request.department}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Current Approval Level:</span>
                  <span>Level {request.currentLevel}: {request.levels.find(l => l.level === request.currentLevel)?.title}</span>
                </div>
              </div>

              {/* Details specific to the request type would go here */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Additional Information</h3>
                <p className="text-gray-700">
                  This section would contain specific details related to this request type.
                </p>
              </div>
            </CardContent>

            {/* Action buttons for approvers at current level */}
            {canTakeAction() && request.status === "pending" && (
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
                {request.levels.map((level) => {
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
                        {level.status !== "pending" ? (
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
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Associated Documents</CardTitle>
              <CardDescription>Files and documents related to this request</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {request.documents.map((doc) => (
                  <li key={doc.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-3" />
                      <span>{doc.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{doc.size}</span>
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comments & Discussion</CardTitle>
              <CardDescription>Communication regarding this request</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {request.comments.map((comment) => (
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