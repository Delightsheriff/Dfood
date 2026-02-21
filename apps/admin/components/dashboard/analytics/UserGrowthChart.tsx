"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { formatShortDate } from "@/lib/format";
import {
  CHART_TOOLTIP_STYLE,
  CHART_AXIS_PROPS,
  CHART_GRID_PROPS,
} from "@/lib/chart-theme";
import type { AdminAnalytics } from "@/services/analytics.service";

interface UserGrowthChartProps {
  analytics?: AdminAnalytics;
  isLoading: boolean;
}

export function UserGrowthChart({
  analytics,
  isLoading,
}: UserGrowthChartProps) {
  if (!analytics?.userGrowth?.length && !isLoading) return null;

  const data = (analytics?.userGrowth ?? []).map((p) => ({
    name: formatShortDate(p.date),
    customers: p.customers,
    vendors: p.vendors,
  }));

  return (
    <ChartCard
      title="User Growth"
      isLoading={isLoading}
      isEmpty={data.length === 0}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVendors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" {...CHART_AXIS_PROPS} />
              <YAxis {...CHART_AXIS_PROPS} />
              <CartesianGrid {...CHART_GRID_PROPS} />
              <Tooltip {...CHART_TOOLTIP_STYLE} />
              <Area
                type="monotone"
                dataKey="customers"
                stroke="#22c55e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCustomers)"
              />
              <Area
                type="monotone"
                dataKey="vendors"
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVendors)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-xs text-text-muted">Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500" />
            <span className="text-xs text-text-muted">Vendors</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
