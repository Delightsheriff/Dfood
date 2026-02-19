import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";

/**
 * User Profile Types
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: "admin" | "vendor" | "customer";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileRequest {
  name?: string;
  phone?: string;
  profileImage?: string; // Base64 or URL after upload
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: UserProfile;
  };
}

/**
 * User Profile API Service
 */
export const userProfileApi = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfileResponse> {
    const response: AxiosResponse<UserProfileResponse> =
      await apiClient.get("/profile");
    console.log("response service: ", response);
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(
    data: UpdateUserProfileRequest,
  ): Promise<UserProfileResponse> {
    const response: AxiosResponse<UserProfileResponse> = await apiClient.patch(
      "/profile",
      data,
    );
    return response.data;
  },

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response: AxiosResponse<{
      success: boolean;
      data: { url: string };
    }> = await apiClient.post("/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },

  /**
   * Delete profile image
   * DELETE /profile/image
   */
  async deleteProfileImage(): Promise<UserProfileResponse> {
    const response: AxiosResponse<UserProfileResponse> =
      await apiClient.delete("/profile/image");
    return response.data;
  },

  /**
   * Change password
   */
  async changePassword(
    data: ChangePasswordRequest,
  ): Promise<UserProfileResponse> {
    const response: AxiosResponse<UserProfileResponse> = await apiClient.post(
      "/auth/change-password",
      data,
    );
    return response.data;
  },
};
