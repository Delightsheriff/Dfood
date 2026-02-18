"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Star, MapPin } from "lucide-react";

export default function RestaurantsPage() {
  const restaurants = [
    {
      name: "KFC Lekki",
      rating: 4.5,
      address: "Lekki Phase 1",
      status: "Active",
    },
    {
      name: "Dominos Pizza",
      rating: 4.2,
      address: "Victoria Island",
      status: "Active",
    },
    { name: "Mama Cass", rating: 4.0, address: "Ikeja", status: "Active" },
    {
      name: "Chicken Republic",
      rating: 4.3,
      address: "Surulere",
      status: "Inactive",
    },
    { name: "Sweet Sensation", rating: 3.8, address: "Yaba", status: "Active" },
  ];

  return (
    <PageShell
      title="Restaurants"
      action={
        <button className="bg-orange text-white px-4 py-2 rounded-md font-medium hover:bg-orange-dim transition-colors">
          + Add Restaurant
        </button>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((place, i) => (
          <Card
            key={i}
            className="bg-surface border-border hover:border-orange/50 transition-colors"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-text">
                {place.name}
              </CardTitle>
              <Store className="h-4 w-4 text-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-orange mb-2">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-bold">{place.rating}</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
                <MapPin className="h-4 w-4" />
                {place.address}
              </div>
              <div
                className={`text-xs font-mono font-bold uppercase tracking-wider ${place.status === "Active" ? "text-green-500" : "text-red-500"}`}
              >
                {place.status}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
