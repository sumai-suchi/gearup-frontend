"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { GearItem, RentalOrder } from "@/types";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateString } from "@/lib/utils";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Package, ClipboardList, DollarSign, PlusCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [gearList, setGearList] = useState<GearItem[]>([]);
  const [orders, setOrders] = useState<RentalOrder[]>([]);

  useEffect(() => {
    async function loadData() {
      const gear = await api.gear.getAll({ providerId: user?.id || "usr-provider-1" });
      const ords = await api.rentals.getAll({ providerId: user?.id || "usr-provider-1" });
      setGearList(gear);
      setOrders(ords);
    }
    loadData();
  }, [user]);

  const activeRentals = orders.filter((o) => o.status === "PICKED_UP" || o.status === "PAID").length;
  const pendingRequests = orders.filter((o) => o.status === "PLACED").length;
  const totalEarnings = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.subtotal, 0);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Provider Hub (Vendor)</h1>
            <p className="text-xs text-slate-500">Manage gear inventory, fulfill incoming bookings, and track revenue</p>
          </div>
          <Link href="/dashboard/provider/gear/new">
            <Button variant="primary" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" /> List New Equipment
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Listed Gear</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{gearList.length} items</h3>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <ClipboardList className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Pending Requests</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{pendingRequests} orders</h3>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Active Rentals</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activeRentals}</h3>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Rental Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalEarnings)}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Incoming Orders</h2>
              <p className="text-xs text-slate-400">Incoming requests from customers</p>
            </div>
            <Link href="/dashboard/provider/orders">
              <Button variant="ghost" size="sm">Manage Orders <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </div>

          <div className="p-6">
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No incoming orders at the moment.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={ord.gearImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{ord.gearTitle}</h4>
                        <p className="text-[11px] text-slate-500">{ord.customerName} ({ord.customerEmail})</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-xs text-slate-900 dark:text-white">{formatCurrency(ord.totalAmount)}</div>
                        <div className="text-[10px] text-slate-400">{formatDateString(ord.startDate)} to {formatDateString(ord.endDate)}</div>
                      </div>
                      <StatusBadge status={ord.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
