"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { RentalOrder } from "@/types";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateString } from "@/lib/utils";
import { CreditCard, ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PaymentInitiationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<"stripe" | "sslcommerz">("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const o = await api.rentals.getById(orderId);
        if (o) setOrder(o);
      } catch (err) {
        console.error("Failed to load order:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handleInitiatePayment = async () => {
    if (!order) return;
    setIsProcessing(true);
    try {
      const { redirectUrl } = await api.payments.createCheckoutSession(order.id, selectedGateway);
      toast.success(`Redirecting to ${selectedGateway === "stripe" ? "Stripe Checkout" : "SSLCommerz"}...`);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 600);
    } catch (err: any) {
      toast.error(err.message || "Payment initiation failed.");
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="max-w-2xl mx-auto p-12 text-center text-sm">Loading checkout...</div>;

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link href="/dashboard/customer"><Button className="mt-4">Back to Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <Link href="/dashboard/customer" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 transition">
        <ArrowLeft className="w-4 h-4" /> Return to Customer Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Secure Payment Gateway</span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Complete Rental Payment</h1>
          <p className="text-xs text-slate-500">Order #{order.id} � Confirmed by {order.providerName}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-4">
          <img src={order.gearImage} alt="" className="w-16 h-16 rounded-xl object-cover" />
          <div className="flex-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{order.gearTitle}</h3>
            <p className="text-xs text-slate-500">
              {formatDateString(order.startDate)} to {formatDateString(order.endDate)} ({order.totalDays} days)
            </p>
          </div>
          <div className="text-right font-extrabold text-base text-slate-900 dark:text-white">
            {formatCurrency(order.totalAmount)}
          </div>
        </div>

        <div className="space-y-2 text-xs border-y border-slate-100 dark:border-slate-800 py-4">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Rental Rate ({formatCurrency(order.dailyRate)} � {order.totalDays} days)</span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Refundable Security Deposit</span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(order.securityDeposit)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2">
            <span>Total to Pay Now</span>
            <span className="text-emerald-600">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
            Select Payment Gateway
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedGateway("stripe")}
              className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                selectedGateway === "stripe"
                  ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Stripe Checkout</span>
                <CreditCard className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Visa, Mastercard, Amex, Apple Pay</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedGateway("sslcommerz")}
              className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                selectedGateway === "sslcommerz"
                  ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">SSLCommerz</span>
                <Lock className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Cards, Mobile Banking & NetBanking</p>
            </button>
          </div>
        </div>

        <Button
          onClick={handleInitiatePayment}
          variant="primary"
          size="lg"
          className="w-full py-4 text-base font-bold shadow-xl shadow-emerald-600/30"
          isLoading={isProcessing}
        >
          <Lock className="w-4 h-4 mr-2" /> Pay {formatCurrency(order.totalAmount)} via {selectedGateway === "stripe" ? "Stripe" : "SSLCommerz"}
        </Button>

        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-bit encrypted checkout. Handled via official payment gateway redirect.</span>
        </div>
      </div>
    </div>
  );
}
