import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabManagerProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  allocationsContent: ReactNode;
  analyticsContent: ReactNode;
  transactionsContent: ReactNode;
  reportsContent: ReactNode;
}

export const TabManager = ({
  activeTab,
  setActiveTab,
  allocationsContent,
  analyticsContent,
  transactionsContent,
  reportsContent
}: TabManagerProps) => {
  const handleTabChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.pushState({}, '', url);
    setActiveTab(value);
  };

  return (
    <Tabs 
      value={activeTab} 
      className="w-full"
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="allocations">Budget Allocations</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      
      <TabsContent value="allocations" className="space-y-6">
        {allocationsContent}
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-6">
        {analyticsContent}
      </TabsContent>
      
      <TabsContent value="transactions" className="space-y-6">
        {transactionsContent}
      </TabsContent>
      
      <TabsContent value="reports" className="space-y-6">
        {reportsContent}
      </TabsContent>
    </Tabs>
  );
};
