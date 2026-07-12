"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { StatCardGrid } from "@/components/dashboard/StatCardGrid";
import { ChangeIndicator } from "@/components/dashboard/ChangeIndicator";
import { formatCurrency } from "@/lib/format";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  TrendingUp,
} from "lucide-react";
import { isAdminAnalytics } from "@/hooks/useAnalytics";
import type {
  VendorAnalytics,
  AdminAnalytics,
} from "@/services/analytics.service";

interface AnalyticsSummaryCardsProps {
  analytics: VendorAnalytics | AdminAnalytics | undefined;
  isVendor: boolean;
  isLoading: boolean;
}

export function AnalyticsSummaryCards({
  analytics,
  isVendor,
  isLoading,
}: AnalyticsSummaryCardsProps) {
  const cards = analytics
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
    <StatCardGrid
      isLoading={isLoading}
      skeletonCount={isVendor ? 3 : 5}
      columns={cards.length}
    >
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </StatCardGrid>
  );
}
