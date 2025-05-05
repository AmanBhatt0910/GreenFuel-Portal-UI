"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Shield,
  CheckCircle,
  AlertTriangle,
  X,
  UserCheck,
  LockIcon,
  KeyRound,
  UserPlus,
  User,
  LogOut,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define types
interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  avatarUrl?: string;
}

interface CurrentMD extends User {
  assignedDate: string;
  assignedBy: string;
}

interface AuthAttempt {
  timestamp: number;
  success: boolean;
  ipAddress: string;
  username?: string;
}

// Import security constants
import { MAX_LOGIN_ATTEMPTS, LOCK_DURATION } from "@/lib/security-constants";

// Mock data - replace with your API call
const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    department: "Finance",
    role: "Senior Analyst",
    avatarUrl: "",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    department: "Operations",
    role: "Team Lead",
    avatarUrl: "",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    department: "Technology",
    role: "Director",
    avatarUrl: "",
  },
  {
    id: 4,
    name: "Lisa Wong",
    email: "lisa@example.com",
    department: "Marketing",
    role: "VP",
    avatarUrl: "",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael@example.com",
    department: "Sales",
    role: "Director",
    avatarUrl: "",
  },
  {
    id: 6,
    name: "Sarah Davis",
    email: "sarah@example.com",
    department: "Human Resources",
    role: "Manager",
    avatarUrl: "",
  },
  {
    id: 7,
    name: "David Wilson",
    email: "david@example.com",
    department: "Legal",
    role: "Counsel",
    avatarUrl: "",
  },
  {
    id: 8,
    name: "Emily Taylor",
    email: "emily@example.com",
    department: "Research",
    role: "Lead Scientist",
    avatarUrl: "",
  },
];

// Mock current MDs
const mockCurrentMDs: CurrentMD[] = [
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    department: "Technology",
    role: "Director",
    avatarUrl: "",
    assignedDate: "2025-03-15",
    assignedBy: "Admin User",
  },
];

// Using fixed timestamps to avoid hydration errors
const mockAuthAttempts: AuthAttempt[] = [
  {
    timestamp: 1672531200000, // Jan 1, 2023
    success: true,
    ipAddress: "192.168.1.1",
  },
  {
    timestamp: 1672617600000, // Jan 2, 2023
    success: false,
    ipAddress: "10.0.0.5",
  },
  {
    timestamp: 1672704000000, // Jan 3, 2023
    success: true,
    ipAddress: "192.168.1.1",
  },
];

