import apiClient from "@/lib/api-client";
import type { Order, OrderItem, OrderStatus } from "@dfood/types";
import { AxiosResponse } from "axios";

export type OrderCustomer = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  profileImage?: string;
};

export type { Order, OrderItem, OrderStatus };

export type OrderResponse = {
  success: true;
  data: {
    order: Order;
  };
  message?: string;
};

export type OrdersResponse = {
  success: true;
  data: {
    orders: Order[];
  };
};

export type OrdersFilters = {
  status?: Order["status"];
  startDate?: string;
  endDate?: string;
  restaurantId?: string;
};

export type OrderStats = {
  orders: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  revenue: {
    total: number;
    today: number;
    thisWeek?: number;
    thisMonth?: number;
  };
  statusBreakdown: Record<Order["status"], number>;
  topRestaurants?: {
    restaurantId: string;
    restaurantName: string;
    orderCount: number;
    revenue: number;
  }[];
};

export type OrderStatsResponse = {
  success: true;
  data: OrderStats;
};

/**
 * Orders API Service
 */
export const ordersApi = {
  /**
   * Vendor: get all restaurant orders
   * GET /api/vendor/orders
   */
  async getVendorOrders(filters?: OrdersFilters): Promise<OrdersResponse> {
    const response: AxiosResponse<OrdersResponse> = await apiClient.get(
      "/vendor/orders",
      { params: filters },
    );
    return response.data;
  },

  /**
   * Admin: get all platform orders
   * GET /api/admin/orders
   */
  async getAdminOrders(filters?: OrdersFilters): Promise<OrdersResponse> {
    const response: AxiosResponse<OrdersResponse> = await apiClient.get(
      "/admin/orders",
      { params: filters },
    );
    return response.data;
  },

  /**
   * Vendor: get order detail
   * GET /api/vendor/orders/:id
   */
  async getVendorOrder(id: string): Promise<OrderResponse> {
    const response: AxiosResponse<OrderResponse> = await apiClient.get(
      `/vendor/orders/${id}`,
    );
    return response.data;
  },

  /**
   * Admin: get order detail
   * GET /api/admin/orders/:id
   */
  async getAdminOrder(id: string): Promise<OrderResponse> {
    const response: AxiosResponse<OrderResponse> = await apiClient.get(
      `/admin/orders/${id}`,
    );
    return response.data;
  },

  /**
   * Vendor: get order stats
   * GET /api/vendor/orders/stats
   */
  async getVendorOrderStats(): Promise<OrderStatsResponse> {
    const response: AxiosResponse<OrderStatsResponse> = await apiClient.get(
      "/vendor/orders/stats",
    );
    return response.data;
  },

  /**
   * Admin: get order stats
   * GET /api/admin/orders/stats
   */
  async getAdminOrderStats(): Promise<OrderStatsResponse> {
    const response: AxiosResponse<OrderStatsResponse> = await apiClient.get(
      "/admin/orders/stats",
    );
    return response.data;
  },
  /**
   * Update order status (vendor only)
   */
  async updateOrderStatus(
    id: string,
    status: Order["status"],
  ): Promise<OrderResponse> {
    const response: AxiosResponse<OrderResponse> = await apiClient.patch(
      `/orders/${id}/status`,
      { status },
    );
    return response.data;
  },

  /**
   * Vendor: update order status
   * PATCH /api/vendor/orders/:id/status
   */
  async updateVendorOrderStatus(
    id: string,
    status: Order["status"],
  ): Promise<OrderResponse> {
    const response: AxiosResponse<OrderResponse> = await apiClient.patch(
      `/vendor/orders/${id}/status`,
      { status },
    );
    return response.data;
  },

};
