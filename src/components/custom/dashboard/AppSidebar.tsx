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
  FileCheck,
  Settings,
  LogOut,
  User,
  Mail,
  PanelRight,
  Key,
  Building,
  CheckCircle,
  List,
  LayoutDashboard,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GFContext } from "@/context/AuthContext";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles: string[];
  excludeUsernames?: string[];
  badge?: string;
}

const DashboardItems: MenuItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["all"], // Dashboard is for all roles
  },
  {
    title: "Approval Dashboard",
    url: "/dashboard/approvals",
    icon: CheckCircle,
    roles: ["APPROVER", "ADMIN"], // Only for approver role and admin
    excludeUsernames: ["Admin"],
    badge: "New",
  },
];

const ApprovalItems: MenuItem[] = [
  {
    title: "Budget Approvals",
    url: "/dashboard/form",
    icon: CreditCard,
    roles: ["all"], // We'll handle the visibility in isItemVisible function
    excludeUsernames: ["Admin"],
  },
  {
    title: "My Requests",
    url: "/dashboard/requests",
    icon: FileCheck,
    roles: ["ADMIN", "APPROVER", "MD"], // For admin, approver, and budget requesters
    excludeUsernames: ["Admin"],
  },
];

const Credentials: MenuItem[] = [
  {
    title: "Credentials",
    url: "/dashboard/credentials",
    icon: Key,
    roles: ["ADMIN"],
  },
];

const BusinessUnits: MenuItem[] = [
  {
    title: "Business Units",
    url: "/dashboard/business-units",
    icon: Building,
    roles: ["ADMIN"],
  },
  {
    title: "Category",
    url: "/dashboard/category-management",
    icon: List,
    roles: ["ADMIN"],
  },
  {
    title: "Approval Access",
    url: "/dashboard/approval-access",
    icon: Key,
    roles: ["ADMIN"],
  },
];

