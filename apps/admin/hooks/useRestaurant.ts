import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  restaurantApi,
  UpdateRestaurantRequest,
  CreateRestaurantRequest,
} from "@/services/restaurant.service";
import { toast } from "sonner";

export const useMyRestaurant = () => {
  return useQuery({
    queryKey: ["my-restaurant"],
    queryFn: restaurantApi.getMyRestaurant,
    retry: false,
  });
};

export const useRestaurantCompletion = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["restaurant-completion"],
    queryFn: async () => {
      const response = await restaurantApi.getProfileStatus();
      return response.data;
    },
    enabled,
  });
};

export const useAllRestaurants = (params?: { isOpen?: boolean }) => {
  return useQuery({
    queryKey: ["restaurants", params],
    queryFn: () => restaurantApi.getAllRestaurants(params),
  });
};

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRestaurantRequest) =>
      restaurantApi.createRestaurant(data),
    onSuccess: () => {
      toast.success("Restaurant created successfully");
      queryClient.invalidateQueries({ queryKey: ["my-restaurant"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-completion"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create restaurant",
      );
    },
  });
};

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRestaurantRequest }) =>
      restaurantApi.updateRestaurant(id, data),
    onSuccess: () => {
      toast.success("Restaurant updated successfully");
      queryClient.invalidateQueries({ queryKey: ["my-restaurant"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-completion"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update restaurant",
      );
    },
  });
};

export const useDeleteRestaurantImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, imageUrl }: { id: string; imageUrl: string }) =>
      restaurantApi.deleteRestaurantImage(id, imageUrl),
    onSuccess: () => {
      toast.success("Image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["my-restaurant"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-completion"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete image");
    },
  });
};
