import { useQuery } from "@tanstack/react-query";
import {
  analyticsApi,
  AnalyticsParams,
  VendorAnalytics,
  AdminAnalytics,
} from "@/services/analytics.service";

export const analyticsKeys = {
  all: ["analytics"] as const,
  vendor: (params?: AnalyticsParams) =>
    [...analyticsKeys.all, "vendor", params] as const,
  admin: (params?: AnalyticsParams) =>
    [...analyticsKeys.all, "admin", params] as const,
};

export type UseAnalyticsParams = {
  isVendor: boolean;
  params?: AnalyticsParams;
};

/**
 * Fetch analytics – returns typed vendor or admin data depending on role.
 *
 * Usage:
 *   const { data } = useAnalytics({ isVendor, params: { days: 30 } });
 *   // data.summary, data.revenueTrend, etc.
 */
export const useAnalytics = ({ isVendor, params }: UseAnalyticsParams) => {
  return useQuery<VendorAnalytics | AdminAnalytics>({
    queryKey: isVendor
      ? analyticsKeys.vendor(params)
      : analyticsKeys.admin(params),
    queryFn: async () => {
      if (isVendor) {
        const res = await analyticsApi.getVendorAnalytics(params);
        return res.data.analytics;
      }
      const res = await analyticsApi.getAdminAnalytics(params);
      return res.data.analytics;
    },
  });
};

/** Type‑guard: is this admin analytics data? */
export function isAdminAnalytics(
  data: VendorAnalytics | AdminAnalytics,
): data is AdminAnalytics {
  return "totalUsers" in data.summary;
}
