"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  Star,
  UtensilsCrossed,
  ImagePlus,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCategories } from "@/hooks/useCategory";
import {
  useMyFoodItems,
  useCreateFoodItem,
  useUpdateFoodItem,
  useDeleteFoodItem,
} from "@/hooks/useFoodItems";
import type { FoodItem } from "@/services/food-items.service";
import { useEffect, useRef } from "react";

function formatPrice(price: number) {
  return `₦${price.toLocaleString()}`;
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
/* ------------------------------------------------------------------ */
function MenuSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border bg-surface"
        >
          <Skeleton className="aspect-4/3 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Food Item Form Schema                                              */
/* ------------------------------------------------------------------ */
const foodItemSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  categoryIds: z
    .array(z.string())
    .min(1, "Select at least 1 category")
    .max(3, "Maximum 3 categories"),
  calories: z.coerce.number().min(0).optional().or(z.literal("")),
});

type FoodItemFormValues = z.infer<typeof foodItemSchema>;

/* ------------------------------------------------------------------ */
/*  Create / Edit Dialog                                               */
/* ------------------------------------------------------------------ */
function FoodItemDialog({
  open,
  onOpenChange,
  foodItem,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  foodItem?: FoodItem;
}) {
  const isEditing = !!foodItem;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { data: categoriesRes } = useCategories();
  const categories = categoriesRes?.data?.categories ?? [];

  const createFoodItem = useCreateFoodItem();
  const updateFoodItem = useUpdateFoodItem();

  const form = useForm<FoodItemFormValues>({
    resolver: zodResolver(foodItemSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryIds: [],
      calories: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (foodItem) {
        form.reset({
          name: foodItem.name,
          description: foodItem.description,
          price: foodItem.price,
          categoryIds: foodItem.categoryIds,
          calories: foodItem.calories ?? "",
        });
        setImagePreviews(foodItem.images ?? []);
      } else {
        form.reset({
          name: "",
          description: "",
          price: 0,
          categoryIds: [],
          calories: "",
        });
        setImagePreviews([]);
      }
      setSelectedFiles([]);
    }
  }, [open, foodItem, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setSelectedFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const onSubmit = (values: FoodItemFormValues) => {
    const calories =
      values.calories !== "" && values.calories !== undefined
        ? Number(values.calories)
        : undefined;

    if (isEditing && foodItem) {
      updateFoodItem.mutate(
        {
          id: foodItem._id,
          data: {
            name: values.name,
            description: values.description,
            price: values.price,
            categoryIds: values.categoryIds,
            calories,
            ...(selectedFiles.length > 0 && { images: selectedFiles }),
          },
        },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      if (selectedFiles.length === 0) {
        form.setError("name", { message: "At least 1 image is required" });
        return;
      }
      createFoodItem.mutate(
        {
          name: values.name,
          description: values.description,
          price: values.price,
          categoryIds: values.categoryIds,
          calories,
          images: selectedFiles,
        },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  };

  const isPending = createFoodItem.isPending || updateFoodItem.isPending;

  const toggleCategory = (id: string) => {
    const current = form.getValues("categoryIds");
    if (current.includes(id)) {
      form.setValue(
        "categoryIds",
        current.filter((c) => c !== id),
        { shouldValidate: true },
      );
    } else if (current.length < 3) {
      form.setValue("categoryIds", [...current, id], { shouldValidate: true });
    }
  };

  const watchedCategories = form.watch("categoryIds");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-surface border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-text">
            {isEditing ? "Edit Food Item" : "Add Food Item"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-muted">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Margherita Pizza"
                      {...field}
                      className="bg-black/20 border-border text-text placeholder:text-text-dim"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-muted">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your food item…"
                      {...field}
                      className="bg-black/20 border-border text-text placeholder:text-text-dim resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price & Calories */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-muted">Price (₦)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2500"
                        {...field}
                        className="bg-black/20 border-border text-text placeholder:text-text-dim"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-muted">
                      Calories{" "}
                      <span className="text-text-dim text-xs">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="250"
                        {...field}
                        value={field.value ?? ""}
                        className="bg-black/20 border-border text-text placeholder:text-text-dim"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Categories */}
            <FormField
              control={form.control}
              name="categoryIds"
              render={() => (
                <FormItem>
                  <FormLabel className="text-text-muted">
                    Categories{" "}
                    <span className="text-text-dim text-xs">(1-3)</span>
                  </FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const selected = watchedCategories.includes(cat._id);
                      return (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => toggleCategory(cat._id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                            selected
                              ? "bg-orange/10 text-orange border-orange/30"
                              : "bg-surface-2 text-text-muted border-border hover:border-text-dim"
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Images */}
            <div className="space-y-2">
              <FormLabel className="text-text-muted">Images</FormLabel>
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((src, i) => (
                  <div
                    key={i}
                    className="relative h-20 w-20 rounded-lg overflow-hidden border border-border"
                  >
                    <Image
                      src={src}
                      alt={`preview-${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-orange/50 transition-colors"
                >
                  <ImagePlus className="h-5 w-5 text-text-muted" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-orange hover:bg-orange/90 text-white font-bold"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isEditing ? "Update Item" : "Create Item"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete Dialog                                                      */
/* ------------------------------------------------------------------ */
function DeleteFoodItemDialog({
  open,
  onOpenChange,
  foodItem,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  foodItem: FoodItem;
}) {
  const deleteFoodItem = useDeleteFoodItem();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-surface border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-text">
            Delete food item?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text-muted">
            This will permanently delete{" "}
            <span className="font-bold text-text">{foodItem.name}</span> and
            remove all its images.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border text-text hover:bg-surface-2 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              deleteFoodItem.mutate(foodItem._id, {
                onSuccess: () => onOpenChange(false),
              });
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={deleteFoodItem.isPending}
          >
            {deleteFoodItem.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */
export function MenuGrid() {
  const { data: foodItemsRes, isLoading, isError } = useMyFoodItems();
  const foodItems = foodItemsRes?.data?.foodItems ?? [];

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<FoodItem | null>(null);

  return (
    <Card className="border-border bg-surface">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-text">Your Menu</CardTitle>
        <Button
          size="sm"
          className="bg-orange hover:bg-orange/90 text-white font-semibold"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <MenuSkeleton />
        ) : isError ? (
          <div className="rounded-xl border border-border bg-surface p-12 text-center">
            <p className="text-red-500">Failed to load menu items.</p>
          </div>
        ) : foodItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <UtensilsCrossed className="h-10 w-10 text-text-dim mb-3" />
            <p className="text-text-muted text-sm mb-3">
              You haven&apos;t added any menu items yet.
            </p>
            <Button
              size="sm"
              className="bg-orange hover:bg-orange/90 text-white"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add your first item
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {foodItems.map((item) => (
              <div
                key={item._id}
                className="group overflow-hidden rounded-xl border border-border bg-black/20 hover:border-orange/50 hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="relative aspect-4/3 bg-surface-2">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-orange/20 to-amber-500/20">
                      <UtensilsCrossed className="h-10 w-10 text-orange/40" />
                    </div>
                  )}

                  {/* Price badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-black/70 text-white border-none font-bold">
                      {formatPrice(item.price)}
                    </Badge>
                  </div>

                  {/* Actions menu */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-surface border-border"
                      >
                        <DropdownMenuItem
                          onClick={() => setEditingItem(item)}
                          className="text-text hover:bg-surface-2 focus:bg-surface-2 cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingItem(item)}
                          className="text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-text mb-1">{item.name}</h3>
                  <p className="text-xs text-text-muted line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-text font-medium">
                        {item.rating.toFixed(1)}
                      </span>
                      <span className="text-text-muted text-xs">
                        ({item.totalReviews})
                      </span>
                    </div>
                    {item.calories !== undefined && (
                      <span className="text-xs text-text-muted">
                        {item.calories} cal
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Dialogs */}
      <FoodItemDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      {editingItem && (
        <FoodItemDialog
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          foodItem={editingItem}
        />
      )}

      {deletingItem && (
        <DeleteFoodItemDialog
          open={!!deletingItem}
          onOpenChange={(open) => !open && setDeletingItem(null)}
          foodItem={deletingItem}
        />
      )}
    </Card>
  );
}
