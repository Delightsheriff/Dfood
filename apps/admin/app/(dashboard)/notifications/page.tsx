"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { Bell, Check } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    { title: "New Order #1234", time: "2 mins ago", read: false },
    { title: "Payment Received", time: "1 hour ago", read: true },
    { title: "New User Registered", time: "3 hours ago", read: true },
    { title: "System Update", time: "1 day ago", read: true },
  ];

  return (
    <PageShell
      title="Notifications"
      action={
        <button className="text-sm text-text-muted hover:text-text">
          Mark all as read
        </button>
      }
    >
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
    </PageShell>
  );
}
