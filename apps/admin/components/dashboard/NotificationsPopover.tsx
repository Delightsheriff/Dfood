"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function NotificationsPopover() {
  const notifications = [
    { title: "New Order #1234", time: "2 mins ago", read: false },
    { title: "Payment Received", time: "1 hour ago", read: true },
    { title: "System Update", time: "5 hours ago", read: true },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-text-muted hover:bg-surface-2 hover:text-text"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-orange" />
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="glass w-80 border-border p-0" align="end">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h4 className="font-semibold text-text">Notifications</h4>
          <Link
            href="/notifications"
            className="text-xs text-orange hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.map((n, i) => (
            <div
              key={i}
              className={cn(
                "cursor-pointer border-b border-border p-4 transition-colors last:border-0 hover:bg-surface-2",
                !n.read && "bg-orange/5",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-1 h-2 w-2 shrink-0 rounded-full",
                    n.read ? "bg-transparent" : "bg-orange",
                  )}
                />
                <div>
                  <p
                    className={cn(
                      "text-sm",
                      n.read ? "text-text-muted" : "font-medium text-text",
                    )}
                  >
                    {n.title}
                  </p>
                  <p className="mt-1 text-xs text-text-dim">{n.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
