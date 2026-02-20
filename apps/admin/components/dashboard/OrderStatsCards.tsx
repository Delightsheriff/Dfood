"use client";

import { useOrderStats } from "@/hooks/useOrders";
import { useDashboardRole } from "./DashboardRoleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  Clock,
  DollarSign,
  TrendingUp,
  CalendarDays,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function OrderStatsCards() {
  const { isVendor } = useDashboardRole();
  const { data: stats, isLoading } = useOrderStats({ isVendor });

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border bg-surface">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-8 w-16 mb-1" />
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
    sub: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  };

  const cards: StatCard[] = [
    {
      label: "Total Orders",
      value: stats.orders.total.toLocaleString(),
      sub: `${stats.orders.today} today`,
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "This Month",
      value: stats.orders.thisMonth.toLocaleString(),
      sub: `${stats.orders.thisWeek} this week`,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Pending",
      value: (stats.statusBreakdown.pending ?? 0).toLocaleString(),
      sub: `${stats.statusBreakdown.preparing ?? 0} preparing`,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Revenue Today",
      value: formatCurrency(stats.revenue.today),
      sub: `${formatCurrency(stats.revenue.total)} total`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  // Admin-only cards for weekly/monthly revenue breakdown
  if (!isVendor) {
    if (stats.revenue.thisWeek != null || stats.revenue.thisMonth != null) {
      cards.push({
        label: "Monthly Revenue",
        value: formatCurrency(stats.revenue.thisMonth ?? 0),
        sub: `${formatCurrency(stats.revenue.thisWeek ?? 0)} this week`,
        icon: CalendarDays,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
      });
    }

    if (stats.topRestaurants && stats.topRestaurants.length > 0) {
      const top = stats.topRestaurants[0];
      cards.push({
        label: "Top Restaurant",
        value: top.restaurantName,
        sub: `${top.orderCount} orders · ${formatCurrency(top.revenue)}`,
        icon: Store,
        color: "text-orange",
        bgColor: "bg-orange/10",
      });
    }
  }

  // Determine grid columns based on card count
  const gridCols =
    cards.length <= 4
      ? "grid-cols-2 lg:grid-cols-4"
      : cards.length === 5
        ? "grid-cols-2 lg:grid-cols-5"
        : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";

  return (
    <div className={cn("grid gap-4", gridCols)}>
      {cards.map((card) => (
        <Card
          key={card.label}
          className="border-border bg-surface hover:border-border/80 transition-colors"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                {card.label}
              </span>
              <div className={cn("rounded-lg p-2", card.bgColor)}>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
            </div>
            <div className="text-2xl font-bold text-text truncate">
              {card.value}
            </div>
            <p className="text-xs text-text-muted mt-1 truncate">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function formatCurrency(amount: number): string {
  if (!amount || Number.isNaN(amount)) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}
