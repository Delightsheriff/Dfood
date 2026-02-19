"use client";

import { CategoryList } from "@/components/dashboard/CategoryList";
import { PageShell } from "@/components/dashboard/PageShell";

export default function CategoriesPage() {
  return (
    <PageShell title="Categories">
      <CategoryList />
    </PageShell>
  );
}
