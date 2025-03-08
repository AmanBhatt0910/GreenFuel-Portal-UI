"use client";
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/custom/dashboard/AppSidebar';
import AppHeader from '@/components/custom/dashboard/AppHeader';

interface LayoutProps {
  children: React.ReactNode
}

const DashboardProvider = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 w-full">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main Content - will automatically adjust to available space */}
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <AppHeader />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-b dark:from-gray-900 dark:to-gray-950">
            <div className="mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardProvider;