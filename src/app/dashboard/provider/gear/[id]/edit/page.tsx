"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { GearItem } from "@/types";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditGearPage() {
  const params = useParams();
  const router = useRouter();
  const gearId = params.id as string;

  const [title, setTitle] = useState("");
  const [pricePerDay, setPricePerDay] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [stock, setStock] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const item = await api.gear.getById(gearId);
      if (item) {
        setTitle(item.title);
        setPricePerDay(item.pricePerDay);
        setSecurityDeposit(item.securityDeposit);
        setStock(item.stock);
      }
    }
    load();
  }, [gearId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.gear.update(gearId, {
        title,
        pricePerDay: Number(pricePerDay),
        securityDeposit: Number(securityDeposit),
        stock: Number(stock),
      });
      toast.success("Equipment updated successfully.");
      router.push("/dashboard/provider/gear");
    } catch (err) {
      toast.error("Failed to update item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-4xl">
        <Link href="/dashboard/provider/gear" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600">
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-6">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Edit Equipment Details</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Price Per Day ($)" type="number" value={pricePerDay} onChange={(e) => setPricePerDay(Number(e.target.value))} required />
              <Input label="Security Deposit ($)" type="number" value={securityDeposit} onChange={(e) => setSecurityDeposit(Number(e.target.value))} required />
              <Input label="Stock" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
            </div>
            <Button type="submit" variant="primary" isLoading={isSubmitting}><Save className="w-4 h-4 mr-1.5" /> Save Changes</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
