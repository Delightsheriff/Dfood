"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
      <Card className={cn("border-border bg-surface", className)}>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full" style={{ height }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border bg-surface", className)}>
      <CardHeader
        className={
          action ? "flex flex-row items-center justify-between" : undefined
        }
      >
        <CardTitle className="text-base font-bold text-text">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div
            className="flex items-center justify-center text-text-muted text-sm"
            style={{ height }}
          >
            {emptyMessage}
          </div>
        ) : (
          <div style={{ height }}>{children}</div>
        )}
      </CardContent>
    </Card>
  );
}
