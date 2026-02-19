"use client";

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
import { Category } from "@/services/category.service";
import { useDeleteCategory } from "@/hooks/useCategory";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
}: DeleteCategoryDialogProps) {
  const deleteCategory = useDeleteCategory();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-surface border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-text">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text-muted">
            This action cannot be undone. This will permanently delete the{" "}
            <span className="font-bold text-text">{category.name}</span>{" "}
            category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border text-text hover:bg-surface-2 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              deleteCategory.mutate(category._id, {
                onSuccess: () => onOpenChange(false),
              });
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={deleteCategory.isPending}
          >
            {deleteCategory.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
