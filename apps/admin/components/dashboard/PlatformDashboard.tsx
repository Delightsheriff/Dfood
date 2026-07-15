"use client";

import React from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useOrderStats } from "@/hooks/useOrders";
import { StatCard } from "./StatCard";
import { StatCardGrid } from "./StatCardGrid";
import { ChartCard } from "./ChartCard";
import { formatCurrency } from "@/lib/format";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  PlusCircle,
  FileText,
  Radio,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { BRAND_ORANGE, CHART_AXIS_PROPS, CHART_GRID_PROPS, CHART_TOOLTIP_STYLE, CHART_PALETTE } from "@/lib/chart-theme";

export function PlatformDashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics({
    isVendor: false,
    params: { days: 7 },
  });
  const { data: stats, isLoading: statsLoading } = useOrderStats({ isVendor: false });

  const activeOrders =
    (stats?.statusBreakdown.pending ?? 0) + (stats?.statusBreakdown.preparing ?? 0);

  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.revenue.total ?? 0, { compact: false }),
      subtitle: `${formatCurrency(stats?.revenue.today ?? 0)} collected today`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Orders",
      value: (stats?.orders.total ?? 0).toLocaleString(),
      subtitle: `${stats?.orders.today ?? 0} dispatched today`,
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Platform Users",
      value: (analytics?.summary && "totalUsers" in analytics.summary ? analytics.summary.totalUsers : 0).toLocaleString(),
      subtitle: `+${analytics?.summary && "newUsers" in analytics.summary ? analytics.summary.newUsers : 0} growth this period`,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Active Shops",
      value: (analytics?.summary && "activeRestaurants" in analytics.summary ? analytics.summary.activeRestaurants : 0).toLocaleString(),
      subtitle: `${activeOrders} active deliveries`,
      icon: Store,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  // Map revenue trend
  const revenueData = analytics?.revenueTrend?.map((point) => {
    const date = new Date(point.date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    return { name: dayName, amount: point.revenue };
  });

  // Map user growth
  const userGrowthData = analytics && "userGrowth" in analytics
    ? analytics.userGrowth.map((point) => {
        const date = new Date(point.date);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        return { name: dayName, Customers: point.customers, Vendors: point.vendors };
      })
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Overview Stat Grid */}
      <StatCardGrid isLoading={statsLoading || analyticsLoading} columns={4} skeletonCount={4}>
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </StatCardGrid>

      {/* Main Charts & Analytics Section */}
      <div className="grid gap-6 md:grid-cols-6">
        {/* Revenue Area Chart */}
        <ChartCard
          title="Revenue Overview"
          isLoading={analyticsLoading}
          isEmpty={!revenueData || revenueData.length === 0}
          height={320}
          className="col-span-6 md:col-span-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="platformRevenueGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND_ORANGE} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={BRAND_ORANGE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" {...CHART_AXIS_PROPS} />
              <YAxis
                {...CHART_AXIS_PROPS}
                tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}K`}
              />
              <CartesianGrid {...CHART_GRID_PROPS} />
              <Tooltip
                {...CHART_TOOLTIP_STYLE}
                formatter={(value) => [formatCurrency(Number(value), { compact: false }), "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={BRAND_ORANGE}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#platformRevenueGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Quick Actions Panel */}
        <SpotlightCard
          className="col-span-6 md:col-span-2 border border-border bg-card p-6 flex flex-col justify-between"
          spotlightColor="rgba(255, 118, 34, 0.04)"
        >
          <div>
            <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/restaurants"
                className="flex items-center gap-3 w-full p-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted hover:border-border/80 transition-all duration-300 shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-primary" />
                Onboard New Restaurant
              </Link>
              <Link
                href="/notifications"
                className="flex items-center gap-3 w-full p-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted hover:border-border/80 transition-all duration-300 shadow-sm"
              >
                <Radio className="w-4 h-4 text-primary" />
                Launch Notice Broadcast
              </Link>
              <Link
                href="/logs"
                className="flex items-center gap-3 w-full p-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted hover:border-border/80 transition-all duration-300 shadow-sm"
              >
                <FileText className="w-4 h-4 text-primary" />
                View Security Audit Logs
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Platform Health</span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Stable
              </span>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* User Growth & Top Restaurants Grid */}
      <div className="grid gap-6 md:grid-cols-6">
        {/* User Growth Area Chart */}
        <ChartCard
          title="User Account Growth"
          isLoading={analyticsLoading}
          isEmpty={userGrowthData.length === 0}
          height={280}
          className="col-span-6 md:col-span-3"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowthData}>
              <XAxis dataKey="name" {...CHART_AXIS_PROPS} />
              <YAxis {...CHART_AXIS_PROPS} />
              <CartesianGrid {...CHART_GRID_PROPS} />
              <Tooltip {...CHART_TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="Customers" stroke={CHART_PALETTE[1]} fill={CHART_PALETTE[1]} fillOpacity={0.03} strokeWidth={2} />
              <Area type="monotone" dataKey="Vendors" stroke={CHART_PALETTE[2]} fill={CHART_PALETTE[2]} fillOpacity={0.03} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Performing Restaurants */}
        <SpotlightCard
          className="col-span-6 md:col-span-3 border border-border bg-card p-6"
          spotlightColor="rgba(255, 118, 34, 0.04)"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              Top Restaurants
            </h3>
            <Link
              href="/restaurants"
              className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-primary hover:opacity-85"
            >
              All Restaurants <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {analytics && "topRestaurants" in analytics
              ? analytics.topRestaurants.slice(0, 3).map((rest, index) => (
                  <div
                    key={rest.restaurantId}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary text-[10px]">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">
                          {rest.restaurantName}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {rest.orderCount} orders completed
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-primary">
                      {formatCurrency(rest.revenue)}
                    </div>
                  </div>
                ))
              : null}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
