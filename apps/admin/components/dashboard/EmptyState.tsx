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
        "rounded-xl border border-border bg-card flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      <Icon className="h-10 w-10 text-muted-foreground mb-3" />
      {title && <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>}
      <p className="text-sm text-muted-foreground">{message}</p>
      {action && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 text-primary hover:text-primary/80"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
