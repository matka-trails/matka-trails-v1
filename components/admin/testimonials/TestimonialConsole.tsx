"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, TextTestimonial } from "@/lib/api";
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  X,
  Star,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function TestimonialConsole() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  // Drawer/Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [stars, setStars] = useState(5);
  const [message, setMessage] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  // Query
  const { data, isLoading } = useQuery({
    queryKey: ["admin-text-testimonials", page],
    queryFn: () => adminApi.getTextTestimonials({ page, limit }),
  });

  const testimonials = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => adminApi.createTextTestimonial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-text-testimonials"] });
      toast.success("Review added successfully!");
      closeDrawer();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add review.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      adminApi.updateTextTestimonial(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-text-testimonials"] });
      toast.success("Review updated successfully!");
      closeDrawer();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update review.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteTextTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-text-testimonials"] });
      toast.success("Review deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete review.");
    },
  });

  const openAdd = () => {
    setEditId(null);
    setName("");
    setStars(5);
    setMessage("");
    setSortOrder(0);
    setIsOpen(true);
  };

  const openEdit = (t: TextTestimonial) => {
    setEditId(t.id);
    setName(t.name);
    setStars(t.stars);
    setMessage(t.message);
    setSortOrder(t.sortOrder || 0);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill out name and review message.");
      return;
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      stars,
      message: message.trim(),
      sortOrder,
    };

    try {
      if (editId) {
        await updateMutation.mutateAsync({ id: editId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this traveler review?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-black uppercase tracking-wide flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Traveler Reviews
          </h1>
          <p className="text-xs text-gray-mid font-medium mt-1">
            Manage client testimonials and reviews shown on the home page.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-orange"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white border border-gray-border rounded-2xl py-12 text-center">
          <MessageSquare className="w-10 h-10 text-gray-light mx-auto mb-3" />
          <p className="text-sm text-gray-mid font-medium">No reviews added yet.</p>
          <p className="text-xs text-gray-light mt-1">Click &quot;Add Review&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-gray-border rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Name and Rating */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-black">{t.name}</h3>
                      <div className="flex gap-0.5 mt-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3.5 h-3.5",
                              i < t.stars ? "fill-amber-500 text-amber-500" : "text-gray-200"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] bg-gray-bg border border-gray-border text-gray-mid font-bold px-2 py-0.5 rounded-lg">
                      Order: {t.sortOrder}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-xs text-gray-mid leading-relaxed font-medium mt-3.5 italic">
                    &ldquo;{t.message}&rdquo;
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-end gap-2 mt-4 pt-3.5 border-t border-gray-100">
                  <button
                    onClick={() => openEdit(t)}
                    className="p-2 rounded-lg bg-gray-bg hover:bg-gray-border text-gray-dark transition"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-border">
              <span className="text-xs text-gray-mid font-semibold">
                Showing {testimonials.length} of {total} reviews
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-border hover:bg-gray-bg disabled:opacity-50 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-black px-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-border hover:bg-gray-bg disabled:opacity-50 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide-over Drawer / Modal for Add & Edit */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
          {/* Backdrop click closer */}
          <div className="flex-1" onClick={closeDrawer} />

          {/* Drawer box */}
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-slideIn">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-border mb-6">
                <h2 className="text-sm font-black text-black uppercase tracking-wide">
                  {editId ? "Edit Traveler Review" : "Add Traveler Review"}
                </h2>
                <button
                  onClick={closeDrawer}
                  className="p-1.5 rounded-lg hover:bg-gray-bg text-gray-mid transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Author Name */}
                <div>
                  <label className="text-[10px] font-black text-gray-dark uppercase tracking-wider block mb-1.5">
                    Traveler Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditya Sharma"
                    className="w-full border border-gray-border rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    required
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="text-[10px] font-black text-gray-dark uppercase tracking-wider block mb-1.5">
                    Rating (Stars)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setStars(num)}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                          stars >= num
                            ? "bg-amber-50 border-amber-300 text-amber-500 shadow-sm"
                            : "border-gray-border text-gray-light hover:bg-gray-bg"
                        )}
                      >
                        <Star className={cn("w-5 h-5", stars >= num ? "fill-amber-500" : "")} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-[10px] font-black text-gray-dark uppercase tracking-wider block mb-1.5">
                    Review Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe their journey experience..."
                    rows={4}
                    className="w-full border border-gray-border rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                    required
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <label className="text-[10px] font-black text-gray-dark uppercase tracking-wider block mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    placeholder="0"
                    className="w-full border border-gray-border rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>
              </form>
            </div>

            {/* Form Footer */}
            <div className="flex gap-3 pt-4 border-t border-gray-border">
              <button
                type="button"
                onClick={closeDrawer}
                className="flex-1 border border-gray-border text-gray-dark text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-gray-bg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl shadow-orange transition flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
