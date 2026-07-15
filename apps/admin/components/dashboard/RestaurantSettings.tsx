"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, Trash2, Upload, ImageIcon, X, Store, Clock } from "lucide-react";
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
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";

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
    resolver: zodResolver(restaurantSchema) as Resolver<RestaurantFormValues> as any,
    defaultValues: {
      name: "",
      description: undefined,
      address: undefined,
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
        description: restaurant.description,
        address: restaurant.address,
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
    URL.revokeObjectURL(previewUrls[index]!);
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
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SpotlightCard className="bg-card border-border p-6" spotlightColor="rgba(255, 118, 34, 0.01)">
      <div className="mb-6 border-b border-border/40 pb-4 flex items-center gap-2">
        <Store className="h-4.5 w-4.5 text-primary shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-foreground">Restaurant Profile</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your store information, delivery configurations, and image gallery.
          </p>
        </div>
      </div>

      {restaurant ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                      Restaurant Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                      />
                    </FormControl>
                    <FormMessage className="text-[11px] text-red-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="openingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Opening Time
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="closingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Closing Time
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Store Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="deliveryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                      Delivery Fee (₦)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                      />
                    </FormControl>
                    <FormDescription className="text-[10px] text-muted-foreground font-semibold mt-1">
                      Charge fee applied for dispatching orders.
                    </FormDescription>
                    <FormMessage className="text-[11px] text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-background border-border focus:ring-primary/20 min-h-[100px] rounded-lg text-xs resize-none"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] text-red-500" />
                </FormItem>
              )}
            />

            {/* Image Gallery Section */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <div>
                <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground block">
                  Store Gallery Images
                </FormLabel>
                <FormDescription className="text-[10px] text-muted-foreground font-semibold mt-1">
                  Upload up to 5 food gallery items. These populate in client storefronts.
                </FormDescription>
              </div>

              {/* Server active gallery items */}
              {restaurant.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {restaurant.images.map((url, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square rounded-xl overflow-hidden border border-border/60 bg-muted/20 shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Restaurant image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteServerImage(url)}
                        className="absolute top-2 right-2 p-1.5 bg-destructive/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isDeletingImage}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Uploading Previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={`preview-${index}`}
                      className="relative group aspect-square rounded-xl overflow-hidden border border-dashed border-primary/40 bg-primary/5"
                    >
                      <img
                        src={url}
                        alt={`New upload ${index + 1}`}
                        className="object-cover w-full h-full opacity-85"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-background/80 text-foreground rounded-md hover:bg-destructive hover:text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload trigger */}
              <div className="flex items-center gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary bg-transparent text-xs h-9 rounded-lg font-semibold"
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
                <span className="text-[10px] text-muted-foreground font-semibold">
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
                className="h-10 px-6 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 rounded-lg shadow-sm"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline-block" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 opacity-50 text-muted-foreground" />
          </div>
          <p className="text-xs">No restaurant found.</p>
          <p className="text-[10px] text-muted-foreground mt-2">
            Please contact support or create a new account.
          </p>
        </div>
      )}
    </SpotlightCard>
  );
}
