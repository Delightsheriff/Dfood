"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

export default function AnalyticsPage() {
  return (
    <PageShell
      title="Analytics"
      action={
        <select className="bg-surface border border-border rounded-md px-3 py-1 text-sm text-text">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      }
    >
      <div className="grid gap-6">
        <RevenueChart />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl border border-border bg-surface flex items-center justify-center text-text-muted"
            >
              Chart {i} Placeholder
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
