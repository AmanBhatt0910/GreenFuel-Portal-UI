"use client";
import React, {
  useContext,
  useEffect,
  useState,
  Suspense,
  useRef,
  ReactNode,
} from "react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
  Variants,
} from "framer-motion";
import useAxios from "../hooks/use-axios";
import { GFContext } from "@/context/AuthContext";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import { scrollToTop } from "@/utils/scroll-utils";

// Import components
import {
  WelcomeBanner,
  ApprovalStatusCards,
  FormStatisticsChart,
  ProfileCard,
  RequestsTable,
  ActivityTimeline,
  QuickActions,
  DashboardCardProps,
} from "@/components/custom/dashboard/DashboardComponents";

// Import icons
import {
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  BarChart2,
} from "lucide-react";

// Import types
import {
  UserInfoType,
  BusinessUnitType,
  DepartmentType,
  DesignationType,
  RequestType,
} from "@/components/custom/dashboard/types";

// Import chart components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Page transition animations
const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4 },
  },
};

// Enhanced animation variants for components
const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

const fadeInRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

// Improved AnimateInView component with threshold option
interface AnimateInViewProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  threshold?: number;
}

const AnimateInView: React.FC<AnimateInViewProps> = ({
  children,
  variants = fadeInUpVariants,
  className = "",
  delay = 0,
  threshold = 0.2,
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

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
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  className = "",
  title,
  icon,
  action,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${className}`}
    >
      {(title || action) && (
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {icon && (
              <span className="text-indigo-500 dark:text-indigo-400">
                {icon}
              </span>
            )}
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              {title}
            </h3>
          </div>
          {action && (
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center transition-colors duration-200">
              {action}
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

// Yearly Stats Chart Component
interface YearlyStatsData {
  month: string;
  created: number;
  approved: number;
  rejected: number;
}

export interface YearlyStatsResponse {
  year: number;
  data: YearlyStatsData[];
}

const YearlyStatsChart: React.FC<{
  yearlyStats: YearlyStatsResponse | null;
}> = ({ yearlyStats }) => {
  if (!yearlyStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const chartData = {
    labels: yearlyStats.data.map((item) => item.month),
    datasets: [
      {
        label: "Created",
        data: yearlyStats.data.map((item) => item.created),
        backgroundColor: "rgba(79, 70, 229, 0.8)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
      },
      {
        label: "Approved",
        data: yearlyStats.data.map((item) => item.approved),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
      {
        label: "Rejected",
        data: yearlyStats.data.map((item) => item.rejected),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Form Statistics for ${yearlyStats.year}`,
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
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
  const api = useAxios();
  const [requestsData, setRequestsData] = useState<RequestType[]>([]);
  const router = useRouter();
  const [yearlyStats, setYearlyStats] = useState<YearlyStatsResponse | null>(
    null
  );

  useEffect(() => {
    if (userInfo?.role) {
      document.cookie = `user_role=${userInfo.role}; path=/`;
    }
  }, [userInfo]);

  // Scroll to top on page load
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

  const fetchYearlyStats = async (): Promise<void> => {
    try {
      const currentYear = new Date().getFullYear();
      const response = await api.get<YearlyStatsResponse>(
        `/yearly-stats?year=${currentYear}`
      );
      console.log(response);
      setYearlyStats(response.data);
    } catch (error) {
      const currentYear = new Date().getFullYear();
      console.error("Error fetching yearly stats:", error);

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      setYearlyStats({
        year: currentYear,
        data: monthNames.map((month) => ({
          month,
          created: 0,
          approved: 0,
          rejected: 0,
        })),
      });
    }
  };

  const getRequestData = async (): Promise<void> => {
    try {
      const response = await api.get(`/approval-requests/`);

      // Ensure we're handling the data as an array
      const requestsArray = Array.isArray(response.data)
        ? response.data
        : [response.data];

      // Map the data to ensure all required fields are present
      const mappedRequests = requestsArray.map(
        (request: Partial<RequestType>) => ({
          ...request,
          // Ensure these fields exist with default values if they don't
          current_status: request.current_status || request.status || "Pending",
          budget_id: request.budget_id || `BUD-${request.id}`,
          approval_category: request.approval_category || "N/A",
          approval_type: request.approval_type || "N/A",
          current_form_level: request.current_form_level || 1,
          form_max_level: request.form_max_level || 3,
        })
      ) as RequestType[];

      // Sort by date (newest first) before setting state
      const sortedRequests = mappedRequests.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setRequestsData(sortedRequests);
    } catch (error) {
      console.error("Error fetching request data:", error);
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
        await fetchYearlyStats();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => setIsLoaded(true), 800);
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

  // Show elegant loading state
  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen bg-gray-50 dark:bg-gray-900"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Welcome Banner with enhanced styling */}
          <AnimateInView variants={fadeInLeftVariants} className="mb-6">
            <WelcomeBanner
              userInfo={
                userInfo
                  ? { ...userInfo, role: userInfo.role ?? undefined }
                  : null
              }
            />
          </AnimateInView>

          {/* Approval Status Cards with upgraded animation */}
          <AnimateInView
            variants={fadeInUpVariants}
            delay={0.1}
            className="mb-6"
          >
            <ApprovalStatusCards yearlyStats={yearlyStats || undefined} />
          </AnimateInView>

          {/* Yearly Statistics Chart */}
          <AnimateInView
            variants={fadeInUpVariants}
            delay={0.15}
            className="mb-6"
          >
            <DashboardCard
              title="Yearly Statistics"
              icon={<BarChart2 className="h-5 w-5" />}
            >
              <YearlyStatsChart yearlyStats={yearlyStats} />
            </DashboardCard>
          </AnimateInView>

          {/* Charts and Profile Section with more dynamic layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Chart with enhanced scale-in animation */}
            <AnimateInView
              variants={scaleInVariants}
              delay={0.2}
              className="lg:col-span-8"
            >
              <DashboardCard
                title="Performance Overview"
                action="View Details"
                icon={<FileText className="h-5 w-5" />}
              >
                <FormStatisticsChart yearlyStats={yearlyStats} />
              </DashboardCard>
            </AnimateInView>

            {/* Profile Card with improved slide-in animation */}
            {userInfo && (
              <AnimateInView
                variants={fadeInRightVariants}
                delay={0.25}
                className="lg:col-span-4"
              >
                <ProfileCard
                  userInfo={{
                    ...userInfo,
                    role: userInfo.role || undefined,
                  }}
                  department={department}
                  designation={designation}
                  businessUnit={businessUnit}
                />
              </AnimateInView>
            )}
          </div>

          {/* Requests Table with enhanced fade-up animation */}
          <AnimateInView
            variants={fadeInUpVariants}
            delay={0.3}
            className="mb-6"
            threshold={0.1}
          >
            <DashboardCard
              title="Recent Requests"
              action="View All"
              icon={<CheckCircle className="h-5 w-5" />}
              className="overflow-hidden"
            >
              <RequestsTable requests={requestsData} formatDate={formatDate} />
            </DashboardCard>
          </AnimateInView>

          {/* Optional bottom row components with grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimateInView variants={fadeInUpVariants} delay={0.4}>
              <DashboardCard
                title="Recent Activity"
                icon={<Users className="h-5 w-5" />}
              >
                <ActivityTimeline />
              </DashboardCard>
            </AnimateInView>

            <AnimateInView variants={fadeInUpVariants} delay={0.5}>
              <DashboardCard
                title="Quick Actions"
                icon={<AlertCircle className="h-5 w-5" />}
              >
                <QuickActions />
              </DashboardCard>
            </AnimateInView>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Wrap the component with Suspense and add some modern loading styles
const DashboardPageWithSuspense: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Loading />
        </div>
      }
    >
      <DashboardPage />
    </Suspense>
  );
};

export default DashboardPageWithSuspense;
