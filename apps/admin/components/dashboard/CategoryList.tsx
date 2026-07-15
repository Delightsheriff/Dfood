"use client";

import { Category } from "@/services/category.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Layers,
  Eye,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CategoryDialog } from "./CategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategory";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";
import { toast } from "sonner";

export function CategoryList() {
  const router = useRouter();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Local state to support instant sorting and custom updates
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const { data: categoriesResponse, isLoading, error } = useCategories();

  useEffect(() => {
    if (categoriesResponse?.data?.categories) {
      setLocalCategories(categoriesResponse.data.categories);
    }
  }, [categoriesResponse]);

  const handleSaveSuccess = (savedCat: Category) => {
    setLocalCategories((prev) => {
      const exists = prev.some((c) => c._id === savedCat._id);
      if (exists) {
        return prev.map((c) => (c._id === savedCat._id ? savedCat : c));
      }
      return [savedCat, ...prev];
    });
    toast.success("Category saved successfully");
  };

  const handleDeleteSuccess = (id: string) => {
    setLocalCategories((prev) => prev.filter((c) => c._id !== id));
    toast.success("Category deleted");
  };

  // Drag-free sorting controls: Swap elements in array
  const moveCategory = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localCategories.length) return;

    const updated = [...localCategories];
    const temp = updated[index]!;
    updated[index] = updated[targetIndex]!;
    updated[targetIndex] = temp;

    setLocalCategories(updated);
    toast.success("Category sequence updated");
  };

  if (isLoading && localCategories.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error && localCategories.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-destructive">Failed to load categories.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Manager layout */}
      <SpotlightCard className="border-border bg-card">
        <div className="flex flex-row items-center justify-between border-b border-border/40 py-4 px-6">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-primary" />
            Food Categories
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="h-9 px-4 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        <CardContent className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-20 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Order</TableHead>
                <TableHead className="w-24 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Image</TableHead>
                <TableHead className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Name</TableHead>
                <TableHead className="text-right text-[10px] font-bold tracking-wider uppercase text-muted-foreground pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localCategories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground text-xs font-medium"
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                localCategories.map((category, index) => (
                  <TableRow
                    key={category._id}
                    className="border-border hover:bg-muted/10 transition-colors"
                  >
                    {/* Rearrange arrows */}
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => moveCategory(index, "up")}
                          className="p-1 hover:text-primary text-muted-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={index === localCategories.length - 1}
                          onClick={() => moveCategory(index, "down")}
                          className="p-1 hover:text-primary text-muted-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Avatar className="h-9 w-9 text-primary border border-border/40">
                        {category.image && (
                          <AvatarImage
                            src={category.image}
                            alt={category.name}
                            className="object-cover"
                          />
                        )}
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          <Layers className="h-4.5 w-4.5" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    <TableCell className="font-bold text-foreground text-xs">
                      {category.name}
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/40"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-card border-border p-1 rounded-lg"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/categories/${category._id}`)
                            }
                            className="text-xs text-foreground hover:bg-muted focus:bg-muted cursor-pointer rounded"
                          >
                            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            View Items
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEditingCategory(category)}
                            className="text-xs text-foreground hover:bg-muted focus:bg-muted cursor-pointer rounded"
                          >
                            <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            Edit Name
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingCategory(category)}
                            className="text-xs text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete Category
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </SpotlightCard>

      {/* Dialog connection overrides */}
      <CategoryDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {editingCategory && (
        <CategoryDialog
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          category={editingCategory}
        />
      )}

      {deletingCategory && (
        <DeleteCategoryDialog
          open={!!deletingCategory}
          onOpenChange={(open) => !open && setDeletingCategory(null)}
          category={deletingCategory}
        />
      )}
    </div>
  );
}
