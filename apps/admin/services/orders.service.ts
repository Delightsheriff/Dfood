import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";

export type OrderCustomer = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  profileImage?: string;
};

export type Order = {
  _id: string;
  orderNumber: string;
  customerId: string | OrderCustomer;
  restaurantId:
    | string
    | {
        _id: string;
        name: string;
        images: string[];
        address?: string;
        phone?: string;
      };
  items: OrderItem[];
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  paymentMethod: "cash" | "card";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paystackReference?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
};

export type CreateOrderRequest = {
  restaurantId: string;
  items: {
    foodItemId: string;
    quantity: number;
  }[];
  addressId: string;
  paymentMethodId: string;
  customerNotes?: string;
};

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
   * Get all orders (filtered by role on backend)
   * Admin: sees all orders
   * Vendor: sees only their restaurant's orders
   */
  async getOrders(): Promise<OrdersResponse> {
    const response: AxiosResponse<OrdersResponse> =
      await apiClient.get("/orders");
    return response.data;
  },

  /**
   * Get single order by ID
   */
  async getOrder(id: string): Promise<OrderResponse> {
    const response: AxiosResponse<OrderResponse> = await apiClient.get(
      `/orders/${id}`,
    );
    return response.data;
  },

  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<OrderResponse> {
    const response: AxiosResponse<OrderResponse> = await apiClient.get(
      `/orders/number/${orderNumber}`,
    );
    return response.data;
  },

  /**
   * Create new order (customers only - but good to have the structure)
   */
  async createOrder(data: CreateOrderRequest): Promise<OrderResponse> {
    const response: AxiosResponse<OrderResponse> = await apiClient.post(
      "/orders",
      data,
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

  /**
   * Cancel order
   */
  async cancelOrder(id: string): Promise<OrderResponse> {
    const response: AxiosResponse<OrderResponse> = await apiClient.patch(
      `/orders/${id}/cancel`,
    );
    return response.data;
  },
};
