"use client";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-text">
          Restaurants
        </h1>
      </div>
      <RestaurantList />
    </div>
  );
}
