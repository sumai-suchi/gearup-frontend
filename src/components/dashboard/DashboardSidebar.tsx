"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  Package,
  PlusCircle,
  ClipboardList,
  Users,
  Shield,
  Layers,
  LogOut,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const customerLinks = [
    { href: "/dashboard/customer", label: "My Rentals & Orders", icon: ShoppingBag },
    { href: "/gear", label: "Browse Catalog", icon: Sparkles },
  ];

  const providerLinks = [
    { href: "/dashboard/provider", label: "Provider Overview", icon: Layers },
    { href: "/dashboard/provider/gear", label: "Inventory Management", icon: Package },
    { href: "/dashboard/provider/gear/new", label: "Add New Gear", icon: PlusCircle },
    { href: "/dashboard/provider/orders", label: "Rental Orders", icon: ClipboardList },
  ];

  const adminLinks = [
    { href: "/dashboard/admin", label: "Overview & Analytics", icon: Shield },
    { href: "/dashboard/admin/users", label: "User Management", icon: Users },
    { href: "/dashboard/admin/gear", label: "Gear Moderation", icon: Package },
    { href: "/dashboard/admin/orders", label: "All Transactions", icon: CreditCard },
  ];

  let links = customerLinks;
  let roleTitle = "Customer Portal";
  let badgeColor = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300";

  if (user.role === "provider") {
    links = providerLinks;
    roleTitle = "Vendor Hub";
    badgeColor = "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300";
  } else if (user.role === "admin") {
    links = adminLinks;
    roleTitle = "Admin Console";
    badgeColor = "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300";
  }

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <img
            src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user.name}
            </h4>
            <span
              className={cn(
                "inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-0.5",
                badgeColor
              )}
            >
              {user.role}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-3">
            {roleTitle}
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
