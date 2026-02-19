"use client";

import { AlertCircle, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRestaurantCompletion } from "@/hooks/useRestaurant";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";

export function RestaurantCompletionBanner() {
  const { isVendor } = useDashboardRole();
  const { data: completion, isLoading } = useRestaurantCompletion(isVendor);
  const [dismissed, setDismissed] = useState(false);

  // Only show for vendors
  if (!isVendor) return null;

  // Don't show while loading
  if (isLoading) return null;

  // Don't show if profile is complete
  if (completion?.isProfileComplete) return null;

  // Don't show if dismissed
  if (dismissed) return null;

  const missingFields = completion?.missingFields || [];
  const missingCount = missingFields.length;

  if (missingCount === 0) return null;

  return (
    <div className="relative bg-orange/10 border border-orange/30 rounded-lg p-4 mb-6">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-orange/60 hover:text-orange transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-full bg-orange/20 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-orange" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-orange mb-1">
            Complete Your Restaurant Profile
          </h3>
          <p className="text-sm text-text-muted mb-3">
            You&apos;re missing {missingCount}{" "}
            {missingCount === 1 ? "field" : "fields"}. Complete your profile to
            start receiving orders and appear in customer searches.
          </p>

          {missingFields.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {missingFields.slice(0, 3).map((field) => (
                <span
                  key={field}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-orange/10 border border-orange/20 text-xs text-orange font-medium"
                >
                  {formatFieldName(field)}
                </span>
              ))}
              {missingFields.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-orange/10 border border-orange/20 text-xs text-orange font-medium">
                  +{missingFields.length - 3} more
                </span>
              )}
            </div>
          )}

          <Link
            href="/settings"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange hover:text-orange/80 transition-colors"
          >
            Complete Profile
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper function to format field names
function formatFieldName(field: string): string {
  const fieldNames: Record<string, string> = {
    logo: "Restaurant Logo",
    bannerImage: "Banner Image",
    description: "Description",
    phone: "Phone Number",
    address: "Full Address",
    openingTime: "Opening Hours",
    closingTime: "Closing Hours",
    deliveryFee: "Delivery Fee",
    images: "Restaurant Images",
  };

  return fieldNames[field] || field;
}
