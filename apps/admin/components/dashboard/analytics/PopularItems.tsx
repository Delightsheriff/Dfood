"use client";

import { Badge } from "@/components/ui/badge";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { formatCurrency } from "@/lib/format";

interface PopularItemsProps {
  items?: { name: string; orders: number; revenue: number }[];
  isLoading: boolean;
}

export function PopularItems({ items, isLoading }: PopularItemsProps) {
  if (!items || items.length === 0) {
    if (isLoading) {
      return (
        <ChartCard title="Popular Items" isLoading>
          {null as never}
        </ChartCard>
      );
    }
    return null;
  }

  const maxOrders = Math.max(...items.map((i) => i.orders));

  return (
    <ChartCard title="Popular Items" isEmpty={false}>
      <div className="space-y-4 overflow-y-auto h-full">
        {items.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-text truncate max-w-[60%]">
                {item.name}
              </span>
              <div className="flex items-center gap-3 text-xs">
                <Badge
                  variant="secondary"
                  className="bg-blue-500/10 text-blue-500 border-0"
                >
                  {item.orders} orders
                </Badge>
                <span className="text-text-muted font-mono">
                  {formatCurrency(item.revenue)}
                </span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-orange transition-all duration-500"
                style={{
                  width: `${(item.orders / maxOrders) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
