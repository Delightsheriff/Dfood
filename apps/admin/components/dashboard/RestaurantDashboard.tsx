"use client";

import React, { useState, useEffect } from "react";
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
  Utensils,
  Star,
  PlusCircle,
  Percent,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Link from "next/link";
import { BRAND_ORANGE, CHART_AXIS_PROPS, CHART_GRID_PROPS, CHART_TOOLTIP_STYLE } from "@/lib/chart-theme";

type OperationalStatus = "Open" | "Closed" | "Busy" | "Disabled";

export function RestaurantDashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics({
    isVendor: true,
    params: { days: 7 },
  });
  const { data: stats, isLoading: statsLoading } = useOrderStats({ isVendor: true });

  const [status, setStatus] = useState<OperationalStatus>("Open");

  useEffect(() => {
    const saved = localStorage.getItem("dfood_restaurant_status") as OperationalStatus;
    if (saved) {
      setStatus(saved);
    }
  }, []);

  const handleStatusChange = (newStatus: OperationalStatus) => {
    setStatus(newStatus);
    localStorage.setItem("dfood_restaurant_status", newStatus);
  };

  const cards = [
    {
      label: "Shop Revenue",
      value: formatCurrency(stats?.revenue.total ?? 0, { compact: false }),
      subtitle: `${formatCurrency(stats?.revenue.today ?? 0)} today`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Sales Orders",
      value: (stats?.orders.total ?? 0).toLocaleString(),
      subtitle: `${stats?.orders.today ?? 0} orders today`,
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Menu Items",
      value: "18 items",
      subtitle: "3 categories",
      icon: Utensils,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Customer Rating",
      value: "4.8 / 5.0",
      subtitle: "24 reviews",
      icon: Star,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  // Map revenue trend
  const revenueData = analytics?.revenueTrend?.map((point) => {
    const date = new Date(point.date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    return { name: dayName, amount: point.revenue };
  });

  // Map popular items
  const popularItemsData = analytics && "popularItems" in analytics
    ? analytics.popularItems.map((item) => ({
        name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
        orders: item.orders,
      }))
    : [];

  const statusConfigs: { value: OperationalStatus; label: string; color: string; hover: string }[] = [
    { value: "Open", label: "Open", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", hover: "hover:bg-emerald-500/20" },
    { value: "Closed", label: "Closed", color: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20", hover: "hover:bg-zinc-500/20" },
    { value: "Busy", label: "Busy", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", hover: "hover:bg-amber-500/20" },
    { value: "Disabled", label: "Disabled", color: "bg-destructive/10 text-destructive border-red-500/20", hover: "hover:bg-destructive/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Overview Stat Grid */}
      <StatCardGrid isLoading={statsLoading || analyticsLoading} columns={4} skeletonCount={4}>
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </StatCardGrid>

      {/* Charts & Actions Section */}
      <div className="grid gap-6 md:grid-cols-6">
        {/* Sales Area Chart */}
        <ChartCard
          title="Sales Overview"
          isLoading={analyticsLoading}
          isEmpty={!revenueData || revenueData.length === 0}
          height={320}
          className="col-span-6 md:col-span-4"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="vendorRevenueGlow" x1="0" y1="0" x2="0" y2="1">
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
                formatter={(value) => [formatCurrency(Number(value), { compact: false }), "Sales"]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={BRAND_ORANGE}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#vendorRevenueGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Operational Status & Quick Actions */}
        <div className="col-span-6 md:col-span-2 space-y-6 flex flex-col justify-between">
          {/* Restaurant Status Card */}
          <SpotlightCard
            className="border border-border bg-card p-6"
            spotlightColor="rgba(255, 118, 34, 0.04)"
          >
            <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider text-muted-foreground">
              Operational Status
            </h3>
            
            <div className="grid grid-cols-2 gap-2.5">
              {statusConfigs.map((cfg) => {
                const isActive = status === cfg.value;
                return (
                  <button
                    key={cfg.value}
                    onClick={() => handleStatusChange(cfg.value)}
                    className={`flex items-center justify-center p-3 text-xs font-semibold rounded-xl border transition-all duration-300 ${
                      isActive ? cfg.color + " border-current" : "border-border bg-background text-muted-foreground " + cfg.hover
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </SpotlightCard>

          {/* Quick Actions */}
          <SpotlightCard
            className="border border-border bg-card p-6 flex-1 flex flex-col justify-center"
            spotlightColor="rgba(255, 118, 34, 0.04)"
          >
            <h3 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider text-muted-foreground">
              Shop Actions
            </h3>
            <div className="space-y-2.5">
              <Link
                href="/menu"
                className="flex items-center gap-3 w-full p-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted hover:border-border/85 transition-all duration-300 shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-primary" />
                Add New Menu Item
              </Link>
              <Link
                href="/promotions"
                className="flex items-center gap-3 w-full p-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted hover:border-border/85 transition-all duration-300 shadow-sm"
              >
                <Percent className="w-4 h-4 text-primary" />
                Launch Coupon Campaign
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 w-full p-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted hover:border-border/85 transition-all duration-300 shadow-sm"
              >
                <Clock className="w-4 h-4 text-primary" />
                Update Opening Hours
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Popular Items Row */}
      <div className="grid gap-6 md:grid-cols-6">
        {/* Popular Items Bar Chart */}
        <ChartCard
          title="Popular Items Performance"
          isLoading={analyticsLoading}
          isEmpty={popularItemsData.length === 0}
          height={280}
          className="col-span-6 md:col-span-3"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularItemsData} layout="vertical">
              <XAxis type="number" {...CHART_AXIS_PROPS} />
              <YAxis dataKey="name" type="category" {...CHART_AXIS_PROPS} width={100} />
              <CartesianGrid {...CHART_GRID_PROPS} />
              <Tooltip {...CHART_TOOLTIP_STYLE} />
              <Bar dataKey="orders" fill={BRAND_ORANGE} radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Live Orders Overview Summary */}
        <SpotlightCard
          className="col-span-6 md:col-span-3 border border-border bg-card p-6"
          spotlightColor="rgba(255, 118, 34, 0.04)"
        >
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground mb-6">
            Live Deliveries Checklist
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 border border-border rounded-xl bg-background">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary text-[10px]">
                  #1
                </span>
                <div>
                  <div className="text-xs font-bold text-foreground">ORD-20260715-AB</div>
                  <div className="text-[9px] text-muted-foreground">1x Chicken Spaghetti, 2x Soda</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20 animate-pulse">
                Pending
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 border border-border rounded-xl bg-background">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 font-bold text-blue-500 text-[10px]">
                  #2
                </span>
                <div>
                  <div className="text-xs font-bold text-foreground">ORD-20260715-XY</div>
                  <div className="text-[9px] text-muted-foreground">2x Jollof Rice with Beef</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-500 border border-blue-500/20">
                Preparing
              </span>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
