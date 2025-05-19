"use client";

import React, { useContext, useEffect, useState } from "react";
import { GFContext } from "@/context/AuthContext";
import useAxios from "@/app/hooks/use-axios";
import { RoleType } from "@/lib/roles";
import ProfileHeader from "./components/ProfileHeader";
import PersonalInfoSection from "./components/PersonalInfoSection";
import WorkInfoSection from "./components/WorkInfoSection";
import AddressInfoSection from "./components/AddressInfoSection";
import AccountInfoSection from "./components/AccountInfoSection";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Types for business unit, department, and designation
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
  department: number | null;
  employee_code: string | null;
  designation: number | null;
  contact?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status?: boolean;
  role?: RoleType;
  is_budget_requester?: boolean;
  is_deleted?: boolean;
  business_unit?: number;
}

const ProfilePage: React.FC = () => {
  const { userInfo, setUserInfo } = useContext(GFContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserInfoType | null>(null);
  const [businessUnit, setBusinessUnit] = useState<BusinessUnitType | null>(null);
  const [department, setDepartment] = useState<DepartmentType | null>(null);
  const [designation, setDesignation] = useState<DesignationType | null>(null);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitType[]>([]);
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [designations, setDesignations] = useState<DesignationType[]>([]);
  
  const api = useAxios();

useEffect(() => {
  const timeout = setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);

  return () => clearTimeout(timeout);
}, []);


  // Fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/userInfo/?self=true");
      const data = response.data as UserInfoType;
      setUserData(data);
      setUserInfo(data);
      
      // Fetch related data
      if (data.business_unit) {
        fetchBusinessUnit(data.business_unit);
      }
      
      if (data.department) {
        fetchDepartment(data.department);
      }
      
      if (data.designation) {
        fetchDesignation(data.designation);
      }
      
      // Fetch all options for dropdowns
      fetchAllBusinessUnits();
      fetchAllDepartments();
      fetchAllDesignations();
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0 , behavior: 'smooth' });
  },[])

  // Fetch business unit details
  const fetchBusinessUnit = async (id: number | string): Promise<void> => {
    try {
      const response = await api.get(`business-units/${id}/`);
      setBusinessUnit(response.data);
    } catch (error) {
      console.error("Error fetching business unit:", error);
    }
  };
  
  // Fetch department details
  const fetchDepartment = async (id: number | string): Promise<void> => {
    try {
      const response = await api.get(`/departments/${id}/`);
      setDepartment(response.data);
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };
  
  // Fetch designation details
  const fetchDesignation = async (id: number | string): Promise<void> => {
    try {
      const response = await api.get(`/designations/${id}/`);
      setDesignation(response.data);
    } catch (error) {
      console.error("Error fetching designation:", error);
    }
  };

  // Fetch all business units for dropdown
  const fetchAllBusinessUnits = async (): Promise<void> => {
    try {
      const response = await api.get(`/business-units/`);
      setBusinessUnits(response.data);
    } catch (error) {
      console.error("Error fetching business units:", error);
    }
  };

  // Fetch all departments for dropdown
  const fetchAllDepartments = async (): Promise<void> => {
    try {
      const response = await api.get(`/departments/`);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch all designations for dropdown
  const fetchAllDesignations = async (): Promise<void> => {
    try {
      const response = await api.get(`/designations/`);
      setDesignations(response.data);
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  // Update user data
  const updateUserData = async (updatedData: Partial<UserInfoType>) => {
    if (!userData) return;
    
    try {
      setUpdating(true);
      const response = await api.put(`/userInfo/${userData.id}/`, updatedData);
      
      if (response.status === 200) {
        // Update local state with new data
        const updatedUserData = { ...userData, ...response.data };
        setUserData(updatedUserData);
        setUserInfo(updatedUserData);
        
        // Refetch related data if those fields were updated
        if (updatedData.business_unit && updatedData.business_unit !== userData.business_unit) {
          fetchBusinessUnit(updatedData.business_unit);
        }
        
        if (updatedData.department && updatedData.department !== userData.department) {
          fetchDepartment(updatedData.department);
        }
        
        if (updatedData.designation && updatedData.designation !== userData.designation) {
          fetchDesignation(updatedData.designation);
        }
        
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-lg">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="w-full py-6 p-4 max-w-full overflow-hidden">
      <ProfileHeader userData={userData} />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <PersonalInfoSection 
            userData={userData} 
            updateUserData={updateUserData} 
            updating={updating} 
          />
          
          <WorkInfoSection 
            userData={userData}
            businessUnit={businessUnit}
            department={department}
            designation={designation}
            businessUnits={businessUnits}
            departments={departments}
            designations={designations}
            updateUserData={updateUserData}
            updating={updating}
          />
        </div>
        
        <div className="space-y-8">
          <AddressInfoSection 
            userData={userData} 
            updateUserData={updateUserData} 
            updating={updating} 
          />
          
          <AccountInfoSection 
            userData={userData} 
            updateUserData={updateUserData} 
            updating={updating} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;