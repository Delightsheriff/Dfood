"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatCardGrid } from "@/components/dashboard/StatCardGrid";
import { UsersTable } from "@/components/dashboard/users/UsersTable";
import { UserDetailDialog } from "@/components/dashboard/users/UserDetailDialog";
import { useUsers, useUserStats } from "@/hooks/useUsers";
import { Users, ShoppingBag, Store, UserPlus } from "lucide-react";
import type { AdminUser, UserRole } from "@/services/users.service";

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // ── Data fetching at page level ──────────────────────────────────
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

  // ── Stat card definitions ────────────────────────────────────────
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
      <StatCardGrid isLoading={statsLoading} skeletonCount={4} columns={4}>
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </StatCardGrid>

      <UsersTable
        users={users}
        isLoading={usersLoading}
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onSelectUser={setSelectedUser}
      />

      <UserDetailDialog
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </PageShell>
  );
}
