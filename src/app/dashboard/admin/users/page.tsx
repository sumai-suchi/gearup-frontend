"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User } from "@/types";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/Button";
import { formatDateString } from "@/lib/utils";
import { Search, ShieldAlert, CheckCircle2, UserX } from "lucide-react";
import { toast } from "sonner";

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === "active" ? "suspended" : "active";
    try {
      await api.admin.updateUserStatus(user.id, nextStatus);
      toast.success(`User "${user.name}" status updated to ${nextStatus}`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user status.");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <DashboardSidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 max-w-6xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Platform User Management</h1>
          <p className="text-xs text-slate-500">Inspect registered accounts and manage suspend / activate permissions</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Registered Users ({filteredUsers.length})</h2>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 pl-8 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Contact / City</th>
                  <th className="px-6 py-3.5">Joined</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60"
                          : u.role === "provider"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60"
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <div>{u.phone || "N/A"}</div>
                      <div className="text-[11px] text-slate-400">{u.address || "N/A"}</div>
                    </td>

                    <td className="px-6 py-4 text-slate-500">{formatDateString(u.createdAt)}</td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        u.status === "active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60"
                      }`}>
                        {u.status === "active" ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                        <span className="capitalize">{u.status}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {u.role !== "admin" ? (
                        <Button
                          size="sm"
                          variant={u.status === "active" ? "danger" : "outline"}
                          onClick={() => handleToggleStatus(u)}
                        >
                          {u.status === "active" ? (
                            <>
                              <UserX className="w-3.5 h-3.5 mr-1" /> Suspend
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Activate
                            </>
                          )}
                        </Button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Platform Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
