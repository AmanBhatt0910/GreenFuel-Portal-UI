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
  PanelRight,
  Key,
  Building,
  CheckCircle,
  List,
  LayoutDashboard,
  LockIcon,
  Activity,
  ChevronRight,
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
import { motion } from "framer-motion";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles: string[];
  excludeUsernames?: string[];
  badge?: string;
}

// Menu item configurations
const DashboardItems: MenuItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["all"],
    badge: "New",
  },
  {
    title: "Approval Dashboard",
    url: "/dashboard/approvals",
    icon: CheckCircle,
    roles: ["APPROVER", "ADMIN", "MD"],
    excludeUsernames: ["Admin"],
  },
];

const ApprovalItems: MenuItem[] = [
  {
    title: "Budget Approvals",
    url: "/dashboard/form",
    icon: CreditCard,
    roles: ["all"],
    excludeUsernames: ["Admin"],
    badge: "New",
  },
  {
    title: "My Requests",
    url: "/dashboard/requests",
    icon: FileCheck,
    roles: ["ADMIN", "APPROVER", "MD"],
    excludeUsernames: ["Admin"],
  },
];

const Credentials: MenuItem[] = [
  {
    title: "Credentials",
    url: "/dashboard/credentials",
    icon: Key,
    roles: ["ADMIN"],
    badge: "New",
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

const AppSidebar = () => {
  const pathname = usePathname();
  const [approvalOpen, setApprovalOpen] = useState(false);
  const { userInfo } = useContext(GFContext);
  const [userRole, setUserRole] = useState("EMPLOYEE");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.role) {
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
    if (item.title === "Approval Dashboard" && userRole !== "APPROVER" && userRole !== "ADMIN" && userRole !== "MD") {
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
  
  const showApprovalsSection = filteredApprovalItems.length > 0;
  const showCredentialsSection = filteredCredentialsItems.length > 0;
  const showBusinessUnitsSection = filteredBusinessUnitsItems.length > 0;

  const MenuItemComponent = ({ item, isActive }: { item: MenuItem, isActive: boolean }) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <span className={`relative ${isActive ? "before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:h-3/5 before:w-1 before:bg-green-500 before:rounded-r-md" : ""}`}>
          <item.icon
            className={`h-5 w-5 ${
              isActive
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"
            }`}
          />
        </span>
        <span
          className={`${
            isActive
              ? "text-gray-800 dark:text-gray-100 font-medium"
              : "text-gray-600 dark:text-gray-300 "
          } transition-all duration-200 ${collapsed ? "hidden" : "block"}`}
        >
          {item.title}
        </span>
      </div>
      {item.badge && !collapsed && (
        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300">
          {item.badge}
        </span>
      )}
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className={`text-xs uppercase font-bold px-3 mb-3 text-gray-500 dark:text-gray-400 tracking-wider ${collapsed ? "text-center" : ""}`}>
      {collapsed ? title.charAt(0) : title}
    </h3>
  );

  // Animation variants for menu items
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <TooltipProvider>
      <div className="relative h-screen flex">
        {/* <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 z-50 bg-white dark:bg-gray-800 shadow-md p-1 rounded-full border border-gray-200 dark:border-gray-700"
        >
          <ChevronRight className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button> */}
        
        <Sidebar className={`h-screen flex flex-col border-r dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
          <SidebarHeader className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-center">
            <div className="flex items-center justify-center">
              {collapsed ? (
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  G
                </div>
              ) : (
                <Image 
                  src="/green.png" 
                  alt="Logo" 
                  width={120}
                  height={40} 
                  className="object-contain"
                  priority
                />
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="flex-1 overflow-y-auto py-5 px-3 bg-gray-50 dark:bg-gray-900">
            {filteredDashboardItems.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                className="mb-6"
              >
                <SectionHeader title="Dashboard" />
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      {filteredDashboardItems.map((item, index) => {
                        const isActive = pathname === item.url;
                        return (
                          <motion.div key={index} variants={itemVariants}>
                            <SidebarMenuItem>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <SidebarMenuButton
                                    asChild
                                    className="w-full group"
                                  >
                                    <Link
                                      href={item.url}
                                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 
                                        ${
                                          isActive
                                            ? "bg-white dark:bg-gray-800 shadow-sm"
                                            : "hover:bg-gray-100/50 dark:hover:bg-gray-800/60"
                                        }`}
                                    >
                                      <MenuItemComponent item={item} isActive={isActive} />
                                    </Link>
                                  </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-gray-800 text-gray-100 text-xs font-medium">
                                  {item.title} {item.badge && <span className="ml-1 px-1.5 py-0.5 bg-green-600 rounded-sm text-white text-xs">{item.badge}</span>}
                                </TooltipContent>
                              </Tooltip>
                            </SidebarMenuItem>
                          </motion.div>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </motion.div>
            )}

            {showApprovalsSection && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.2
                    }
                  }
                }}
                className="mb-6"
              >
                <SectionHeader title="Approvals" />
                <SidebarGroup>
                  <SidebarGroupContent>
                    <Collapsible open={approvalOpen} onOpenChange={setApprovalOpen}>
                      <CollapsibleTrigger asChild>
                        <button
                          className={`flex w-full items-center justify-between px-4 py-3 text-sm rounded-lg transition-all duration-200 group
                            hover:bg-gray-100 dark:hover:bg-gray-800/60
                            ${approvalOpen ? "bg-white dark:bg-gray-800 shadow-sm" : ""}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`relative ${approvalOpen ? "before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:h-3/5 before:w-1 before:bg-green-500 before:rounded-r-md" : ""}`}>
                              <PanelRight
                                className={`h-5 w-5 ${
                                  approvalOpen
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"
                                }`}
                              />
                            </span>
                            <span className={`${
                              approvalOpen
                                ? "text-gray-800 dark:text-gray-100 font-medium"
                                : "text-gray-600 dark:text-gray-300 "
                            } ${collapsed ? "hidden" : "block"}`}>
                              Approval Notes
                            </span>
                          </div>
                          {!collapsed && (
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                approvalOpen
                                  ? "transform rotate-180 text-green-600 dark:text-green-400"
                                  : "text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"
                              }`}
                            />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className={`mt-1 space-y-1 ${collapsed ? "pl-0" : "pl-6"}`}>
                        {filteredApprovalItems.map((item, index) => {
                          const isActive = pathname === item.url;
                          return (
                            <motion.div key={index} variants={itemVariants}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={item.url}
                                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 group
                                      hover:bg-gray-100 dark:hover:bg-gray-800/60
                                      ${isActive ? "bg-white dark:bg-gray-800 shadow-sm" : ""}`}
                                  >
                                    <MenuItemComponent item={item} isActive={isActive} />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-gray-800 text-gray-100 text-xs font-medium">
                                  {item.title} {item.badge && <span className="ml-1 px-1.5 py-0.5 bg-green-600 rounded-sm text-white text-xs">{item.badge}</span>}
                                </TooltipContent>
                              </Tooltip>
                            </motion.div>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarGroupContent>
                </SidebarGroup>
              </motion.div>
            )}

            {(userRole === "ADMIN" || userInfo?.is_staff) && (
              <>
                {showCredentialsSection && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.3
                        }
                      }
                    }}
                    className="mb-6"
                  >
                    <SectionHeader title="Credentials" />
                    <SidebarGroup>
                      <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                          {filteredCredentialsItems.map((item, index) => {
                            const isActive = pathname === item.url;
                            return (
                              <motion.div key={index} variants={itemVariants}>
                                <SidebarMenuItem>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <SidebarMenuButton
                                        asChild
                                        className="w-full group"
                                      >
                                        <Link
                                          href={item.url}
                                          className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 
                                            ${
                                              isActive
                                                ? "bg-white dark:bg-gray-800 shadow-sm"
                                                : "hover:bg-gray-100/50 dark:hover:bg-gray-800/60"
                                            }`}
                                        >
                                          <MenuItemComponent item={item} isActive={isActive} />
                                        </Link>
                                      </SidebarMenuButton>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-gray-800 text-gray-100 text-xs font-medium">
                                      {item.title} {item.badge && <span className="ml-1 px-1.5 py-0.5 bg-green-600 rounded-sm text-white text-xs">{item.badge}</span>}
                                    </TooltipContent>
                                  </Tooltip>
                                </SidebarMenuItem>
                              </motion.div>
                            );
                          })}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </motion.div>
                )}

                {showBusinessUnitsSection && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.4
                        }
                      }
                    }}
                    className="mb-6"
                  >
                    <SectionHeader title="Business Units" />
                    <SidebarGroup>
                      <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                          {filteredBusinessUnitsItems.map((item, index) => {
                            const isActive = pathname === item.url;
                            return (
                              <motion.div key={index} variants={itemVariants}>
                                <SidebarMenuItem>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <SidebarMenuButton
                                        asChild
                                        className="w-full group"
                                      >
                                        <Link
                                          href={item.url}
                                          className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 
                                            ${
                                              isActive
                                                ? "bg-white dark:bg-gray-800 shadow-sm"
                                                : "hover:bg-gray-100/50 dark:hover:bg-gray-800/60"
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
                              </motion.div>
                            );
                          })}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </motion.div>
                )}
              </>
            )}
          </SidebarContent>

          <SidebarFooter className="p-4 mt-auto border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors">
                  <Avatar className="h-10 w-10 border-2 border-green-100 dark:border-green-900 ring-2 ring-green-50 dark:ring-green-900/30">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white font-semibold">
                      {userInfo?.name?.substring(0, 2) || userInfo?.email?.substring(0, 2) || "JD"}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <>
                      <div className="flex flex-col items-start overflow-hidden flex-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                          {userInfo?.name || userInfo?.email || "John Doe"}
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                            {userRole || "Employee"}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 p-2 dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg"
                side="top"
                align="start"
              >
                <div className="p-3 mb-2 bg-gray-50 dark:bg-gray-800/80 rounded-md">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {userInfo?.name || "John Doe"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userInfo?.email || "john.doe@example.com"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Link href="/dashboard/profile" className="w-full flex items-center gap-3 p-2.5 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    Profile
                  </Link>
                  <Link href="/dashboard/change-password" className="w-full flex items-center gap-3 p-2.5 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <LockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    Change Password
                  </Link>
                  <button className="w-full flex items-center gap-3 p-2.5 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    Settings
                  </button>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarFooter>
        </Sidebar>
      </div>
    </TooltipProvider>
  );
};

export default AppSidebar;