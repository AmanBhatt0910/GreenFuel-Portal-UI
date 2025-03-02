"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  FileText,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    },
    {
      title: "Forms",
      icon: <FileText className="h-5 w-5" />,
      href: "/dashboard/form",
      isActive: pathname.startsWith("/dashboard/form"),
    },
    {
      title: "credentials",
      icon: <FileText className="h-5 w-5" />,
      href: "/dashboard/credentials",
      isActive: pathname.startsWith("/dashboard/credentials"),
    },
  ];

  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" },
  };

  const sidebarContentVariants = {
    expanded: { opacity: 1, transition: { delay: 0.2 } },
    collapsed: { opacity: 0, transition: { duration: 0.1 } },
  };

  // Add responsive state for mobile
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      className={`fixed left-0 top-0 h-screen bg-gradient-to-br from-green-50 to-green-100 dark:bg-[#1D1D2A] shadow-md dark:shadow-gray-900/20 z-20 flex flex-col ${
        isMobile && !isCollapsed ? "w-full" : ""
      }`}
      initial={isCollapsed ? "collapsed" : "expanded"}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Logo & Collapse Button */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
        <div className="flex items-center">
          <Leaf className="h-6 w-6 text-green-600 dark:text-green-500" />
          <motion.span
            className="ml-2 font-semibold text-lg dark:text-white"
            initial={isCollapsed ? "collapsed" : "expanded"}
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarContentVariants}
          >
            Green Fuel
          </motion.span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full ${
            isCollapsed
              ? "absolute -right-3 top-20 h-6 w-6 bg-white dark:bg-[#1D1D2A] border shadow-sm z-30"
              : ""
          }`}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1">
        <TooltipProvider>
          {sidebarItems.map((item) => (
            <Tooltip key={item.title} delayDuration={isCollapsed ? 300 : 1000}>
              <TooltipTrigger asChild>
                <Link href={item.href} passHref>
                  <Button
                    variant="ghost"
                    className={`
                      w-full justify-start mb-1 rounded-md cursor-pointer
                      ${
                        item.isActive
                          ? "bg-gray-100 dark:bg-gray-800 text-green-600 dark:text-green-500"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <div
                        className={
                          item.isActive
                            ? "text-green-600 dark:text-green-500"
                            : ""
                        }
                      >
                        {item.icon}
                      </div>
                      <motion.span
                        initial={isCollapsed ? "collapsed" : "expanded"}
                        animate={isCollapsed ? "collapsed" : "expanded"}
                        variants={sidebarContentVariants}
                        className="ml-3 truncate"
                      >
                        {item.title}
                      </motion.span>
                    </div>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className={isCollapsed ? "block" : "hidden"}
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t dark:border-gray-800">
        <TooltipProvider>
          <Tooltip delayDuration={isCollapsed ? 300 : 1000}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="h-5 w-5" />
                <motion.span
                  initial={isCollapsed ? "collapsed" : "expanded"}
                  animate={isCollapsed ? "collapsed" : "expanded"}
                  variants={sidebarContentVariants}
                  className="ml-3"
                >
                  Logout
                </motion.span>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className={isCollapsed ? "block" : "hidden"}
            >
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};

export default Sidebar;
