"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface FaqItem {
  id: string;
  _id?: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export default function FaqConsole() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  // Drawer/Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form Fields
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  // Query
  const { data, isLoading } = useQuery({
    queryKey: ["admin-global-faqs", page],
    queryFn: () => adminApi.getFaqs({ isGlobal: true, page, limit }),
  });

  const faqs = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => adminApi.createFaq(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-global-faqs"] });
      toast.success("FAQ added successfully!");
      closeDrawer();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add FAQ.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      adminApi.updateFaq(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-global-faqs"] });
      toast.success("FAQ updated successfully!");
      closeDrawer();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update FAQ.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-global-faqs"] });
      toast.success("FAQ deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete FAQ.");
    },
  });

  const openAdd = () => {
    setEditId(null);
    setQuestion("");
    setAnswer("");
    setSortOrder(0);
    setIsOpen(true);
  };

  const openEdit = (f: FaqItem) => {
    setEditId(f.id);
    setQuestion(f.question);
    setAnswer(f.answer);
    setSortOrder(f.sortOrder || 0);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error("Please fill out both the question and answer fields.");
      return;
    }

    setSaving(true);
    const payload = {
      question: question.trim(),
      answer: answer.trim(),
      isGlobal: true,
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
    if (confirm("Are you sure you want to delete this FAQ?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-black uppercase tracking-wide flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Global FAQs
          </h1>
          <p className="text-xs text-gray-mid font-medium mt-1">
            Manage global questions and answers displayed on the destinations page.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-orange cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-white border border-gray-border rounded-2xl py-12 text-center">
          <HelpCircle className="w-10 h-10 text-gray-light mx-auto mb-3" />
          <p className="text-sm text-gray-mid font-medium">No FAQs added yet.</p>
          <p className="text-xs text-gray-light mt-1">Click &quot;Add FAQ&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border border-gray-border rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-border">
              {faqs.map((f: FaqItem) => (
                <div
                  key={f.id}
                  className="p-5 flex items-start justify-between gap-6 hover:bg-gray-bg/50 transition-colors duration-150"
                >
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-lg border border-primary/20">
                        Order: {f.sortOrder}
                      </span>
                      <h3 className="font-extrabold text-sm text-black leading-snug">
                        {f.question}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-mid leading-relaxed font-medium pl-0.5">
                      {f.answer}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(f)}
                      className="p-2 rounded-lg bg-gray-bg hover:bg-gray-border text-gray-dark transition cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-border">
              <span className="text-xs text-gray-mid font-semibold">
                Showing {faqs.length} of {total} FAQs
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-border hover:bg-gray-bg disabled:opacity-50 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-black px-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-border hover:bg-gray-bg disabled:opacity-50 transition cursor-pointer"
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
                  {editId ? "Edit FAQ" : "Add FAQ"}
                </h2>
                <button
                  onClick={closeDrawer}
                  className="p-1.5 rounded-lg hover:bg-gray-bg text-gray-mid transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Question */}
                <div>
                  <label className="text-[10px] font-black text-gray-dark uppercase tracking-wider block mb-1.5">
                    Question
                  </label>
                  <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. What is the difficulty level of the Kedarnath Trek?"
                    className="w-full border border-gray-border rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    required
                  />
                </div>

                {/* Answer */}
                <div>
                  <label className="text-[10px] font-black text-gray-dark uppercase tracking-wider block mb-1.5">
                    Answer
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Provide a detailed answer here..."
                    rows={6}
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
                className="flex-1 border border-gray-border text-gray-dark text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-gray-bg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl shadow-orange transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save FAQ
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
