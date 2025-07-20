"use client";
import React, { useContext, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Bell, Search, HelpCircle, User, Settings, LogOut, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GFContext } from "@/context/AuthContext";

const AppHeader = () => {
  const pathname = usePathname();
  const { userInfo } = useContext(GFContext);
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    const path = pathname.split("/").pop() || "Dashboard";
    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/logout";
    }
  };

  const notifications = [
    { id: 1, message: "New comment on your post", time: "2 mins ago", read: false },
    { id: 2, message: "New like on your photo", time: "5 mins ago", read: false },
    { id: 3, message: "New follower: John Doe", time: "10 mins ago", read: false },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-[.9rem] shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md p-2" />
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 mx-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:placeholder:text-slate-400 focus-visible:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          {/* <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            onClick={toggleNotifications}
          >
            <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-indigo-600">
                {unreadCount}
              </Badge>
            )}
          </Button> */}
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
              <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 cursor-pointer">Mark all as read</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      !notification.read ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                        !notification.read ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"
                      }`}></div>
                      <div className="ml-3">
                        <p className="text-sm text-slate-800 dark:text-slate-200">{notification.message}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-slate-200 dark:border-slate-700">
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <HelpCircle className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help & Support</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt={userInfo?.name || "User"} />
                <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900">
                  <User className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{userInfo?.name || userInfo?.username || "User"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{userInfo?.role || "Employee"}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {userInfo?.name || userInfo?.username}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {userInfo?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=> window.location.href = "/dashboard/profile"}>
              <UserIcon className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" /> Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;