"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDate, getInitials } from "@/lib/format";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { UserRoleBadge, ROLE_FILTERS } from "./UserRoleBadge";
import { Search, Users, Eye } from "lucide-react";
import type { AdminUser, UserRole } from "@/services/users.service";

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */
interface UsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: UserRole | "all";
  onRoleFilterChange: (value: UserRole | "all") => void;
  onSelectUser: (user: AdminUser) => void;
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                            */
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
/*  Main component                                                      */
/* ------------------------------------------------------------------ */
export function UsersTable({
  users,
  isLoading,
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  onSelectUser,
}: UsersTableProps) {
  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-surface border-border focus:border-orange/50 focus:ring-orange/10 h-10 rounded-[10px]"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {ROLE_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant="ghost"
              size="sm"
              onClick={() => onRoleFilterChange(f.value)}
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

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          message="No users found."
          action={
            search || roleFilter !== "all"
              ? {
                  label: "Clear filters",
                  onClick: () => {
                    onSearchChange("");
                    onRoleFilterChange("all");
                  },
                }
              : undefined
          }
        />
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
                  <TableCell>
                    <UserRoleBadge role={user.role} />
                  </TableCell>
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
                      onClick={() => onSelectUser(user)}
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
    </>
  );
}
