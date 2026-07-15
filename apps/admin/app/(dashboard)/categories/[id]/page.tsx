"use client";

import { useParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/dashboard/PageShell";
import { useFoodItemsByCategory } from "@/hooks/useFoodItems";
import { useCategories } from "@/hooks/useCategory";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import type { FoodItem } from "@/services/food-items.service";

function formatPrice(price: number) {
  return `₦${price.toLocaleString()}`;
}

function getRestaurantName(item: FoodItem) {
  if (typeof item.restaurantId === "object" && item.restaurantId !== null) {
    return item.restaurantId.name;
  }
  return null;
}

function getRestaurantImage(item: FoodItem) {
  if (typeof item.restaurantId === "object" && item.restaurantId !== null) {
    return item.restaurantId.images?.[0];
  }
  return null;
}

function ItemsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-border bg-card overflow-hidden">
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

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const { data: categoriesRes } = useCategories();
  const {
    data: foodItemsRes,
    isLoading,
    isError,
  } = useFoodItemsByCategory(categoryId);

  const categories = categoriesRes?.data?.categories ?? [];
  const category = categories.find((c) => c._id === categoryId);
  const foodItems = foodItemsRes?.data?.foodItems ?? [];

  return (
    <PageShell
      title={category?.name ?? "Category"}
      action={
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/categories")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      }
    >
      {/* Category header card */}
      {category && (
        <Card className="border-border bg-card overflow-hidden">
          <CardContent className="flex items-center gap-4 p-4">
            {category.image ? (
              <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 border border-border">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-foreground">{category.name}</h2>
              <p className="text-sm text-muted-foreground">
                {foodItems.length} food item{foodItems.length !== 1 && "s"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Food items grid */}
      {isLoading ? (
        <ItemsSkeleton />
      ) : isError ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-destructive">Failed to load food items.</p>
        </div>
      ) : foodItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center py-16 text-center">
          <UtensilsCrossed className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">
            No food items in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foodItems.map((item) => {
            const restaurantName = getRestaurantName(item);
            const restaurantImage = getRestaurantImage(item);

            return (
              <Card
                key={item._id}
                className="border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all group"
              >
                {/* Image */}
                <div className="relative aspect-4/3 bg-muted">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {/* Price badge */}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/70 text-white border-none font-bold text-sm">
                      {formatPrice(item.price)}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-2">
                  <h3 className="font-bold text-foreground leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    {/* Rating */}
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-foreground font-medium">
                        {item.rating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        ({item.totalReviews})
                      </span>
                    </div>
                    {item.calories !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {item.calories} cal
                      </span>
                    )}
                  </div>

                  {/* Restaurant info */}
                  {restaurantName && (
                    <div className="flex items-center gap-2 pt-1 border-t border-border mt-2">
                      {restaurantImage ? (
                        <div className="relative h-5 w-5 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={restaurantImage}
                            alt={restaurantName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <UtensilsCrossed className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground truncate">
                        {restaurantName}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
