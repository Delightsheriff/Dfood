"use client";

import { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";
import { useAnalytics, isAdminAnalytics } from "@/hooks/useAnalytics";
import { formatShortDate } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AnalyticsSummaryCards } from "@/components/dashboard/analytics/AnalyticsSummaryCards";
import { OrdersTrendChart } from "@/components/dashboard/analytics/OrdersTrendChart";
import { StatusBreakdown } from "@/components/dashboard/analytics/StatusBreakdown";
import { PopularItems } from "@/components/dashboard/analytics/PopularItems";
import { TopRestaurants } from "@/components/dashboard/analytics/TopRestaurants";
import { CategoryPerformance } from "@/components/dashboard/analytics/CategoryPerformance";
import { UserGrowthChart } from "@/components/dashboard/analytics/UserGrowthChart";

const DAY_OPTIONS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

export default function AnalyticsPage() {
  const { isVendor } = useDashboardRole();
  const [days, setDays] = useState("7");

  // ── Data fetching at page level ──────────────────────────────────
  const { data: analytics, isLoading } = useAnalytics({
    isVendor,
    params: { days: Number(days) },
  });

  const revenueData = analytics?.revenueTrend?.map((p) => ({
    name: formatShortDate(p.date),
    total: p.revenue,
  }));

  const admin =
    analytics && isAdminAnalytics(analytics) ? analytics : undefined;

  return (
    <PageShell
      title="Analytics"
      action={
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-40 bg-surface border-border text-text">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      <AnalyticsSummaryCards
        analytics={analytics}
        isVendor={isVendor}
        isLoading={isLoading}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart
          title={isVendor ? "Sales Trend" : "Revenue Trend"}
          data={revenueData}
          isLoading={isLoading}
          className="col-span-1"
          height={250}
        />
        <OrdersTrendChart data={analytics?.orderTrend} isLoading={isLoading} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <StatusBreakdown
          data={analytics?.statusBreakdown}
          isLoading={isLoading}
        />
        {isVendor ? (
          <PopularItems
            items={
              analytics && !isAdminAnalytics(analytics)
                ? analytics.popularItems
                : undefined
            }
            isLoading={isLoading}
          />
        ) : (
          <TopRestaurants analytics={admin} isLoading={isLoading} />
        )}
      </div>

      {!isVendor && (
        <div className="grid gap-6 md:grid-cols-2">
          <CategoryPerformance analytics={admin} isLoading={isLoading} />
          <UserGrowthChart analytics={admin} isLoading={isLoading} />
        </div>
      )}
    </PageShell>
  );
}
