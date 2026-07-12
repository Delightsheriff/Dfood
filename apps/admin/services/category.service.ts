import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";

/**
 * Category Types
 */
export interface Category {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  message?: string;
  data: {
    category?: Category;
    categories?: Category[];
  };
}

export interface CreateCategoryRequest {
  name: string;
  image: File;
}

export interface UpdateCategoryRequest {
  name?: string;
  image?: File;
}

/**
 * Category API Service
 */
export const categoryApi = {
  /**
   * Get all categories
   * GET /api/categories
   */
  async getAll(): Promise<CategoryResponse> {
    const response: AxiosResponse<CategoryResponse> =
      await apiClient.get("/categories");
    return response.data;
  },

  /**
   * Get category by ID
   * GET /api/categories/:id
   */
  async getById(id: string): Promise<CategoryResponse> {
    const response: AxiosResponse<CategoryResponse> = await apiClient.get(
      `/categories/${id}`,
    );
    return response.data;
  },

  /**
   * Create new category
   * POST /api/categories
   */
  async create(data: CreateCategoryRequest): Promise<CategoryResponse> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", data.image);

    const response: AxiosResponse<CategoryResponse> = await apiClient.post(
      "/categories",
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
   * Update category
   * PATCH /api/categories/:id
   */
  async update(
    id: string,
    data: UpdateCategoryRequest,
  ): Promise<CategoryResponse> {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.image) formData.append("image", data.image);

    const response: AxiosResponse<CategoryResponse> = await apiClient.patch(
      `/categories/${id}`,
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
   * Delete category
   * DELETE /api/categories/:id
   */
  async delete(id: string): Promise<CategoryResponse> {
    const response: AxiosResponse<CategoryResponse> = await apiClient.delete(
      `/categories/${id}`,
    );
    return response.data;
  },
};
