import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";

/**
 * User Types
 */
export type UserRole = "customer" | "vendor" | "admin";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserStats {
  total: number;
  customers: number;
  vendors: number;
  admins: number;
  recentSignups: number;
}

export interface UsersResponse {
  success: true;
  data: {
    users: AdminUser[];
  };
}

export interface UserResponse {
  success: true;
  data: {
    user: AdminUser;
  };
}

export interface UserStatsResponse {
  success: true;
  data: UserStats;
}

export interface UsersFilters {
  role?: UserRole;
  search?: string;
}

/**
 * Admin Users API Service
 */
export const usersApi = {
  /**
   * Get all users (admin only)
   * GET /api/admin/users
   */
  async getAll(filters?: UsersFilters): Promise<UsersResponse> {
    const params = new URLSearchParams();
    if (filters?.role) params.append("role", filters.role);
    if (filters?.search) params.append("search", filters.search);

    const query = params.toString();
    const response: AxiosResponse<UsersResponse> = await apiClient.get(
      `/admin/users${query ? `?${query}` : ""}`,
    );
    return response.data;
  },

  /**
   * Get user by ID (admin only)
   * GET /api/admin/users/:id
   */
  async getById(id: string): Promise<UserResponse> {
    const response: AxiosResponse<UserResponse> = await apiClient.get(
      `/admin/users/${id}`,
    );
    return response.data;
  },

  /**
   * Get user stats (admin only)
   * GET /api/admin/users/stats
   */
  async getStats(): Promise<UserStatsResponse> {
    const response: AxiosResponse<UserStatsResponse> =
      await apiClient.get("/admin/users/stats");
    return response.data;
  },
};
