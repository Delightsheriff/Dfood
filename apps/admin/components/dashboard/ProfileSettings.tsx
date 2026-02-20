"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  useUserProfile,
  useUpdateUserProfile,
  useUploadProfilePicture,
  useChangePassword,
} from "@/hooks/useUserProfile";

// Profile Schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

// Password Schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ProfileSettings() {
  const { data: user, isLoading: userLoading } = useUserProfile();
  const updateProfile = useUpdateUserProfile();
  const uploadPicture = useUploadProfilePicture();
  const changePassword = useChangePassword();

  const [uploadingPicture, setUploadingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user, profileForm]);

  // Password Form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle profile update
  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfile.mutate(data);
  };

  // Handle password change
  const onPasswordSubmit = (data: PasswordFormValues) => {
    changePassword.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          passwordForm.reset();
        },
      },
    );
  };

  // Handle profile picture upload
  const handlePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setUploadingPicture(true);
    try {
      await uploadPicture.mutateAsync(file);
    } finally {
      setUploadingPicture(false);
    }
  };

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-text">Profile Picture</CardTitle>
          <CardDescription className="text-text-muted">
            Update your profile picture. Recommended size: 400x400px
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border border-border">
                <AvatarImage
                  src={user?.profileImage}
                  alt={user?.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-orange/10 text-orange text-2xl font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              {uploadingPicture && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePictureUpload}
                disabled={uploadingPicture}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPicture}
                variant="outline"
                className="border-border text-text hover:bg-surface-2 hover:text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                {uploadingPicture ? "Uploading..." : "Change Picture"}
              </Button>
              <p className="text-xs text-text-dim mt-2">
                JPG, PNG or GIF. Max size 5MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-text">Personal Information</CardTitle>
          <CardDescription className="text-text-muted">
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-muted">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="bg-black/20 border-border text-text placeholder:text-text-dim"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-muted">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+234 800 000 0000"
                        type="tel"
                        {...field}
                        className="bg-black/20 border-border text-text placeholder:text-text-dim"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-text-muted">Email</FormLabel>
                <Input
                  value={user?.email}
                  disabled
                  className="bg-surface-2 border-border text-text-muted mt-1"
                />
                <p className="text-xs text-text-dim mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="bg-orange hover:bg-orange/90 text-white"
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-text">Change Password</CardTitle>
          <CardDescription className="text-text-muted">
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-muted">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter current password"
                        {...field}
                        className="bg-black/20 border-border text-text placeholder:text-text-dim"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-muted">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                        className="bg-black/20 border-border text-text placeholder:text-text-dim"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-muted">
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        {...field}
                        className="bg-black/20 border-border text-text placeholder:text-text-dim"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={changePassword.isPending}
                  className="bg-orange hover:bg-orange/90 text-white"
                >
                  {changePassword.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
