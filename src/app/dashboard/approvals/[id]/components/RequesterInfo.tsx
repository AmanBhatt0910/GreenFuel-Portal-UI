import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Building2, Users, Briefcase, Calendar, MapPin, Phone, Bell } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import useAxios from '@/app/hooks/use-axios';

/**
 * RequesterInfo Component
 * 
 * This component displays detailed information about the person who submitted 
 * the approval request in a clean, two-column layout.
 */
interface RequesterInfoProps {
  enrichedForm: any;
  loading: boolean;
}

interface UserInfo {
  id: string | number;
  name: string;
  email?: string;
}

interface DepartmentInfo {
  id: string | number;
  name: string;
}

interface User {
  contact: string;
  city: string;
  date_joined: string;
}

export default function RequesterInfo({ enrichedForm, loading }: RequesterInfoProps) {
  const [notifyToUsers, setNotifyToUsers] = useState<UserInfo[]>([]);
  const [concernedDepartment, setConcernedDepartment] = useState<DepartmentInfo | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingDepartment, setIsLoadingDepartment] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const api = useAxios();

  // Fetch notify-to users
  useEffect(() => {
    if (!enrichedForm?.notify_to) return;

    const fetchUserInfo = async (userId: string | number) => {
      try {
        const response = await api.get(`/userInfo/${userId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching user info:', error);
        return { id: userId, name: `User ${userId}`, email: `user${userId}@example.com` };
      }
    };

    const getNotifyToUsers = async () => {
      let userIds: (string | number)[] = [];
      
      if (Array.isArray(enrichedForm.notify_to)) {
        userIds = enrichedForm.notify_to;
      } else if (enrichedForm.notify_to) {
        userIds = [enrichedForm.notify_to];
      }
      
      if (userIds.length === 0) return;
      
      setIsLoadingUsers(true);
      const userPromises = userIds.map(id => fetchUserInfo(id));
      const users = await Promise.all(userPromises);
      setNotifyToUsers(users);
      setIsLoadingUsers(false);
    };

    getNotifyToUsers();
  }, [enrichedForm?.notify_to]);

  // Fetch user information
  useEffect(() => {
    if (!enrichedForm?.user) return;

    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/userInfo/${enrichedForm.user}`);
        setUser(response?.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUser(null);
      }
    };

    fetchUserDetails();
  }, [enrichedForm?.user]);

  // Fetch concerned department
  useEffect(() => {
    if (!enrichedForm?.concerned_department) return;

    const fetchDepartment = async () => {
      setIsLoadingDepartment(true);
      try {
        const deptId = enrichedForm.concerned_department;
        const response = await api.get(`/departments/${deptId}`);
        setConcernedDepartment(response.data);
      } catch (error) {
        console.error('Error fetching department info:', error);
        setConcernedDepartment(null);
      } finally {
        setIsLoadingDepartment(false);
      }
    };

    fetchDepartment();
  }, [enrichedForm?.concerned_department]);

  // Display a skeleton loading state when data is being fetched
  if (loading || !enrichedForm) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Requester Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = enrichedForm.user_name ? getInitials(enrichedForm.user_name) : "??";
  
  const formatDate = (timestamp: string | number | Date) => {
    if (!timestamp) return "Not available";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const notifyToDisplay = () => {
    if (isLoadingUsers) {
      return <span className="text-muted-foreground italic">Loading users...</span>;
    }
    
    if (notifyToUsers.length > 0) {
      return (
        <span className="text-gray-900 dark:text-gray-100">
          {notifyToUsers.map(user => user.email || user.name).join(', ')}
        </span>
      );
    }
    
    return <span className="text-gray-900 dark:text-gray-100">Not specified</span>;
  };

  const concernedDepartmentDisplay = () => {
    if (isLoadingDepartment) {
      return <span className="text-muted-foreground italic">Loading department...</span>;
    }
    
    if (concernedDepartment) {
      return <span className="text-gray-900 dark:text-gray-100">{concernedDepartment.name}</span>;
    }
    
    return <span className="text-gray-900 dark:text-gray-100">{enrichedForm.concerned_department_name || "Not specified"}</span>;
  };

  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="border-b bg-gray-50 dark:bg-gray-900">
        <CardTitle className="text-xl">Requester Information</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Profile section */}
        <div className="flex flex-col items-center text-center py-6 bg-white dark:bg-gray-950">
          <Avatar className="h-20 w-20 mb-3 border-2 border-indigo-100 dark:border-indigo-900">
            <AvatarFallback className="bg-indigo-600 text-white text-xl">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-xl text-gray-900 dark:text-white">
            {enrichedForm.user_name || "Unknown User"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {enrichedForm.user_email || "No email available"}
          </p>
          
          <div className="mt-2 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-1 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-300">
            {enrichedForm.designation_name || "Employee"}
          </div>
        </div>
        
        <Separator />
        
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-0">
          {/* Left column items */}
          <div className="border-r border-gray-100 dark:border-gray-800">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-1 text-indigo-600 dark:text-indigo-400">
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Designation</span>
              </div>
              <div className="text-gray-900 dark:text-gray-100 font-medium">
                {enrichedForm.designation_name || "Not specified"}
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-1 text-indigo-600 dark:text-indigo-400">
                <Building2 className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Business Unit</span>
              </div>
              <div className="text-gray-900 dark:text-gray-100 font-medium">
                {enrichedForm.business_unit_name || "Not specified"}
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-1 text-indigo-600 dark:text-indigo-400">
                <Bell className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Notify To</span>
              </div>
              <div className="font-sm">
                {notifyToDisplay()}
              </div>
            </div>
            
            <div className="p-4 border-b md:border-b-0 border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-1 text-indigo-600 dark:text-indigo-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <div className="text-gray-900 dark:text-gray-100 font-medium">
                {user?.city || "Not available"}
              </div>
            </div>
          </div>
          
          {/* Right column items */}
          <div>
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-1 text-indigo-600 dark:text-indigo-400">
                <Users className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Department</span>
              </div>
              <div className="text-gray-900 dark:text-gray-100 font-medium">
                {enrichedForm.department_name || "Not specified"}
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-1 text-indigo-600 dark:text-indigo-400">
                <Building2 className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Concerned Dept</span>
              </div>
              <div className="font-medium">
                {concernedDepartmentDisplay()}
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-1 text-indigo-600 dark:text-indigo-400">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Phone</span>
              </div>
              <div className="text-gray-900 dark:text-gray-100 font-medium">
                {user?.contact || "Not available"}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center mb-1 text-indigo-600 dark:text-indigo-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Joined</span>
              </div>
              <div className="text-gray-900 dark:text-gray-100 font-medium">
                {formatDate(user?.date_joined || "")}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}