"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { RentalOrder, RentalOrderStatus } from "@/types";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateString } from "@/lib/utils";
import { CheckCircle, PackageCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function ProviderOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.rentals.getAll({ providerId: user?.id || "usr-provider-1" });
      setOrders(data);
    } catch (err) {
      console.error("Failed to load provider orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Requirement Action Triggers:
  // PLACED -> Provider clicks "Confirm" -> CONFIRMED
  // PAID -> Provider clicks "Mark Picked Up" -> PICKED_UP
  // PICKED_UP -> Provider clicks "Mark Returned" -> RETURNED
  const handleUpdateStatus = async (orderId: string, newStatus: RentalOrderStatus) => {
    try {
      await api.rentals.updateStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-6xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Incoming Rental Orders</h1>
          <p className="text-xs text-slate-500">Confirm equipment requests, manage handovers, and process returns</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Fulfillment Orders Table ({orders.length})</h2>
          </div>

          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No incoming rental orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Item & Order #</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Rental Duration</th>
                    <th className="px-6 py-3.5">Total & Payment</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Fulfillment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={ord.gearImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{ord.gearTitle}</div>
                            <div className="text-[11px] text-slate-400 font-mono">#{ord.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-400">{ord.customerEmail}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div>{formatDateString(ord.startDate)} – {formatDateString(ord.endDate)}</div>
                        <div className="text-[11px] text-slate-400">{ord.totalDays} days</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">{formatCurrency(ord.totalAmount)}</div>
                        <span className={`text-[10px] font-bold uppercase ${ord.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={ord.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        {/* Fulfillment Action Buttons per Status */}
                        {ord.status === "PLACED" && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleUpdateStatus(ord.id, "CONFIRMED")}
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Confirm Order
                          </Button>
                        )}

                        {ord.status === "CONFIRMED" && (
                          <span className="text-[11px] text-blue-600 font-medium">Awaiting Customer Payment</span>
                        )}

                        {ord.status === "PAID" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdateStatus(ord.id, "PICKED_UP")}
                          >
                            <PackageCheck className="w-3.5 h-3.5 mr-1" /> Mark Picked Up
                          </Button>
                        )}

                        {ord.status === "PICKED_UP" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(ord.id, "RETURNED")}
                          >
                            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Mark Returned
                          </Button>
                        )}

                        {ord.status === "RETURNED" && (
                          <span className="text-[11px] text-slate-400 font-medium">Order Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
