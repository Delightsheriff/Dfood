"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Star, UtensilsCrossed } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import Image from "next/image";

interface FoodItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  rating: number;
  totalReviews: number;
  calories?: number;
}

interface FoodItemsGridProps {
  items: FoodItem[];
  isLoading: boolean;
  isError?: boolean;
}

function GridSkeleton() {
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

export function FoodItemsGrid({
  items,
  isLoading,
  isError,
}: FoodItemsGridProps) {
  if (isLoading) return <GridSkeleton />;

  if (isError) {
    return (
      <div className="rounded-xl border border-border bg-surface p-12 text-center">
        <p className="text-red-500">Failed to load menu items.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        message="This restaurant has no menu items yet."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
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
                {formatCurrency(item.price, { compact: false })}
              </Badge>
            </div>
          </div>

          <CardContent className="p-4 space-y-2">
            <h3 className="font-bold text-text leading-tight">{item.name}</h3>
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
  );
}
