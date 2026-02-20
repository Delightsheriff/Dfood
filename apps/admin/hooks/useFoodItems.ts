import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  foodItemsApi,
  CreateFoodItemRequest,
  UpdateFoodItemRequest,
} from "@/services/food-items.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/response";

export const foodItemKeys = {
  all: ["food-items"] as const,
  detail: (id: string) => [...foodItemKeys.all, "detail", id] as const,
  myItems: ["food-items", "my"] as const,
  byRestaurant: (restaurantId: string) =>
    [...foodItemKeys.all, "restaurant", restaurantId] as const,
  byCategory: (categoryId: string) =>
    [...foodItemKeys.all, "category", categoryId] as const,
};

/**
 * Get a single food item by ID
 */
export function useFoodItem(id: string) {
  return useQuery({
    queryKey: foodItemKeys.detail(id),
    queryFn: () => foodItemsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Get current vendor's food items
 */
export function useMyFoodItems() {
  return useQuery({
    queryKey: foodItemKeys.myItems,
    queryFn: foodItemsApi.getMyItems,
  });
}

/**
 * Get food items by restaurant ID (admin/public)
 */
export function useFoodItemsByRestaurant(restaurantId: string) {
  return useQuery({
    queryKey: foodItemKeys.byRestaurant(restaurantId),
    queryFn: () => foodItemsApi.getByRestaurant(restaurantId),
    enabled: !!restaurantId,
  });
}

/**
 * Get food items by category ID (admin/public)
 */
export function useFoodItemsByCategory(categoryId: string) {
  return useQuery({
    queryKey: foodItemKeys.byCategory(categoryId),
    queryFn: () => foodItemsApi.getByCategory(categoryId),
    enabled: !!categoryId,
  });
}

/**
 * Create a new food item (vendor)
 */
export function useCreateFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFoodItemRequest) => foodItemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodItemKeys.myItems });
      queryClient.invalidateQueries({ queryKey: foodItemKeys.all });
      toast.success("Food item created successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to create food item",
      );
    },
  });
}

/**
 * Update an existing food item (vendor)
 */
export function useUpdateFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFoodItemRequest }) =>
      foodItemsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodItemKeys.myItems });
      queryClient.invalidateQueries({ queryKey: foodItemKeys.all });
      toast.success("Food item updated successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to update food item",
      );
    },
  });
}

/**
 * Delete a food item (vendor)
 */
export function useDeleteFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => foodItemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodItemKeys.myItems });
      queryClient.invalidateQueries({ queryKey: foodItemKeys.all });
      toast.success("Food item deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to delete food item",
      );
    },
  });
}

/**
 * Delete a food item image (vendor)
 */
export function useDeleteFoodItemImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, imageUrl }: { id: string; imageUrl: string }) =>
      foodItemsApi.deleteImage(id, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodItemKeys.myItems });
      queryClient.invalidateQueries({ queryKey: foodItemKeys.all });
      toast.success("Image deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete image");
    },
  });
}
