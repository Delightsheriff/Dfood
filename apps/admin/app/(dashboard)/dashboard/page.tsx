"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";
import { PlatformDashboard } from "@/components/dashboard/PlatformDashboard";
import { RestaurantDashboard } from "@/components/dashboard/RestaurantDashboard";
import { RestaurantCompletionBanner } from "@/components/dashboard/RestaurantCompletionBanner";

export default function DashboardPage() {
  const { role, isRestaurantAdmin, isContentManager } = useDashboardRole();

  const isRestaurantSpecific = isRestaurantAdmin || isContentManager;

  return (
    <PageShell title="Dashboard Overview">
      {isRestaurantSpecific && <RestaurantCompletionBanner />}
      {isRestaurantSpecific ? <RestaurantDashboard /> : <PlatformDashboard />}
    </PageShell>
  );
}
