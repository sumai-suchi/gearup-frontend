import React from "react";
import Link from "next/link";
import { Zap, ShieldCheck, RefreshCw, Headphones, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-400">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Insured & Verified Gear</p>
              <p className="text-xs text-slate-400">Every item safety-inspected by verified shops</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Flexible Rental Periods</p>
              <p className="text-xs text-slate-400">Daily, weekend, or weekly rates available</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">24/7 Adventure Support</p>
              <p className="text-xs text-slate-400">Prompt assistance before and during your trips</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-xl text-white">GearUp</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rent high-performance outdoor, mountain, water, and cycling equipment on demand. 
              Adventure without the burden of gear ownership.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Explore Gear
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/gear?category=Cycling" className="hover:text-emerald-400 transition">
                  Mountain & Road Bikes
                </Link>
              </li>
              <li>
                <Link href="/gear?category=Camping%20%26%20Hiking" className="hover:text-emerald-400 transition">
                  Tents & Hiking Packs
                </Link>
              </li>
              <li>
                <Link href="/gear?category=Water%20Sports" className="hover:text-emerald-400 transition">
                  Kayaks & Paddleboards
                </Link>
              </li>
              <li>
                <Link href="/gear?category=Winter%20Sports" className="hover:text-emerald-400 transition">
                  Skis & Snowboards
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Platform Roles
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard/customer" className="hover:text-emerald-400 transition">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard/provider" className="hover:text-emerald-400 transition">
                  Provider Dashboard (Vendors)
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-emerald-400 transition">
                  Platform Moderation (Admin)
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-emerald-400 transition">
                  List Your Gear as Provider
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Security & Payment
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Protected transactions powered by Stripe & SSLCommerz gateway systems.
            </p>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                STRIPE CHECKOUT
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                SSLCOMMERZ
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>� {new Date().getFullYear()} GearUp Outdoors, Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Engineered with Next.js App Router & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
