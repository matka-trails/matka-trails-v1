"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { Compass, Plus, Edit2, Trash2, ShieldAlert, Check, X, Eye } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function PackagesConsole() {
  const queryClient = useQueryClient();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Fetch all packages
  const { data: packages = [], isLoading, error } = useQuery({
    queryKey: ["admin-packages"],
    queryFn: () => adminApi.getPackages(),
  });

  // Mutate package deletion
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      toast.success("Package deleted successfully!");
      setDeleteTargetId(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete package.");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <h1 className="font-sans font-black italic text-xl md:text-2xl text-black uppercase tracking-tight">
            Trail Packages
          </h1>
        </div>

        <Link
          href="/admin/packages/new"
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-5 py-3.5 rounded-xl shadow-orange transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>New Package</span>
        </Link>
      </div>

      {/* Table list */}
      <div className="bg-white border border-gray-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-gray-dark border-collapse">
            <thead>
              <tr className="bg-gray-bg border-b border-gray-border uppercase text-[10px] font-bold tracking-wider text-gray-light">
                <th className="p-4">Package Title</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Price (Discounted)</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2].map((i) => (
                  <tr key={i} className="animate-pulse border-b border-gray-border">
                    <td colSpan={6} className="p-8">
                      <div className="h-4 bg-gray-bg rounded w-3/4" />
                    </td>
                  </tr>
                ))
              ) : packages.length > 0 ? (
                packages.map((pkg: any) => {
                  const isPublished = pkg.status === "PUBLISHED";
                  return (
                    <tr key={pkg.id} className="border-b border-gray-border hover:bg-gray-bg/25">
                      <td className="p-4">
                        <div className="font-bold text-black text-sm">{pkg.title}</div>
                        <div className="text-[10px] text-gray-light font-bold uppercase tracking-wider mt-0.5">
                          Format: {pkg.groupType}
                        </div>
                      </td>
                      <td className="p-4">{pkg.destination?.name || "General"}</td>
                      <td className="p-4 font-bold text-primary font-sans">
                        {formatPrice(pkg.priceDiscounted || pkg.priceOriginal)}
                        {pkg.priceDiscounted && (
                          <span className="text-[9px] text-gray-light line-through ml-1.5">
                            {formatPrice(pkg.priceOriginal)}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {pkg.durationDays} Days / {pkg.durationNights} Nights
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "text-[9px] font-extrabold px-2.5 py-1 rounded border uppercase tracking-wider",
                            isPublished
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-gray-bg text-gray-mid border-gray-border"
                          )}
                        >
                          {pkg.status}
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-3">
                          {/* Public View link */}
                          <Link
                            href={`/packages/${pkg.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg border border-gray-border text-gray-dark hover:bg-gray-bg hover:text-primary transition-all"
                            title="View Public Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {/* Edit */}
                          <Link
                            href={`/admin/packages/${pkg.id}/edit`}
                            className="p-2 rounded-lg border border-gray-border text-gray-dark hover:bg-gray-bg hover:text-primary transition-all"
                            title="Edit Package"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTargetId(pkg.id)}
                            className="p-2 rounded-lg border border-rose-100 bg-rose-50/30 text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-xs text-gray-light italic font-semibold">
                    No packages published yet. Get started by clicking "New Package".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#111111]/50 backdrop-blur-xs" onClick={() => setDeleteTargetId(null)} />
          <div className="bg-white border border-gray-border rounded-2xl w-full max-w-sm shadow-float p-6 z-10 space-y-5 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-extrabold text-sm text-black">Confirm Deletion</h4>
                <p className="text-[10px] text-gray-light uppercase tracking-wider font-bold">This action is irreversible</p>
              </div>
            </div>
            <p className="text-xs text-gray-mid font-semibold leading-relaxed">
              Are you sure you want to delete this trail route? It will be marked deleted in the database and hidden from listings.
            </p>
            <div className="flex gap-3 justify-end pt-2 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2.5 rounded-lg border border-gray-border text-gray-dark hover:bg-gray-bg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTargetId && handleDelete(deleteTargetId)}
                className="px-4 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white shadow-orange cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
