import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Store,
  Users,
  UtensilsCrossed,
  LineChart,
  Percent,
  Star,
  DollarSign,
  FolderOpen,
  FileText,
  History,
} from "lucide-react";
import { Role } from "@/components/dashboard/DashboardRoleContext";

export type NavLink = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: Role[]; // Updated to match the 6 V2 roles
};

// Single source of truth for all navigation matching the V2 system
export const navigationLinks: NavLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "manager", "support", "restaurant_admin", "content_manager", "finance"],
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ShoppingBag,
    roles: ["super_admin", "manager", "support", "restaurant_admin", "finance"],
  },
  {
    href: "/restaurants",
    label: "Restaurants",
    icon: Store,
    roles: ["super_admin", "manager"],
  },
  {
    href: "/categories",
    label: "Categories",
    icon: Layers,
    roles: ["super_admin", "manager", "content_manager"],
  },
  {
    href: "/users",
    label: "Customers",
    icon: Users,
    roles: ["super_admin", "support"],
  },
  {
    href: "/menu",
    label: "Menu Items",
    icon: UtensilsCrossed,
    roles: ["restaurant_admin", "content_manager"],
  },
  {
    href: "/promotions",
    label: "Promotions",
    icon: Percent,
    roles: ["super_admin", "manager", "content_manager"],
  },
  {
    href: "/reviews",
    label: "Reviews",
    icon: Star,
    roles: ["super_admin", "manager", "support"],
  },
  {
    href: "/financials",
    label: "Financials",
    icon: DollarSign,
    roles: ["super_admin", "finance"],
  },
  {
    href: "/media",
    label: "Media Library",
    icon: FolderOpen,
    roles: ["super_admin", "content_manager", "restaurant_admin"],
  },
  {
    href: "/logs",
    label: "Activity Logs",
    icon: History,
    roles: ["super_admin"],
  },
  {
    href: "/reports",
    label: "Reports",
    icon: FileText,
    roles: ["super_admin", "manager", "finance"],
  },
];
