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
 * the approval request. It shows personal and organizational details about the requester
 * and handles fetching additional user information when needed.
 * 
 * Features:
 * - Displays the requester's name, avatar, and contact information
 * - Shows organizational context (department, business unit, designation)
 * - Makes API calls to fetch information about notify-to users
 * - Provides visual indicators for the requester's role and position
 * - Handles loading states and data fetching
 * 
 * @param {Object} props - Component props
 * @param {Object} props.enrichedForm - The enhanced form data with requester info
 * @param {boolean} props.loading - Whether data is still loading
 */
interface RequesterInfoProps {
  enrichedForm: any;
  loading: boolean;
}

/**
 * Interface for user information returned from API
 */
interface UserInfo {
  id: string | number;
  name: string;
  email?: string;
}

export default function RequesterInfo({ enrichedForm, loading }: RequesterInfoProps) {
  // State to store users to notify about this request
  const [notifyToUsers, setNotifyToUsers] = useState<UserInfo[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const api = useAxios();

  /**
   * Fetches user information for the notify-to IDs
   * Makes API calls to /api/userinfo/${userId} for each ID in notify_to
   */
  useEffect(() => {
    if (!enrichedForm?.notify_to) return;

    /**
     * Fetch details for a single user by ID
     * @param {string|number} userId - The ID of the user to fetch
     * @returns {Promise<UserInfo>} The user information or a fallback
     */
    const fetchUserInfo = async (userId: string | number) => {
      setIsLoadingUsers(true);
      try {
        const response = await api.get(`/userInfo/${userId}`);
        
        return response.data;
      } catch (error) {
        console.error('Error fetching user info:', error);
        // Return a fallback object with just the ID and a placeholder name
        return { id: userId, name: `User ${userId}` };
      } finally {
        setIsLoadingUsers(false);
      }
    };

    /**
     * Fetch all users that need to be notified about this request
     */
    const getNotifyToUsers = async () => {
      // Handle different formats of notify_to (single ID, array of IDs, etc.)
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

  /**
   * Generate initials from a user's name for avatar
   * @param {string} name - The user's full name
   * @returns {string} The first two initials of the name
   */
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = enrichedForm.user_name ? getInitials(enrichedForm.user_name) : "??";
  
  // Mock data for additional requester details that might not be in the API
  const mockUserData = {
    phone: "+91 98765 43210",
    location: "New Delhi, India",
    joinDate: "April, 2022"
  };

  /**
   * Format the list of users for display in the notify-to field
   * Handles loading state and empty results
   */
  const notifyToDisplay = () => {
    if (isLoadingUsers) {
      return <span className="text-muted-foreground font-medium italic">Loading users...</span>;
    }
    
    if (notifyToUsers.length > 0) {
      return (
        <span className="text-muted-foreground font-medium flex-1">
          {notifyToUsers.map(user => user.name).join(', ')}
        </span>
      );
    }
    
    return <span className="text-muted-foreground font-medium">Not specified</span>;
  };

  return (
    <Card className="mb-6 overflow-hidden">
      {/* Visual header accent */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5"></div>
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Requester Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Requester avatar and basic info */}
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-20 w-20 mb-4 border-2 border-indigo-100 dark:border-indigo-900">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-xl">{enrichedForm.user_name || "Unknown User"}</h3>
          <p className="text-sm text-muted-foreground">{enrichedForm.user_email || "No email available"}</p>
          
          <div className="mt-3 bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-300">
            {enrichedForm.designation_name || "Employee"}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Detailed information list */}
        <div className="space-y-4">
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 mr-3 text-indigo-500" />
            <span className="font-medium min-w-24">Designation:</span>
            <span className="text-muted-foreground font-medium">{enrichedForm.designation_name || "Employee"}</span>
          </div>
          
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-3 text-indigo-500" />
            <span className="font-medium min-w-24">Department:</span>
            <span className="text-muted-foreground font-medium">{enrichedForm.department_name || "IT"}</span>
          </div>
          
          <div className="flex items-center">
            <Building2 className="h-5 w-5 mr-3 text-indigo-500" />
            <span className="font-medium min-w-24">Business Unit:</span>
            <span className="text-muted-foreground font-medium">{enrichedForm.business_unit_name || "Green Fuel"}</span>
          </div>
          
          <div className="flex items-start">
            <Bell className="h-5 w-5 mr-3 text-indigo-500 mt-0.5" />
            <span className="font-medium min-w-24 mt-0.5">Notify To:</span>
            {notifyToDisplay()}
          </div>
          
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-indigo-500" />
            <span className="font-medium min-w-24">Phone:</span>
            <span className="text-muted-foreground font-medium">{mockUserData.phone}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-3 text-indigo-500" />
            <span className="font-medium min-w-24">Location:</span>
            <span className="text-muted-foreground font-medium">{mockUserData.location}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-3 text-indigo-500" />
            <span className="font-medium min-w-24">Joined:</span>
            <span className="text-muted-foreground font-medium">{mockUserData.joinDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}