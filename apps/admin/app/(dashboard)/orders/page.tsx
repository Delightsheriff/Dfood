"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";
import { useOrderStats } from "@/hooks/useOrders";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatCardGrid } from "@/components/dashboard/StatCardGrid";
import { formatCurrency } from "@/lib/format";
import {
  ShoppingBag,
  Clock,
  DollarSign,
  TrendingUp,
  CalendarDays,
  Store,
} from "lucide-react";

export default function OrdersPage() {
  const { isVendor } = useDashboardRole();
  const { data: stats, isLoading } = useOrderStats({ isVendor });

  const cards = stats
    ? [
        {
          label: "Total Orders",
          value: stats.orders.total.toLocaleString(),
          subtitle: `${stats.orders.today} today`,
          icon: ShoppingBag,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "This Month",
          value: stats.orders.thisMonth.toLocaleString(),
          subtitle: `${stats.orders.thisWeek} this week`,
          icon: TrendingUp,
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
        },
        {
          label: "Pending",
          value: (stats.statusBreakdown.pending ?? 0).toLocaleString(),
          subtitle: `${stats.statusBreakdown.preparing ?? 0} preparing`,
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
        },
        {
          label: "Revenue Today",
          value: formatCurrency(stats.revenue.today),
          subtitle: `${formatCurrency(stats.revenue.total)} total`,
          icon: DollarSign,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
        },
        // Admin-only cards
        ...(!isVendor &&
        (stats.revenue.thisWeek != null || stats.revenue.thisMonth != null)
          ? [
              {
                label: "Monthly Revenue",
                value: formatCurrency(stats.revenue.thisMonth ?? 0),
                subtitle: `${formatCurrency(stats.revenue.thisWeek ?? 0)} this week`,
                icon: CalendarDays,
                color: "text-emerald-500",
                bgColor: "bg-emerald-500/10",
              },
            ]
          : []),
        ...(!isVendor && stats.topRestaurants?.length
          ? [
              {
                label: "Top Restaurant",
                value: stats.topRestaurants[0].restaurantName,
                subtitle: `${stats.topRestaurants[0].orderCount} orders · ${formatCurrency(stats.topRestaurants[0].revenue)}`,
                icon: Store,
                color: "text-orange",
                bgColor: "bg-orange/10",
              },
            ]
          : []),
      ]
    : [];

  return (
    <PageShell title="Orders">
      <StatCardGrid
        isLoading={isLoading}
        skeletonCount={isVendor ? 4 : 6}
        columns={cards.length}
      >
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </StatCardGrid>
      <OrdersTable />
    </PageShell>
  );
}
