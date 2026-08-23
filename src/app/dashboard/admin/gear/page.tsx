"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { GearItem } from "@/types";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function AdminGearModerationPage() {
  const [gearList, setGearList] = useState<GearItem[]>([]);

  const fetchGear = async () => {
    const data = await api.gear.getAll();
    setGearList(data);
  };

  useEffect(() => {
    fetchGear();
  }, []);

  const handleModerateDelete = async (id: string, title: string) => {
    if (!confirm(`Admin Moderate Action: Remove listing "${title}" from platform?`)) return;
    try {
      await api.gear.delete(id);
      toast.success("Listing moderated and deleted.");
      fetchGear();
    } catch (err) {
      toast.error("Failed to delete item.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-6xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Content Moderation (Gear Listings)</h1>
          <p className="text-xs text-slate-500">Inspect and moderate published sports equipment across all providers</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Platform Equipment Inventory ({gearList.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Equipment</th>
                  <th className="px-6 py-3.5">Provider</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Rate / Day</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {gearList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                          <div className="text-[11px] text-slate-400">{item.brand}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{item.providerName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.category}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatCurrency(item.pricePerDay)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating.toFixed(1)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="danger" onClick={() => handleModerateDelete(item.id, item.title)}>
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Force Remove
                      </Button>
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
