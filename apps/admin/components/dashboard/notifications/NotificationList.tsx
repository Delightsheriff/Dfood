"use client";

import { Bell, Check, Trash2, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/services/notification.service";
import { getNotificationHref } from "@/services/notification.service";
import { useState } from "react";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
}: NotificationListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const handleClick = (n: Notification) => {
    if (!n.read && onMarkAsRead) {
      onMarkAsRead(n._id);
    }
    const href = getNotificationHref(n);
    if (href) {
      router.push(href);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-2xl">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm animate-pulse">
          <Bell className="h-5 w-5" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          No notifications
        </h3>
        <p className="text-[10px] text-muted-foreground mt-1.5 font-semibold leading-relaxed">
          You&apos;re all caught up! We&apos;ll notify you when something new arrives.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Category filters */}
      <div className="flex items-center gap-2 pb-1.5">
        <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        {["all", "unread", "read"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-300",
              filter === f
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <SpotlightCard
            key={n._id}
            onClick={() => handleClick(n)}
            className={cn(
              "group flex items-start gap-4 p-4 border transition-all cursor-pointer rounded-xl shadow-sm",
              n.read
                ? "border-border/60 bg-card/60"
                : "border-primary/20 bg-primary/5"
            )}
            spotlightColor={n.read ? "rgba(255, 118, 34, 0.01)" : "rgba(255, 118, 34, 0.03)"}
          >
            <div
              className={cn(
                "mt-0.5 p-2 rounded-lg shrink-0",
                n.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
              )}
            >
              <Bell className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <h4
                className={cn(
                  "text-xs font-bold leading-snug",
                  n.read ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {n.title}
              </h4>
              <p className="mt-1 text-[11px] text-muted-foreground leading-normal">
                {n.message}
              </p>
              <p className="text-[9px] text-muted-foreground/60 mt-2 font-bold font-mono">
                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {!n.read && onMarkAsRead && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-emerald-500 hover:bg-muted/40 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(n._id);
                  }}
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-muted/40 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(n._id);
                  }}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {!n.read && (
              <div className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0 animate-pulse" />
            )}
          </SpotlightCard>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground text-xs">
            No notifications matching selection filter
          </div>
        )}
      </div>
    </div>
  );
}
