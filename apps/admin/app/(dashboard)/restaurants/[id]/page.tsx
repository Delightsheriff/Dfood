"use client";

import { useParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useFoodItemsByRestaurant } from "@/hooks/useFoodItems";
import { useAllRestaurants } from "@/hooks/useRestaurant";
import { RestaurantHeader } from "@/components/dashboard/restaurants/RestaurantHeader";
import { FoodItemsGrid } from "@/components/dashboard/restaurants/FoodItemsGrid";

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;

  // ── Data fetching at page level ──────────────────────────────────
  const { data: restaurantsRes } = useAllRestaurants();
  const {
    data: foodItemsRes,
    isLoading,
    isError,
  } = useFoodItemsByRestaurant(restaurantId);

  const restaurants = restaurantsRes?.data?.restaurants ?? [];
  const restaurant = restaurants.find((r) => r._id === restaurantId);
  const foodItems = foodItemsRes?.data?.foodItems ?? [];

  return (
    <PageShell
      title={restaurant?.name ?? "Restaurant"}
      action={
        <Button
          variant="ghost"
          className="text-text-muted hover:text-text"
          onClick={() => router.push("/restaurants")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Restaurants
        </Button>
      }
    >
      {restaurant && (
        <RestaurantHeader
          restaurant={restaurant}
          menuCount={foodItems.length}
        />
      )}

      <FoodItemsGrid
        items={foodItems}
        isLoading={isLoading}
        isError={isError}
      />
    </PageShell>
  );
}
