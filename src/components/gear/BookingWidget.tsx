"use client";

import React, { useState } from "react";
import { GearItem } from "@/types";
import { formatCurrency, calculateDaysBetween } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Calendar, ShieldCheck, Zap, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface BookingWidgetProps {
  gear: GearItem;
}

export function BookingWidget({ gear }: BookingWidgetProps) {
  const { user } = useAuth();
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalDays = calculateDaysBetween(startDate, endDate);
  const subtotal = gear.pricePerDay * totalDays;
  const securityDeposit = gear.securityDeposit;
  const totalAmount = subtotal + securityDeposit;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please sign in or select a demo account to reserve equipment.");
      router.push(`/auth/login?redirect=/gear/${gear.id}`);
      return;
    }

    if (!gear.isAvailable || gear.stock < 1) {
      toast.error("This gear is currently out of stock.");
      return;
    }

    if (totalDays <= 0) {
      toast.error("End date must be after start date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await api.rentals.create({
        gearId: gear.id,
        gearTitle: gear.title,
        gearImage: gear.images[0],
        gearCategory: gear.category,
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        providerId: gear.providerId,
        providerName: gear.providerName,
        startDate,
        endDate,
        totalDays,
        dailyRate: gear.pricePerDay,
        subtotal,
        securityDeposit,
        totalAmount,
      });

      toast.success("Rental request placed successfully! Provider will confirm shortly.");
      router.push("/dashboard/customer");
    } catch (err: any) {
      toast.error(err.message || "Failed to create rental reservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl sticky top-24">
      {/* Price Header */}
      <div className="flex items-baseline justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(gear.pricePerDay)}
          </span>
          <span className="text-sm font-medium text-slate-500"> / day</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
            Instant Confirmation
          </span>
          <span className="text-[11px] text-slate-400">Refundable Deposit: {formatCurrency(gear.securityDeposit)}</span>
        </div>
      </div>

      {/* Date Pickers */}
      <form onSubmit={handleBooking} className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Pickup Date
            </label>
            <div className="relative">
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Return Date
            </label>
            <div className="relative">
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>
              {formatCurrency(gear.pricePerDay)} × {totalDays} {totalDays === 1 ? "day" : "days"}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              Refundable Security Deposit
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(securityDeposit)}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
            <span>Total Estimated</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-base">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {/* Submit CTA */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full py-4 text-base font-bold shadow-lg shadow-emerald-600/30"
          isLoading={isSubmitting}
          disabled={!gear.isAvailable || gear.stock < 1}
        >
          <Zap className="w-5 h-5 fill-current" />
          <span>{gear.isAvailable ? "Request Rental Now" : "Unavailable"}</span>
        </Button>
      </form>

      {/* Safety & Guarantee Note */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          Gear is protected by GearUp Rental Guarantee. Security deposit refunded upon safe return.
        </span>
      </div>
    </div>
  );
}
