import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";

/**
 * Notification Types
 */
export type NotificationType =
  | "new_order"
  | "order_status"
  | "payment"
  | "system"
  | "review"
  | "promotion"
  | "new_user";

export interface Notification {
  _id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  success: true;
  data: {
    notifications: Notification[];
  };
}

export interface UnreadCountResponse {
  success: true;
  data: {
    count: number;
  };
}

export interface SingleNotificationResponse {
  success: true;
  data: {
    notification: Notification;
  };
}

export interface NotificationsFilters {
  unreadOnly?: boolean;
  limit?: number;
}

/**
 * Notifications API Service
 */
export const notificationsApi = {
  /**
   * Get all notifications
   * GET /api/notifications
   */
  async getNotifications(
    filters?: NotificationsFilters,
  ): Promise<NotificationsResponse> {
    const response: AxiosResponse<NotificationsResponse> = await apiClient.get(
      "/notifications",
      { params: filters },
    );
    return response.data;
  },

  /**
   * Get unread notification count (for badge)
   * GET /api/notifications/unread-count
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response: AxiosResponse<UnreadCountResponse> = await apiClient.get(
      "/notifications/unread-count",
    );
    return response.data;
  },

  /**
   * Mark a single notification as read
   * PATCH /api/notifications/:id/read
   */
  async markAsRead(
    notificationId: string,
  ): Promise<SingleNotificationResponse> {
    const response: AxiosResponse<SingleNotificationResponse> =
      await apiClient.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   * PATCH /api/notifications/mark-all-read
   */
  async markAllAsRead(): Promise<{ success: true }> {
    const response: AxiosResponse<{ success: true }> = await apiClient.patch(
      "/notifications/mark-all-read",
    );
    return response.data;
  },

  /**
   * Delete a notification
   * DELETE /api/notifications/:id
   */
  async deleteNotification(notificationId: string): Promise<{ success: true }> {
    const response: AxiosResponse<{ success: true }> = await apiClient.delete(
      `/notifications/${notificationId}`,
    );
    return response.data;
  },
};

/**
 * Resolve a notification to its target page URL based on type and data.
 * Returns null if no meaningful destination exists.
 */
export function getNotificationHref(notification: Notification): string | null {
  const d = notification.data;
  switch (notification.type) {
    case "new_order":
    case "order_status":
      return d?.orderId ? `/orders/${d.orderId}` : null;
    case "payment":
      return d?.orderId ? `/orders/${d.orderId}` : null;
    case "review":
      return d?.restaurantId ? `/restaurants/${d.restaurantId}` : null;
    case "new_user":
      return "/users";
    default:
      return null;
  }
}
