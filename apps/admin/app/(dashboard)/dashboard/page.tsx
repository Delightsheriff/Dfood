"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { RestaurantCompletionBanner } from "@/components/dashboard/RestaurantCompletionBanner";

export default function DashboardPage() {
  return (
    <PageShell title="Dashboard">
      <RestaurantCompletionBanner />
      <StatsGrid />
      <div className="grid gap-6 md:grid-cols-4">
        <RevenueChart />
        <ActivityFeed />
      </div>
    </PageShell>
  );
}
