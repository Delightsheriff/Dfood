import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi, OrdersFilters, Order } from "@/services/orders.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/response";

export const orderKeys = {
  all: ["orders"] as const,
  list: (role: "vendor" | "admin", filters?: OrdersFilters) =>
    [...orderKeys.all, role, filters] as const,
  stats: (role: "vendor" | "admin") => ["order-stats", role] as const,
};

export type OrdersQueryParams = {
  isVendor: boolean;
  filters?: OrdersFilters;
};

export const useOrders = ({ isVendor, filters }: OrdersQueryParams) => {
  return useQuery({
    queryKey: orderKeys.list(isVendor ? "vendor" : "admin", filters),
    queryFn: async () => {
      const response = isVendor
        ? await ordersApi.getVendorOrders(filters)
        : await ordersApi.getAdminOrders(filters);
      return response.data.orders;
    },
  });
};

export type OrderStatsQueryParams = {
  isVendor: boolean;
};

export const useOrderStats = ({ isVendor }: OrderStatsQueryParams) => {
  return useQuery({
    queryKey: orderKeys.stats(isVendor ? "vendor" : "admin"),
    queryFn: async () => {
      const response = isVendor
        ? await ordersApi.getVendorOrderStats()
        : await ordersApi.getAdminOrderStats();
      return response.data;
    },
  });
};

export const useUpdateOrderStatus = ({ isVendor }: { isVendor: boolean }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      isVendor
        ? ordersApi.updateVendorOrderStatus(id, status)
        : ordersApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
      toast.success("Order status updated");
    },
    onError: (error: AxiosError<ErrorResponse> | Error) => {
      const message =
        (error as AxiosError<ErrorResponse>).response?.data?.message ||
        error.message ||
        "Failed to update order status";
      toast.error(message);
    },
  });
};

export type OrdersListItem = Order;
