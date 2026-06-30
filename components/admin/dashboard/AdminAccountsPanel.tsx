"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { ShieldCheck, UserPlus, X, Eye, EyeOff, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: "Super Admin", color: "bg-primary-light text-primary border-primary/20" },
  ADMIN: { label: "Admin", color: "bg-blue-50 text-blue-600 border-blue-200" },
};

function AddAdminModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const mutation = useMutation({
    mutationFn: () => adminApi.createAdmin(form),
    onSuccess: () => {
      toast.success("Admin account created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create admin.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-border w-full max-w-md z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center border border-primary/20">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-sans font-black text-sm text-black uppercase tracking-wide">Add New Admin</h2>
              <p className="text-[10px] text-gray-light font-semibold">Create a new admin account for the console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-bg hover:bg-gray-border flex items-center justify-center text-gray-mid hover:text-black transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-dark uppercase tracking-widest block">
              Full Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Rahul Singh"
              className="w-full h-11 px-4 rounded-xl border border-gray-border bg-gray-bg text-sm font-semibold text-black placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-dark uppercase tracking-widest block">
              Email Address *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@matkatrails.com"
              className="w-full h-11 px-4 rounded-xl border border-gray-border bg-gray-bg text-sm font-semibold text-black placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-dark uppercase tracking-widest block">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full h-11 px-4 pr-12 rounded-xl border border-gray-border bg-gray-bg text-sm font-semibold text-black placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light hover:text-gray-dark transition-colors cursor-pointer"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-dark uppercase tracking-widest block">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-gray-border bg-gray-bg text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer"
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-gray-border text-xs font-bold uppercase tracking-wider text-gray-dark hover:bg-gray-bg transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider shadow-orange transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminAccountsPanel() {
  const [showModal, setShowModal] = useState(false);

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admin-accounts"],
    queryFn: () => adminApi.getAdmins(),
  });

  return (
    <>
      <div className="bg-white border border-gray-border rounded-2xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-light rounded-xl flex items-center justify-center border border-primary/20">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-sans font-extrabold text-sm text-black uppercase tracking-wide">Admin Accounts</h3>
              <p className="text-[10px] text-gray-light font-semibold">{admins.length} active member{admins.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            id="add-admin-btn"
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-orange transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Admin</span>
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-border">
          {isLoading ? (
            <div className="p-6 space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-bg rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-gray-bg rounded w-1/3" />
                    <div className="h-3 bg-gray-bg rounded w-1/2" />
                  </div>
                  <div className="h-6 bg-gray-bg rounded w-20" />
                </div>
              ))}
            </div>
          ) : admins.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-8 h-8 text-gray-border mx-auto mb-2" />
              <p className="text-xs text-gray-light font-semibold italic">No admin accounts found.</p>
            </div>
          ) : (
            admins.map((admin: any) => {
              const role = ROLE_LABELS[admin.role] || { label: admin.role, color: "bg-gray-bg text-gray-dark border-gray-border" };
              const initials = admin.name
                .split(" ")
                .map((n: string) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div key={admin._id || admin.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-bg/30 transition-colors">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center font-black text-xs text-primary uppercase border border-primary/20 shrink-0">
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-black block truncate">{admin.name}</span>
                    <span className="text-[10px] text-gray-light font-semibold block truncate">{admin.email}</span>
                  </div>

                  {/* Role Badge */}
                  <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded border uppercase tracking-wider shrink-0 ${role.color}`}>
                    {role.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showModal && <AddAdminModal onClose={() => setShowModal(false)} />}
    </>
  );
}
