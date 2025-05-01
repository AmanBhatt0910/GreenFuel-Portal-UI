"use client";
import React, { useContext, useEffect, useState, Suspense } from "react";
import {
  User,
  MapPin,
  Briefcase,
  Calendar,
  Phone,
  Mail,
  IdCard,
  Building,
  Search,
  Bell,
} from "lucide-react";
import useAxios from "../hooks/use-axios";
import { GFContext } from "@/context/AuthContext";
import Loading from './loading';

// User interface based on provided data
interface UserInfoType {
  id: number;
  last_login: string | null;
  is_superuser?: boolean;
  username: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_active?: boolean;
  date_joined: string;
  email: string;
  name: string;
  dob: string | null;
  department: number | string | null;
  employee_code: string | null;
  designation: number | string | null;
  groups?: any[];
  user_permissions?: any[];
  // Additional fields from your current data
  contact?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status?: boolean;
  is_budget_requester?: boolean;
  is_deleted?: boolean;
  business_unit?: number | string;
}

interface BusinessUnitType {
  id: number;
  name: string;
  code: string;
  description?: string;
}

interface DepartmentType {
  id: number;
  name: string;
  code: string;
  business_unit: number;
  description?: string;
}

interface DesignationType {
  id: number;
  name: string;
  code?: string;
  description?: string;
}

const DashboardPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { userInfo, setUserInfo } = useContext(GFContext);
  const [businessUnit, setBusinessUnit] = useState<BusinessUnitType | null>(null);
  const [department, setDepartment] = useState<DepartmentType | null>(null);
  const [designation, setDesignation] = useState<DesignationType | null>(null);
  const api = useAxios();

  console.log(userInfo)

  const getUserDashboardData = async (): Promise<void> => {
    try {
      const response = await api.get("/userInfo/?self=true");
      const userData = response.data as UserInfoType;
      
      typeof window !== "undefined" &&
        localStorage.setItem("userInfo", JSON.stringify(userData));
      
      setUserInfo(userData);
      
      // Fetch related data if user data has the required IDs
      if (userData.business_unit) {
        fetchBusinessUnit(userData.business_unit);
      }
      
      if (userData.department) {
        fetchDepartment(userData.department);
      }
      
      if (userData.designation) {
        fetchDesignation(userData.designation);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  const fetchBusinessUnit = async (id: number | string): Promise<void> => {
    try {
      const response = await api.get(`business-units/${id}/`);
      setBusinessUnit(response.data);
    } catch (error) {
      console.error("Error fetching business unit:", error);
    }
  };
  
  const fetchDepartment = async (id: number | string): Promise<void> => {
    try {
      const response = await api.get(`/departments/${id}/`);
      console.log(response)
      setDepartment(response.data);
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };
  
  const fetchDesignation = async (id: number | string): Promise<void> => {
    try {
      const response = await api.get(`/designations/${id}/`);
      setDesignation(response.data);
    } catch (error) {
      console.error("Error fetching designation:", error);
    }
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoaded(false);
      try {
        await getUserDashboardData();
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setTimeout(() => setIsLoaded(true), 1000);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {userInfo?.name || "User"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-1 border-t-4 border-indigo-500">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-indigo-600 dark:text-indigo-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {userInfo?.name || "User Name"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Employee Code: {userInfo?.employee_code || "Not available"}
            </p>
            <div className="mt-2 px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full">
              <p className="text-xs text-green-800 dark:text-green-300">
                {userInfo?.status ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white">{userInfo?.email || "Not available"}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                <p className="text-gray-900 dark:text-white">{userInfo?.contact || "Not available"}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                <p className="text-gray-900 dark:text-white">{formatDate(userInfo?.dob)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2 border-t-4 border-indigo-500">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-indigo-600 dark:text-indigo-400 mb-2">Personal Information</h3>
                <div className="space-y-4 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                      <p className="text-gray-900 dark:text-white">{userInfo?.username || "Not available"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <IdCard className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Employee ID</p>
                      <p className="text-gray-900 dark:text-white">{userInfo?.employee_code || "Not available"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Joined Date</p>
                      <p className="text-gray-900 dark:text-white">{formatDate(userInfo?.date_joined)}</p>
                    </div>
                  </div>
                  
                  {(userInfo?.first_name || userInfo?.last_name) && (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="text-gray-900 dark:text-white">
                          {`${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`.trim() || "Not available"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-indigo-600 dark:text-indigo-400 mb-2">Work Information</h3>
                <div className="space-y-4 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Business Unit</p>
                      <p className="text-gray-900 dark:text-white">
                        {businessUnit?.name || `ID: ${userInfo?.business_unit || "Not assigned"}`}
                      </p>
                      {businessUnit?.code && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Code: {businessUnit.code}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                      <p className="text-gray-900 dark:text-white">
                        {department?.name || `ID: ${userInfo?.department || "Not assigned"}`}
                      </p>
                      {department?.code && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Code: {department.code}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <IdCard className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Designation</p>
                      <p className="text-gray-900 dark:text-white">
                        {designation?.name || `ID: ${userInfo?.designation || "Not assigned"}`}
                      </p>
                      {designation?.code && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Code: {designation.code}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-indigo-600 dark:text-indigo-400 mb-2">Address Information</h3>
                <div className="space-y-4 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Full Address</p>
                      <p className="text-gray-900 dark:text-white">{userInfo?.address || "Not available"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                      <p className="text-gray-900 dark:text-white">{userInfo?.city || "Not available"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">State</p>
                      <p className="text-gray-900 dark:text-white">{userInfo?.state || "Not available"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
                      <p className="text-gray-900 dark:text-white">{userInfo?.country || "Not available"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-indigo-600 dark:text-indigo-400 mb-2">User Status & Permissions</h3>
                <div className="space-y-4 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-5 h-5 mr-3">
                      <div className={`w-4 h-4 rounded-full ${userInfo?.status ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    </div>
                    <p className="text-gray-900 dark:text-white">Account Status</p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-5 h-5 mr-3">
                      <div className={`w-4 h-4 rounded-full ${userInfo?.is_budget_requester ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    </div>
                    <p className="text-gray-900 dark:text-white">Budget Requester</p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-5 h-5 mr-3">
                      <div className={`w-4 h-4 rounded-full ${userInfo?.is_staff ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    </div>
                    <p className="text-gray-900 dark:text-white">Staff Member</p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-5 h-5 mr-3">
                      <div className={`w-4 h-4 rounded-full ${!userInfo?.is_deleted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <p className="text-gray-900 dark:text-white">Account Active</p>
                  </div>
                  
                  {userInfo?.is_superuser !== undefined && (
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-5 h-5 mr-3">
                        <div className={`w-4 h-4 rounded-full ${userInfo?.is_superuser ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      </div>
                      <p className="text-gray-900 dark:text-white">Super User</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap the component with Suspense
const DashboardPageWithSuspense = () => {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardPage />
    </Suspense>
  );
};

export default DashboardPageWithSuspense;