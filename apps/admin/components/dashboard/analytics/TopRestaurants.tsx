"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { formatCurrency } from "@/lib/format";
import {
  CHART_TOOLTIP_STYLE,
  CHART_AXIS_PROPS,
  CHART_GRID_PROPS,
  BRAND_ORANGE,
} from "@/lib/chart-theme";
import type { AdminAnalytics } from "@/services/analytics.service";

interface TopRestaurantsProps {
  analytics?: AdminAnalytics;
  isLoading: boolean;
}

export function TopRestaurants({ analytics, isLoading }: TopRestaurantsProps) {
  if (!analytics?.topRestaurants?.length && !isLoading) return null;

  const data = (analytics?.topRestaurants ?? []).slice(0, 6).map((r) => ({
    name:
      r.restaurantName.length > 14
        ? r.restaurantName.slice(0, 14) + "…"
        : r.restaurantName,
    revenue: r.revenue,
    orders: r.orderCount,
  }));

  return (
    <ChartCard
      title="Top Restaurants by Revenue"
      isLoading={isLoading}
      isEmpty={data.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis
            type="number"
            {...CHART_AXIS_PROPS}
            tickFormatter={(v) => formatCurrency(v)}
          />
          <YAxis
            type="category"
            dataKey="name"
            {...CHART_AXIS_PROPS}
            width={100}
          />
          <CartesianGrid {...CHART_GRID_PROPS} horizontal={false} />
          <Tooltip
            {...CHART_TOOLTIP_STYLE}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [
              formatCurrency(Number(value)),
              "Revenue",
            ]}
          />
          <Bar
            dataKey="revenue"
            fill={BRAND_ORANGE}
            radius={[0, 4, 4, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
