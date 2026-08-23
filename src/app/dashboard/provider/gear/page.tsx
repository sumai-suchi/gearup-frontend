"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { GearItem } from "@/types";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { PlusCircle, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProviderGearListPage() {
  const { user } = useAuth();
  const [gearList, setGearList] = useState<GearItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGear = async () => {
    setIsLoading(true);
    try {
      const data = await api.gear.getAll({ providerId: user?.id || "usr-provider-1" });
      setGearList(data);
    } catch (err) {
      console.error("Failed to load provider gear:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGear();
  }, [user]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" from your listed inventory?`)) return;
    try {
      await api.gear.delete(id);
      toast.success("Gear item removed.");
      fetchGear();
    } catch (err: any) {
      toast.error("Failed to delete item.");
    }
  };

  const handleToggleStock = async (gear: GearItem) => {
    try {
      await api.gear.update(gear.id, { isAvailable: !gear.isAvailable });
      toast.success(`${gear.title} status updated`);
      fetchGear();
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Gear Inventory Management</h1>
            <p className="text-xs text-slate-500">Create, edit, toggle availability, and monitor equipment</p>
          </div>
          <Link href="/dashboard/provider/gear/new">
            <Button variant="primary" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" /> Add New Gear
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Your Listed Equipment ({gearList.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Equipment</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Rate / Day</th>
                  <th className="px-6 py-3.5">Deposit</th>
                  <th className="px-6 py-3.5">Availability</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {gearList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</div>
                          <div className="text-[11px] text-slate-400">{item.brand} � Stock: {item.stock}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{item.category}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatCurrency(item.pricePerDay)}</td>
                    <td className="px-6 py-4 text-slate-500">{formatCurrency(item.securityDeposit)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStock(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                          item.isAvailable
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 border border-rose-200"
                        }`}
                      >
                        {item.isAvailable ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{item.isAvailable ? "Available" : "Disabled"}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/provider/gear/${item.id}/edit`}>
                          <button className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
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
