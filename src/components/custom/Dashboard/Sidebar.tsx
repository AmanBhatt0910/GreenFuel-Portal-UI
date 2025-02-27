"use client";
import React, { useState } from "react";
import Link from "next/link";

import {
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FormInput,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({
  className,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse: externalOnToggleCollapse,
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  const isCollapsed =
    externalIsCollapsed !== undefined
      ? externalIsCollapsed
      : internalIsCollapsed;
  const toggleCollapse =
    externalOnToggleCollapse ||
    (() => setInternalIsCollapsed(!internalIsCollapsed));

  const pathname = usePathname();
  const currentPath = pathname || "";

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Form",
      href: "/form",
      icon: <FormInput className="h-5 w-5" />,
    },
  ];

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      <div
        className={`
          fixed top-0 left-0 flex flex-col h-screen ${sidebarWidth} 
          bg-white dark:bg-[#1D1D2A]
          text-gray-800 dark:text-gray-100
          shadow-lg dark:shadow-none
          transition-all duration-300 ease-in-out
          border-r border-gray-200 dark:border-gray-700
          ${className || ""}
        `}
      >
        <button
          onClick={toggleCollapse}
          className="
            absolute 
            top-4 
            -right-4
            bg-white dark:bg-gray-800
            border 
            border-gray-200 dark:border-gray-700
            rounded-full 
            w-8 
            h-8 
            flex 
            items-center 
            justify-center 
            shadow-md 
            z-10
            hover:bg-gray-50 dark:hover:bg-gray-700
            transition-all
          "
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          )}
        </button>

        <div className="flex items-center mb-8 mt-4 px-4 h-16 border-b border-gray-200 dark:border-gray-700">
          <div className="h-8 w-10 rounded-md bg-indigo-600 dark:bg-indigo-500 mr-3 flex items-center justify-center text-white font-bold text-xl">
            GF
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
            }`}
          >
            <h1 className="text-xl font-bold whitespace-nowrap">Green Fuel</h1>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link href={item.href} key={item.href}>
                <div
                  className={`
                  flex items-center ${
                    isCollapsed ? "justify-center" : "px-4"
                  } py-3 rounded-md 
                  transition-colors cursor-pointer
                  mb-1
                  ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }
                `}
                >
                  <div
                    className={`
                    ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  `}
                  >
                    {item.icon}
                  </div>
                  <div
                    className={`ml-3 overflow-hidden transition-all duration-300 ease-in-out ${
                      isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
                    }`}
                  >
                    <span
                      className={`${
                        isActive ? "font-medium" : ""
                      } whitespace-nowrap`}
                    >
                      {item.title}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto mb-6 px-2">
          <div
            className={`
            flex items-center ${
              isCollapsed ? "justify-center" : "px-4"
            } py-3 rounded-md 
            text-red-500 dark:text-red-400
            hover:bg-red-50 dark:hover:bg-red-900/20
            transition-colors cursor-pointer
          `}
          >
            <LogOut className="h-5 w-5" />
            <div
              className={`ml-3 overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
              }`}
            >
              <span className="whitespace-nowrap">Logout</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;