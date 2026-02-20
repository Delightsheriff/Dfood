"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Store,
  Search,
  MapPin,
  Star,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useAllRestaurants } from "@/hooks/useRestaurant";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RestaurantList() {
  const router = useRouter();
  const { data: response, isLoading, isError } = useAllRestaurants();
  const [searchTerm, setSearchTerm] = useState("");

  const restaurants = response?.data?.restaurants || [];

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-orange" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load restaurants. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search restaurants..."
            className="pl-8 bg-surface border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Future: Add filters here */}
      </div>

      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-xl text-text">All Restaurants</CardTitle>
          <CardDescription className="text-text-muted">
            Manage and view all registered restaurants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-surface-hover">
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRestaurants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-hover">
                          <Store className="h-6 w-6 text-text-muted" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-text">
                            No restaurants found
                          </p>
                          <p className="text-sm text-text-muted">
                            {searchTerm
                              ? "Try adjusting your search terms"
                              : "No restaurants have been registered yet"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRestaurants.map((restaurant) => (
                    <TableRow
                      key={restaurant._id}
                      className="border-border hover:bg-surface-hover"
                    >
                      <TableCell>
                        <div className="relative h-10 w-10 rounded-md overflow-hidden bg-background">
                          {restaurant.images?.[0] ? (
                            <Image
                              src={restaurant.images[0]}
                              alt={restaurant.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <Store className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-text">
                            {restaurant.name}
                          </span>
                          <span className="flex items-center text-xs text-text-muted">
                            <MapPin className="mr-1 h-3 w-3" />
                            {restaurant.address || "No address"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            restaurant.status === "Open"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            restaurant.status === "Open"
                              ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                              : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
                          }
                        >
                          {restaurant.status || "Closed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-text">
                          <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{restaurant.rating.toFixed(1)}</span>
                          <span className="ml-1 text-xs text-text-muted">
                            ({restaurant.totalReviews})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                navigator.clipboard.writeText(restaurant._id)
                              }
                            >
                              Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/restaurants/${restaurant._id}`)
                              }
                              className="cursor-pointer"
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500 focus:text-red-500">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
