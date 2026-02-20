"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { MenuGrid } from "@/components/dashboard/MenuGrid";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";
import { UtensilsCrossed } from "lucide-react";

export default function MenuPage() {
  const { isAdmin } = useDashboardRole();

  if (isAdmin) {
    return (
      <PageShell title="Menu">
        <div className="rounded-xl border border-border bg-surface flex flex-col items-center justify-center py-16 text-center">
          <UtensilsCrossed className="h-10 w-10 text-text-dim mb-3" />
          <h3 className="text-lg font-bold text-text mb-1">Access Denied</h3>
          <p className="text-sm text-text-muted">
            This page is only available for vendors.
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Menu">
      <MenuGrid />
    </PageShell>
  );
}
