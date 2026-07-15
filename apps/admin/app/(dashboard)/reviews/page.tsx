"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";
import {
  Star,
  MessageSquare,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle,
  CornerDownRight,
  Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  orderCode: string;
  restaurantName?: string;
  reply?: string;
  replyDate?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "rev1",
      customerName: "Obinna K.",
      rating: 5,
      comment: "Super fast delivery! The Jollof rice was hot and delicious. Definitely ordering again.",
      date: "2026-07-15",
      orderCode: "ORD-20260715-AB",
      restaurantName: "Mega Chicken",
      reply: "Thank you for the wonderful feedback, Obinna! We always strive to serve you hot and fresh.",
      replyDate: "2026-07-15",
    },
    {
      id: "rev2",
      customerName: "Chidi E.",
      rating: 2,
      comment: "The food was cold and it took over an hour. Disappointed with the service this time.",
      date: "2026-07-14",
      orderCode: "ORD-20260714-XY",
      restaurantName: "Chicken Republic",
    },
    {
      id: "rev3",
      customerName: "Funmi A.",
      rating: 4,
      comment: "Good portion sizes. Pasta was seasoned well, but the delivery fee is a bit high.",
      date: "2026-07-13",
      orderCode: "ORD-20260713-ZZ",
      restaurantName: "The Place",
    },
    {
      id: "rev4",
      customerName: "Tunde O.",
      rating: 1,
      comment: "Awful. I ordered a beef burger and got chicken instead, and the drink was flat.",
      date: "2026-07-12",
      orderCode: "ORD-20260712-PP",
      restaurantName: "Mr Bigg's",
    },
  ]);

  const [selectedRating, setSelectedRating] = useState<number | "all">("all");
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const handleReplySubmit = (id: string) => {
    const text = replyInputs[id]?.trim();
    if (!text) {
      toast.error("Reply text cannot be empty");
      return;
    }

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          reply: text,
          replyDate: new Date().toISOString().split("T")[0],
        };
      })
    );

    setReplyInputs((prev) => ({ ...prev, [id]: "" }));
    toast.success("Response submitted");
  };

  const filteredReviews = reviews.filter((r) => {
    if (selectedRating === "all") return true;
    return r.rating === selectedRating;
  });

  const totalReviews = reviews.length;
  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
  ).toFixed(1);
  const unansweredCount = reviews.filter((r) => !r.reply).length;

  // Star breakdowns
  const getStarPercentage = (star: number) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <PageShell title="Customer Reviews">
      <div className="space-y-6">
        {/* Analytics Rows */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Rating Summary card */}
          <SpotlightCard className="bg-card border-border p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground mb-4">
                Average Rating
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-foreground tracking-tight">
                  {averageRating}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">/ 5.0</span>
              </div>
              <div className="flex gap-0.5 mt-3 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4.5 w-4.5 ${
                      i < Math.round(Number(averageRating)) ? "fill-primary" : "text-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-6 pt-4 border-t border-border/40 font-medium">
              Based on {totalReviews} client reviews
            </p>
          </SpotlightCard>

          {/* Star Breakdown Card */}
          <SpotlightCard className="bg-card border-border p-6 lg:col-span-2">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground mb-4">
              Rating Distribution
            </h3>
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = getStarPercentage(star);
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-8 font-bold flex items-center gap-0.5">
                      {star} <Star className="h-3 w-3 fill-primary text-primary inline" />
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-muted-foreground font-semibold">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </SpotlightCard>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <button
              onClick={() => setSelectedRating("all")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 ${
                selectedRating === "all"
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              All Stars
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedRating(star)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border flex items-center gap-1 transition-all duration-300 ${
                  selectedRating === star
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {star} <Star className="h-3 w-3 fill-current shrink-0" />
              </button>
            ))}
          </div>

          <div className="text-xs text-muted-foreground font-semibold">
            {unansweredCount} review replies pending
          </div>
        </div>

        {/* Reviews Feed */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <SpotlightCard
              key={review.id}
              className="p-6 border border-border bg-card shadow-sm"
              spotlightColor="rgba(255, 118, 34, 0.03)"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Review Header info */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground text-sm">
                      {review.customerName}
                    </span>
                    <div className="flex gap-0.5 text-primary">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating ? "fill-primary" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {review.date}
                    </span>
                    <span>Order: <span className="font-semibold text-foreground font-mono">{review.orderCode}</span></span>
                    {review.restaurantName && (
                      <span>Restaurant: <span className="font-semibold text-foreground">{review.restaurantName}</span></span>
                    )}
                  </div>

                  <p className="mt-4 text-xs text-foreground leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>

              {/* Nested Reply */}
              {review.reply ? (
                <div className="mt-6 pl-4 border-l-2 border-primary/20 flex gap-3 animate-in slide-in-from-left-2 duration-300">
                  <CornerDownRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Response Submitted
                      </span>
                      <span className="text-[9px] text-muted-foreground font-medium">
                        {review.replyDate}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {review.reply}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-3">
                  <CornerDownRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    placeholder="Draft response to this customer..."
                    value={replyInputs[review.id] ?? ""}
                    onChange={(e) =>
                      setReplyInputs((prev) => ({ ...prev, [review.id]: e.target.value }))
                    }
                    className="flex-1 h-9 bg-background border-border text-xs rounded-lg"
                  />
                  <Button
                    onClick={() => handleReplySubmit(review.id)}
                    size="sm"
                    className="h-9 px-4 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 rounded-lg flex items-center gap-1 shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Reply
                  </Button>
                </div>
              )}
            </SpotlightCard>
          ))}

          {filteredReviews.length === 0 && (
            <div className="border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground text-xs">
              No reviews found matching star filter
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
