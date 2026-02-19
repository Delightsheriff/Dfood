"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RestaurantSettings() {
  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle className="text-text">Restaurant Details</CardTitle>
        <CardDescription className="text-text-muted">
          Manage your restaurant information and settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-8 text-center text-text-muted border border-dashed border-border rounded-lg">
          <p>Restaurant settings configuration coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
