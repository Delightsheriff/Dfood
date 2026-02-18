import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";

export type Order = {
  _id: string;
  orderNumber: string;
  customerId: string;
  restaurantId: {
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

/**
 * Orders API Service
 */
export const ordersApi = {
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
   * Cancel order
   */
  async cancelOrder(id: string): Promise<OrderResponse> {
    const response: AxiosResponse<OrderResponse> = await apiClient.patch(
      `/orders/${id}/cancel`,
    );
    return response.data;
  },
};
