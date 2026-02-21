"use client";

import { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";
import { useAnalytics, isAdminAnalytics } from "@/hooks/useAnalytics";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatCardGrid } from "@/components/dashboard/StatCardGrid";
import { formatCurrency, formatShortDate } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  TrendingUp,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Extracted chart components
import { OrdersTrendChart } from "@/components/dashboard/analytics/OrdersTrendChart";
import { StatusBreakdown } from "@/components/dashboard/analytics/StatusBreakdown";
import { PopularItems } from "@/components/dashboard/analytics/PopularItems";
import { TopRestaurants } from "@/components/dashboard/analytics/TopRestaurants";
import { CategoryPerformance } from "@/components/dashboard/analytics/CategoryPerformance";
import { UserGrowthChart } from "@/components/dashboard/analytics/UserGrowthChart";

// ── Constants & Helpers ───────────────────────────────────────────────────────

const DAY_OPTIONS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

function ChangeIndicator({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  if (value === 0)
    return (
      <span className="inline-flex items-center text-xs text-text-muted">
        <Minus className="h-3 w-3 mr-0.5" /> 0%{suffix}
      </span>
    );
  const isUp = value > 0;
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-semibold",
        isUp ? "text-green-500" : "text-red-500",
      )}
    >
      <Icon className="h-3 w-3 mr-0.5" />
      {Math.abs(value).toFixed(1)}%{suffix}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { isVendor } = useDashboardRole();
  const [days, setDays] = useState("7");
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

  // Build summary cards from analytics data
  const summaryCards = analytics
    ? [
        {
          label: "Total Revenue",
          value: formatCurrency(analytics.summary.totalRevenue),
          change: (
            <ChangeIndicator
              value={analytics.summary.revenueChange}
              suffix=" vs prior period"
            />
          ),
          icon: DollarSign,
          color: "text-orange",
          bgColor: "bg-orange/10",
        },
        {
          label: "Total Orders",
          value: analytics.summary.totalOrders.toLocaleString(),
          change: (
            <ChangeIndicator
              value={analytics.summary.ordersChange}
              suffix=" vs prior period"
            />
          ),
          icon: ShoppingBag,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "Avg Order Value",
          value: formatCurrency(analytics.summary.averageOrderValue),
          icon: TrendingUp,
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
        },
        // Admin-only cards
        ...(!isVendor && isAdminAnalytics(analytics)
          ? [
              {
                label: "Active Restaurants",
                value: analytics.summary.activeRestaurants.toLocaleString(),
                icon: Store,
                color: "text-green-500",
                bgColor: "bg-green-500/10",
              },
              {
                label: "Total Users",
                value: analytics.summary.totalUsers.toLocaleString(),
                change: (
                  <ChangeIndicator
                    value={analytics.summary.usersChange}
                    suffix=" vs prior period"
                  />
                ),
                icon: Users,
                color: "text-cyan-500",
                bgColor: "bg-cyan-500/10",
              },
            ]
          : []),
      ]
    : [];

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
      {/* Summary cards */}
      <StatCardGrid
        isLoading={isLoading}
        skeletonCount={isVendor ? 3 : 5}
        columns={summaryCards.length}
      >
        {summaryCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </StatCardGrid>

      {/* Revenue + Orders trend */}
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart
          title={isVendor ? "Sales Trend" : "Revenue Trend"}
          data={revenueData}
          isLoading={isLoading}
          className="col-span-1! !md:col-span-1"
          height={250}
        />
        <OrdersTrendChart data={analytics?.orderTrend} isLoading={isLoading} />
      </div>

      {/* Status breakdown + Popular items / Top restaurants */}
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

      {/* Admin-only: Category performance + User growth */}
      {!isVendor && (
        <div className="grid gap-6 md:grid-cols-2">
          <CategoryPerformance analytics={admin} isLoading={isLoading} />
          <UserGrowthChart analytics={admin} isLoading={isLoading} />
        </div>
      )}
    </PageShell>
  );
}
