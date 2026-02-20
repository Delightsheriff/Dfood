import { useQuery } from "@tanstack/react-query";
import { usersApi, UsersFilters } from "@/services/users.service";

export const userKeys = {
  all: ["admin-users"] as const,
  filtered: (filters: UsersFilters) => [...userKeys.all, filters] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
  stats: ["admin-users-stats"] as const,
};

/**
 * Fetch all users with optional filters (admin only)
 */
export function useUsers(filters?: UsersFilters) {
  return useQuery({
    queryKey: userKeys.filtered(filters ?? {}),
    queryFn: () => usersApi.getAll(filters),
  });
}

/**
 * Fetch a single user by ID (admin only)
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Fetch user stats (admin only)
 */
export function useUserStats() {
  return useQuery({
    queryKey: userKeys.stats,
    queryFn: usersApi.getStats,
  });
}
