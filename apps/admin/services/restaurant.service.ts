import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";

/**
 * Restaurant Types
 */
export interface Restaurant {
  _id: string;
  ownerId: string;
  name: string;
  description?: string;
  images: string[];
  address?: string;
  deliveryFee: number;
  openingTime: string;
  closingTime: string;
  tags: string[];
  rating: number;
  totalReviews: number;
  isProfileComplete: boolean;
  status?: "Open" | "Closed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateRestaurantRequest {
  name: string;
  description?: string;
  address?: string;
  deliveryFee?: number;
  openingTime: string;
  closingTime: string;
  images: File[];
}

export interface UpdateRestaurantRequest {
  name?: string;
  description?: string;
  address?: string;
  deliveryFee?: number;
  openingTime?: string;
  closingTime?: string;
  images?: File[];
}

export interface RestaurantListResponse {
  success: boolean;
  data: {
    restaurants: Restaurant[];
  };
}

export interface RestaurantResponse {
  success: boolean;
  message?: string;
  data: {
    restaurant: Restaurant;
  };
}

export interface ProfileStatusResponse {
  success: boolean;
  data: {
    hasRestaurant: boolean;
    isProfileComplete: boolean;
    missingFields: string[];
    restaurant?: {
      id: string;
      name: string;
      images: string[];
      address?: string;
      description?: string;
    };
  };
}

/**
 * Restaurant API Service
 */
export const restaurantApi = {
  /**
   * Get my restaurant (Vendor only)
   */
  async getMyRestaurant(): Promise<RestaurantResponse | null> {
    try {
      const response: AxiosResponse<RestaurantResponse> = await apiClient.get(
        "/restaurants/my/restaurant",
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Get profile status (Vendor only)
   */
  async getProfileStatus(): Promise<ProfileStatusResponse> {
    const response: AxiosResponse<ProfileStatusResponse> = await apiClient.get(
      "/restaurants/my/profile-status",
    );
    return response.data;
  },

  /**
   * Get all restaurants (Public/Admin)
   */
  async getAllRestaurants(params?: {
    isOpen?: boolean;
  }): Promise<RestaurantListResponse> {
    const response: AxiosResponse<RestaurantListResponse> = await apiClient.get(
      "/restaurants",
      { params },
    );
    return response.data;
  },

  /**
   * Create restaurant
   */
  async createRestaurant(
    data: CreateRestaurantRequest,
  ): Promise<RestaurantResponse> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("openingTime", data.openingTime);
    formData.append("closingTime", data.closingTime);

    if (data.description) formData.append("description", data.description);
    if (data.address) formData.append("address", data.address);
    if (data.deliveryFee !== undefined)
      formData.append("deliveryFee", data.deliveryFee.toString());

    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response: AxiosResponse<RestaurantResponse> = await apiClient.post(
      "/restaurants",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Update restaurant
   */
  async updateRestaurant(
    id: string,
    data: UpdateRestaurantRequest,
  ): Promise<RestaurantResponse> {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.address) formData.append("address", data.address);
    if (data.deliveryFee !== undefined)
      formData.append("deliveryFee", data.deliveryFee.toString());
    if (data.openingTime) formData.append("openingTime", data.openingTime);
    if (data.closingTime) formData.append("closingTime", data.closingTime);

    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response: AxiosResponse<RestaurantResponse> = await apiClient.patch(
      `/restaurants/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Delete restaurant image
   */
  async deleteRestaurantImage(
    id: string,
    imageUrl: string,
  ): Promise<RestaurantResponse> {
    const response: AxiosResponse<RestaurantResponse> = await apiClient.delete(
      `/restaurants/${id}/images`,
      {
        data: { imageUrl },
      },
    );
    return response.data;
  },
};
