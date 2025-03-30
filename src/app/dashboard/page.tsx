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
import { GFContext, UserInfoType } from "@/context/AuthContext";
import Loading from './loading';

// User interface based on provided data

const DashboardPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { userInfo, setUserInfo } = useContext(GFContext);
  const api = useAxios();

  const getUserDashboardData = async (): Promise<void> => {
    try {
      const response = await api.get("/userInfo/?self=true");
      typeof window !== "undefined" &&
        localStorage.setItem("userInfo", JSON.stringify(response.data));
      setUserInfo(response.data as UserInfoType);
    } catch (error) {
      console.error("Error fetching user data:", error);
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-1">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-blue-600 dark:text-blue-300" />
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
              <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white">{userInfo?.email || "Not available"}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                <p className="text-gray-900 dark:text-white">{userInfo?.contact || "Not available"}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                <p className="text-gray-900 dark:text-white">{formatDate(userInfo?.dob)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Personal Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                      <p className="text-gray-900 dark:text-white">{userInfo?.username || "Not available"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <IdCard className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Employee ID</p>
                      <p className="text-gray-900 dark:text-white">{userInfo?.employee_code || "Not available"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Joined Date</p>
                      <p className="text-gray-900 dark:text-white">{formatDate(userInfo?.date_joined)}</p>
                    </div>
                  </div>
                  
                  {(userInfo?.first_name || userInfo?.last_name) && (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
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
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Work Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Business Unit</p>
                      <p className="text-gray-900 dark:text-white">ID: {userInfo?.business_unit || "Not assigned"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                      <p className="text-gray-900 dark:text-white">ID: {userInfo?.department || "Not assigned"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <IdCard className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Designation</p>
                      <p className="text-gray-900 dark:text-white">ID: {userInfo?.designation || "Not assigned"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Address Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Full Address</p>
                      <p className="text-gray-900 dark:text-white">{userInfo?.address || "Not available"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                      <p className="text-gray-900 dark:text-white">{userInfo?.city || "Not available"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">State</p>
                      <p className="text-gray-900 dark:text-white">{userInfo?.state || "Not available"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
                      <p className="text-gray-900 dark:text-white">{userInfo?.country || "Not available"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">User Status & Permissions</h3>
                <div className="space-y-4">
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