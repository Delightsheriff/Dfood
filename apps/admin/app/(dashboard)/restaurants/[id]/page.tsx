"use client";

import { useParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/dashboard/PageShell";
import { useFoodItemsByRestaurant } from "@/hooks/useFoodItems";
import { useAllRestaurants } from "@/hooks/useRestaurant";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, UtensilsCrossed, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

function formatPrice(price: number) {
  return `₦${price.toLocaleString()}`;
}

function ItemsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-border bg-surface overflow-hidden">
          <Skeleton className="aspect-4/3 w-full" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;

  const { data: restaurantsRes } = useAllRestaurants();
  const {
    data: foodItemsRes,
    isLoading,
    isError,
  } = useFoodItemsByRestaurant(restaurantId);

  const restaurants = restaurantsRes?.data?.restaurants ?? [];
  const restaurant = restaurants.find((r) => r._id === restaurantId);
  const foodItems = foodItemsRes?.data?.foodItems ?? [];

  const isOpen = restaurant?.status === "Open";

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
      {/* Restaurant header card */}
      {restaurant && (
        <Card className="border-border bg-surface overflow-hidden">
          <CardContent className="p-0">
            {/* Cover image */}
            {restaurant.images?.[0] && (
              <div className="relative h-44 w-full">
                <Image
                  src={restaurant.images[0]}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <Badge
                    className={cn(
                      "font-semibold",
                      isOpen
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30",
                    )}
                    variant="outline"
                  >
                    {isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-text">
                    {restaurant.name}
                  </h2>
                  {restaurant.description && (
                    <p className="text-sm text-text-muted mt-1 max-w-lg">
                      {restaurant.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm shrink-0">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-text">
                    {restaurant.rating.toFixed(1)}
                  </span>
                  <span className="text-text-muted">
                    ({restaurant.totalReviews})
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                {restaurant.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {restaurant.address}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {restaurant.openingTime} — {restaurant.closingTime}
                </span>
                <span className="font-medium text-orange">
                  Delivery: {formatPrice(restaurant.deliveryFee)}
                </span>
              </div>

              <p className="text-sm text-text-muted">
                {foodItems.length} menu item{foodItems.length !== 1 && "s"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Food items grid */}
      {isLoading ? (
        <ItemsSkeleton />
      ) : isError ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-red-500">Failed to load menu items.</p>
        </div>
      ) : foodItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface flex flex-col items-center justify-center py-16 text-center">
          <UtensilsCrossed className="h-10 w-10 text-text-dim mb-3" />
          <p className="text-text-muted text-sm">
            This restaurant has no menu items yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foodItems.map((item) => (
            <Card
              key={item._id}
              className="border-border bg-surface overflow-hidden hover:border-orange/40 hover:shadow-md transition-all group"
            >
              {/* Image */}
              <div className="relative aspect-4/3 bg-surface-2">
                {item.images?.[0] ? (
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UtensilsCrossed className="h-8 w-8 text-text-dim" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/70 text-white border-none font-bold text-sm">
                    {formatPrice(item.price)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-2">
                <h3 className="font-bold text-text leading-tight">
                  {item.name}
                </h3>
                <p className="text-xs text-text-muted line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-text font-medium">
                      {item.rating.toFixed(1)}
                    </span>
                    <span className="text-text-muted text-xs">
                      ({item.totalReviews})
                    </span>
                  </div>
                  {item.calories !== undefined && (
                    <span className="text-xs text-text-muted">
                      {item.calories} cal
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
