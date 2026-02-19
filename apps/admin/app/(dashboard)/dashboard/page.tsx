"use client";

import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

import { RestaurantCompletionBanner } from "@/components/dashboard/RestaurantCompletionBanner";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <RestaurantCompletionBanner />
      <StatsGrid />
      <div className="grid gap-6 md:grid-cols-4">
        <RevenueChart />
        <ActivityFeed />
      </div>
    </div>
  );
}
