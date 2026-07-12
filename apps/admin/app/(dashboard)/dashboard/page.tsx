"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { RestaurantCompletionBanner } from "@/components/dashboard/RestaurantCompletionBanner";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function DashboardPage() {
  const { isVendor } = useDashboardRole();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics({
    isVendor,
    params: { days: 7 },
  });

  // Map revenue trend to chart format
  const revenueData = analytics?.revenueTrend?.map((point) => {
    const date = new Date(point.date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    return { name: dayName, total: point.revenue };
  });

  return (
    <PageShell title="Dashboard">
      <RestaurantCompletionBanner />
      <StatsGrid />
      <div className="grid gap-6 md:grid-cols-4">
        <RevenueChart
          title={isVendor ? "Sales Overview" : "Revenue Overview"}
          data={revenueData}
          isLoading={analyticsLoading}
        />
        <ActivityFeed />
      </div>
    </PageShell>
  );
}
