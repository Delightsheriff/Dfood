"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  /** Optional change indicator element */
  change?: React.ReactNode;
}

export function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  color,
  bgColor,
  change,
}: StatCardProps) {
  return (
    <Card className="border-border bg-surface shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {label}
          </span>
          <div className={cn("rounded-lg p-2", bgColor)}>
            <Icon className={cn("h-4 w-4", color)} />
          </div>
        </div>
        <div className="text-2xl font-bold text-text truncate">{value}</div>
        {change && <div className="mt-1">{change}</div>}
        {subtitle && (
          <p className="text-xs text-text-muted mt-1 truncate">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
