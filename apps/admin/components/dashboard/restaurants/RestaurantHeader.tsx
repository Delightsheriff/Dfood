"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { Restaurant } from "@/services/restaurant.service";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  menuCount: number;
}

export function RestaurantHeader({
  restaurant,
  menuCount,
}: RestaurantHeaderProps) {
  const isOpen = restaurant.status === "Open";

  return (
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
              <h2 className="text-xl font-bold text-text">{restaurant.name}</h2>
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
              Delivery:{" "}
              {formatCurrency(restaurant.deliveryFee, { compact: false })}
            </span>
          </div>

          <p className="text-sm text-text-muted">
            {menuCount} menu item{menuCount !== 1 && "s"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
