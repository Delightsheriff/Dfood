"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { OrderStatsCards } from "@/components/dashboard/OrderStatsCards";
import { OrdersTable } from "@/components/dashboard/OrdersTable";

export default function OrdersPage() {
  return (
    <PageShell title="Orders">
      <OrderStatsCards />
      <OrdersTable />
    </PageShell>
  );
}
