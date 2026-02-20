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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
  if (isLoading) {
    return (
      <Card
        className={`col-span-4 border-border bg-surface md:col-span-3 ${className ?? ""}`}
      >
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="pl-2">
          <Skeleton className="w-full" style={{ height }} />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card
        className={`col-span-4 border-border bg-surface md:col-span-3 ${className ?? ""}`}
      >
        <CardHeader>
          <CardTitle className="text-base font-bold text-text">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-center justify-center text-text-muted text-sm"
            style={{ height }}
          >
            No revenue data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`col-span-4 border-border bg-surface md:col-span-3 ${className ?? ""}`}
    >
      <CardHeader>
        <CardTitle className="text-base font-bold text-text">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7622" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff7622" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#6b6b6b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b6b6b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}K`}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#f0ede8" }}
                labelStyle={{ color: "#999" }}
                formatter={(value: number) => [
                  `₦${value.toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#ff7622"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
