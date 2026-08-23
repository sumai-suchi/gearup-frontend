"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PlatformStats } from "@/types";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { formatCurrency } from "@/lib/utils";
import { Shield, Users, Package, CreditCard, Activity, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const s = await api.admin.getStats();
        setStats(s);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-6xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase mb-2">
            <Shield className="w-3.5 h-3.5" /> Platform Governance
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Platform Analytics</h1>
          <p className="text-xs text-slate-500">Global platform health, user activity, content moderation, and revenue</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Total Registered Users</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalUsers || 0}</h3>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Active Listed Gear</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalGear || 0} items</h3>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Active Rentals</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.activeRentals || 0}</h3>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Gross Platform Volume</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats?.totalRevenue || 0)}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link href="/dashboard/admin/users" className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 shadow-sm hover:shadow-xl transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600">User Management</h3>
            <p className="text-xs text-slate-500">Inspect all customer and provider accounts. Suspend or activate users instantly.</p>
            <div className="text-xs font-bold text-purple-600 flex items-center gap-1 pt-2">
              Manage Users <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link href="/dashboard/admin/gear" className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 shadow-sm hover:shadow-xl transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600">Content Moderation</h3>
            <p className="text-xs text-slate-500">Review all published sports gear listings across providers. Remove flagged items.</p>
            <div className="text-xs font-bold text-purple-600 flex items-center gap-1 pt-2">
              Moderate Content <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link href="/dashboard/admin/orders" className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 shadow-sm hover:shadow-xl transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600">All Transactions</h3>
            <p className="text-xs text-slate-500">Monitor global rental orders, payment statuses, and transaction logs.</p>
            <div className="text-xs font-bold text-purple-600 flex items-center gap-1 pt-2">
              View Transactions <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
