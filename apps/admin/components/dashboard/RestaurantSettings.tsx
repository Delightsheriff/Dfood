"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, Trash2, Upload, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  useMyRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurantImage,
} from "@/hooks/useRestaurant";

// Schema matching the API requirements
const restaurantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .optional(),
  deliveryFee: z.coerce.number().min(0, "Delivery fee must be 0 or more"),
  openingTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  closingTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
});

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

export function RestaurantSettings() {
  const { data: response, isLoading: isLoadingRestaurant } = useMyRestaurant();
  const { mutate: updateRestaurant, isPending: isUpdating } =
    useUpdateRestaurant();
  const { mutate: deleteImage, isPending: isDeletingImage } =
    useDeleteRestaurantImage();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const restaurant = response?.data?.restaurant;

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      address: "",
      deliveryFee: 0,
      openingTime: "09:00",
      closingTime: "22:00",
    },
  });

  // Load restaurant data when available
  useEffect(() => {
    if (restaurant) {
      form.reset({
        name: restaurant.name,
        description: restaurant.description || "",
        address: restaurant.address || "",
        deliveryFee: restaurant.deliveryFee,
        openingTime: restaurant.openingTime,
        closingTime: restaurant.closingTime,
      });
    }
  }, [restaurant, form]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check total images (existing + new)
    const currentCount =
      (restaurant?.images?.length || 0) + selectedImages.length + files.length;
    if (currentCount > 5) {
      toast.error("Maximum 5 images allowed. Please delete some images first.");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

    // Revoke URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteServerImage = (imageUrl: string) => {
    if (!restaurant) return;

    if (restaurant.images.length <= 1) {
      toast.error("Restaurant must have at least one image");
      return;
    }

    if (confirm("Are you sure you want to delete this image?")) {
      deleteImage({ id: restaurant._id, imageUrl });
    }
  };

  const onSubmit = (data: RestaurantFormValues) => {
    if (!restaurant) return;

    updateRestaurant(
      {
        id: restaurant._id,
        data: {
          ...data,
          images: selectedImages.length > 0 ? selectedImages : undefined,
        },
      },
      {
        onSuccess: () => {
          setSelectedImages([]);
          setPreviewUrls([]);
        },
      },
    );
  };

  if (isLoadingRestaurant) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border">
      <CardHeader>
        <CardTitle className="text-text">Restaurant Details</CardTitle>
        <CardDescription className="text-text-muted">
          Manage your restaurant information and gallery.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {restaurant ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control as any}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-text">
                        Restaurant Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-background border-border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="openingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text">
                          Opening Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="bg-background border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="closingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text">
                          Closing Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="bg-background border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control as any}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text">Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-background border-border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="deliveryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-text">
                        Delivery Fee (₦)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="bg-background border-border"
                        />
                      </FormControl>
                      <FormDescription className="text-text-muted">
                        Fee charged for delivery services.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control as any}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-background border-border min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Management Section */}
              <div className="space-y-4 pt-4 border-t border-border">
                <FormLabel className="text-text block">
                  Restaurant Images
                </FormLabel>
                <FormDescription className="text-text-muted">
                  Upload up to 5 images. These will be displayed in your
                  restaurant gallery.
                </FormDescription>

                {/* Existing Images */}
                {restaurant.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {restaurant.images.map((url, index) => (
                      <div
                        key={index}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-border"
                      >
                        <Image
                          src={url}
                          alt={`Restaurant image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteServerImage(url)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isDeletingImage}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Image Previews */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                    {previewUrls.map((url, index) => (
                      <div
                        key={`preview-${index}`}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-orange/50 border-dashed bg-orange/5"
                      >
                        <Image
                          src={url}
                          alt={`New upload ${index + 1}`}
                          fill
                          className="object-cover opacity-80"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-background/80 text-text rounded-md hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-dashed border-border text-text-muted hover:text-orange hover:border-orange bg-transparent"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select Images
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <span className="text-xs text-text-muted">
                    {selectedImages.length > 0
                      ? `${selectedImages.length} new image(s) selected`
                      : "No new images selected"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-orange hover:bg-orange/90 text-white min-w-[120px]"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="text-center py-12 text-text-muted">
            <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 opacity-50" />
            </div>
            <p>No restaurant found.</p>
            <p className="text-sm mt-2">
              Please contact support or create a new account.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
