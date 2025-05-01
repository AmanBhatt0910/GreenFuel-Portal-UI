"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  CreditCard,
  ChevronDown,
  ClipboardList,
  Settings,
  LogOut,
  User,
  Mail,
  Home,
  FileCheck,
  PanelRight,
  Key,
  Building,
  CheckCircle,
  List,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { GFContext } from "@/context/AuthContext";
import useAxios from "@/app/hooks/use-axios";

const DashboardItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
    roles: ["all"],
  },
  {
    title: "Approval Dashboard",
    url: "/dashboard/approvals",
    icon: CheckCircle,
    roles: ["manager", "approver", "staff"],
    excludeUsernames: ["Admin"],
  },
];

const ApprovalItems = [
  {
    title: "Budget Approvals",
    url: "/dashboard/form",
    icon: CreditCard,
    roles: ["user", "approver"],
    excludeUsernames: ["Admin"],
  },
  {
    title: "My Requests",
    url: "/dashboard/requests",
    icon: FileCheck,
    roles: ["manager", "approver", "staff", "user"],
    excludeUsernames: ["Admin"],
  },
];

const RequestItems = [
  {
    title: "My Requests",
    url: "/dashboard/requests",
    icon: FileCheck,
    roles: ["manager", "approver", "staff", "user"],
    excludeUsernames: ["Admin"],
  },
];

const Credentials = [
  {
    title: "Credentials",
    url: "/dashboard/credentials",
    icon: Key,
    roles: ["admin", "superadmin"],
  },
];

