import {
  DollarSign,
  LayoutDashboard,
  Layers,
  LineChart,
  ShoppingBag,
  Store,
  Users,
  UtensilsCrossed,
} from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  roles: ("admin" | "vendor")[]; // Which roles can see this link
};

// Single source of truth for all navigation
export const navigationLinks: NavLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "vendor"],
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ShoppingBag,
    badge: "12", // This should come from real data
    roles: ["admin", "vendor"],
  },
  {
    href: "/restaurants",
    label: "Restaurants",
    icon: Store,
    roles: ["admin"], // Admin only
  },
  {
    href: "/categories",
    label: "Categories",
    icon: Layers,
    roles: ["admin"], // Admin only
  },
  {
    href: "/users",
    label: "Users",
    icon: Users,
    roles: ["admin"], // Admin only
  },
  {
    href: "/financials",
    label: "Financials",
    icon: DollarSign,
    roles: ["admin"], // Admin only
  },
  {
    href: "/menu",
    label: "Menu",
    icon: UtensilsCrossed,
    roles: ["vendor"], // Vendor only
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: LineChart,
    roles: ["admin", "vendor"],
  },
];
