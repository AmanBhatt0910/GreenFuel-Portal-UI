"use client";
import React, {
  useContext,
  useEffect,
  useState,
  Suspense,
  useRef,
} from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import useAxios from "../hooks/use-axios";
import { GFContext } from "@/context/AuthContext";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import { scrollToTop } from "@/utils/scroll-utils";

import {
  WelcomeBanner,
  StatsCard,
  ApprovalStatusCards,
  FormStatisticsChart,
  ProfileCard,
  RequestsTable,
  ActivityTimeline,
  QuickActions,
  AnimateInViewProps,
  fadeInUpVariants,
  pageVariants,
  fadeInLeftVariants,
  scaleInVariants,
  fadeInRightVariants,
  StatType,
} from "@/components/custom/dashboard/DashboardComponents";

import {
  UserInfoType,
  BusinessUnitType,
  DepartmentType,
  DesignationType,
  RequestType,
} from "@/components/custom/dashboard/types";

const AnimateInView: React.FC<AnimateInViewProps> = ({
  children,
  variants = fadeInUpVariants,
  className = "",
  delay = 0,
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
      custom={delay}
    >
      {children}
    </motion.div>
  );
};

const DashboardPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { userInfo, setUserInfo } = useContext(GFContext);
  const [businessUnit, setBusinessUnit] = useState<BusinessUnitType | null>(
    null
  );
  const [department, setDepartment] = useState<DepartmentType | null>(null);
  const [designation, setDesignation] = useState<DesignationType | null>(null);
  const [statData, setStatData] = useState<StatType | null>(null);
  const api = useAxios();
  const [requestsData, setRequestsData] = useState<RequestType[]>([]);
  const router = useRouter();

  useEffect(() => {
    document.cookie = `user_role=${userInfo?.role}; path=/`;
  }, [userInfo]);

  useEffect(() => {
    const cleanup = scrollToTop({ behavior: "auto", delay: 100, position: 0 });
    return cleanup;
  }, []);

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

  const getRequestData = async (): Promise<void> => {
    try {
      const response = await api.get(`/approval-requests/`);
      // console.log("Request data:", response.data);

      const requestsArray = Array.isArray(response.data)
        ? response.data
        : [response.data];

      // Map the data to ensure all required fields are present
      const mappedRequests = requestsArray.map((request) => ({
        ...request,
        current_status: request.current_status || request.status || "Pending",
        budget_id: request.budget_id || `BUD-${request.id}`,
        approval_category: request.approval_category || "N/A",
        approval_type: request.approval_type || "N/A",
        current_form_level: request.current_form_level || 1,
        form_max_level: request.form_max_level || 3,
      }));

      // Sort by date (newest first) before setting state
      const sortedRequests = mappedRequests.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setRequestsData(sortedRequests);
    } catch (error: any) {
      console.error("Error fetching request data:", error);
    }
  };

  const fetchstat = async () => {
    try {
      const res = await api.get("approver-dashboard-stats/");
      // console.log(res);
      setStatData(res.data);
    } catch (error: any) {
      console.error("error", error?.messgae);
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
        await getRequestData();
        await fetchstat();
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setTimeout(() => setIsLoaded(true), 1000);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="p-6">
        {/* Welcome Banner with slide-in animation */}
        <AnimateInView variants={fadeInLeftVariants}>
          <WelcomeBanner
            userInfo={
              userInfo
                ? { ...userInfo, role: userInfo.role ?? undefined }
                : null
            }
          />
        </AnimateInView>

        {/* Approval Status Cards with staggered fade-in animation */}
        <AnimateInView variants={fadeInUpVariants} delay={0.1}>
          <ApprovalStatusCards statData = {statData} />
        </AnimateInView>

        {/* Charts and Profile Section with different animations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart with scale-in animation */}
          <AnimateInView variants={scaleInVariants} className="lg:col-span-2">
            <FormStatisticsChart statData = {statData} />
          </AnimateInView>

          {/* Profile Card with slide-in from right animation */}
          {userInfo && (
            <AnimateInView variants={fadeInRightVariants}>
              <ProfileCard
                userInfo={{
                  ...userInfo,
                  role: userInfo.role || undefined, // Convert null to undefined
                }}
                department={department}
                designation={designation}
                businessUnit={businessUnit}
              />
            </AnimateInView>
          )}
        </div>

        {/* Request Table with fade-up animation */}
        <AnimateInView variants={fadeInUpVariants} delay={0.2}>
          <RequestsTable requests={requestsData} formatDate={formatDate} />
        </AnimateInView>

        {/* Uncomment if you want to add these components back with animations */}
        {/* <div className="grid grid-cols-1 gap-6">
          <AnimateInView variants={fadeInUpVariants} delay={0.3}>
            <ActivityTimeline />
          </AnimateInView>
          <AnimateInView variants={fadeInUpVariants} delay={0.4}>
            <QuickActions />
          </AnimateInView>
        </div> */}
      </div>
    </motion.div>
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
