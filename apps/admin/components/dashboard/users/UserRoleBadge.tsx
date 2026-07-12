"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/services/users.service";

export const ROLE_FILTERS: { label: string; value: UserRole | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Customers", value: "customer" },
  { label: "Vendors", value: "vendor" },
  { label: "Admins", value: "admin" },
];

const ROLE_STYLES: Record<UserRole, { className: string; label: string }> = {
  customer: {
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    label: "Customer",
  },
  vendor: {
    className: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    label: "Vendor",
  },
  admin: {
    className: "bg-orange/10 text-orange border-orange/20",
    label: "Admin",
  },
};

export function UserRoleBadge({ role }: { role: UserRole }) {
  const { className, label } = ROLE_STYLES[role] ?? {
    className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    label: role,
  };
  return (
    <Badge
      variant="outline"
      className={cn("font-medium capitalize", className)}
    >
      {label}
    </Badge>
  );
}
