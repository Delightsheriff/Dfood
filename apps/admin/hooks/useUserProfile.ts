import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userProfileApi,
  UpdateUserProfileRequest,
} from "@/services/user-profile.service";

import { toast } from "sonner";

/**
 * Query Keys
 */
export const userProfileKeys = {
  all: ["user-profile"] as const,
  profile: () => [...userProfileKeys.all, "detail"] as const,
};

/**
 * Get user profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: userProfileKeys.profile(),
    queryFn: async () => {
      const response = await userProfileApi.getProfile();
      return response.data.user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Update user profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserProfileRequest) =>
      userProfileApi.updateProfile(data),
    onSuccess: (response) => {
      // Update cache
      queryClient.setQueryData(userProfileKeys.profile(), response.data.user);

      toast.success("Profile updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update profile.");
    },
  });
}

/**
 * Upload profile picture
 */
export function useUploadProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userProfileApi.uploadProfilePicture(file),
    onSuccess: (data) => {
      // Invalidate profile to refetch with new picture
      queryClient.invalidateQueries({ queryKey: userProfileKeys.profile() });

      toast.success("Profile picture uploaded successfully.");

      return data.url;
    },
    onError: () => {
      toast.error("Failed to upload profile picture.");
    },
  });
}

export function useDeleteProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userProfileApi.deleteProfileImage(),
    onSuccess: (response) => {
      queryClient.setQueryData(["profile"], response);
    },
    onError: () => {
      toast.error("Failed to delete profile picture.");
    },
  });
}
