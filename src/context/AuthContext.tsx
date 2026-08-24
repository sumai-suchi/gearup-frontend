"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/types";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    role: "customer" | "provider" | "CUSTOMER" | "PROVIDER";
    password?: string;
  }) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = api.auth.getCurrentUser();
      if (stored) {
        setUser(stored);
      }
    } catch (e) {
      console.error("Auth init error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      const loggedInUser = res?.user;
      console.log(loggedInUser);
      if (!loggedInUser) throw new Error("Invalid user response from server.");

      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.name || "User"}!`);

      const normalizedRole = String(loggedInUser?.role ).toLowerCase();
      if (normalizedRole === "admin") {
        router.push("/dashboard/admin");
      } else if (normalizedRole === "provider") {
        router.push("/dashboard/provider");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    role: "customer" | "provider" | "CUSTOMER" | "PROVIDER";
    password?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(data);
      const registeredUser = res?.user;
      if (!registeredUser) throw new Error("Invalid registration response from server.");

      setUser(registeredUser);
      toast.success(`Account created successfully! Welcome to GearUp.`);

      const normalizedRole = String(registeredUser.role || "customer").toLowerCase();
      if (normalizedRole === "provider") {
        router.push("/dashboard/provider");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    toast.info("You have been signed out.");
    router.push("/auth/login");
  };

  const switchDemoRole = async (role: UserRole) => {
    const normalizedRole = String(role).toLowerCase();
    const demoEmails: Record<string, string> = {
      admin: "admin@gearup.com",
      provider: "provider@gearup.com",
      customer: "customer@gearup.com",
    };
    await login(demoEmails[normalizedRole] || "customer@gearup.com");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
