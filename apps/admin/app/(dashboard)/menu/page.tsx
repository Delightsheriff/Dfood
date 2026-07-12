"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { MenuGrid } from "@/components/dashboard/MenuGrid";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";
import { UtensilsCrossed } from "lucide-react";

export default function MenuPage() {
  const { isAdmin } = useDashboardRole();

  if (isAdmin) {
    return (
      <PageShell title="Menu">
        <EmptyState
          icon={UtensilsCrossed}
          title="Access Denied"
          message="This page is only available for vendors."
        />
      </PageShell>
    );
  }

  return (
    <PageShell title="Menu">
      <MenuGrid />
    </PageShell>
  );
}
