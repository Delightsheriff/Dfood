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
import {
  CHART_TOOLTIP_STYLE,
  CHART_AXIS_PROPS,
  CHART_GRID_PROPS,
  BRAND_ORANGE,
} from "@/lib/chart-theme";
import { formatCurrency } from "@/lib/format";

type DataPoint = { name: string; total: number };

interface RevenueChartProps {
  title?: string;
  data?: DataPoint[];
  isLoading?: boolean;
  height?: number;
  className?: string;
}

export function RevenueChart({
  title = "Revenue Overview",
  data,
  isLoading = false,
  height = 280,
  className,
}: RevenueChartProps) {
  return (
    <ChartCard
      title={title}
      isLoading={isLoading}
      isEmpty={!data || data.length === 0}
      emptyMessage="No revenue data available yet"
      height={height}
      className={`col-span-4 md:col-span-3 ${className ?? ""}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={BRAND_ORANGE} stopOpacity={0.3} />
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [
              formatCurrency(Number(value), { compact: false }),
              "Revenue",
            ]}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke={BRAND_ORANGE}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTotal)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
