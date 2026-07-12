"use client";

import * as React from "react";
import {
  Search,
  LayoutDashboard,
  ShoppingBag,
  Store,
  Settings,
  User,
  CreditCard,
  UtensilsCrossed,
  Loader2,
  Hash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDashboardSearch } from "@/hooks/useSearch";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type {
  SearchUser,
  SearchRestaurant,
  SearchOrder,
  SearchFoodItem,
} from "@/services/search.service";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// ── Quick-nav links shown when there's no query ───
const quickLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Restaurants", href: "/restaurants", icon: Store },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Users", href: "/users", icon: User },
  { label: "Financials", href: "/financials", icon: CreditCard },
];

// ── Props ──────────────────────────────────────────
interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const router = useRouter();
  const { isAdmin } = useDashboardRole();

  // Debounce the query (300ms)
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // ⌘K / Ctrl+K global shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Reset search when dialog closes
  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setDebouncedQuery("");
    }
  }, [open]);

  const { data: results, isFetching } = useDashboardSearch(debouncedQuery);

  const navigate = React.useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [onOpenChange, router],
  );

  // Determine if we have any search results
  const hasQuery = debouncedQuery.trim().length >= 2;
  const hasResults =
    hasQuery &&
    results &&
    (("users" in results && results.users.length > 0) ||
      ("restaurants" in results && results.restaurants.length > 0) ||
      ("orders" in results && results.orders.length > 0) ||
      ("foodItems" in results && results.foodItems.length > 0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135 bg-surface border-border p-0 gap-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Search</DialogTitle>
        </VisuallyHidden>

        {/* Search input */}
        <div className="flex items-center border-b border-border px-4">
          {isFetching ? (
            <Loader2 className="mr-2 h-5 w-5 shrink-0 animate-spin text-text-muted" />
          ) : (
            <Search className="mr-2 h-5 w-5 shrink-0 text-text-muted" />
          )}
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search everything…"
            className="flex-1 border-none bg-transparent py-4 text-base shadow-none focus-visible:ring-0 placeholder:text-text-dim text-text h-12"
          />
          <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-surface-2 px-1.5 font-mono text-[10px] font-medium text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div className="max-h-90 overflow-y-auto">
          {/* No query → show quick links */}
          {!hasQuery && (
            <div className="p-2">
              <p className="px-3 py-1.5 text-xs font-medium text-text-muted">
                Quick links
              </p>
              {quickLinks
                .filter(
                  (link) =>
                    isAdmin || !["/users", "/financials"].includes(link.href),
                )
                .map((link) => (
                  <button
                    key={link.href}
                    onClick={() => navigate(link.href)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text hover:bg-surface-2 transition-colors cursor-pointer"
                  >
                    <link.icon className="h-4 w-4 text-text-muted" />
                    {link.label}
                  </button>
                ))}
            </div>
          )}

          {/* Has query but still loading first time */}
          {hasQuery && !results && isFetching && (
            <div className="p-8 text-center text-sm text-text-muted">
              Searching…
            </div>
          )}

          {/* Has query, finished loading, no results */}
          {hasQuery && results && !hasResults && (
            <div className="p-8 text-center text-sm text-text-muted">
              No results for &ldquo;{debouncedQuery}&rdquo;
            </div>
          )}

          {/* Real results */}
          {hasResults && results && (
            <div className="p-2 space-y-1">
              {/* Users (admin only) */}
              {"users" in results && results.users.length > 0 && (
                <ResultGroup label="Users">
                  {results.users.map((u: SearchUser) => (
                    <ResultItem
                      key={u._id}
                      onClick={() => navigate("/users")}
                      icon={
                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarFallback className="bg-orange/10 text-orange text-[10px] font-bold">
                            {u.name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      }
                      title={u.name}
                      subtitle={u.email}
                      badge={u.role}
                    />
                  ))}
                </ResultGroup>
              )}

              {/* Restaurants (admin only) */}
              {"restaurants" in results && results.restaurants.length > 0 && (
                <ResultGroup label="Restaurants">
                  {results.restaurants.map((r: SearchRestaurant) => (
                    <ResultItem
                      key={r._id}
                      onClick={() => navigate(`/restaurants/${r._id}`)}
                      icon={
                        <Avatar className="h-6 w-6 border border-border rounded-lg">
                          <AvatarImage
                            src={r.images?.[0]}
                            alt={r.name}
                            className="rounded-lg"
                          />
                          <AvatarFallback className="bg-surface-2 text-text-muted text-[10px] rounded-lg">
                            <Store className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                      }
                      title={r.name}
                      subtitle={r.address}
                    />
                  ))}
                </ResultGroup>
              )}

              {/* Orders */}
              {"orders" in results && results.orders.length > 0 && (
                <ResultGroup label="Orders">
                  {results.orders.map((o: SearchOrder) => (
                    <ResultItem
                      key={o._id}
                      onClick={() => navigate("/orders")}
                      icon={
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-surface-2">
                          <Hash className="h-3 w-3 text-text-muted" />
                        </div>
                      }
                      title={o.orderNumber}
                      subtitle={
                        o.customerId?.name
                          ? `${o.customerId.name} · ₦${o.total?.toLocaleString()}`
                          : `₦${o.total?.toLocaleString()}`
                      }
                      badge={o.status}
                    />
                  ))}
                </ResultGroup>
              )}

              {/* Food Items */}
              {"foodItems" in results && results.foodItems.length > 0 && (
                <ResultGroup label="Food Items">
                  {results.foodItems.map((f: SearchFoodItem) => (
                    <ResultItem
                      key={f._id}
                      onClick={() => navigate("/menu")}
                      icon={
                        <Avatar className="h-6 w-6 border border-border rounded-lg">
                          <AvatarImage
                            src={f.images?.[0]}
                            alt={f.name}
                            className="rounded-lg object-cover"
                          />
                          <AvatarFallback className="bg-surface-2 text-text-muted text-[10px] rounded-lg">
                            <UtensilsCrossed className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                      }
                      title={f.name}
                      subtitle={
                        f.restaurantId?.name
                          ? `${f.restaurantId.name} · ₦${f.price?.toLocaleString()}`
                          : `₦${f.price?.toLocaleString()}`
                      }
                    />
                  ))}
                </ResultGroup>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Sub-components ─────────────────────────────────

function ResultGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="px-3 py-1.5 text-xs font-medium text-text-muted">{label}</p>
      {children}
    </div>
  );
}

function ResultItem({
  onClick,
  icon,
  title,
  subtitle,
  badge,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text hover:bg-surface-2 transition-colors cursor-pointer"
    >
      {icon}
      <div className="flex-1 text-left min-w-0">
        <p className="truncate font-medium">{title}</p>
        {subtitle && (
          <p className="truncate text-xs text-text-muted">{subtitle}</p>
        )}
      </div>
      {badge && (
        <Badge
          variant="outline"
          className="ml-auto shrink-0 border-border text-text-muted text-[10px] capitalize"
        >
          {badge}
        </Badge>
      )}
    </button>
  );
}
