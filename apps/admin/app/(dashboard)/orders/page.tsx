"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { OrderStatsCards } from "@/components/dashboard/orders/OrderStatsCards";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";
import { useOrderStats } from "@/hooks/useOrders";

export default function OrdersPage() {
  const { isVendor } = useDashboardRole();

  // ── Data fetching at page level ──────────────────────────────────
  const { data: stats, isLoading } = useOrderStats({ isVendor });

  return (
    <PageShell title="Orders">
      <OrderStatsCards
        stats={stats}
        isVendor={isVendor}
        isLoading={isLoading}
      />
      <OrdersTable />
    </PageShell>
  );
}
