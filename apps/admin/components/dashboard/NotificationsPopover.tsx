"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
} from "@/hooks/useNotifications";
import { getNotificationHref } from "@/services/notification.service";
import type { Notification } from "@/services/notification.service";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

export function NotificationsPopover() {
  const { data: notifications, isLoading } = useNotifications({ limit: 5 });
  const { data: unreadCount } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const router = useRouter();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead.mutate(notification._id);
    }
    const href = getNotificationHref(notification);
    if (href) {
      router.push(href);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          {(unreadCount ?? 0) > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount && unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="glass w-80 border-border p-0" align="end">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h4 className="font-semibold text-foreground">Notifications</h4>
          <Link
            href="/notifications"
            className="text-xs text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : !notifications || notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={cn(
                  "cursor-pointer border-b border-border p-4 transition-colors last:border-0 hover:bg-muted",
                  !n.read && "bg-primary/5",
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-1 h-2 w-2 shrink-0 rounded-full",
                      n.read ? "bg-transparent" : "bg-primary",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm",
                        n.read ? "text-muted-foreground" : "font-medium text-foreground",
                      )}
                    >
                      {n.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {n.message}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
