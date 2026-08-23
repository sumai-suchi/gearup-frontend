import React from "react";
import Link from "next/link";
import { GearItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Star, MapPin, CheckCircle, ShieldAlert, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface GearCardProps {
  gear: GearItem;
}

export function GearCard({ gear }: GearCardProps) {
  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={gear.images[0] || "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800"}
          alt={gear.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <Badge variant="default" className="bg-slate-900/80 text-white backdrop-blur-md border-0">
            {gear.category}
          </Badge>
        </div>

        {/* Stock / Availability Indicator */}
        <div className="absolute top-3 right-3">
          {gear.isAvailable && gear.stock > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
              <CheckCircle className="w-3 h-3" /> In Stock ({gear.stock})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/90 text-white backdrop-blur-md shadow-sm">
              <ShieldAlert className="w-3 h-3" /> Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
              {gear.brand}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {gear.rating.toFixed(1)}
              </span>
              <span>({gear.reviewsCount})</span>
            </div>
          </div>

          <Link href={`/gear/${gear.id}`}>
            <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {gear.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{gear.location} � {gear.condition} Condition</span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(gear.pricePerDay)}
            </span>
            <span className="text-xs text-slate-500 font-medium"> / day</span>
          </div>

          <Link
            href={`/gear/${gear.id}`}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-colors shadow-sm"
          >
            <span>Rent Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
