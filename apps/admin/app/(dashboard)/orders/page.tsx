"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { OrdersTable } from "@/components/dashboard/OrdersTable";

export default function OrdersPage() {
  return (
    <PageShell title="Orders">
      <OrdersTable />
    </PageShell>
  );
}
