"use client";

import { useDashboardRole } from "./DashboardRoleContext";
import { useOrderStats } from "@/hooks/useOrders";
import { StatCard } from "./StatCard";
import { StatCardGrid } from "./StatCardGrid";
import { formatCurrency } from "@/lib/format";
import {
  DollarSign,
  ShoppingBag,
  Store,
  Activity,
  TrendingUp,
  Users,
} from "lucide-react";

export function StatsGrid() {
  const { isVendor } = useDashboardRole();
  const { data: stats, isLoading } = useOrderStats({ isVendor });

  if (!stats && !isLoading) return null;

  const pendingCount = stats?.statusBreakdown.pending ?? 0;
  const preparingCount = stats?.statusBreakdown.preparing ?? 0;
  const activeOrders = pendingCount + preparingCount;

  const cards = stats
    ? [
        {
          label: "Total Revenue",
          value: formatCurrency(stats.revenue.total),
          subtitle: `${formatCurrency(stats.revenue.today)} today`,
          icon: DollarSign,
          color: "text-orange",
          bgColor: "bg-orange/10",
        },
        {
          label: "Orders",
          value: stats.orders.total.toLocaleString(),
          subtitle: `${stats.orders.today} today · ${stats.orders.thisMonth} this month`,
          icon: ShoppingBag,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "Active Orders",
          value: activeOrders.toLocaleString(),
          subtitle: `${pendingCount} pending · ${preparingCount} preparing`,
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
          subtitle: `${stats.orders.thisWeek} orders this week`,
          icon: Activity,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        },
        // Admin-only: top restaurant
        ...(!isVendor && stats.topRestaurants?.length
          ? [
              {
                label: "Top Restaurant",
                value: stats.topRestaurants[0].restaurantName,
                subtitle: `${stats.topRestaurants[0].orderCount} orders · ${formatCurrency(stats.topRestaurants[0].revenue)}`,
                icon: Store,
                color: "text-emerald-500",
                bgColor: "bg-emerald-500/10",
              },
            ]
          : []),
        // Admin-only: monthly revenue
        ...(!isVendor
          ? [
              {
                label: "Monthly Revenue",
                value: formatCurrency(stats.revenue.thisMonth ?? 0),
                subtitle: `${formatCurrency(stats.revenue.thisWeek ?? 0)} this week`,
                icon: Users,
                color: "text-cyan-500",
                bgColor: "bg-cyan-500/10",
              },
            ]
          : []),
      ]
    : [];

  return (
    <StatCardGrid
      isLoading={isLoading}
      skeletonCount={isVendor ? 4 : 6}
      columns={cards.length}
    >
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </StatCardGrid>
  );
}
