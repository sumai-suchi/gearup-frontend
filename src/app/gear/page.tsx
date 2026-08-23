"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { GearItem } from "@/types";
import { GearCard } from "@/components/gear/GearCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, SlidersHorizontal, RotateCcw, CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  "All",
  "Cycling",
  "Camping & Hiking",
  "Water Sports",
  "Winter Sports",
  "Climbing",
  "Fitness & Gym",
  "Outdoor Games",
];

const BRANDS = ["All", "Trek", "MSR", "Oru Kayak", "Salomon", "Petzl", "Garmin"];

export default function GearCatalogPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [gearList, setGearList] = useState<GearItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [maxPrice, setMaxPrice] = useState(200);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "price_asc" | "price_desc" | "rating">("popular");

  const fetchGear = async () => {
    setIsLoading(true);
    try {
      const items = await api.gear.getAll({
        category: selectedCategory === "All" ? undefined : selectedCategory,
        brand: selectedBrand === "All" ? undefined : selectedBrand,
        search: searchTerm,
        maxPrice: maxPrice,
        inStockOnly: inStockOnly,
      });

      let sorted = [...items];
      if (sortBy === "price_asc") {
        sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
      } else if (sortBy === "price_desc") {
        sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
      } else if (sortBy === "rating") {
        sorted.sort((a, b) => b.rating - a.rating);
      }

      setGearList(sorted);
    } catch (err) {
      console.error("Error fetching gear catalog:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGear();
  }, [selectedCategory, selectedBrand, maxPrice, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setMaxPrice(200);
    setInStockOnly(false);
    setSortBy("popular");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Rent Top-Tier Outdoor Equipment</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Explore Sports & Adventure Gear</h1>
          <p className="text-sm text-slate-300">Browse through bikes, tents, kayaks, climbing kits, and winter sports equipment ready for rental.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Filters
            </h3>
            <button onClick={handleResetFilters} className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Search Keyword</label>
            <Input
              placeholder="Search gear, brand, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchGear()}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Sport Category</label>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    selectedCategory === cat
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Max Daily Rate</label>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">${maxPrice}/day</span>
            </div>
            <input
              type="range"
              min={10}
              max={200}
              step={5}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$10</span>
              <span>$200+</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Available in Stock Only</span>
            </label>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Showing <span className="text-emerald-600 dark:text-emerald-400 font-bold">{gearList.length}</span> equipment listings
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : gearList.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No matching gear found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Try resetting filters or searching with another keyword.</p>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>Reset All Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gearList.map((gear) => (
                <GearCard key={gear.id} gear={gear} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
