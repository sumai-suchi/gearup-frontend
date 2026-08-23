"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RentalOrder } from "@/types";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDateString } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);

  useEffect(() => {
    async function load() {
      const data = await api.rentals.getAll();
      setOrders(data);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-6xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Global Rental Transactions Log</h1>
          <p className="text-xs text-slate-500">Monitor all platform transactions, payment statuses, and return cycles</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">All System Transactions ({orders.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Order #</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Provider</th>
                  <th className="px-6 py-3.5">Dates</th>
                  <th className="px-6 py-3.5">Total Paid</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">#{ord.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{ord.customerName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{ord.providerName}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDateString(ord.startDate)} � {formatDateString(ord.endDate)}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatCurrency(ord.totalAmount)}</td>
                    <td className="px-6 py-4"><StatusBadge status={ord.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