const MDSelectionPage: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentMDs, setCurrentMDs] = useState<CurrentMD[]>(mockCurrentMDs);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [maxSelections, setMaxSelections] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("current");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string>("");
  // Initialize state from localStorage if available, otherwise use defaults
  const [lockTime, setLockTime] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const storedLockTime = localStorage.getItem('lockTime');
      return storedLockTime ? parseInt(storedLockTime, 10) : 0;
    }
    return 0;
  });
  
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLocked') === 'true';
    }
    return false;
  });
  
  const [loginAttempts, setLoginAttempts] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const storedAttempts = localStorage.getItem('loginAttempts');
      return storedAttempts ? parseInt(storedAttempts, 10) : 0;
    }
    return 0;
  });
  
  const [authAttempts, setAuthAttempts] = useState<AuthAttempt[]>(mockAuthAttempts);
  const [lockTimeLeft, setLockTimeLeft] = useState<number>(0);

  // Ref for lock timer interval
  const lockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter out current MDs from available selection
  const availableUsers = filteredUsers.filter(
    (user) => !currentMDs.some((md) => md.id === user.id)
  );

  // Handle user selection
  const toggleUserSelection = (user: User): void => {
    if (selectedUsers.some((selected) => selected.id === user.id)) {
      setSelectedUsers(
        selectedUsers.filter((selected) => selected.id !== user.id)
      );
    } else {
      if (selectedUsers.length < maxSelections) {
        setSelectedUsers([...selectedUsers, user]);
      } else {
        setErrors([`You can only select up to ${maxSelections} user(s)`]);
        setTimeout(() => setErrors([]), 3000);
      }
    }
  };

  // Custom setter functions that update both state and localStorage
  const updateIsLocked = (value: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLocked', value.toString());
    }
    setIsLocked(value);
  };

  const updateLockTime = (value: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lockTime', value.toString());
    }
    setLockTime(value);
  };

  const updateLoginAttempts = (value: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('loginAttempts', value.toString());
    }
    setLoginAttempts(value);
  };

  // Update lock time countdown
  useEffect(() => {
    if (isLocked) {
      // Clear any existing interval
      if (lockTimerRef.current) {
        clearInterval(lockTimerRef.current);
      }

      // Calculate initial time left
      const initialTimeLeft = Math.max(
        0,
        Math.ceil((lockTime + LOCK_DURATION - Date.now()) / 1000)
      );
      setLockTimeLeft(initialTimeLeft);

      // Set new interval
      lockTimerRef.current = setInterval(() => {
        const timeLeft = Math.max(
          0,
          Math.ceil((lockTime + LOCK_DURATION - Date.now()) / 1000)
        );
        setLockTimeLeft(timeLeft);

        // If lock time has expired
        if (timeLeft <= 0) {
          updateIsLocked(false);
          updateLoginAttempts(0);
          updateLockTime(0); // Reset lockTime when lock expires
          if (lockTimerRef.current) {
            clearInterval(lockTimerRef.current);
          }
        }
      }, 1000);

      return () => {
        if (lockTimerRef.current) {
          clearInterval(lockTimerRef.current);
        }
      };
    }
  }, [isLocked, lockTime]);

  // Check authorization
  const checkAuthorization = (): void => {
    // In a real app, this would be a secure authentication call to your backend

    if (isLocked) {
      return; // Don't process attempts during lockout
    }

    // Record this attempt
    const newAttempt = {
      timestamp: Date.now(),
      success: password === "admin123" && adminName.trim() !== "",
      ipAddress: "192.168.1.1", // In a real app, this would be the actual IP
      username: adminName.trim(),
    };

    setAuthAttempts([...authAttempts, newAttempt]);

    if (password === "admin123" && adminName.trim() !== "") {
      setIsAuthorized(true);
      setShowAuthDialog(false);
      setErrors([]);
      updateLoginAttempts(0);
      if (isEditMode) {
        setActiveTab("change");
      }
    } else {
      const newAttemptCount = loginAttempts + 1;
      updateLoginAttempts(newAttemptCount);

      if (newAttemptCount >= MAX_LOGIN_ATTEMPTS) {
        updateIsLocked(true);
        updateLockTime(Date.now());
        setErrors([
          `Too many failed attempts. Account locked for ${
            LOCK_DURATION / 60000
          } minutes.`,
        ]);
      } else {
        setErrors([
          `Invalid credentials. Authorization failed. ${
            MAX_LOGIN_ATTEMPTS - newAttemptCount
          } attempts remaining.`,
        ]);
      }
    }
  };

  // Logout function
  const handleLogout = () => {
    setIsAuthorized(false);
    setActiveTab("current");
    router.push("/dashboard");
  };

  // Submit MD selection
  const submitMDSelection = (): void => {
    // Validation checks
    const newErrors: string[] = [];

    if (selectedUsers.length === 0) {
      newErrors.push("Please select at least one user.");
    }

    if (selectedUsers.length > maxSelections) {
      newErrors.push(`You can only select up to ${maxSelections} user(s).`);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  // Confirm MD selection
  const confirmSelection = (): void => {
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Create new current MDs from selected users
    const newMDs: CurrentMD[] = selectedUsers.map((user) => ({
      ...user,
      assignedDate: today,
      assignedBy: adminName,
    }));

    // In a real app, call your API here
    console.log("Selected MDs:", newMDs);

    // Update current MDs
    setCurrentMDs(newMDs);

    // Reset form and show success message
    setSelectedUsers([]);
    setShowConfirmation(false);
    setActiveTab("current");
    setIsEditMode(false);
    setSuccessMessage("Managing Director(s) successfully assigned!");

    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  // Start edit mode - requires authentication
  const startEditMode = (): void => {
    setIsEditMode(true);
    setShowAuthDialog(true);
    setPassword("");
    setAdminName("");
    setErrors([]);
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if lock has expired on component mount
  useEffect(() => {
    if (isLocked && lockTime > 0) {
      const timeElapsed = Date.now() - lockTime;
      if (timeElapsed >= LOCK_DURATION) {
        // Lock has expired, reset the lock
        updateIsLocked(false);
        updateLoginAttempts(0);
        updateLockTime(0); // Reset lockTime when lock expires
        // Also clear localStorage if needed
        if (typeof window !== 'undefined') {
          localStorage.removeItem('isLocked');
          localStorage.removeItem('lockTime');
          localStorage.removeItem('loginAttempts');
        }
      }
    }
  }, []);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (lockTimerRef.current) clearInterval(lockTimerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 p-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header with admin info */}
        {isAuthorized && (
          <div className="mb-4 flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center">
              <UserCheck className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium">
                  Logged in as:{" "}
                  <span className="text-blue-600">{adminName}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={handleLogout}>
                <LogOut className="h-3 w-3 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        )}

        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-gradient-to-r text-black">
            <div className="flex justify-between items-center h-full">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Company Management
                </CardTitle>
                <CardDescription className="text-gray-400 mt-1">
                  Manage and assign Managing Directors for the company
                </CardDescription>
              </div>
              <Shield className="h-12 w-12 text-blue-500" />
            </div>
          </CardHeader>

          {successMessage && (
            <div className="mx-6 mt-4">
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            </div>
          )}

          

          <CardContent className="p-6">
            <Tabs
              defaultValue="current"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="current" className="text-sm">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Current MD
                </TabsTrigger>
                <TabsTrigger
                  value="change"
                  className="text-sm"
                  disabled={!isAuthorized && isEditMode}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Change MD
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="space-y-4">
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                      <UserCheck className="mr-2 h-5 w-5 text-blue-600" />
                      Current Managing{" "}
                      {currentMDs.length > 1 ? "Directors" : "Director"}
                    </h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" onClick={startEditMode}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Change
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Change the current Managing Director</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {currentMDs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {currentMDs.map((md) => (
                        <Card
                          key={md.id}
                          className="overflow-hidden border-slate-200"
                        >
                          <CardHeader className="bg-slate-50 pb-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16 border-2 border-white shadow">
                                <AvatarImage src={md.avatarUrl || ""} />
                                <AvatarFallback className="bg-blue-600 text-white text-xl">
                                  {getInitials(md.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle>{md.name}</CardTitle>
                                <CardDescription className="mt-1">
                                  {md.email}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Department:
                                </span>
                                <span className="font-medium">
                                  {md.department}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Role:
                                </span>
                                <span className="font-medium">{md.role}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Assigned Date:
                                </span>
                                <span className="font-medium">
                                  {formatDate(md.assignedDate)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Assigned By:
                                </span>
                                <span className="font-medium">
                                  {md.assignedBy}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed">
                      <User className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-slate-600">
                        No Managing Director Assigned
                      </h3>
                      <p className="text-slate-500 mt-1 mb-4">
                        There are currently no Managing Directors assigned to
                        the company
                      </p>
                      <Button onClick={startEditMode}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign MD
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="change">
                {isAuthorized ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="max-selections">
                            Maximum Number of MDs to Select
                          </Label>
                          <Input
                            id="max-selections"
                            type="number"
                            min="1"
                            max="5"
                            value={maxSelections}
                            onChange={(e) =>
                              setMaxSelections(parseInt(e.target.value))
                            }
                          />
                          <p className="text-sm text-muted-foreground">
                            Set the maximum number of Managing Directors allowed
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="search">Search Users</Label>
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="search"
                              placeholder="Search by name, email, department..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>

                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">
                                Selected Users
                              </CardTitle>
                              <Badge variant="outline">
                                {selectedUsers.length}/{maxSelections}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {selectedUsers.length > 0 ? (
                              <div className="space-y-2">
                                {selectedUsers.map((user) => (
                                  <div
                                    key={user.id}
                                    className="flex justify-between items-center p-2 bg-blue-50 border border-blue-200 rounded-md"
                                  >
                                    <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                                          {getInitials(user.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium text-sm">
                                          {user.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {user.email}
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleUserSelection(user)}
                                    >
                                      <X className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">
                                No users selected
                              </p>
                            )}
                          </CardContent>
                        </Card>

                        <Button
                          onClick={submitMDSelection}
                          className="w-full"
                          disabled={selectedUsers.length === 0}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Assign as Managing Director(s)
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">
                            Available Users
                          </CardTitle>
                          <CardDescription>
                            Select from the list of available users
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <ScrollArea className="h-96 border-t">
                            <div className="p-4 space-y-2">
                              {availableUsers.length > 0 ? (
                                availableUsers.map((user) => (
                                  <div
                                    key={user.id}
                                    onClick={() => toggleUserSelection(user)}
                                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                                      selectedUsers.some(
                                        (selected) => selected.id === user.id
                                      )
                                        ? "bg-blue-50 border-blue-200"
                                        : "bg-white border-slate-200 hover:bg-slate-50"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <Avatar className="h-10 w-10 mr-3">
                                          <AvatarFallback className="bg-slate-200 text-slate-800">
                                            {getInitials(user.name)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h4 className="font-medium">
                                            {user.name}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            {user.email}
                                          </p>
                                        </div>
                                      </div>
                                      {selectedUsers.some(
                                        (selected) => selected.id === user.id
                                      ) && (
                                        <CheckCircle
                                          size={18}
                                          className="text-primary"
                                        />
                                      )}
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      <Badge variant="outline">
                                        {user.department}
                                      </Badge>
                                      <Badge variant="secondary">
                                        {user.role}
                                      </Badge>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8">
                                  <p className="text-muted-foreground">
                                    No users available
                                  </p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <Card className="border-warning">
                    <CardHeader className="">
                      <CardTitle className="text-warning flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        Authorization Required
                      </CardTitle>
                      <CardDescription>
                        You need to authenticate to make changes
                      </CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                      <Button onClick={() => setShowAuthDialog(true)}>
                        <KeyRound className="mr-2 h-4 w-4" />
                        Authenticate
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>

          {activeTab === "current" && currentMDs.length > 0 && (
            <CardFooter className="bg-slate-50 border-t p-4">
              <div className="w-full">
                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <AlertTitle className="text-blue-800 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Information
                  </AlertTitle>
                  <AlertDescription className="text-blue-700 text-sm">
                    <p>
                      Last successful authentication:{" "}
                      {new Date(
                        authAttempts
                          .filter((a) => a.success)
                          .sort((a, b) => b.timestamp - a.timestamp)[0]
                          ?.timestamp || Date.now()
                      ).toLocaleString()}
                    </p>
                    <p>
                      Number of authentication attempts in past 24h:{" "}
                      {
                        authAttempts.filter(
                          (a) => a.timestamp > Date.now() - 86400000
                        ).length
                      }
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Authentication Dialog */}
      <Dialog
        open={showAuthDialog}
        onOpenChange={(open) => {
          setShowAuthDialog(open);
          if (!open) setIsEditMode(false);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <LockIcon className="mr-2 h-5 w-5 text-warning" />
              Administrator Authentication
            </DialogTitle>
            <DialogDescription>
              Please enter your credentials to proceed
            </DialogDescription>
          </DialogHeader>

          {errors.length > 0 && (
            <div className="mx-6 mt-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* <form> */}
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">
                Admin Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your admin name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                disabled={isLocked}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
              />
            </div>

            {isLocked && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Account Locked</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>
                    Too many failed attempts. Please wait before trying again.
                  </p>
                  <div className="w-full bg-red-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (lockTimeLeft / (LOCK_DURATION / 1000)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-center">
                    Unlocks in: {Math.floor(lockTimeLeft / 60)}:
                    {(lockTimeLeft % 60).toString().padStart(2, "0")}
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                setShowAuthDialog(false);
                setIsEditMode(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={checkAuthorization}
              disabled={isLocked || !adminName.trim() || !password.trim()}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Authenticate
            </Button>
          </DialogFooter>
          {/* </form> */}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onOpenChange={(open) => setShowConfirmation(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Selection</DialogTitle>
            <DialogDescription>
              Are you sure you want to assign the following user(s) as Managing
              Director(s)?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 border rounded-md bg-slate-50"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.department} - {user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmSelection}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MDSelectionPage;
