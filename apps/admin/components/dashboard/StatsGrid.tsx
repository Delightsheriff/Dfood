"use client";

import { useDashboardRole } from "./DashboardRoleContext";
import { useOrderStats } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  ShoppingBag,
  Store,
  Activity,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatCurrency(amount: number): string {
  if (!amount || Number.isNaN(amount)) return "₦0";
  if (amount >= 1_000_000)
    return `₦${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (amount >= 1_000)
    return `₦${(amount / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `₦${amount.toLocaleString()}`;
}

export function StatsGrid() {
  const { isVendor } = useDashboardRole();
  const { data: stats, isLoading } = useOrderStats({ isVendor });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border bg-surface shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  type StatCard = {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  };

  const pendingCount = stats.statusBreakdown.pending ?? 0;
  const preparingCount = stats.statusBreakdown.preparing ?? 0;
  const activeOrders = pendingCount + preparingCount;

  const cards: StatCard[] = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.revenue.total),
      change: `${formatCurrency(stats.revenue.today)} today`,
      trend: "up",
      icon: DollarSign,
      color: "text-orange",
      bgColor: "bg-orange/10",
    },
    {
      label: "Orders",
      value: stats.orders.total.toLocaleString(),
      change: `${stats.orders.today} today · ${stats.orders.thisMonth} this month`,
      trend: "up",
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Active Orders",
      value: activeOrders.toLocaleString(),
      change: `${pendingCount} pending · ${preparingCount} preparing`,
      trend: "neutral",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Avg Order Value",
      value:
        stats.orders.total > 0
          ? formatCurrency(stats.revenue.total / stats.orders.total)
          : "₦0",
      change: `${stats.orders.thisWeek} orders this week`,
      trend: "up",
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  // Admin-only: show top restaurant or total restaurants
  if (!isVendor && stats.topRestaurants && stats.topRestaurants.length > 0) {
    const top = stats.topRestaurants[0];
    cards.push({
      label: "Top Restaurant",
      value: top.restaurantName,
      change: `${top.orderCount} orders · ${formatCurrency(top.revenue)}`,
      trend: "up",
      icon: Store,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    });
  }

  if (!isVendor) {
    cards.push({
      label: "Monthly Revenue",
      value: formatCurrency(stats.revenue.thisMonth ?? 0),
      change: `${formatCurrency(stats.revenue.thisWeek ?? 0)} this week`,
      trend: "up",
      icon: Users,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    });
  }

  const gridCols =
    cards.length <= 4
      ? "grid-cols-2 lg:grid-cols-4"
      : cards.length === 5
        ? "grid-cols-2 lg:grid-cols-5"
        : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";

  return (
    <div className={cn("grid gap-4", gridCols)}>
      {cards.map((stat) => (
        <Card
          key={stat.label}
          className="border-border bg-surface shadow-sm hover:shadow-md transition-all duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-muted font-mono uppercase tracking-wider">
              {stat.label}
            </CardTitle>
            <div className={cn("rounded-lg p-2", stat.bgColor)}>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text mb-1 truncate">
              {stat.value}
            </div>
            <p className="text-xs text-text-muted truncate">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
