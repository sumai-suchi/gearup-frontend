"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { GearItem, Review } from "@/types";
import { BookingWidget } from "@/components/gear/BookingWidget";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Star, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDateString } from "@/lib/utils";

export default function GearDetailsPage() {
  const params = useParams();
  const gearId = params.id as string;

  const [gear, setGear] = useState<GearItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!gearId) return;
      try {
        const item = await api.gear.getById(gearId);
        if (item) {
          setGear(item);
          setSelectedImage(item.images[0] || "");
        }
        const revs = await api.reviews.getByGearId(gearId);
        setReviews(revs);
      } catch (err) {
        console.error("Failed to load gear details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [gearId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Gear Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The equipment you are looking for is no longer available.</p>
        <Link href="/gear">
          <Button variant="primary"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/gear" className="hover:text-emerald-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Gear Catalog
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200">{gear.category}</span>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-xs">{gear.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-md">
              <img src={selectedImage || gear.images[0]} alt={gear.title} className="w-full h-full object-cover" />
            </div>

            {gear.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gear.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${
                      selectedImage === img ? "border-emerald-500 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-emerald-200">{gear.category}</Badge>
              <Badge variant="default" className="bg-slate-100 text-slate-700">{gear.brand}</Badge>
              <span className="text-xs text-slate-500">� {gear.condition} Condition</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{gear.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900 dark:text-white">{gear.rating.toFixed(1)}</span>
                <span>({gear.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{gear.location}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-bold text-lg">
                {gear.providerName.charAt(0)}
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Verified Provider</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{gear.providerName}</h4>
                <p className="text-xs text-slate-400">Rating: {gear.providerRating} ? � 100% On-time handover</p>
              </div>
            </div>
            <Badge variant="success">Verified Shop</Badge>
          </div>

          <div className="space-y-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">About this Equipment</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{gear.description}</p>
          </div>

          {gear.specs && Object.keys(gear.specs).length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Technical Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(gear.specs).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">{key}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Renter Feedback & Reviews</h3>
                <p className="text-xs text-slate-500">Verified experiences from previous renters</p>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{gear.rating.toFixed(1)} / 5</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No reviews yet. Be the first to rent and leave feedback!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={rev.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{rev.userName}</div>
                          <div className="text-[10px] text-slate-400">{formatDateString(rev.createdAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <BookingWidget gear={gear} />
        </div>
      </div>
    </div>
  );
}
