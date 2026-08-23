const fs = require("fs");
const path = require("path");

function write(p, content) {
  const full = path.resolve(p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + "\n", "utf8");
  console.log("Wrote:", p);
}

// 2. src/app/gear/page.tsx
write("src/app/gear/page.tsx", `"use client";
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
                  className={\`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between \${
                    selectedCategory === cat
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }\`}
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
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">\${maxPrice}/day</span>
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
              <span>\$10</span>
              <span>\$200+</span>
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
`);

// 3. src/app/gear/[id]/page.tsx
write("src/app/gear/[id]/page.tsx", `"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { GearItem, Review } from "@/types";
import { BookingWidget } from "@/components/gear/BookingWidget";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Star, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDateString } from "@/lib/utils";

export default function GearDetailsPage() {
  const params = useParams();
  const gearId = params.id as string;

  const [gear, setGear] = useState<GearItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!gearId) return;
      try {
        const item = await api.gear.getById(gearId);
        if (item) {
          setGear(item);
          setSelectedImage(item.images[0] || "");
        }
        const revs = await api.reviews.getByGearId(gearId);
        setReviews(revs);
      } catch (err) {
        console.error("Failed to load gear details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [gearId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Gear Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The equipment you are looking for is no longer available.</p>
        <Link href="/gear">
          <Button variant="primary"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/gear" className="hover:text-emerald-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Gear Catalog
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200">{gear.category}</span>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-xs">{gear.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-md">
              <img src={selectedImage || gear.images[0]} alt={gear.title} className="w-full h-full object-cover" />
            </div>

            {gear.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gear.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={\`w-20 h-20 rounded-2xl overflow-hidden border-2 transition \${
                      selectedImage === img ? "border-emerald-500 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                    }\`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-emerald-200">{gear.category}</Badge>
              <Badge variant="default" className="bg-slate-100 text-slate-700">{gear.brand}</Badge>
              <span className="text-xs text-slate-500">• {gear.condition} Condition</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{gear.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900 dark:text-white">{gear.rating.toFixed(1)}</span>
                <span>({gear.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{gear.location}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-bold text-lg">
                {gear.providerName.charAt(0)}
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Verified Provider</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{gear.providerName}</h4>
                <p className="text-xs text-slate-400">Rating: {gear.providerRating} ? • 100% On-time handover</p>
              </div>
            </div>
            <Badge variant="success">Verified Shop</Badge>
          </div>

          <div className="space-y-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">About this Equipment</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{gear.description}</p>
          </div>

          {gear.specs && Object.keys(gear.specs).length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Technical Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(gear.specs).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">{key}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Renter Feedback & Reviews</h3>
                <p className="text-xs text-slate-500">Verified experiences from previous renters</p>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{gear.rating.toFixed(1)} / 5</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No reviews yet. Be the first to rent and leave feedback!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={rev.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{rev.userName}</div>
                          <div className="text-[10px] text-slate-400">{formatDateString(rev.createdAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <BookingWidget gear={gear} />
        </div>
      </div>
    </div>
  );
}
`);
