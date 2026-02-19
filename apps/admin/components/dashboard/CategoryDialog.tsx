"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { Category } from "@/services/category.service";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategory";
import { UpdateCategoryRequest } from "@/services/category.service";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
}: CategoryDialogProps) {
  const isEditing = !!category;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when dialog opens or category changes
  useEffect(() => {
    if (open) {
      if (category) {
        form.reset({ name: category.name });
        setImagePreview(category.image);
      } else {
        form.reset({ name: "" });
        setImagePreview(null);
      }
      setSelectedFile(null);
    }
  }, [open, category, form]);

  const onSubmit = (values: FormValues) => {
    if (!isEditing && !selectedFile) {
      toast.error("Image is required for new categories");
      return;
    }

    if (isEditing && category) {
      const updateData: UpdateCategoryRequest = {
        name: values.name,
      };
      if (selectedFile) {
        updateData.image = selectedFile;
      }

      updateCategory.mutate(
        { id: category._id, data: updateData },
        {
          onSuccess: () => onOpenChange(false),
        },
      );
    } else {
      createCategory.mutate(
        {
          name: values.name,
          image: selectedFile!,
        },
        {
          onSuccess: () => onOpenChange(false),
        },
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-text">
            {isEditing ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-muted">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Italian"
                      {...field}
                      className="bg-black/20 border-border text-text placeholder:text-text-dim"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel className="text-text-muted">Image</FormLabel>
              <div
                className="flex items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-surface-2 transition-colors relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">
                        Change Image
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-text-muted">
                    <ImagePlus className="h-8 w-8" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border text-text hover:bg-surface-2 hover:text-white"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-orange hover:bg-orange/90 text-white"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
