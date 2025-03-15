"use client";
import React, { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  MessageSquare,
  HelpCircle
} from "lucide-react";
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
  const {userInfo} = useContext(GFContext);

  const getPageTitle = () => {
    const path = pathname.split("/").pop() || "Dashboard";
    return path
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleLogout = () => {
    if(typeof window !== "undefined" ){
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md p-2" />
        <div className="flex items-center">
          <h1 className="text-lg font-medium text-slate-800 dark:text-white">{getPageTitle()}</h1>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-2 mx-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
          <Input 
            placeholder="Search..." 
            className="pl-9 bg-slate-100 border-0 dark:bg-slate-800 dark:placeholder:text-slate-400 focus-visible:ring-indigo-500 dark:border-slate-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-indigo-600">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Notifications</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">New comment on your post</p>
                <span className="text-xs text-slate-500 dark:text-slate-400">2 mins ago</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">New like on your photo</p>
                <span className="text-xs text-slate-500 dark:text-slate-400">5 mins ago</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">New follower: John Doe</p>
                <span className="text-xs text-slate-500 dark:text-slate-400">10 mins ago</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-indigo-600">View All</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
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
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback className="bg-indigo-700 text-white">{userInfo && (userInfo.first_name ? userInfo.first_name.charAt(0) + userInfo.last_name.charAt(0) : "JH")}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{userInfo?.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{userInfo?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500 " onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
