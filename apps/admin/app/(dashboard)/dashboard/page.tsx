"use client";

import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsGrid />
      <div className="grid gap-6 md:grid-cols-4">
        <RevenueChart />
        <ActivityFeed />
      </div>
    </div>
  );
}