const BusinessUnits = [
  {
    title: "Business Units",
    url: "/dashboard/business-units",
    icon: Building,
    roles: ["admin", "superadmin"],
  },
  {
    title: "Category",
    url: "/dashboard/category-management",
    icon: List,
    roles: ["admin", "superadmin"],
  },
  {
    title: "Approval Access",
    url: "/dashboard/approval-access",
    icon: Key,
    roles: ["admin", "superadmin"],
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const [approvalOpen, setApprovalOpen] = React.useState(false);
  const { userInfo } = useContext(GFContext);
  const api = useAxios();
  const [designation, setDesignation] = useState<string | null>(null);
  const [userRole, setUserRole] = useState("user");

  const fetchedRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (userInfo && userInfo.designation) {
      if (fetchedRef.current !== userInfo.designation) {
        const fetchDesignation = async () => {
          try {
            const response = await api.get(
              `/designations/${userInfo.designation}/`
            );
            setDesignation(response.data.level);
            fetchedRef.current = String(userInfo.designation);

            if (userInfo.is_staff) {
              setUserRole("admin");
            } else if (parseInt(response.data.level) > 2) {
              setUserRole("manager");
            } else if (parseInt(response.data.level) > 1) {
              setUserRole("approver");
            } else if (parseInt(response.data.level) === 1) {
              setUserRole("staff");
            }
          } catch (error) {
            console.error("Error fetching designation:", error);
          }
        };

        fetchDesignation();
      }
    }
  }, [userInfo]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }
  };

  interface MenuItem {
    title: string;
    url: string;
    icon: React.ComponentType;
    roles: string[];
    excludeUsernames?: string[];
  }

  const isItemVisible = (item: MenuItem): boolean => {
    // Check username exclusions first
    if (
      item.excludeUsernames &&
      userInfo?.username &&
      item.excludeUsernames.includes(userInfo.username)
    ) {
      return false;
    }

    return (
      item.roles.includes("all") ||
      item.roles.includes(userRole) ||
      (!!userInfo?.is_staff && item.roles.includes("admin"))
    );
  };

  const filteredDashboardItems = DashboardItems.filter(isItemVisible);
  const filteredApprovalItems = ApprovalItems.filter(isItemVisible);
  const filteredRequestItems = RequestItems.filter(isItemVisible);

  const showApprovalsSection = filteredApprovalItems.length > 0;

  const showRequestsSection =
    filteredRequestItems.length > 0 && designation && parseInt(designation) > 1;

  return (
    <Sidebar className="h-screen flex flex-col border-r dark:bg-gray-800 dark:border-gray-700">
      <SidebarHeader className="p-[15px] border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="rounded flex items-center justify-center w-full h-7.5">
            <Image src="/green.png" alt="Logo" width={100} height={100} />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto px-3 py-4 bg-gray-50 dark:bg-gray-900">
        {/* Dashboard Section */}
        {filteredDashboardItems.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs uppercase font-semibold px-3 mb-2 text-gray-600 dark:text-gray-300">
              Dashboard
            </h3>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredDashboardItems.map((item, index) => {
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem key={index} className="mb-1">
                        <SidebarMenuButton
                          asChild
                          className="hover:bg-gray-600/10 dark:hover:bg-gray-600/20"
                        >
                          <Link
                            href={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 
                              ${
                                isActive
                                  ? "bg-gray-600/10 text-gray-700 dark:bg-gray-600/20 dark:text-gray-200 font-medium"
                                  : "text-gray-500 hover:bg-gray-600/20 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon
                                className={`h-4 w-4 ${
                                  isActive
                                    ? "text-gray-700 dark:text-gray-200"
                                    : "text-gray-500 dark:text-gray-400 dark:hover:text-green-400"
                                }`}
                              />
                              <span
                                className={`${
                                  isActive
                                    ? "text-gray-700 dark:text-gray-200"
                                    : "dark:hover:text-green-400"
                                }`}
                              >
                                {item.title}
                              </span>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        )}

        {/* Approvals Section with Dropdown */}
        {showApprovalsSection && (
          <div className="mt-5">
            <h3 className="text-xs uppercase font-semibold px-3 mb-2 text-gray-600 dark:text-gray-300">
              Approvals
            </h3>
            <SidebarGroup>
              <SidebarGroupContent>
                <Collapsible
                  open={approvalOpen}
                  onOpenChange={setApprovalOpen}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <button
                      className={`flex w-full items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 
                          ${
                            approvalOpen
                              ? "bg-gray-600/10 text-gray-700 dark:bg-gray-600/20 dark:text-gray-200"
                              : "text-gray-500 hover:bg-gray-600/10 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600/20 dark:hover:text-gray-200"
                          }`}
                    >
                      <div className="flex items-center gap-3">
                        <PanelRight
                          className={`h-4 w-4 ${
                            approvalOpen
                              ? "text-gray-700 dark:text-gray-200"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                        <span>Approval Notes</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          approvalOpen
                            ? "transform rotate-180 text-gray-700 dark:text-gray-200"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-1 mt-1">
                    {filteredApprovalItems.map((item, index) => {
                      const isActive = pathname === item.url;
                      return (
                        <Link
                          key={index}
                          href={item.url}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                               ${
                                 isActive
                                   ? "bg-gray-600/10 text-gray-700 dark:bg-gray-600/20 dark:text-gray-200 font-medium"
                                   : "text-gray-500 hover:bg-gray-600/20 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600/20 dark:hover:text-gray-200"
                               }`}
                        >
                          <item.icon
                            className={`h-4 w-4 ${
                              isActive
                                ? "text-gray-700 dark:text-gray-200"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                          <span
                            className={`${
                              isActive
                                ? "text-gray-700 dark:text-gray-200"
                                : "text-gray-500 dark:text-gray-400 transition-all duration-200"
                            }`}
                          >
                            {item.title}
                          </span>
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        )}

        {/* Request Section */}
        {showRequestsSection && (
          <div className="mt-5">
            <h3 className="text-xs uppercase font-semibold px-3 mb-2 text-gray-600 dark:text-gray-300">
              Requests
            </h3>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredRequestItems.map((item, index) => {
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem key={index} className="mb-1">
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                              isActive
                                ? "bg-gray-600/10 text-gray-700 dark:bg-gray-600/20 dark:text-gray-200"
                                : "text-gray-500 hover:bg-gray-600/20 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600/20 dark:hover:text-gray-200"
                            }`}
                          >
                            <item.icon
                              className={`h-4 w-4 ${
                                isActive
                                  ? "text-gray-700 dark:text-gray-200"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            />
                            <span
                              className={`${
                                isActive
                                  ? "text-gray-700 dark:text-gray-200"
                                  : "text-gray-500 dark:text-gray-400 transition-all duration-200"
                              }`}
                            >
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        )}

        {/* Credentials Section - Only visible for admin users */}
        {userInfo?.is_staff && (
          <div className="mt-5">
            <h3 className="text-xs uppercase font-semibold px-3 mb-2 text-gray-600 dark:text-gray-300">
              Credentials
            </h3>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Credentials.map((item, index) => {
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem key={index} className="mb-1">
                        <SidebarMenuButton
                          asChild
                          className="hover:bg-gray-600/10 dark:hover:bg-gray-600/20"
                        >
                          <Link
                            href={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 
                                    ${
                                      isActive
                                        ? "bg-gray-600/10 text-gray-700 dark:bg-gray-600/20 dark:text-gray-200 font-medium"
                                        : "text-gray-500 hover:bg-gray-600/20 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600/20 dark:hover:text-gray-200"
                                    }`}
                          >
                            <item.icon
                              className={`h-4 w-4 ${
                                isActive
                                  ? "text-gray-700 dark:text-gray-200"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            />
                            <span
                              className={`${
                                isActive
                                  ? "text-gray-700 dark:text-gray-200"
                                  : ""
                              }`}
                            >
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        )}

        {/* Business Units Section - Only visible for admin users */}
        {userInfo && userInfo.is_staff && (
          <div className="mt-5">
            <h3 className="text-xs uppercase font-semibold px-3 mb-2 text-gray-600 dark:text-gray-300">
              Business Units
            </h3>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {BusinessUnits.map((item, index) => {
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem key={index} className="mb-1">
                        <SidebarMenuButton
                          asChild
                          className="hover:bg-gray-600/10 dark:hover:bg-gray-600/20"
                        >
                          <Link
                            href={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 
                                    ${
                                      isActive
                                        ? "bg-gray-600/10 text-gray-700 dark:bg-gray-600/20 dark:text-gray-200 font-medium"
                                        : "text-gray-500 hover:bg-gray-600/20 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600/20 dark:hover:text-gray-200"
                                    }`}
                          >
                            <item.icon
                              className={`h-4 w-4 ${
                                isActive
                                  ? "text-gray-700 dark:text-gray-200"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            />
                            <span
                              className={`${
                                isActive
                                  ? "text-gray-700 dark:text-gray-200"
                                  : ""
                              }`}
                            >
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-600/10 dark:hover:bg-gray-600/20 transition-all duration-200">
              <Avatar className="h-10 w-10 border-2 dark:border-gray-700">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback className="bg-gray-600 dark:bg-gray-700 text-gray-200">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {userInfo && (userInfo.name ? userInfo.name : userInfo.email)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {userInfo && userInfo.email}
                </p>
              </div>
              <ChevronDown className="ml-auto h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-56 p-2 dark:bg-gray-900 border dark:border-gray-700 text-gray-200"
            side="top"
            align="start"
          >
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 p-2 rounded-md text-sm hover:bg-gray-600/20 transition-colors duration-150">
                <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Profile
                </span>
              </button>
              <button className="w-full flex items-center gap-2 p-2 rounded-md text-sm hover:bg-gray-600/20 transition-colors duration-150">
                <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Messages
                </span>
              </button>
              <button className="w-full flex items-center gap-2 p-2 rounded-md text-sm hover:bg-gray-600/20 transition-colors duration-150">
                <Settings className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Settings
                </span>
              </button>
              <hr className="my-1 border-red-600 dark:border-red-700" />
              <button
                className="w-full flex items-center gap-2 p-2 rounded-md text-sm text-red-600 hover:bg-red-600/20 transition-colors duration-150"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400">Logout</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
