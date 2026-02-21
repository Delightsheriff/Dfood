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

interface CategoryPerformanceProps {
  analytics?: AdminAnalytics;
  isLoading: boolean;
}

export function CategoryPerformance({
  analytics,
  isLoading,
}: CategoryPerformanceProps) {
  if (!analytics?.categoryPerformance?.length && !isLoading) return null;

  const data = (analytics?.categoryPerformance ?? []).slice(0, 6).map((c) => ({
    name:
      c.categoryName.length > 16
        ? c.categoryName.slice(0, 16) + "…"
        : c.categoryName,
    revenue: c.revenue,
    orders: c.orderCount,
  }));

  return (
    <ChartCard
      title="Category Performance"
      isLoading={isLoading}
      isEmpty={data.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" {...CHART_AXIS_PROPS} fontSize={11} />
          <YAxis
            {...CHART_AXIS_PROPS}
            tickFormatter={(v) => formatCurrency(v)}
          />
          <CartesianGrid {...CHART_GRID_PROPS} />
          <Tooltip
            {...CHART_TOOLTIP_STYLE}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: any) => [
              name === "revenue"
                ? formatCurrency(Number(value))
                : Number(value).toLocaleString(),
              name === "revenue" ? "Revenue" : "Orders",
            ]}
          />
          <Bar dataKey="revenue" fill={BRAND_ORANGE} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
