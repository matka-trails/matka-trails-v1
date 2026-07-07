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
  Images,
  HelpCircle,
  Video,
  ChevronLeft,
  Play,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import Image from "next/image";

// ─── Sub-Drawer Types ────────────────────────────────────────────────────────
type SubDrawer = "gallery" | "faqs" | "videos" | null;

export default function DestinationsConsole() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Main form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [guidelinesText, setGuidelinesText] = useState(""); // newline-separated
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sub-drawer state
  const [subDrawer, setSubDrawer] = useState<SubDrawer>(null);
  const [activeDestId, setActiveDestId] = useState<string | null>(null);
  const [activeDestName, setActiveDestName] = useState("");

  // Sub-drawer: gallery
  const [galleryCaption, setGalleryCaption] = useState("");
  const [gallerySortOrder, setGallerySortOrder] = useState(0);
  const [galleryImageUrl, setGalleryImageUrl] = useState("");
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [savingGallery, setSavingGallery] = useState(false);

  // Sub-drawer: faqs
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqSortOrder, setFaqSortOrder] = useState(0);
  const [savingFaq, setSavingFaq] = useState(false);

  // Sub-drawer: videos
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [videoSortOrder, setVideoSortOrder] = useState(0);
  const [uploadingVideoThumb, setUploadingVideoThumb] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);

  // ─── Main Queries ────────────────────────────────────────────────────────
  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ["admin-destinations"],
    queryFn: () => adminApi.getDestinations(),
  });

  // Sub-drawer queries
  const { data: galleryItems = [], refetch: refetchGallery } = useQuery({
    queryKey: ["dest-gallery", activeDestId],
    queryFn: () => adminApi.getDestinationGallery(activeDestId!),
    enabled: !!activeDestId && subDrawer === "gallery",
  });

  const { data: destFaqs = [], refetch: refetchFaqs } = useQuery({
    queryKey: ["dest-faqs", activeDestId],
    queryFn: () => adminApi.getDestinationFaqs(activeDestId!),
    enabled: !!activeDestId && subDrawer === "faqs",
  });

  const { data: destVideos = [], refetch: refetchVideos } = useQuery({
    queryKey: ["dest-videos", activeDestId],
    queryFn: () => adminApi.getDestinationVideos(activeDestId!),
    enabled: !!activeDestId && subDrawer === "videos",
  });

  // ─── Main Mutations ──────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (editingId) return adminApi.updateDestination(editingId, payload);
      return adminApi.createDestination(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      toast.success(editingId ? "Destination updated!" : "Destination created!");
      closeDrawer();
    },
    onError: (err: any) => toast.error(err.message || "Failed to save destination."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteDestination(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-destinations"] });
      toast.success("Destination deleted!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete destination."),
  });

  const removeGalleryMutation = useMutation({
    mutationFn: (imageId: string) => adminApi.removeDestinationGalleryImage(activeDestId!, imageId),
    onSuccess: () => { refetchGallery(); toast.success("Image removed."); },
    onError: () => toast.error("Failed to remove image."),
  });

  const deleteFaqMutation = useMutation({
    mutationFn: (faqId: string) => adminApi.deleteFaq(faqId),
    onSuccess: () => { refetchFaqs(); toast.success("FAQ deleted."); },
    onError: () => toast.error("Failed to delete FAQ."),
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (videoId: string) => adminApi.deleteVideoTestimonial(videoId),
    onSuccess: () => { refetchVideos(); toast.success("Video deleted."); },
    onError: () => toast.error("Failed to delete video."),
  });

  // ─── Drawer open/close helpers ───────────────────────────────────────────
  const openNew = () => {
    resetForm();
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
    setGuidelinesText(Array.isArray(dest.guidelines) ? dest.guidelines.join("\n") : "");
    setNotes(dest.notes || "");
    setEditingId(dest.id);
    setIsOpen(true);
  };

  const resetForm = () => {
    setName(""); setDescription(""); setCoverImage("");
    setIsFeatured(false); setSortOrder(0); setMetaTitle("");
    setMetaDescription(""); setGuidelinesText(""); setNotes("");
  };

  const closeDrawer = () => { setIsOpen(false); setEditingId(null); };

  const openSubDrawer = (drawer: SubDrawer, dest: any) => {
    setActiveDestId(dest.id);
    setActiveDestName(dest.name);
    setSubDrawer(drawer);
  };

  const closeSubDrawer = () => {
    setSubDrawer(null);
    setGalleryImageUrl(""); setGalleryCaption(""); setGallerySortOrder(0);
    setFaqQuestion(""); setFaqAnswer(""); setFaqSortOrder(0);
    setVideoTitle(""); setVideoUrl(""); setVideoThumbnail(""); setVideoSortOrder(0);
  };

  // ─── Upload Handlers ─────────────────────────────────────────────────────
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const sig = await adminApi.getUploadSignature("destinations");
      const fd = new FormData();
      fd.append("file", file); fd.append("api_key", sig.api_key);
      fd.append("timestamp", String(sig.timestamp)); fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`, { method: "POST", body: fd });
      const json = await res.json();
      if (json.secure_url) { setCoverImage(json.secure_url); toast.success("Cover uploaded!"); }
      else toast.error("Upload failed.");
    } catch { toast.error("Upload error."); }
    finally { setUploading(false); }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGallery(true);
    try {
      const sig = await adminApi.getUploadSignature("destinations-gallery");
      const fd = new FormData();
      fd.append("file", file); fd.append("api_key", sig.api_key);
      fd.append("timestamp", String(sig.timestamp)); fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`, { method: "POST", body: fd });
      const json = await res.json();
      if (json.secure_url) { setGalleryImageUrl(json.secure_url); toast.success("Image uploaded!"); }
      else toast.error("Upload failed.");
    } catch { toast.error("Upload error."); }
    finally { setUploadingGallery(false); }
  };

  const handleVideoThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideoThumb(true);
    try {
      const sig = await adminApi.getUploadSignature("testimonials");
      const fd = new FormData();
      fd.append("file", file); fd.append("api_key", sig.api_key);
      fd.append("timestamp", String(sig.timestamp)); fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`, { method: "POST", body: fd });
      const json = await res.json();
      if (json.secure_url) { setVideoThumbnail(json.secure_url); toast.success("Thumbnail uploaded!"); }
      else toast.error("Upload failed.");
    } catch { toast.error("Upload error."); }
    finally { setUploadingVideoThumb(false); }
  };

  // ─── Save Handlers ───────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    setIsSubmitting(true);
    try {
      const guidelines = guidelinesText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      await saveMutation.mutateAsync({
        name, description: description || null, coverImage: coverImage || null,
        isFeatured, sortOrder: Number(sortOrder),
        metaTitle: metaTitle || null, metaDescription: metaDescription || null,
        guidelines, notes: notes || null,
      });
    } catch { /* handled in mutation */ }
    finally { setIsSubmitting(false); }
  };

  const handleAddGalleryImage = async () => {
    if (!galleryImageUrl) { toast.error("Please upload an image first."); return; }
    setSavingGallery(true);
    try {
      await adminApi.addDestinationGalleryImage(activeDestId!, {
        imageUrl: galleryImageUrl,
        caption: galleryCaption || undefined,
        sortOrder: gallerySortOrder,
      });
      setGalleryImageUrl(""); setGalleryCaption(""); setGallerySortOrder(0);
      refetchGallery();
      toast.success("Image added to gallery!");
    } catch { toast.error("Failed to add image."); }
    finally { setSavingGallery(false); }
  };

  const handleAddFaq = async () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) { toast.error("Question and answer are required."); return; }
    setSavingFaq(true);
    try {
      await adminApi.createDestinationFaq({
        destinationId: activeDestId!,
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        sortOrder: faqSortOrder,
      });
      setFaqQuestion(""); setFaqAnswer(""); setFaqSortOrder(0);
      refetchFaqs();
      toast.success("FAQ added!");
    } catch { toast.error("Failed to add FAQ."); }
    finally { setSavingFaq(false); }
  };

  const handleAddVideo = async () => {
    if (!videoUrl.trim() || !videoTitle.trim()) { toast.error("Video URL and title are required."); return; }
    setSavingVideo(true);
    try {
      await adminApi.createDestinationVideo({
        destinationId: activeDestId!,
        videoUrl: videoUrl.trim(),
        title: videoTitle.trim(),
        thumbnail: videoThumbnail || undefined,
        sortOrder: videoSortOrder,
      });
      setVideoTitle(""); setVideoUrl(""); setVideoThumbnail(""); setVideoSortOrder(0);
      refetchVideos();
      toast.success("Video testimonial added!");
    } catch { toast.error("Failed to add video."); }
    finally { setSavingVideo(false); }
  };

  const handleDelete = (id: string, n: string) => {
    if (confirm(`Delete destination "${n}"?`)) deleteMutation.mutate(id);
  };

  // ─── Input class shorthand ───────────────────────────────────────────────
  const inputCls = "w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-6 relative">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h1 className="font-sans font-black italic text-xl md:text-2xl text-black uppercase tracking-tight">
            Destinations Mapped
          </h1>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-5 py-3.5 rounded-xl shadow-orange transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* ── Destinations Table ── */}
      <div className="bg-white border border-gray-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-gray-dark border-collapse">
            <thead>
              <tr className="bg-gray-bg border-b border-gray-border uppercase text-[10px] font-bold tracking-wider text-gray-light">
                <th className="p-4">Cover</th>
                <th className="p-4">Territory</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4">Order</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="p-16 text-center text-xs text-gray-light italic">Loading...</td></tr>
              ) : destinations.length > 0 ? (
                destinations.map((d: any) => (
                  <tr key={d.id} className="border-b border-gray-border hover:bg-gray-bg/25">
                    <td className="p-4">
                      {d.coverImage ? (
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-gray-border">
                          <Image src={d.coverImage} alt={d.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-10 rounded-lg bg-gray-bg border border-gray-border flex items-center justify-center text-[9px] text-gray-light">No cover</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-black text-sm">{d.name}</div>
                      {d._count && (
                        <div className="text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">
                          {d._count.packages} packages
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-light">/{d.slug}</td>
                    <td className="p-4">
                      {d.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-orange-50 border border-orange-200 text-primary px-2.5 py-1 rounded-md">
                          <Sparkles className="w-3 h-3 animate-pulse" /><span>Featured</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-gray-light uppercase tracking-wider">Standard</span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-bold text-black">{d.sortOrder}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Gallery */}
                        <button onClick={() => openSubDrawer("gallery", d)} title="Manage Gallery"
                          className="p-2 border border-gray-border hover:border-blue-400 text-gray-dark hover:text-blue-500 rounded-lg transition-colors cursor-pointer">
                          <Images className="w-3.5 h-3.5" />
                        </button>
                        {/* FAQs */}
                        <button onClick={() => openSubDrawer("faqs", d)} title="Manage FAQs"
                          className="p-2 border border-gray-border hover:border-green-400 text-gray-dark hover:text-green-500 rounded-lg transition-colors cursor-pointer">
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                        {/* Videos */}
                        <button onClick={() => openSubDrawer("videos", d)} title="Manage Videos"
                          className="p-2 border border-gray-border hover:border-purple-400 text-gray-dark hover:text-purple-500 rounded-lg transition-colors cursor-pointer">
                          <Video className="w-3.5 h-3.5" />
                        </button>
                        {/* Edit */}
                        <button onClick={() => openEdit(d)} title="Edit"
                          className="p-2 border border-gray-border hover:border-black text-gray-dark hover:text-black rounded-lg transition-colors cursor-pointer">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete */}
                        <button onClick={() => handleDelete(d.id, d.name)} title="Delete"
                          className="p-2 border border-gray-border hover:border-red-500 text-gray-dark hover:text-red-500 rounded-lg transition-colors cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="p-16 text-center text-xs text-gray-light italic">No destinations mapped yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN EDIT / CREATE DRAWER
      ═══════════════════════════════════════════════════════════════════ */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeDrawer} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-float flex flex-col z-10 animate-slideOver">
            {/* Header */}
            <div className="p-6 border-b border-gray-border flex items-center justify-between bg-white sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                <h3 className="font-sans font-black italic text-lg text-black uppercase tracking-tight">
                  {editingId ? "Edit Destination" : "Add Destination"}
                </h3>
              </div>
              <button onClick={closeDrawer} className="p-1.5 border border-gray-border hover:border-black rounded-lg text-gray-dark hover:text-black transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">Destination Name *</label>
                <input type="text" required placeholder="e.g. Kedarnath" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">Cover Image</label>
                <div className="flex items-center gap-4">
                  {coverImage ? (
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-gray-border shrink-0">
                      <Image src={coverImage} alt="Cover" fill className="object-cover" />
                      <button type="button" onClick={() => setCoverImage("")} className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white cursor-pointer">
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
                      {uploading ? "Uploading..." : "Upload Cover"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">Description</label>
                <textarea placeholder="Describe the region..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
              </div>

              {/* Guidelines */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-1">
                  Guidelines / Pointers
                </label>
                <p className="text-[10px] text-gray-light font-medium mb-2">Enter one guideline per line — each line becomes a bullet point.</p>
                <textarea
                  placeholder={"Carry valid photo ID\nWear proper trekking shoes\nNo littering in the trail"}
                  rows={5}
                  value={guidelinesText}
                  onChange={(e) => setGuidelinesText(e.target.value)}
                  className={inputCls + " font-mono text-xs"}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">Important Notes</label>
                <textarea placeholder="Any special notice or important alert for visitors..." rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} />
              </div>

              {/* Sort & Featured */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">Sort Order</label>
                  <input type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputCls} />
                </div>
                <div className="pt-6">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-primary cursor-pointer" />
                    <span className="text-xs font-bold text-gray-dark uppercase tracking-wider">Featured</span>
                  </label>
                </div>
              </div>

              {/* SEO */}
              <div className="border-t border-gray-border pt-4 space-y-4">
                <h4 className="font-sans font-bold text-xs text-black uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /><span>SEO (Optional)</span>
                </h4>
                <div>
                  <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">Meta Title (Max 70)</label>
                  <input type="text" maxLength={70} placeholder="SEO title..." value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">Meta Description (Max 160)</label>
                  <textarea maxLength={160} placeholder="SEO description..." rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className={inputCls} />
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="p-6 border-t border-gray-border bg-gray-bg flex items-center justify-end gap-3 sticky bottom-0">
              <button type="button" onClick={closeDrawer} className="bg-white hover:bg-gray-border border border-gray-border text-gray-dark font-semibold text-xs tracking-wide uppercase px-6 py-3 rounded-xl transition-all cursor-pointer">Cancel</button>
              <button type="button" onClick={handleSave} disabled={isSubmitting} className="bg-primary hover:bg-primary-dark text-white font-bold text-xs tracking-wide uppercase px-8 py-3 rounded-xl shadow-orange transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50">
                <Check className="w-4 h-4" />
                <span>{editingId ? "Save Changes" : "Create Destination"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SUB-DRAWER: GALLERY
      ═══════════════════════════════════════════════════════════════════ */}
      {subDrawer === "gallery" && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeSubDrawer} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-float flex flex-col z-10 animate-slideOver">
            <div className="p-5 border-b border-gray-border flex items-center gap-3 bg-white sticky top-0 z-20">
              <button onClick={closeSubDrawer} className="p-1.5 border border-gray-border rounded-lg text-gray-dark hover:text-black cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <Images className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-black italic text-sm text-black uppercase tracking-tight">Territory Gallery</h3>
                <p className="text-[10px] text-gray-light font-semibold">{activeDestName}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Upload form */}
              <div className="border border-gray-border rounded-2xl p-4 space-y-4 bg-gray-bg/30">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-dark">Add New Photo</h4>
                <div className="flex items-center gap-4">
                  {galleryImageUrl ? (
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-gray-border shrink-0">
                      <Image src={galleryImageUrl} alt="preview" fill className="object-cover" />
                      <button type="button" onClick={() => setGalleryImageUrl("")} className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white cursor-pointer"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <label className="w-24 h-16 rounded-xl bg-gray-bg border-2 border-dashed border-gray-border flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all shrink-0">
                      <Upload className="w-4 h-4 text-gray-light" />
                      <span className="text-[9px] text-gray-light mt-0.5">{uploadingGallery ? "..." : "Upload"}</span>
                      <input type="file" accept="image/*" onChange={handleGalleryUpload} disabled={uploadingGallery} className="hidden" />
                    </label>
                  )}
                  <div className="flex-1 space-y-2">
                    <input type="text" placeholder="Caption (optional)" value={galleryCaption} onChange={(e) => setGalleryCaption(e.target.value)} className={inputCls} />
                    <input type="number" placeholder="Sort order" min={0} value={gallerySortOrder} onChange={(e) => setGallerySortOrder(Number(e.target.value))} className={inputCls} />
                  </div>
                </div>
                <button onClick={handleAddGalleryImage} disabled={savingGallery || !galleryImageUrl} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wide py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /><span>{savingGallery ? "Saving..." : "Add to Gallery"}</span>
                </button>
              </div>

              {/* Gallery grid */}
              <div className="grid grid-cols-2 gap-3">
                {(galleryItems as any[]).map((img: any) => (
                  <div key={img.id || img._id} className="relative group rounded-xl overflow-hidden border border-gray-border aspect-video bg-gray-bg">
                    <Image src={img.imageUrl} alt={img.caption || "Gallery"} fill className="object-cover" />
                    {img.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-2 py-1 font-semibold truncate">{img.caption}</div>
                    )}
                    <button onClick={() => removeGalleryMutation.mutate(img.id || img._id)}
                      className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {(galleryItems as any[]).length === 0 && (
                  <p className="col-span-2 text-center text-xs text-gray-light italic py-8">No gallery photos yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SUB-DRAWER: FAQs
      ═══════════════════════════════════════════════════════════════════ */}
      {subDrawer === "faqs" && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeSubDrawer} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-float flex flex-col z-10 animate-slideOver">
            <div className="p-5 border-b border-gray-border flex items-center gap-3 bg-white sticky top-0 z-20">
              <button onClick={closeSubDrawer} className="p-1.5 border border-gray-border rounded-lg text-gray-dark hover:text-black cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <HelpCircle className="w-5 h-5 text-green-500" />
              <div>
                <h3 className="font-black italic text-sm text-black uppercase tracking-tight">Territory FAQs</h3>
                <p className="text-[10px] text-gray-light font-semibold">{activeDestName}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Add FAQ form */}
              <div className="border border-gray-border rounded-2xl p-4 space-y-3 bg-gray-bg/30">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-dark">Add FAQ</h4>
                <textarea placeholder="Question..." rows={2} value={faqQuestion} onChange={(e) => setFaqQuestion(e.target.value)} className={inputCls} />
                <textarea placeholder="Answer..." rows={3} value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)} className={inputCls} />
                <input type="number" placeholder="Sort order" min={0} value={faqSortOrder} onChange={(e) => setFaqSortOrder(Number(e.target.value))} className={inputCls} />
                <button onClick={handleAddFaq} disabled={savingFaq} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wide py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /><span>{savingFaq ? "Saving..." : "Add FAQ"}</span>
                </button>
              </div>

              {/* FAQ list */}
              <div className="space-y-3">
                {(destFaqs as any[]).map((faq: any) => (
                  <div key={faq.id || faq._id} className="bg-white border border-gray-border rounded-xl p-4 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-black mb-1">{faq.question}</p>
                        <p className="text-[11px] text-gray-mid leading-relaxed">{faq.answer}</p>
                      </div>
                      <button onClick={() => { if (confirm("Delete this FAQ?")) deleteFaqMutation.mutate(faq.id || faq._id); }}
                        className="p-1.5 border border-gray-border hover:border-red-500 text-gray-light hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {(destFaqs as any[]).length === 0 && (
                  <p className="text-center text-xs text-gray-light italic py-8">No FAQs added yet for this territory.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SUB-DRAWER: VIDEO TESTIMONIALS
      ═══════════════════════════════════════════════════════════════════ */}
      {subDrawer === "videos" && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeSubDrawer} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-float flex flex-col z-10 animate-slideOver">
            <div className="p-5 border-b border-gray-border flex items-center gap-3 bg-white sticky top-0 z-20">
              <button onClick={closeSubDrawer} className="p-1.5 border border-gray-border rounded-lg text-gray-dark hover:text-black cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <Video className="w-5 h-5 text-purple-500" />
              <div>
                <h3 className="font-black italic text-sm text-black uppercase tracking-tight">Video Testimonials</h3>
                <p className="text-[10px] text-gray-light font-semibold">{activeDestName}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Add video form */}
              <div className="border border-gray-border rounded-2xl p-4 space-y-3 bg-gray-bg/30">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-dark">Add Video Testimonial</h4>
                <input type="text" placeholder="Video Title *" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className={inputCls} />
                <input type="text" placeholder="Cloudinary Video URL *" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className={inputCls} />
                <div className="flex items-center gap-3">
                  {videoThumbnail ? (
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-gray-border shrink-0">
                      <Image src={videoThumbnail} alt="thumb" fill className="object-cover" />
                      <button type="button" onClick={() => setVideoThumbnail("")} className="absolute top-0.5 right-0.5 bg-black/60 p-0.5 rounded-full text-white cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                    </div>
                  ) : (
                    <label className="w-20 h-14 rounded-lg border-2 border-dashed border-gray-border bg-gray-bg flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all shrink-0">
                      <Upload className="w-3.5 h-3.5 text-gray-light" />
                      <span className="text-[9px] text-gray-light mt-0.5">{uploadingVideoThumb ? "..." : "Thumbnail"}</span>
                      <input type="file" accept="image/*" onChange={handleVideoThumbUpload} disabled={uploadingVideoThumb} className="hidden" />
                    </label>
                  )}
                  <input type="number" placeholder="Sort order" min={0} value={videoSortOrder} onChange={(e) => setVideoSortOrder(Number(e.target.value))} className={inputCls} />
                </div>
                <button onClick={handleAddVideo} disabled={savingVideo} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs uppercase tracking-wide py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /><span>{savingVideo ? "Saving..." : "Add Video"}</span>
                </button>
              </div>

              {/* Video list */}
              <div className="space-y-3">
                {(destVideos as any[]).map((v: any) => (
                  <div key={v.id || v._id} className="bg-white border border-gray-border rounded-xl p-3 flex items-center gap-3 group">
                    {v.thumbnail ? (
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-gray-border shrink-0 bg-gray-bg">
                        <Image src={v.thumbnail} alt={v.title} fill className="object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-10 rounded-lg bg-gray-bg border border-gray-border flex items-center justify-center shrink-0">
                        <Play className="w-4 h-4 text-gray-light" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-black truncate">{v.title}</p>
                      <p className="text-[10px] text-gray-light truncate">{v.videoUrl}</p>
                    </div>
                    <button onClick={() => { if (confirm("Delete this video?")) deleteVideoMutation.mutate(v.id || v._id); }}
                      className="p-1.5 border border-gray-border hover:border-red-500 text-gray-light hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {(destVideos as any[]).length === 0 && (
                  <p className="text-center text-xs text-gray-light italic py-8">No videos added yet for this territory.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
