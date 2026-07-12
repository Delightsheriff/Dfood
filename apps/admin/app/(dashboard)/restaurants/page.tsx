"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { RestaurantList } from "@/components/dashboard/RestaurantList";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RestaurantsPage() {
  const { data: session, status } = useSession();

  // Client-side protection (can also be done in middleware/layout)
  if (status === "loading") {
    return null;
  }

  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <PageShell title="Restaurants">
      <RestaurantList />
    </PageShell>
  );
}
