"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Star } from "lucide-react";
import { RentalOrder } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface ReviewModalProps {
  order: RentalOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReviewModal({ order, isOpen, onClose, onSuccess }: ReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a short review comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.reviews.create({
        gearId: order.gearId,
        orderId: order.id,
        userId: user?.id || "usr-customer-1",
        userName: user?.name || "Customer",
        userAvatar: user?.avatar,
        rating,
        comment,
      });

      toast.success("Thank you for submitting your review!");
      setComment("");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate & Review Rental Gear"
      description={`Share your experience renting the ${order.gearTitle}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
          <img
            src={order.gearImage}
            alt={order.gearTitle}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
              {order.gearTitle}
            </h4>
            <p className="text-xs text-slate-500">Provided by {order.providerName}</p>
          </div>
        </div>

        {/* Rating Stars */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Your Rating
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              {rating} / 5 Stars
            </span>
          </div>
        </div>

        {/* Review Comment */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Your Feedback
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="How was the gear condition, ease of pickup/return, and overall experience?"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
}
