"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";

interface ChartCardProps {
  title: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  height?: number;
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ChartCard({
  title,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available",
  height = 250,
  className,
  children,
  action,
}: ChartCardProps) {
  if (isLoading) {
    return (
      <div className={cn("border border-border bg-card rounded-2xl p-6 shadow-sm", className)}>
        <Skeleton className="h-5 w-36 mb-4" />
        <Skeleton className="w-full" style={{ height }} />
      </div>
    );
  }

  return (
    <SpotlightCard
      className={cn("border border-border bg-card shadow-sm", className)}
      spotlightColor="rgba(255, 118, 34, 0.02)"
    >
      <div className="flex flex-row items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        {action}
      </div>
      <div>
        {isEmpty ? (
          <div
            className="flex items-center justify-center text-muted-foreground text-xs"
            style={{ height }}
          >
            {emptyMessage}
          </div>
        ) : (
          <div style={{ height }}>{children}</div>
        )}
      </div>
    </SpotlightCard>
  );
}
