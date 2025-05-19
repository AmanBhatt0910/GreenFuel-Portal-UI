"use client";

import { Credential } from "@/components/custom/CredentialsManagement/types";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Clock, ShieldAlert } from "lucide-react";

export interface CredentialStatsProps {
  credentials: Credential[];
}

export function CredentialStats() {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Total Employees"
        value={12}
        description="Total registered employees"
        icon={<Users className="h-5 w-5" />}
        trend={{ value: 4, label: "from last month" }}
        trendType="up"
      />
      <StatsCard
        title="Active Employees"
        value= {12}
        description="Currently active employees"
        icon={<UserCheck className="h-5 w-5" />}
        trend={{ value: 2, label: "from last month" }}
        trendType="up"
      />
      <StatsCard
        title="Pending Activation"
        value={14}
        description="Awaiting account setup"
        icon={<Clock className="h-5 w-5" />}
        trend={{ value: 1, label: "from last month" }}
        trendType="down"
      />
      <StatsCard
        title="Admin Users"
        value={12}
        description="Users with admin privileges"
        icon={<ShieldAlert className="h-5 w-5" />}
        trend={{ value: 0, label: "from last month" }}
        trendType="neutral"
      />
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend: { value: number; label: string };
  trendType: "up" | "down" | "neutral";
}

function StatsCard({ title, value, description, icon, trend, trendType }: StatsCardProps) {
  const trendColor = 
    trendType === "up"
      ? "text-green-600 dark:text-green-400"
      : trendType === "down"
        ? "text-red-600 dark:text-red-400"
        : "text-gray-600 dark:text-gray-400";

  const trendIcon = 
    trendType === "up"
      ? "↑"
      : trendType === "down"
        ? "↓"
        : "•";

  return (
    <Card className="border bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/90">
      <CardContent className="pt-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
        
        {trend.value > 0 ? (
          <p className={`text-xs mt-2 ${trendColor} flex items-center`}>
            <span className="mr-1">{trendIcon}</span>
            <span>{trend.value} {trend.label}</span>
          </p>
        ) : (
          <p className={`text-xs mt-2 ${trendColor} flex items-center`}>
            <span className="mr-1">{trendIcon}</span>
            <span>No change {trend.label}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}