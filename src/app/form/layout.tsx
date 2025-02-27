"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/custom/Dashboard/Sidebar';

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#C5B299] to-[#e9ecef] dark:from-[#1E1E2E] dark:to-[#2D2D3A]">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div 
        className={`
          flex-1 transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "ml-20" : "ml-64"}
        `}
      >
        <main className="overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout;