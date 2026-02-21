"use client";

import { Bell } from "lucide-react";

interface Notification {
  title: string;
  time: string;
  read: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAllRead?: () => void;
}

export function NotificationList({ notifications }: NotificationListProps) {
  return (
    <div className="space-y-2 max-w-2xl">
      {notifications.map((n, i) => (
        <div
          key={i}
          className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${n.read ? "border-transparent bg-surface/50" : "border-orange/20 bg-orange/5"}`}
        >
          <div
            className={`mt-1 p-2 rounded-full ${n.read ? "bg-surface-2" : "bg-orange/20 text-orange"}`}
          >
            <Bell className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h4
              className={`text-sm font-semibold ${n.read ? "text-text-muted" : "text-text"}`}
            >
              {n.title}
            </h4>
            <p className="text-xs text-text-dim">{n.time}</p>
          </div>
          {!n.read && <div className="h-2 w-2 rounded-full bg-orange mt-2" />}
        </div>
      ))}
    </div>
  );
}