const CompanyManagement: MenuItem[] = [
  {
    title: "Manage MD",
    url: "/dashboard/manage-md",
    icon: User,
    roles: ["ADMIN", "MD"],
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const [approvalOpen, setApprovalOpen] = useState(false);
  const { userInfo } = useContext(GFContext);
  const [userRole, setUserRole] = useState("EMPLOYEE");

  useEffect(() => {
    if (userInfo && userInfo.role) {
      // Set user role directly from userInfo.role
      setUserRole(userInfo.role);
    }
  }, [userInfo]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }
  };

  const isItemVisible = (item: MenuItem): boolean => {
    // Check username exclusions
    if (
      item.excludeUsernames &&
      userInfo?.username &&
      item.excludeUsernames.includes(userInfo.username)
    ) {
      return false;
    }
    
    // Special case for Budget Approvals - only visible for admin or budget requesters
    if (item.title === "Budget Approvals") {
      return userRole === "ADMIN" || !!userInfo?.is_budget_requester;
    }
    
    // Special case for Approval Dashboard - only visible for approvers
    if (item.title === "Approval Dashboard" && userRole !== "APPROVER" && userRole !== "ADMIN") {
      return false;
    }
    
    // Special case for My Requests - visible for admin, approver, MD, and budget requesters
    if (item.title === "My Requests") {
      return userRole === "ADMIN" || userRole === "APPROVER" || userRole === "MD" || !!userInfo?.is_budget_requester;
    }
    
    // For admin-only items
    if (["Credentials", "Business Units", "Category", "Approval Access"].includes(item.title)) {
      return userRole === "ADMIN" || userInfo?.is_staff === true;
    }
    
    // Special case for Manage MD - only for MD and admin
    if (item.title === "Manage MD") {
      return userRole === "MD" || userRole === "ADMIN" || userInfo?.is_staff === true;
    }
    
    // Default visibility check
    return (
      item.roles.includes("all") ||
      item.roles.includes(userRole) ||
      (userInfo?.is_staff === true && item.roles.includes("ADMIN"))
    );
  };

  const filteredDashboardItems = DashboardItems.filter(isItemVisible);
  const filteredApprovalItems = ApprovalItems.filter(isItemVisible);
  const filteredCredentialsItems = Credentials.filter(isItemVisible);
  const filteredBusinessUnitsItems = BusinessUnits.filter(isItemVisible);
  const filteredCompanyManagementItems = CompanyManagement.filter(isItemVisible);
  
  const showApprovalsSection = filteredApprovalItems.length > 0;
  const showCredentialsSection = filteredCredentialsItems.length > 0;
  const showBusinessUnitsSection = filteredBusinessUnitsItems.length > 0;
  const showCompanyManagementSection = filteredCompanyManagementItems.length > 0;

  const MenuItemComponent = ({ item, isActive }: { item: MenuItem, isActive: boolean }) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <item.icon
          className={`h-5 w-5 ${
            isActive
              ? "text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"
          }`}
        />
        <span
          className={`${
            isActive
              ? "text-gray-800 dark:text-gray-100 font-medium"
              : "text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400"
          } transition-all duration-200`}
        >
          {item.title}
        </span>
      </div>
      {item.badge && (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          {item.badge}
        </span>
      )}
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-xs uppercase font-bold px-3 mb-3 text-gray-600 dark:text-gray-300 tracking-wider">
      {title}
    </h3>
  );

  return (
    <TooltipProvider>
      <Sidebar className="h-screen flex flex-col border-r dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md">
        <SidebarHeader className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-center w-full">
            <Image 
              src="/green.png" 
              alt="Logo" 
              width={120} 
              height={40} 
              className="object-contain"
              priority
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto py-5 px-3 bg-gray-50 dark:bg-gray-900">
          {filteredDashboardItems.length > 0 && (
            <div className="mb-6">
              <SectionHeader title="Dashboard" />
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    {filteredDashboardItems.map((item, index) => {
                      const isActive = pathname === item.url;
                      return (
                        <SidebarMenuItem key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                asChild
                                className="w-full hover:bg-gray-100 dark:hover:bg-gray-700/30 group"
                              >
                                <Link
                                  href={item.url}
                                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 
                                    ${
                                      isActive
                                        ? "bg-white dark:bg-gray-800 shadow-sm border-l-4 border-green-500"
                                        : "hover:bg-gray-100/50 dark:hover:bg-gray-700/30"
                                    }`}
                                >
                                  <MenuItemComponent item={item} isActive={isActive} />
                                </Link>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-gray-800 text-gray-100 text-xs font-medium">
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>
          )}

          {showApprovalsSection && (
            <div className="mb-6">
              <SectionHeader title="Approvals" />
              <SidebarGroup>
                <SidebarGroupContent>
                  <Collapsible open={approvalOpen} onOpenChange={setApprovalOpen}>
                    <CollapsibleTrigger asChild>
                      <button
                        className={`flex w-full items-center justify-between px-4 py-3 text-sm rounded-lg transition-all duration-200 group
                          hover:bg-gray-100 dark:hover:bg-gray-700/30
                          ${approvalOpen ? "bg-white dark:bg-gray-800 border-l-4 border-green-500" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <PanelRight
                            className={`h-5 w-5 ${
                              approvalOpen
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"
                            }`}
                          />
                          <span className={`${
                            approvalOpen
                              ? "text-gray-800 dark:text-gray-100 font-medium"
                              : "text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400"
                          }`}>
                            Approval Notes
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${
                            approvalOpen
                              ? "transform rotate-180 text-green-600 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"
                          }`}
                        />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 mt-2 space-y-2">
                      {filteredApprovalItems.map((item, index) => {
                        const isActive = pathname === item.url;
                        return (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <Link
                                href={item.url}
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 group
                                  hover:bg-gray-100 dark:hover:bg-gray-700/30
                                  ${isActive ? "bg-white dark:bg-gray-800 border-l-4 border-green-500" : ""}`}
                              >
                                <MenuItemComponent item={item} isActive={isActive} />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-gray-800 text-gray-100 text-xs font-medium">
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>
          )}

          {(userRole === "ADMIN" || userInfo?.is_staff) && (
            <>
              {showCredentialsSection && (
                <div className="mb-6">
                  <SectionHeader title="Credentials" />
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenu className="space-y-2">
                        {filteredCredentialsItems.map((item, index) => {
                          const isActive = pathname === item.url;
                          return (
                            <SidebarMenuItem key={index}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <SidebarMenuButton
                                    asChild
                                    className="w-full hover:bg-gray-100 dark:hover:bg-gray-700/30 group"
                                  >
                                    <Link
                                      href={item.url}
                                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 
                                        ${
                                          isActive
                                            ? "bg-white dark:bg-gray-800 shadow-sm border-l-4 border-green-500"
                                            : "hover:bg-gray-100/50 dark:hover:bg-gray-700/30"
                                        }`}
                                    >
                                      <MenuItemComponent item={item} isActive={isActive} />
                                    </Link>
                                  </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-gray-800 text-gray-100 text-xs font-medium">
                                  {item.title}
                                </TooltipContent>
                              </Tooltip>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </div>
              )}

              {showBusinessUnitsSection && (
                <div className="mb-6">
                  <SectionHeader title="Business Units" />
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenu className="space-y-2">
                        {filteredBusinessUnitsItems.map((item, index) => {
                          const isActive = pathname === item.url;
                          return (
                            <SidebarMenuItem key={index}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <SidebarMenuButton
                                    asChild
                                    className="w-full hover:bg-gray-100 dark:hover:bg-gray-700/30 group"
                                  >
                                    <Link
                                      href={item.url}
                                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 
                                        ${
                                          isActive
                                            ? "bg-white dark:bg-gray-800 shadow-sm border-l-4 border-green-500" 
                                            : "hover:bg-gray-100/50 dark:hover:bg-gray-700/30"
                                        }`}
                                    >
                                      <MenuItemComponent item={item} isActive={isActive} />
                                    </Link>
                                  </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-gray-800 text-gray-100 text-xs font-medium">
                                  {item.title}
                                </TooltipContent>
                              </Tooltip>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </div>
              )}

              {showCompanyManagementSection && (
                <div className="mb-6">
                  <SectionHeader title="Company Management" />
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenu className="space-y-2">
                        {filteredCompanyManagementItems.map((item, index) => {
                          const isActive = pathname === item.url;
                          return (
                            <SidebarMenuItem key={index}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <SidebarMenuButton
                                    asChild
                                    className="w-full hover:bg-gray-100 dark:hover:bg-gray-700/30 group"
                                  >
                                    <Link
                                      href={item.url}
                                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 
                                        ${
                                          isActive
                                            ? "bg-white dark:bg-gray-800 shadow-sm border-l-4 border-green-500"
                                            : "hover:bg-gray-100/50 dark:hover:bg-gray-700/30"
                                        }`}
                                    >
                                      <MenuItemComponent item={item} isActive={isActive} />
                                    </Link>
                                  </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-gray-800 text-gray-100 text-xs font-medium">
                                  {item.title}
                                </TooltipContent>
                              </Tooltip>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </div>
              )}
            </>
          )}
        </SidebarContent>

        <SidebarFooter className="p-4 mt-auto border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors">
                <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-600">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback className="bg-green-600 dark:bg-green-700 text-white font-semibold">
                    {userInfo?.name?.substring(0, 2) || userInfo?.email?.substring(0, 2) || "JD"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start overflow-hidden flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {userInfo?.name || userInfo?.email || "John Doe"}
                  </p>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
                    {userInfo?.email || "john.doe@example.com"}
                  </p>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 p-2 dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg"
              side="top"
              align="start"
            >
              <div className="space-y-1.5">
                <button className="w-full flex items-center gap-3 p-2.5 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 p-2.5 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Messages
                </button>
                <button className="w-full flex items-center gap-3 p-2.5 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Settings
                </button>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
                  Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
};

export default AppSidebar;