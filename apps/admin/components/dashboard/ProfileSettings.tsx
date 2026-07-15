"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, Loader2, KeyRound, User } from "lucide-react";

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
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";

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
    resolver: zodResolver(passwordSchema) as any,
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
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Picture */}
      <SpotlightCard className="bg-card border-border p-6" spotlightColor="rgba(255, 118, 34, 0.01)">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-foreground">Avatar Image</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Update your profile picture. Recommended size: 400x400px.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-20 w-20 border border-border/80">
              <AvatarImage
                src={user?.profileImage}
                alt={user?.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            {uploadingPicture && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            )}
          </div>

          <div className="space-y-2">
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
              className="border-border text-foreground hover:bg-muted text-xs h-9 rounded-lg font-semibold"
            >
              <Camera className="h-4 w-4 mr-2" />
              {uploadingPicture ? "Uploading..." : "Change Picture"}
            </Button>
            <p className="text-[10px] text-muted-foreground font-semibold">
              JPG, PNG or WEBP formats up to 5MB.
            </p>
          </div>
        </div>
      </SpotlightCard>

      {/* Personal Information */}
      <SpotlightCard className="bg-card border-border p-6" spotlightColor="rgba(255, 118, 34, 0.01)">
        <div className="mb-6 border-b border-border/40 pb-4 flex items-center gap-2">
          <User className="h-4.5 w-4.5 text-primary shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-foreground">Operator Info</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your account details and contact parameters.
            </p>
          </div>
        </div>

        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-4 max-w-xl"
          >
            <FormField
              control={profileForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+234 800 000 0000"
                      type="tel"
                      {...field}
                      className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] text-red-500" />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Email</FormLabel>
              <Input
                value={user?.email}
                disabled
                className="bg-muted border-border text-muted-foreground h-10 rounded-lg text-xs mt-1.5"
              />
              <p className="text-[10px] text-muted-foreground mt-1.5 font-semibold">
                Account email configuration cannot be changed.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="h-10 px-6 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 rounded-lg shadow-sm"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin inline-block" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SpotlightCard>

      {/* Change Password */}
      <SpotlightCard className="bg-card border-border p-6" spotlightColor="rgba(255, 118, 34, 0.01)">
        <div className="mb-6 border-b border-border/40 pb-4 flex items-center gap-2">
          <KeyRound className="h-4.5 w-4.5 text-primary shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-foreground">Change Password</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your account password key details.
            </p>
          </div>
        </div>

        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4 max-w-xl"
          >
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      {...field}
                      className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                      className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                      className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] text-red-500" />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                disabled={changePassword.isPending}
                className="h-10 px-6 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 rounded-lg shadow-sm"
              >
                {changePassword.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin inline-block" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SpotlightCard>
    </div>
  );
}
