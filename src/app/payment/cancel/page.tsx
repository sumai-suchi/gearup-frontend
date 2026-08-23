"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
          <XCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">Payment Cancelled</span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Checkout Was Not Completed</h1>
          <p className="text-xs text-slate-500 mt-1">No charges were made. Your reservation is still saved.</p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          {orderId && (
            <Link href={`/dashboard/customer/orders/${orderId}/pay`}>
              <Button variant="primary" className="w-full py-3">
                <RefreshCw className="w-4 h-4 mr-2" /> Retry Payment
              </Button>
            </Link>
          )}
          <Link href="/dashboard/customer">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
