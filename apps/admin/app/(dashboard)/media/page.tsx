"use client";

import React, { useState, useRef } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  FileImage,
  Search,
  Grid,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface MediaAsset {
  id: string;
  name: string;
  category: "mains" | "sides" | "dessert" | "drinks";
  size: string;
  dimensions: string;
  url: string;
  uploadedAt: string;
}

export default function MediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([
    {
      id: "m1",
      name: "jollof_rice_chicken.jpg",
      category: "mains",
      size: "240 KB",
      dimensions: "1200 x 800",
      url: "/app-screen-1.jpeg", // recycle existing app images for high-fidelity mocks
      uploadedAt: "2026-07-15",
    },
    {
      id: "m2",
      name: "spaghetti_meatballs.jpg",
      category: "mains",
      size: "185 KB",
      dimensions: "1000 x 667",
      url: "/app-screen-2.jpeg",
      uploadedAt: "2026-07-14",
    },
    {
      id: "m3",
      name: "coca_cola_can.jpg",
      category: "drinks",
      size: "95 KB",
      dimensions: "800 x 800",
      url: "/cart.jpeg",
      uploadedAt: "2026-07-13",
    },
    {
      id: "m4",
      name: "chocolate_cake_slice.jpg",
      category: "dessert",
      size: "310 KB",
      dimensions: "1200 x 900",
      url: "/app-screen-4.jpeg",
      uploadedAt: "2026-07-12",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  
  // Drag and drop / upload simulation states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAssets((prev) => prev.filter((a) => a.id !== id));
    toast.success("Asset deleted from library");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const simulateUpload = (fileName: string) => {
    setUploadingProgress(10);
    const interval = setInterval(() => {
      setUploadingProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          
          // Complete upload and append asset
          const newAsset: MediaAsset = {
            id: `m-${Date.now()}`,
            name: fileName,
            category: "mains",
            size: "150 KB",
            dimensions: "1200 x 800",
            url: "/app-screen-1.jpeg",
            uploadedAt: new Date().toISOString().split("T")[0]!,
          };
          setAssets((assets) => [newAsset, ...assets]);
          setUploadingProgress(null);
          toast.success("Asset uploaded successfully");
          return null;
        }
        return prev + 30;
      });
    }, 300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      simulateUpload(file.name);
    }
  };

  const filteredAssets = assets.filter((a) => {
    const matchesCategory = selectedCategory === "all" || a.category === selectedCategory;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageShell title="Media Library">
      <div className="space-y-6">
        {/* Upload Drop Zone Grid */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />

          {uploadingProgress !== null ? (
            <div className="w-full max-w-xs text-center space-y-3">
              <div className="text-xs font-bold text-foreground">
                Uploading asset... {uploadingProgress}%
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-2.5">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Supports JPG, PNG, WEBP formats up to 4MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search assets by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-card border-border text-xs rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              All
            </button>
            {["mains", "sides", "dessert", "drinks"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Grid List */}
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
          {filteredAssets.map((asset) => (
            <SpotlightCard
              key={asset.id}
              onClick={() => setPreviewAsset(asset)}
              className="p-3 border border-border bg-card rounded-xl cursor-pointer group shadow-sm flex flex-col justify-between"
              spotlightColor="rgba(255, 118, 34, 0.02)"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border/40">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-300"
                />
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <div className="p-1.5 bg-background border border-border rounded-lg text-foreground hover:text-primary">
                      <Eye className="h-4 w-4" />
                    </div>
                    <button
                      onClick={(e) => handleDelete(asset.id, e)}
                      className="p-1.5 bg-background border border-border rounded-lg text-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-[11px] font-bold text-foreground truncate" title={asset.name}>
                  {asset.name}
                </div>
                <div className="flex justify-between items-center mt-2 text-[9px] text-muted-foreground font-semibold">
                  <span>{asset.dimensions}</span>
                  <span className="px-1.5 py-0.5 rounded bg-muted uppercase border border-border/40">
                    {asset.size}
                  </span>
                </div>
              </div>
            </SpotlightCard>
          ))}

          {filteredAssets.length === 0 && (
            <div className="col-span-full border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground text-xs">
              No files found in media library
            </div>
          )}
        </div>
      </div>

      {/* Asset Preview Modal */}
      <Dialog open={!!previewAsset} onOpenChange={(open) => !open && setPreviewAsset(null)}>
        <DialogContent className="sm:max-w-xl bg-card border-border p-6 rounded-2xl shadow-lg">
          {previewAsset && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground truncate max-w-md">
                  {previewAsset.name}
                </DialogTitle>
              </DialogHeader>

              <div className="aspect-video rounded-xl overflow-hidden bg-muted border border-border/40 relative mt-2">
                <img
                  src={previewAsset.url}
                  alt={previewAsset.name}
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border/40 mt-6 pt-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Dimensions:</span>
                  <p className="font-bold text-foreground mt-0.5">{previewAsset.dimensions} px</p>
                </div>
                <div>
                  <span className="text-muted-foreground">File Size:</span>
                  <p className="font-bold text-foreground mt-0.5">{previewAsset.size}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-bold text-foreground mt-0.5 uppercase tracking-wider">{previewAsset.category}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Uploaded:</span>
                  <p className="font-bold text-foreground mt-0.5">{previewAsset.uploadedAt}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
