import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  notificationsApi,
  NotificationsFilters,
} from "@/services/notification.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/response";

/**
 * Query Keys
 */
export const notificationKeys = {
  all: ["notifications"] as const,
  list: (filters?: NotificationsFilters) =>
    [...notificationKeys.all, "list", filters] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

/**
 * Fetch notification list
 */
export function useNotifications(filters?: NotificationsFilters) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: async () => {
      const response = await notificationsApi.getNotifications(filters);
      return response.data.notifications;
    },
  });
}

/**
 * Fetch unread notification count (polls every 30 seconds)
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const response = await notificationsApi.getUnreadCount();
      return response.data.count;
    },
    refetchInterval: 30_000,
  });
}

/**
 * Mark a single notification as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error: AxiosError<ErrorResponse> | Error) => {
      const message =
        (error as AxiosError<ErrorResponse>).response?.data?.message ||
        error.message ||
        "Failed to mark notification as read";
      toast.error(message);
    },
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success("All notifications marked as read");
    },
    onError: (error: AxiosError<ErrorResponse> | Error) => {
      const message =
        (error as AxiosError<ErrorResponse>).response?.data?.message ||
        error.message ||
        "Failed to mark all as read";
      toast.error(message);
    },
  });
}

/**
 * Delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success("Notification deleted");
    },
    onError: (error: AxiosError<ErrorResponse> | Error) => {
      const message =
        (error as AxiosError<ErrorResponse>).response?.data?.message ||
        error.message ||
        "Failed to delete notification";
      toast.error(message);
    },
  });
}
