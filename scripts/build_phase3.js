const fs = require("fs");
const path = require("path");

function write(p, content) {
  const full = path.resolve(p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + "\n", "utf8");
  console.log("Wrote:", p);
}

// 1. Home Page
write("src/app/page.tsx", `"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { GearItem } from "@/types";
import { GearCard } from "@/components/gear/GearCard";
import { Button } from "@/components/ui/Button";
import { Compass, Sparkles, ArrowRight, Bike, Tent, Waves, Snowflake, Mountain, Dumbbell, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const [featuredGear, setFeaturedGear] = useState<GearItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const items = await api.gear.getAll();
        setFeaturedGear(items.slice(0, 6));
      } catch (err) {
        console.error("Failed to load featured gear:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { name: "Cycling", icon: Bike, count: "18+ items" },
    { name: "Camping & Hiking", icon: Tent, count: "32+ items" },
    { name: "Water Sports", icon: Waves, count: "14+ items" },
    { name: "Winter Sports", icon: Snowflake, count: "20+ items" },
    { name: "Climbing", icon: Mountain, count: "12+ items" },
    { name: "Fitness & Gym", icon: Dumbbell, count: "15+ items" },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Sports & Outdoor Equipment Network
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            Rent Premium Sports & Outdoor Gear <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Instantly.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience mountain trails, remote summits, and coastal rivers without spending thousands on gear. Rent top-tier equipment from verified providers today.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/gear">
              <Button size="lg" variant="primary" className="w-full sm:w-auto px-8 py-4 text-base font-bold shadow-lg shadow-emerald-500/30">
                <Compass className="w-5 h-5 mr-2" /> Explore Gear Catalog
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white border-slate-700 hover:bg-slate-800">
                List Your Gear as Provider
              </Button>
            </Link>
          </div>
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-800 mt-12 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-extrabold text-white">500+</div>
              <div className="text-xs text-slate-400">Verified Equipment Items</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400">Insured & Inspected</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">4.9 ?</div>
              <div className="text-xs text-slate-400">Renter Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-teal-400">24/7</div>
              <div className="text-xs text-slate-400">Support & Pickup</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Categories</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Gear Up for Any Adventure</h2>
          </div>
          <Link href="/gear" className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1 mt-2 md:mt-0">
            View all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={\`/gear?category=\${encodeURIComponent(cat.name)}\`} className="group rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600">{cat.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Popular Rentals</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Top-Rated Equipment Ready for Pickup</h2>
          </div>
          <Link href="/gear"><Button variant="outline" size="sm" className="mt-2 md:mt-0">Browse Full Catalog</Button></Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGear.map((gear) => <GearCard key={gear.id} gear={gear} />)}
          </div>
        )}
      </section>

      <section className="bg-slate-100 dark:bg-slate-900/60 py-20 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Frictionless Process</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">How GearUp Works</h2>
          <p className="text-sm text-slate-500 mt-2">From booking to return in 4 seamless steps</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "1", title: "Find Your Gear", desc: "Filter by sport category, brand, and rental dates." },
            { step: "2", title: "Provider Confirms", desc: "Rental shops verify gear readiness and accept request." },
            { step: "3", title: "Secure Payment", desc: "Pay securely via Stripe / SSLCommerz with deposit hold." },
            { step: "4", title: "Pickup & Adventure", desc: "Pick up the gear, explore, return, and review!" },
          ].map((s) => (
            <div key={s.step} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">{s.step}</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
`);
