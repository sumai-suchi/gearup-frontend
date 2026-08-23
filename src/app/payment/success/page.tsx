"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { RentalOrder } from "@/types";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id") || `pi_mock_${Date.now()}`;
  const method = searchParams.get("method") || "stripe";

  const [order, setOrder] = useState<RentalOrder | null>(null);

  useEffect(() => {
    async function finalize() {
      if (!orderId) return;
      try {
        const updated = await api.payments.confirmPayment(orderId, sessionId, method);
        setOrder(updated);
      } catch (err) {
        console.error("Payment confirmation error:", err);
      }
    }
    finalize();
  }, [orderId, sessionId, method]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Payment Verified</span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Rental Confirmed & Paid!</h1>
          <p className="text-xs text-slate-500 mt-1">Transaction ID: <span className="font-mono text-slate-700 dark:text-slate-300">{sessionId}</span></p>
        </div>

        {order && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-left space-y-2 text-xs">
            <div className="flex justify-between font-bold text-slate-900 dark:text-white">
              <span>{order.gearTitle}</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            <p className="text-slate-400">Ready for pickup at {order.providerName}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <Link href="/dashboard/customer">
            <Button variant="primary" className="w-full py-3">
              <ShoppingBag className="w-4 h-4 mr-2" /> View in Customer Dashboard
            </Button>
          </Link>
          <Link href="/gear">
            <Button variant="outline" className="w-full">Explore More Gear <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
