import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-5">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          404 Page Not Found
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 mb-3">
          Trail Ended Here
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The sports gear or platform page you are searching for does not exist or has been moved.
        </p>

        <Link href="/gear">
          <Button variant="primary" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Browse Gear Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
}
