"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardGridProps {
  /** Number of skeleton cards to show while loading */
  skeletonCount?: number;
  isLoading: boolean;
  children: React.ReactNode;
  /** Override responsive grid columns. Defaults are based on child count. */
  className?: string;
  /** Number of items — used to pick responsive grid cols. */
  columns?: number;
}

function getGridCols(count: number): string {
  if (count <= 4) return "grid-cols-2 lg:grid-cols-4";
  if (count === 5) return "grid-cols-2 lg:grid-cols-5";
  return "grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
}

export function StatCardGrid({
  skeletonCount = 4,
  isLoading,
  children,
  className,
  columns,
}: StatCardGridProps) {
  if (isLoading) {
    return (
      <div className={cn("grid gap-4", getGridCols(skeletonCount), className)}>
        {[...Array(skeletonCount)].map((_, i) => (
          <Card key={i} className="border-border bg-surface shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        columns ? getGridCols(columns) : "grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
