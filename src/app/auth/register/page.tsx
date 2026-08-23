"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, User as UserIcon, Zap, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [role, setRole] = useState<"customer" | "provider">("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setIsSubmitting(true);
    try {
      await register({ name, email, role, password });
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create GearUp Account</h1>
          <p className="text-xs text-slate-500">Choose your role to get started</p>
        </div>

        {/* Role Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`p-4 rounded-2xl border-2 text-left transition relative ${
                role === "customer"
                  ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {role === "customer" && <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-3 right-3" />}
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Customer</h4>
              <p className="text-[11px] text-slate-500 mt-1">Rent sports & outdoor gear</p>
            </button>

            <button
              type="button"
              onClick={() => setRole("provider")}
              className={`p-4 rounded-2xl border-2 text-left transition relative ${
                role === "provider"
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {role === "provider" && <CheckCircle2 className="w-4 h-4 text-blue-600 absolute top-3 right-3" />}
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Provider</h4>
              <p className="text-[11px] text-slate-500 mt-1">List gear & earn income</p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder={role === "provider" ? "Apex Outdoor Rentals" : "Sarah Jenkins"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<UserIcon className="w-4 h-4" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Button type="submit" variant="primary" className="w-full py-3 font-bold" isLoading={isSubmitting || isLoading}>
            Create Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold text-emerald-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
