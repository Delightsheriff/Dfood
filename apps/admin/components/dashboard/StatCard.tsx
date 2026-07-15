"use client";

import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";

export interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
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
    <SpotlightCard
      className="border border-border bg-card shadow-sm transition-all duration-300 hover:shadow"
      spotlightColor="rgba(255, 118, 34, 0.04)"
    >
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className={cn("rounded-lg p-2.5", bgColor)}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground truncate">{value}</div>
      {change && <div className="mt-1">{change}</div>}
      {subtitle && (
        <p className="text-[10px] text-muted-foreground mt-2 truncate font-medium">
          {subtitle}
        </p>
      )}
    </SpotlightCard>
  );
}
