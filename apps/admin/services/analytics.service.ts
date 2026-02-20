import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";

// ── Shared Types ──────────────────────────────────────────────────────────────

export type TrendPoint = { date: string; revenue: number };
export type OrderTrendPoint = { date: string; orders: number };

export type StatusBreakdownItem = {
  status: string;
  count: number;
};

// ── Vendor Analytics ──────────────────────────────────────────────────────────

export type VendorAnalyticsSummary = {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
};

export type VendorPopularItem = {
  foodItemId: string;
  name: string;
  orders: number;
  revenue: number;
};

export type VendorAnalytics = {
  summary: VendorAnalyticsSummary;
  revenueTrend: TrendPoint[];
  orderTrend: OrderTrendPoint[];
  statusBreakdown: StatusBreakdownItem[];
  popularItems: VendorPopularItem[];
};

export type VendorAnalyticsResponse = {
  success: true;
  data: {
    period: { startDate: string; endDate: string };
    analytics: VendorAnalytics;
  };
};

// ── Admin Analytics ───────────────────────────────────────────────────────────

export type AdminAnalyticsSummary = {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  newUsers: number;
  activeRestaurants: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  usersChange: number;
};

export type UserGrowthPoint = {
  date: string;
  customers: number;
  vendors: number;
  total: number;
};

export type RestaurantPerformance = {
  restaurantId: string;
  restaurantName: string;
  orderCount: number;
  revenue: number;
  averageOrderValue: number;
};

export type TopRestaurant = {
  restaurantId: string;
  restaurantName: string;
  orderCount: number;
  revenue: number;
};

export type CategoryPerformance = {
  categoryId: string;
  categoryName: string;
  orderCount: number;
  revenue: number;
};

export type AdminAnalytics = {
  summary: AdminAnalyticsSummary;
  revenueTrend: TrendPoint[];
  orderTrend: OrderTrendPoint[];
  userGrowth: UserGrowthPoint[];
  restaurantPerformance: RestaurantPerformance[];
  topRestaurants: TopRestaurant[];
  categoryPerformance: CategoryPerformance[];
  statusBreakdown: StatusBreakdownItem[];
};

export type AdminAnalyticsResponse = {
  success: true;
  data: {
    period: { startDate: string; endDate: string };
    analytics: AdminAnalytics;
  };
};

// ── Query Params ──────────────────────────────────────────────────────────────

export type AnalyticsParams = {
  days?: number;
  startDate?: string;
  endDate?: string;
};

// ── API Service ───────────────────────────────────────────────────────────────

export const analyticsApi = {
  /**
   * Vendor analytics
   * GET /api/vendor/analytics
   */
  async getVendorAnalytics(
    params?: AnalyticsParams,
  ): Promise<VendorAnalyticsResponse> {
    const response: AxiosResponse<VendorAnalyticsResponse> =
      await apiClient.get("/vendor/analytics", { params });
    return response.data;
  },

  /**
   * Admin analytics
   * GET /api/admin/analytics
   */
  async getAdminAnalytics(
    params?: AnalyticsParams,
  ): Promise<AdminAnalyticsResponse> {
    const response: AxiosResponse<AdminAnalyticsResponse> = await apiClient.get(
      "/admin/analytics",
      { params },
    );
    return response.data;
  },
};
