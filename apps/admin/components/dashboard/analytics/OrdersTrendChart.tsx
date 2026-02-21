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

interface OrdersTrendChartProps {
  data?: { date: string; orders: number }[];
  isLoading: boolean;
}

export function OrdersTrendChart({ data, isLoading }: OrdersTrendChartProps) {
  const chartData =
    data?.map((p) => ({ name: formatShortDate(p.date), orders: p.orders })) ??
    [];

  return (
    <ChartCard
      title="Orders Trend"
      isLoading={isLoading}
      isEmpty={chartData.length === 0}
      emptyMessage="No order data available"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" {...CHART_AXIS_PROPS} />
          <YAxis {...CHART_AXIS_PROPS} />
          <CartesianGrid {...CHART_GRID_PROPS} />
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorOrders)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
