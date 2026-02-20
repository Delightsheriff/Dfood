import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/services/search.service";

export const searchKeys = {
  all: ["dashboard-search"] as const,
  query: (q: string) => [...searchKeys.all, q] as const,
};

/**
 * Dashboard search hook with debounced query.
 * Only fires when `query` is at least 2 characters.
 */
export function useDashboardSearch(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: searchKeys.query(trimmed),
    queryFn: () => searchApi.dashboardSearch(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 30_000, // cache results for 30s
    placeholderData: (prev) => prev, // keep previous results while fetching
  });
}
