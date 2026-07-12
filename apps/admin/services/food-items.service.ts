import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";

/**
 * Food Item Types
 */
export interface FoodItem {
  _id: string;
  restaurantId:
    | string
    | {
        _id: string;
        name: string;
        images: string[];
        address?: string;
        deliveryFee?: number;
        openingTime?: string;
        closingTime?: string;
        rating?: number;
        totalReviews?: number;
        status?: string;
      };
  name: string;
  description: string;
  images: string[];
  price: number;
  categoryIds: string[];
  calories?: number;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface FoodItemResponse {
  success: true;
  data: {
    foodItem: FoodItem;
  };
}

export interface FoodItemsResponse {
  success: true;
  data: {
    foodItems: FoodItem[];
  };
}

export interface CreateFoodItemRequest {
  name: string;
  description: string;
  price: number;
  categoryIds: string[];
  calories?: number;
  images: File[];
}

export interface UpdateFoodItemRequest {
  name?: string;
  description?: string;
  price?: number;
  categoryIds?: string[];
  calories?: number;
  images?: File[];
}

/**
 * Food Items API Service
 */
export const foodItemsApi = {
  /**
   * Get food item by ID (public)
   * GET /api/food-items/:id
   */
  async getById(id: string): Promise<FoodItemResponse> {
    const response: AxiosResponse<FoodItemResponse> = await apiClient.get(
      `/food-items/${id}`,
    );
    return response.data;
  },

  /**
   * Get my food items (vendor only)
   * GET /api/food-items/my/items
   */
  async getMyItems(): Promise<FoodItemsResponse> {
    const response: AxiosResponse<FoodItemsResponse> = await apiClient.get(
      "/food-items/my/items",
    );

    return response.data;
  },

  /**
   * Get food items by restaurant (public)
   * GET /api/food-items/restaurant/:restaurantId
   */
  async getByRestaurant(restaurantId: string): Promise<FoodItemsResponse> {
    const response: AxiosResponse<FoodItemsResponse> = await apiClient.get(
      `/food-items/restaurant/${restaurantId}`,
    );
    return response.data;
  },

  /**
   * Get food items by category (public)
   * GET /api/food-items/category/:categoryId
   */
  async getByCategory(categoryId: string): Promise<FoodItemsResponse> {
    const response: AxiosResponse<FoodItemsResponse> = await apiClient.get(
      `/food-items/category/${categoryId}`,
    );
    return response.data;
  },

  /**
   * Create food item (vendor only)
   * POST /api/food-items
   */
  async create(data: CreateFoodItemRequest): Promise<FoodItemResponse> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    if (data.calories !== undefined) {
      formData.append("calories", data.calories.toString());
    }
    data.categoryIds.forEach((id) => formData.append("categoryIds", id));
    data.images.forEach((file) => formData.append("images", file));

    const response: AxiosResponse<FoodItemResponse> = await apiClient.post(
      "/food-items",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  /**
   * Update food item (vendor only, must be owner)
   * PATCH /api/food-items/:id
   */
  async update(
    id: string,
    data: UpdateFoodItemRequest,
  ): Promise<FoodItemResponse> {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.price !== undefined)
      formData.append("price", data.price.toString());
    if (data.calories !== undefined)
      formData.append("calories", data.calories.toString());
    if (data.categoryIds) {
      data.categoryIds.forEach((id) => formData.append("categoryIds", id));
    }
    if (data.images) {
      data.images.forEach((file) => formData.append("images", file));
    }

    const response: AxiosResponse<FoodItemResponse> = await apiClient.patch(
      `/food-items/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  /**
   * Delete food item image (vendor only, must be owner)
   * DELETE /api/food-items/:id/images
   */
  async deleteImage(id: string, imageUrl: string): Promise<FoodItemResponse> {
    const response: AxiosResponse<FoodItemResponse> = await apiClient.delete(
      `/food-items/${id}/images`,
      { data: { imageUrl } },
    );
    return response.data;
  },

  /**
   * Delete food item (vendor only, must be owner)
   * DELETE /api/food-items/:id
   */
  async delete(id: string): Promise<{ success: true; message: string }> {
    const response: AxiosResponse<{ success: true; message: string }> =
      await apiClient.delete(`/food-items/${id}`);
    return response.data;
  },
};
