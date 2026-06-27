"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import {
  MapPin,
  Plus,
  Trash2,
  Edit,
  Upload,
  X,
  Sparkles,
  Compass,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function DestinationsConsole() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch destinations
  const { data: destinations = [], isLoading, error } = useQuery({
    queryKey: ["admin-destinations"],
    queryFn: () => adminApi.getDestinations(),
  });

  // Mutate create/update
  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (editingId) {
        return adminApi.updateDestination(editingId, payload);
      } else {
        return adminApi.createDestination(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      toast.success(editingId ? "Destination updated!" : "Destination created!");
      closeDrawer();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save destination.");
    },
  });

  // Mutate delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteDestination(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      toast.success("Destination deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete destination.");
    },
  });

  const openNew = () => {
    setName("");
    setDescription("");
    setCoverImage("");
    setIsFeatured(false);
    setSortOrder(0);
    setMetaTitle("");
    setMetaDescription("");
    setEditingId(null);
    setIsOpen(true);
  };

  const openEdit = (dest: any) => {
    setName(dest.name || "");
    setDescription(dest.description || "");
    setCoverImage(dest.coverImage || "");
    setIsFeatured(dest.isFeatured || false);
    setSortOrder(dest.sortOrder || 0);
    setMetaTitle(dest.metaTitle || "");
    setMetaDescription(dest.metaDescription || "");
    setEditingId(dest.id);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setEditingId(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const sigData = await adminApi.getUploadSignature("matka-trails/destinations");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.api_key);
      formData.append("timestamp", String(sigData.timestamp));
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.secure_url) {
        setCoverImage(json.secure_url);
        toast.success("Destination cover uploaded!");
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload connection failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await saveMutation.mutateAsync({
        name,
        description: description || null,
        coverImage: coverImage || null,
        isFeatured,
        sortOrder: Number(sortOrder),
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete destination "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h1 className="font-sans font-black italic text-xl md:text-2xl text-black uppercase tracking-tight">
            Destinations Mapped
          </h1>
        </div>

        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-5 py-3.5 rounded-xl shadow-orange transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* Destinations List */}
      <div className="bg-white border border-gray-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-gray-dark border-collapse">
            <thead>
              <tr className="bg-gray-bg border-b border-gray-border uppercase text-[10px] font-bold tracking-wider text-gray-light">
                <th className="p-4">Cover Image</th>
                <th className="p-4">Destination Region</th>
                <th className="p-4">Route Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4">Sort Order</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-xs text-gray-light italic font-semibold">
                    Loading destinations...
                  </td>
                </tr>
              ) : destinations.length > 0 ? (
                destinations.map((d: any) => (
                  <tr key={d.id} className="border-b border-gray-border hover:bg-gray-bg/25">
                    <td className="p-4">
                      {d.coverImage ? (
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-gray-border">
                          <Image src={d.coverImage} alt={d.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-10 rounded-lg bg-gray-bg border border-gray-border flex items-center justify-center text-gray-light text-[9px]">
                          No cover
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-black text-sm">{d.name}</div>
                      {d._count && (
                        <div className="text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">
                          {d._count.packages} active packages
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-light">/{d.slug}</td>
                    <td className="p-4">
                      {d.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-orange-50 border border-orange-200 text-primary px-2.5 py-1 rounded-md">
                          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-gray-light uppercase tracking-wider">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-bold text-black">{d.sortOrder}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(d)}
                        className="p-2 border border-gray-border hover:border-black text-gray-dark hover:text-black rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Edit Destination"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id, d.name)}
                        className="p-2 border border-gray-border hover:border-red-500 text-gray-dark hover:text-red-500 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Delete Destination"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-xs text-gray-light italic font-semibold">
                    No destinations mapped in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={closeDrawer}
          />

          {/* Panel */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-float flex flex-col z-10 animate-slideOver">
            {/* Header */}
            <div className="p-6 border-b border-gray-border flex items-center justify-between bg-white sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                <h3 className="font-sans font-black italic text-lg text-black uppercase tracking-tight">
                  {editingId ? "Edit Destination" : "Add Destination"}
                </h3>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 border border-gray-border hover:border-black rounded-lg text-gray-dark hover:text-black transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Destination Name */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Destination Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kedarnath"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Cover Image
                </label>
                <div className="flex items-center gap-4">
                  {coverImage ? (
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-gray-border shrink-0 bg-gray-bg">
                      <Image src={coverImage} alt="Cover preview" fill className="object-cover animate-fadeIn" />
                      <button
                        type="button"
                        onClick={() => setCoverImage("")}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black p-1 rounded-full text-white transition-all cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-xl bg-gray-bg border-2 border-dashed border-gray-border flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gray-light" />
                    </div>
                  )}

                  <label className="flex-1 flex flex-col items-center justify-center border border-gray-border hover:border-black rounded-xl p-4 cursor-pointer hover:bg-gray-bg/15 transition-all text-center">
                    <Upload className="w-5 h-5 text-gray-dark mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-dark">
                      {uploading ? "Uploading..." : "Upload Cover Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Destination Description
                </label>
                <textarea
                  placeholder="Describe the region, accessibility, sights, and seasonal information..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Grid: Sort Order & Is Featured */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="pt-6">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4.5 h-4.5 text-primary border-gray-border rounded focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                    <span className="text-xs font-bold text-gray-dark uppercase tracking-wider">
                      Featured Destination
                    </span>
                  </label>
                </div>
              </div>

              {/* SEO Configurations */}
              <div className="border-t border-gray-border pt-4 space-y-4">
                <h4 className="font-sans font-bold text-xs text-black uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>SEO Configurations (Optional)</span>
                </h4>

                {/* Meta Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                    Meta Title (Max 70 chars)
                  </label>
                  <input
                    type="text"
                    maxLength={70}
                    placeholder="SEO title matching keywords..."
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                    Meta Description (Max 160 chars)
                  </label>
                  <textarea
                    maxLength={160}
                    placeholder="Short summary displayed under search engine links..."
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </form>

            {/* Footer buttons */}
            <div className="p-6 border-t border-gray-border bg-gray-bg flex items-center justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={closeDrawer}
                className="bg-white hover:bg-gray-border border border-gray-border text-gray-dark font-semibold text-xs tracking-wide uppercase px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary-dark text-white font-bold text-xs tracking-wide uppercase px-8 py-3 rounded-xl shadow-orange transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{editingId ? "Save Changes" : "Create Destination"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
