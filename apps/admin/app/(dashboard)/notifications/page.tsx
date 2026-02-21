"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { NotificationList } from "@/components/dashboard/notifications/NotificationList";

// TODO: Replace with real data fetching via a useNotifications hook
const MOCK_NOTIFICATIONS = [
  { title: "New Order #1234", time: "2 mins ago", read: false },
  { title: "Payment Received", time: "1 hour ago", read: true },
  { title: "New User Registered", time: "3 hours ago", read: true },
  { title: "System Update", time: "1 day ago", read: true },
];

export default function NotificationsPage() {
  return (
    <PageShell
      title="Notifications"
      action={
        <button className="text-sm text-text-muted hover:text-text">
          Mark all as read
        </button>
      }
    >
      <NotificationList notifications={MOCK_NOTIFICATIONS} />
    </PageShell>
  );
}
