"use client";

import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChangeIndicatorProps {
  value: number;
  suffix?: string;
}

export function ChangeIndicator({ value, suffix = "" }: ChangeIndicatorProps) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center text-xs text-text-muted">
        <Minus className="h-3 w-3 mr-0.5" /> 0%{suffix}
      </span>
    );
  }

  const isUp = value > 0;
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-semibold",
        isUp ? "text-green-500" : "text-red-500",
      )}
    >
      <Icon className="h-3 w-3 mr-0.5" />
      {Math.abs(value).toFixed(1)}%{suffix}
    </span>
  );
}
