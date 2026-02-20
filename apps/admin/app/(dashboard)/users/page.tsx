"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Users,
  ShoppingBag,
  Store,
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Eye,
} from "lucide-react";
import { useUsers, useUserStats } from "@/hooks/useUsers";
import type { AdminUser, UserRole } from "@/services/users.service";

const ROLE_FILTERS: { label: string; value: UserRole | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Customers", value: "customer" },
  { label: "Vendors", value: "vendor" },
  { label: "Admins", value: "admin" },
];

function getRoleBadge(role: UserRole) {
  const map: Record<UserRole, { className: string; label: string }> = {
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
  const { className, label } = map[role] ?? {
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name?: string) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  );
}

/* ------------------------------------------------------------------ */
/*  Stats skeleton                                                     */
/* ------------------------------------------------------------------ */
function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-border bg-surface">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Table skeleton                                                     */
/* ------------------------------------------------------------------ */
function TableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-text-muted">User</TableHead>
            <TableHead className="text-text-muted">Role</TableHead>
            <TableHead className="text-text-muted hidden sm:table-cell">
              Phone
            </TableHead>
            <TableHead className="text-text-muted hidden md:table-cell">
              Joined
            </TableHead>
            <TableHead className="text-right text-text-muted">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i} className="border-border">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-md" />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  User detail dialog                                                 */
/* ------------------------------------------------------------------ */
function UserDetailDialog({
  user,
  open,
  onClose,
}: {
  user: AdminUser | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-text">User Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="bg-orange/10 text-orange text-2xl font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-bold text-text">{user.name}</h3>
            {getRoleBadge(user.role)}
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-surface-2 p-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-text-muted" />
            <span className="text-text-muted">Email</span>
            <span className="ml-auto text-text font-medium">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-text-muted" />
              <span className="text-text-muted">Phone</span>
              <span className="ml-auto text-text font-medium">
                {user.phone}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-text-muted" />
            <span className="text-text-muted">Joined</span>
            <span className="ml-auto text-text font-medium">
              {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Build API filters — debounce search at the network-level via query key
  const filters = useMemo(
    () => ({
      ...(roleFilter !== "all" && { role: roleFilter }),
      ...(search.trim() && { search: search.trim() }),
    }),
    [roleFilter, search],
  );

  const { data: usersData, isLoading: usersLoading } = useUsers(filters);
  const { data: statsData, isLoading: statsLoading } = useUserStats();

  const users = usersData?.data?.users ?? [];
  const stats = statsData?.data;

  const statCards = [
    {
      label: "Total Users",
      value: stats?.total ?? "—",
      icon: Users,
      color: "text-orange",
      bgColor: "bg-orange/10",
    },
    {
      label: "Customers",
      value: stats?.customers ?? "—",
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Vendors",
      value: stats?.vendors ?? "—",
      icon: Store,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "New This Week",
      value: stats?.recentSignups ?? "—",
      icon: UserPlus,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <PageShell title="Users">
      {/* ---- STATS ---- */}
      {statsLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, i) => (
            <Card
              key={i}
              className="border-border bg-surface shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-text-muted font-mono uppercase tracking-wider">
                  {stat.label}
                </CardTitle>
                <div className={cn("rounded-lg p-2", stat.bgColor)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ---- FILTERS ---- */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface border-border focus:border-orange/50 focus:ring-orange/10 h-10 rounded-[10px]"
          />
        </div>

        {/* Role filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {ROLE_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant="ghost"
              size="sm"
              onClick={() => setRoleFilter(f.value)}
              className={cn(
                "rounded-full px-4 text-xs font-semibold tracking-wide uppercase transition-colors",
                roleFilter === f.value
                  ? "bg-orange/10 text-orange hover:bg-orange/20"
                  : "text-text-muted hover:bg-surface-2 hover:text-text",
              )}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ---- TABLE ---- */}
      {usersLoading ? (
        <TableSkeleton />
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-10 w-10 text-text-dim mb-3" />
          <p className="text-text-muted text-sm">No users found.</p>
          {(search || roleFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-orange hover:text-orange/80"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-text-muted">User</TableHead>
                <TableHead className="text-text-muted">Role</TableHead>
                <TableHead className="text-text-muted hidden sm:table-cell">
                  Phone
                </TableHead>
                <TableHead className="text-text-muted hidden md:table-cell">
                  Joined
                </TableHead>
                <TableHead className="text-right text-text-muted">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  className="border-border hover:bg-surface-2 transition-colors"
                >
                  <TableCell className="font-medium text-text">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={user.profileImage} alt={user.name} />
                        <AvatarFallback className="bg-orange/10 text-orange font-bold text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold leading-tight">
                          {user.name}
                        </div>
                        <div className="text-xs text-text-muted">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="text-text-muted text-sm hidden sm:table-cell">
                    {user.phone || "—"}
                  </TableCell>
                  <TableCell className="text-text-muted text-sm hidden md:table-cell">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-text-muted hover:text-white hover:bg-surface-2"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ---- DETAIL DIALOG ---- */}
      <UserDetailDialog
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </PageShell>
  );
}
