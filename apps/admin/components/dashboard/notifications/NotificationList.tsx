"use client";

import { Bell, Check, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/services/notification.service";
import { getNotificationHref } from "@/services/notification.service";

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

  const handleClick = (n: Notification) => {
    if (!n.read && onMarkAsRead) {
      onMarkAsRead(n._id);
    }
    const href = getNotificationHref(n);
    if (href) {
      router.push(href);
    }
  };
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Bell className="h-12 w-12 text-text-dim" />
        <h3 className="mt-4 text-lg font-semibold text-text">
          No notifications
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          You&apos;re all caught up! We&apos;ll notify you when something new
          arrives.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-w-2xl">
      {notifications.map((n) => (
        <div
          key={n._id}
          onClick={() => handleClick(n)}
          className={cn(
            "group flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer",
            n.read
              ? "border-transparent bg-surface/50"
              : "border-orange/20 bg-orange/5",
          )}
        >
          <div
            className={cn(
              "mt-1 p-2 rounded-full shrink-0",
              n.read ? "bg-surface-2" : "bg-orange/20 text-orange",
            )}
          >
            <Bell className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className={cn(
                "text-sm font-semibold",
                n.read ? "text-text-muted" : "text-text",
              )}
            >
              {n.title}
            </h4>
            <p className="mt-0.5 text-xs text-text-muted truncate">
              {n.message}
            </p>
            <p className="text-xs text-text-dim mt-1">
              {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {!n.read && onMarkAsRead && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-text-muted hover:text-green-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(n._id);
                }}
                title="Mark as read"
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-text-muted hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(n._id);
                }}
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {!n.read && (
            <div className="h-2 w-2 rounded-full bg-orange mt-2 shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}
