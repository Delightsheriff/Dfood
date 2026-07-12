"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      <Icon className="h-10 w-10 text-text-dim mb-3" />
      {title && <h3 className="text-lg font-bold text-text mb-1">{title}</h3>}
      <p className="text-sm text-text-muted">{message}</p>
      {action && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 text-orange hover:text-orange/80"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
