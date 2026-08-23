"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { GearCategory } from "@/types";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Plus, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const CATEGORIES: GearCategory[] = [
  "Cycling",
  "Camping & Hiking",
  "Water Sports",
  "Winter Sports",
  "Climbing",
  "Fitness & Gym",
  "Outdoor Games",
];

export default function AddGearPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GearCategory>("Cycling");
  const [brand, setBrand] = useState("");
  const [pricePerDay, setPricePerDay] = useState(35);
  const [securityDeposit, setSecurityDeposit] = useState(100);
  const [stock, setStock] = useState(3);
  const [condition, setCondition] = useState<"New" | "Excellent" | "Good" | "Fair">("Excellent");
  const [location, setLocation] = useState(user?.address || "Boulder, CO");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !brand) {
      toast.error("Please fill in required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.gear.create({
        title,
        description,
        category,
        brand,
        pricePerDay: Number(pricePerDay),
        securityDeposit: Number(securityDeposit),
        stock: Number(stock),
        condition,
        location,
        isAvailable: true,
        images: [imageUrl],
        specs: { "Kit Status": "Complete & Inspected" },
        providerId: user?.id || "usr-provider-1",
        providerName: user?.name || "Summit Ridge Outfitters",
        providerRating: 4.9,
      });

      toast.success("New sports gear listed successfully!");
      router.push("/dashboard/provider/gear");
    } catch (err: any) {
      toast.error(err.message || "Failed to list gear.");
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
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">List New Rental Equipment</h1>
            <p className="text-xs text-slate-500">Provide equipment specifications, images, and daily rates</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Equipment Title"
              placeholder="e.g. Trek Fuel EX 8 Mountain Bike"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Sport Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GearCategory)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Brand / Manufacturer"
                placeholder="e.g. Trek, MSR, Salomon, Petzl"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Description & Features
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe equipment condition, sizing, included accessories, and usage rules..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Price Per Day ($)"
                type="number"
                min={1}
                value={pricePerDay}
                onChange={(e) => setPricePerDay(Number(e.target.value))}
                required
              />
              <Input
                label="Security Deposit ($)"
                type="number"
                min={0}
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                required
              />
              <Input
                label="Inventory Stock Units"
                type="number"
                min={1}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Item Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="New">New (Flawless)</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <Input
                label="Pickup Location"
                placeholder="Boulder, CO"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <Input
              label="Primary Image URL"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              leftIcon={<ImageIcon className="w-4 h-4" />}
              required
            />

            <div className="pt-4 flex items-center justify-end gap-3">
              <Link href="/dashboard/provider/gear"><Button type="button" variant="outline">Cancel</Button></Link>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                <Plus className="w-4 h-4 mr-1.5" /> Publish Equipment Listing
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
