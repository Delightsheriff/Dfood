"use client";

import { MenuGrid } from "@/components/dashboard/MenuGrid";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";

export default function MenuPage() {
  const { isAdmin } = useDashboardRole();

  // Simple client-side protection
  // Ideally this should be server-side or middleware, but for this demo context it works
  if (isAdmin) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-text">Access Denied</h2>
        <p className="text-text-muted">
          This page is only available for vendors.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MenuGrid />
    </div>
  );
}
