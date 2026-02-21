"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { formatStatusLabel } from "@/lib/format";
import { CHART_TOOLTIP_STYLE, STATUS_COLORS } from "@/lib/chart-theme";

interface StatusBreakdownProps {
  data?: { status: string; count: number }[];
  isLoading: boolean;
}

export function StatusBreakdown({ data, isLoading }: StatusBreakdownProps) {
  const total = data?.reduce((sum, d) => sum + d.count, 0) ?? 0;
  const chartData =
    data?.map((d) => ({
      name: formatStatusLabel(d.status),
      value: d.count,
      fill: STATUS_COLORS[d.status] ?? "#6b6b6b",
    })) ?? [];

  return (
    <ChartCard
      title="Order Status Breakdown"
      isLoading={isLoading}
      isEmpty={chartData.length === 0}
      emptyMessage="No data"
    >
      <div className="flex items-center gap-6 h-full">
        <div className="h-[200px] w-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                {...CHART_TOOLTIP_STYLE}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [
                  `${Number(value)} (${total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0}%)`,
                  "",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm text-text">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-text">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
