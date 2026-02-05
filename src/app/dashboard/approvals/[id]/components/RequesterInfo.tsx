import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import useAxios from "@/app/hooks/use-axios";

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

export default function RequesterInfo({
  enrichedForm,
  loading,
}: RequesterInfoProps) {
  const [notifyToUsers, setNotifyToUsers] = useState<UserInfo[]>([]);
  const [concernedDepartment, setConcernedDepartment] =
    useState<DepartmentInfo | null>(null);
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
        console.error("Error fetching user info:", error);
        return {
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
        };
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
      const userPromises = userIds.map((id) => fetchUserInfo(id));
      const users = await Promise.all(userPromises);
      setNotifyToUsers(users);
      setIsLoadingUsers(false);
    };

    getNotifyToUsers();
  }, [enrichedForm?.notify_to, api]);

  // Fetch user information
  useEffect(() => {
    if (!enrichedForm?.user) return;

    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/userInfo/${enrichedForm.user}`);
        setUser(response?.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUser(null);
      }
    };

    fetchUserDetails();
  }, [enrichedForm?.user, api]);

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
        console.error("Error fetching department info:", error);
        setConcernedDepartment(null);
      } finally {
        setIsLoadingDepartment(false);
      }
    };

    fetchDepartment();
  }, [enrichedForm?.concerned_department, api]);

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
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = enrichedForm.user_name
    ? getInitials(enrichedForm.user_name)
    : "??";

  const formatDate = (timestamp: string | number | Date) => {
    if (!timestamp) return "Not available";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const notifyToDisplay = () => {
    if (isLoadingUsers) {
      return "Loading users...";
    }

    if (notifyToUsers.length > 0) {
      return notifyToUsers.map((user) => user.email || user.name).join(", ");
    }

    return enrichedForm.notify_to || "Not specified";
  };

  const concernedDepartmentDisplay = () => {
    if (isLoadingDepartment) {
      return "Loading department...";
    }

    if (concernedDepartment) {
      return concernedDepartment.name;
    }

    return enrichedForm.concerned_department_name || "Not specified";
  };

  // Information rows definition - this makes it easy to maintain and modify
  const infoRows = [
    // { key: "Designation", value: enrichedForm.designation_name || "Not specified" },
    {
      key: "Employee ID",
      value: enrichedForm.employee_code || "Not available",
    },
    {
      key: "Department",
      value: enrichedForm.department_name || "Not specified",
    },
    {
      key: "Business Unit",
      value: enrichedForm.business_unit_name || "Not specified",
    },
    { key: "Concerned Dept", value: concernedDepartmentDisplay() },
    { key: "Notify To", value: notifyToDisplay() },
    {
      key: "Phone",
      value: user?.contact || enrichedForm.phone || "Not available",
    },
    {
      key: "Location",
      value: user?.city || enrichedForm.location || "Not available",
    },
    { key: "Joined", value: formatDate(user?.date_joined || "") },
  ];

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

        {/* Clean two-column information layout with proper text wrapping */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {infoRows.map((row, index) => (
            <div key={index} className="grid grid-cols-5 w-full">
              <div className="col-span-2 py-3 pl-4 font-bold text-gray-600 dark:text-gray-400 border-r border-gray-100 dark:border-gray-800">
                {row.key}
              </div>
              <div className="col-span-3 py-3 pl-4 pr-4 text-sm text-gray-900 dark:text-gray-100 break-words">
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
