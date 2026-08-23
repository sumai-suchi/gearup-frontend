"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { RentalOrder } from "@/types";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ReviewModal } from "@/components/common/ReviewModal";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateString } from "@/lib/utils";
import { ShoppingBag, CreditCard, Star, Clock, PackageCheck } from "lucide-react";
import Link from "next/link";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReviewOrder, setSelectedReviewOrder] = useState<RentalOrder | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.rentals.getAll({ customerId: user?.id || "usr-customer-1" });
      setOrders(data);
    } catch (err) {
      console.error("Failed to load customer orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Metric aggregations for customer dashboard
  const activeRentalsCount = orders.filter((o) => o.status === "PICKED_UP" || o.status === "PAID" || o.status === "CONFIRMED").length;
  const completedCount = orders.filter((o) => o.status === "RETURNED").length;
  const totalSpent = orders.filter((o) => o.paymentStatus === "paid").reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Role Dashboard Sidebar */}
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Customer Rental Hub</h1>
            <p className="text-xs text-slate-500">Track current gear bookings, complete payments, and leave feedback</p>
          </div>
          <Link href="/gear">
            <Button variant="primary" size="sm">
              <ShoppingBag className="w-4 h-4 mr-1.5" /> Rent More Gear
            </Button>
          </Link>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Active Bookings</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activeRentalsCount}</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Completed Trips</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{completedCount}</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Paid</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalSpent)}</h3>
            </div>
          </div>
        </div>

        {/* Customer Orders Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Rental Orders & History</h2>
            <p className="text-xs text-slate-400">Live order status and fulfillment workflow</p>
          </div>

          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">No rental orders placed yet</h3>
              <p className="text-xs text-slate-400">Browse the catalog to reserve your first mountain bike, tent, or kayak.</p>
              <Link href="/gear"><Button size="sm">Explore Equipment</Button></Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Equipment</th>
                    <th className="px-6 py-3.5">Dates & Duration</th>
                    <th className="px-6 py-3.5">Total Cost</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={order.gearImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{order.gearTitle}</div>
                            <div className="text-[11px] text-slate-400">Order #{order.id} • {order.providerName}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatDateString(order.startDate, "MMM dd")} – {formatDateString(order.endDate, "MMM dd, yyyy")}
                        </div>
                        <div className="text-[11px] text-slate-400">{order.totalDays} {order.totalDays === 1 ? "day" : "days"} rental</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</div>
                        <div className="text-[10px] text-slate-400">Deposit: {formatCurrency(order.securityDeposit)}</div>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        {/* Mandatory Requirement: CONFIRMED status renders Pay Now button */}
                        {order.status === "CONFIRMED" && (
                          <Link href={`/dashboard/customer/orders/${order.id}/pay`}>
                            <Button size="sm" variant="primary" className="shadow-md shadow-emerald-500/20">
                              <CreditCard className="w-3.5 h-3.5 mr-1" /> Pay Now
                            </Button>
                          </Link>
                        )}

                        {/* Mandatory Requirement: RETURNED status renders Leave Review button */}
                        {order.status === "RETURNED" && !order.reviewSubmitted && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedReviewOrder(order)}
                          >
                            <Star className="w-3.5 h-3.5 mr-1 text-amber-400" /> Review Gear
                          </Button>
                        )}

                        {order.status === "RETURNED" && order.reviewSubmitted && (
                          <span className="text-[11px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
                            <Star className="w-3 h-3 fill-emerald-600" /> Reviewed
                          </span>
                        )}

                        {order.status === "PLACED" && (
                          <span className="text-[11px] text-amber-600 font-medium">Awaiting Provider</span>
                        )}

                        {order.status === "PAID" && (
                          <span className="text-[11px] text-purple-600 font-medium">Ready for Pickup</span>
                        )}

                        {order.status === "PICKED_UP" && (
                          <span className="text-[11px] text-emerald-600 font-medium">Gear in Use</span>
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

      {/* Review Submission Modal */}
      <ReviewModal
        order={selectedReviewOrder}
        isOpen={!!selectedReviewOrder}
        onClose={() => setSelectedReviewOrder(null)}
        onSuccess={fetchOrders}
      />
    </div>
  );
}
