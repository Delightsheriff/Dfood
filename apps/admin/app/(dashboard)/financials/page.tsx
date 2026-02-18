"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StatsGrid } from "@/components/dashboard/StatsGrid";

export default function FinancialsPage() {
  return (
    <PageShell title="Financials">
      <div className="space-y-6">
        <StatsGrid />
        <div className="grid md:grid-cols-2 gap-6">
          <RevenueChart />
          <div className="rounded-xl border border-border p-6 bg-surface flex items-center justify-center text-text-muted">
            Transaction History (Placeholder)
          </div>
        </div>
      </div>
    </PageShell>
  );
}
