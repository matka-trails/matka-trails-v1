"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { adminApi, publicApi, PublicDestination } from "@/lib/api";
import { getSession } from "next-auth/react";
import { getOptimizedImageUrl } from "@/lib/utils";
import { toast } from "react-hot-toast";
import {
  Compass,
  Upload,
  Plus,
  Trash2,
  Save,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  X,
} from "lucide-react";

// Package client form validation schema
const packageFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  destinationId: z.string().min(1, "Destination is required"),
  groupType: z.enum(["SOLO_GROUP", "CORPORATE", "CUSTOM"]),
  priceOriginal: z.number().min(0, "Original price must be positive"),
  priceDiscounted: z.number().min(0, "Discounted price must be positive").optional(),
  durationDays: z.number().int().min(1, "Must be at least 1 day"),
  durationNights: z.number().int().min(0, "Must be positive"),
  summary: z.string().max(300).optional(),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  notes: z.string().optional(),
  pdfUrl: z.string().optional(),
});

type PackageFormInput = z.infer<typeof packageFormSchema>;

interface PackageFormProps {
  initialData?: any;
}

export default function PackageForm({ initialData }: PackageFormProps) {
  const router = useRouter();
  const [destinations, setDestinations] = useState<PublicDestination[]>([]);
  const [coverImage, setCoverImage] = useState<string>(initialData?.coverImage || "");
  const [pdfUrl, setPdfUrl] = useState<string>(initialData?.pdfUrl || "");
  const [galleryImages, setGalleryImages] = useState<string[]>(initialData?.galleryImages || []);
  const [uploading, setUploading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic sections: Itinerary Days
  const [itineraryDays, setItineraryDays] = useState<any[]>(
    initialData?.itinerary || [{ dayNumber: 1, title: "Assembly & Welcome", description: "", images: [] }]
  );

  // Dynamic lists: Inclusions & Exclusions
  const [inclusions, setInclusions] = useState<string[]>(initialData?.inclusions || []);
  const [exclusions, setExclusions] = useState<string[]>(initialData?.exclusions || []);
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PackageFormInput>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      destinationId: initialData?.destinationId || "",
      groupType: initialData?.groupType || "SOLO_GROUP",
      priceOriginal: initialData?.priceOriginal || 0,
      priceDiscounted: initialData?.priceDiscounted || undefined,
      durationDays: initialData?.durationDays || 1,
      durationNights: initialData?.durationNights || 0,
      summary: initialData?.summary || "",
      description: initialData?.description || "",
      status: initialData?.status || "DRAFT",
      notes: initialData?.notes || "",
      pdfUrl: initialData?.pdfUrl || "",
    },
  });

  const titleValue = watch("title");

  // Auto-generate slug from title (only when creating new package)
  useEffect(() => {
    if (!initialData && titleValue) {
      const generated = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generated);
    }
  }, [titleValue, setValue, initialData]);

  // Load destinations
  useEffect(() => {
    adminApi
      .getDestinations()
      .then((data) => setDestinations(data))
      .catch((err) => console.error("Destinations loading error", err));
  }, []);

  // Direct Cloudinary Browser Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const sigData = await adminApi.getUploadSignature("matka-trails/packages");
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
        toast.success("Cover image uploaded successfully!");
      } else {
        toast.error("Failed to upload cover image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Cloudinary connection failed.");
    } finally {
      setUploading(false);
    }
  };

  // Upload PDF to our own backend server (avoids Cloudinary 'untrusted customer' error for raw files)
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const session = await getSession();
      const token = (session as any)?.accessToken as string | undefined;
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001").replace(/\/$/, "");

      const res = await fetch(`${apiBase}/api/admin/upload/pdf`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data?.url) {
        setPdfUrl(json.data.url);
        toast.success("PDF Itinerary uploaded successfully!");
      } else {
        const msg = json.error?.message || "Failed to upload PDF Itinerary.";
        toast.error(msg);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server connection failed. Please try again.");
    } finally {
      setUploadingPdf(false);
    }
  };

  // Direct Cloudinary Gallery Image Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGallery(true);
    try {
      const sigData = await adminApi.getUploadSignature("packages");
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
        setGalleryImages((prev) => [...prev, json.secure_url]);
        toast.success("Image added to gallery!");
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Cloudinary connection failed.");
    } finally {
      setUploadingGallery(false);
    }
  };

  // Itinerary CRUD helper functions
  const addItineraryDay = () => {
    setItineraryDays((prev) => [
      ...prev,
      { dayNumber: prev.length + 1, title: "", description: "", images: [] },
    ]);
  };

  const removeItineraryDay = (idx: number) => {
    const updated = itineraryDays.filter((_, i) => i !== idx).map((day, i) => ({
      ...day,
      dayNumber: i + 1,
    }));
    setItineraryDays(updated);
  };

  const updateItineraryDay = (idx: number, key: string, val: any) => {
    const updated = [...itineraryDays];
    updated[idx] = { ...updated[idx], [key]: val };
    setItineraryDays(updated);
  };

  // Inclusions/Exclusions list addition triggers
  const addInclusionItem = () => {
    if (!newInclusion.trim()) return;
    setInclusions((prev) => [...prev, newInclusion.trim()]);
    setNewInclusion("");
  };

  const addExclusionItem = () => {
    if (!newExclusion.trim()) return;
    setExclusions((prev) => [...prev, newExclusion.trim()]);
    setNewExclusion("");
  };

  // Main Submit handler (supports create/update)
  const onSubmit = async (data: PackageFormInput) => {
    if (!coverImage) {
      toast.error("Please upload a cover image for the package.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        coverImage,
        pdfUrl,
        galleryImages,
        inclusions,
        exclusions,
        itinerary: itineraryDays.map((day) => ({
          dayNumber: Number(day.dayNumber),
          title: day.title || `Day ${day.dayNumber}`,
          description: day.description || null,
          images: day.images || [],
        })),
        priceOriginal: Number(data.priceOriginal),
        priceDiscounted: data.priceDiscounted ? Number(data.priceDiscounted) : null,
        durationDays: Number(data.durationDays),
        durationNights: Number(data.durationNights),
      };

      if (initialData) {
        await adminApi.updatePackage(initialData.id, payload);
      } else {
        await adminApi.createPackage(payload);
      }

      toast.success(initialData ? "Package updated!" : "New package created!");
      router.push("/admin/packages");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred while saving the package.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-12">
      
      {/* Dynamic console title bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary animate-pulse" />
          <h1 className="font-sans font-black italic text-xl md:text-2xl text-black uppercase tracking-tight">
            {initialData ? "Edit Trail Package" : "Publish New Trail"}
          </h1>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-6 py-3.5 rounded-xl shadow-orange transition-colors cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4 shrink-0" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Grid Layout Form Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Basic Details & Media (Cols span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section A: Basic Info */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black flex items-center gap-2 uppercase tracking-wide">
              <Info className="w-4.5 h-4.5 text-primary shrink-0" />
              <span>Basic Information</span>
            </h3>

            {/* Title */}
            <div>
              <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
                Package Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Kedarnath Spiritual Expedition"
                {...register("title")}
                className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
              />
              {errors.title && (
                <span className="text-[10px] text-primary font-bold mt-1 block">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* Grid: Slug & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Router Slug *
                </label>
                <input
                  type="text"
                  placeholder="auto-generated-slug"
                  {...register("slug")}
                  className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Territory Destination *
                </label>
                <select
                  {...register("destinationId")}
                  className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                >
                  <option value="">Select Region</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
                Detailed Description *
              </label>
              <textarea
                rows={5}
                placeholder="Write full details about mountain passes, local sights, schedules..."
                {...register("description")}
                className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white resize-none"
              />
            </div>
          </div>

          {/* Section B: Itinerary Builder */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-extrabold text-sm text-black flex items-center gap-2 uppercase tracking-wide">
                <Sparkles className="w-4.5 h-4.5 text-primary shrink-0" />
                <span>Day-by-Day Itinerary Builder</span>
              </h3>
              <button
                type="button"
                onClick={addItineraryDay}
                className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Add Day</span>
              </button>
            </div>

            {/* List of Days */}
            <div className="space-y-4">
              {itineraryDays.map((day, idx) => (
                <div
                  key={idx}
                  className="border border-gray-border rounded-xl p-4 bg-gray-bg/25 space-y-3 relative group/day"
                >
                  {/* Remove day */}
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(idx)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg border border-rose-100 bg-rose-50/20 text-rose-500 hover:bg-rose-50 opacity-0 group-hover/day:opacity-100 transition-opacity cursor-pointer"
                    title="Remove Day"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Day header */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      Day {day.dayNumber}
                    </span>
                    <input
                      type="text"
                      placeholder="Enter heading..."
                      value={day.title}
                      onChange={(e) => updateItineraryDay(idx, "title", e.target.value)}
                      className="flex-1 bg-transparent border-b border-gray-border focus:border-primary text-xs font-bold focus:outline-none pb-1"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Day descriptions, treks lengths, altitudes mapped..."
                    value={day.description || ""}
                    onChange={(e) => updateItineraryDay(idx, "description", e.target.value)}
                    className="w-full bg-white border border-gray-border rounded-xl p-3 text-xs font-semibold focus:outline-none focus:bg-white resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section C: Camp & Trail Gallery Images */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black flex items-center gap-2 uppercase tracking-wide">
              <Compass className="w-4.5 h-4.5 text-primary shrink-0" />
              <span>Camp &amp; Trail Gallery</span>
            </h3>
            <p className="text-[10px] text-gray-light font-bold uppercase tracking-wider">
              Add multiple photo frames showcasing campsites, viewpoints, and journey highlights
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-border bg-gray-bg group">
                  <img src={getOptimizedImageUrl(img, 300)} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-rose-600 p-1.5 rounded-full text-white cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <label className="border-2 border-dashed border-gray-border hover:border-primary/45 rounded-xl aspect-video flex flex-col items-center justify-center text-center p-4 cursor-pointer bg-gray-bg/10 hover:bg-primary-light/5 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  disabled={uploadingGallery}
                  className="hidden"
                />
                {uploadingGallery ? (
                  <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-gray-light mb-1 hover:text-primary" />
                    <span className="text-[9px] font-bold text-gray-dark uppercase tracking-wider">Add Photo</span>
                  </>
                )}
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Pricing, Formats, Policies & Status */}
        <div className="space-y-6">
          
          {/* Cover Media box */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black flex items-center gap-2 uppercase tracking-wide">
              <Upload className="w-4.5 h-4.5 text-primary shrink-0" />
              <span>Cover Media Image</span>
            </h3>

            {coverImage ? (
              <div className="relative h-[160px] rounded-xl overflow-hidden border border-gray-border bg-gray-bg">
                <img
                  src={getOptimizedImageUrl(coverImage, 400)}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-3 right-3 p-1.5 bg-black/60 rounded-lg text-white hover:text-primary transition-colors cursor-pointer"
                  title="Remove Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-border hover:border-primary/45 rounded-xl h-[160px] flex flex-col items-center justify-center text-center p-5 cursor-pointer bg-gray-bg/10 hover:bg-primary-light/5 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploading}
                  className="hidden"
                />
                {uploading ? (
                  <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-light mb-2 group-hover:text-primary" />
                    <span className="text-[10px] font-bold text-gray-dark uppercase tracking-wider">Upload Cover</span>
                  </>
                )}
              </label>
            )}
          </div>

          {/* Formats & Pricing Box */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black flex items-center gap-2 uppercase tracking-wide">
              <Compass className="w-4.5 h-4.5 text-primary shrink-0" />
              <span>Details & Pricing</span>
            </h3>

            {/* Travel Format */}
            <div>
              <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
                Travel cohort format
              </label>
              <select
                {...register("groupType")}
                className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
              >
                <option value="SOLO_GROUP">SOLO_GROUP</option>
                <option value="CORPORATE">CORPORATE</option>
                <option value="CUSTOM">CUSTOM</option>
              </select>
            </div>

            {/* Grid Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="Original price"
                  {...register("priceOriginal", { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Discounted Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="Discounted price"
                  {...register("priceDiscounted", { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Grid Durations */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  placeholder="Days count"
                  {...register("durationDays", { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Duration (Nights)
                </label>
                <input
                  type="number"
                  placeholder="Nights count"
                  {...register("durationNights", { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Inclusions editor */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black flex items-center gap-2 uppercase tracking-wide">
              <Check className="w-4.5 h-4.5 text-primary shrink-0" />
              <span>Inclusions List</span>
            </h3>

            {/* Dynamic chips list */}
            <div className="flex flex-wrap gap-1.5 min-h-[40px] border border-gray-border rounded-xl p-3 bg-gray-bg/25">
              {inclusions.map((inc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-white border border-gray-border text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                >
                  <span>{inc}</span>
                  <button type="button" onClick={() => setInclusions(inclusions.filter((_, idx) => idx !== i))}>
                    <X className="w-3 h-3 hover:text-primary" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add inclusion item..."
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none"
              />
              <button
                type="button"
                onClick={addInclusionItem}
                className="bg-[#111111] text-white px-4 rounded-xl text-xs font-bold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Exclusions editor */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black flex items-center gap-2 uppercase tracking-wide">
              <X className="w-4.5 h-4.5 text-primary shrink-0" />
              <span>Exclusions List</span>
            </h3>

            {/* Dynamic chips list */}
            <div className="flex flex-wrap gap-1.5 min-h-[40px] border border-gray-border rounded-xl p-3 bg-gray-bg/25">
              {exclusions.map((exc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-white border border-gray-border text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                >
                  <span>{exc}</span>
                  <button type="button" onClick={() => setExclusions(exclusions.filter((_, idx) => idx !== i))}>
                    <X className="w-3 h-3 hover:text-primary" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add exclusion item..."
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none"
              />
              <button
                type="button"
                onClick={addExclusionItem}
                className="bg-[#111111] text-white px-4 rounded-xl text-xs font-bold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* PDF Upload */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black flex items-center gap-2 uppercase tracking-wide">
              <Upload className="w-4.5 h-4.5 text-primary shrink-0" />
              <span>Itinerary PDF Document</span>
            </h3>

            {pdfUrl ? (
              <div className="flex items-center justify-between border border-gray-border rounded-xl p-3.5 bg-gray-bg/25">
                <div className="min-w-0 flex-1 pr-3">
                  <span className="text-[10px] text-gray-light font-bold uppercase block">Uploaded Itinerary PDF</span>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-bold hover:underline truncate block">
                    {pdfUrl.substring(pdfUrl.lastIndexOf("/") + 1)}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setPdfUrl("")}
                  className="p-1.5 rounded-lg border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-border hover:border-primary/45 rounded-xl h-[100px] flex flex-col items-center justify-center text-center p-4 cursor-pointer bg-gray-bg/10 hover:bg-primary-light/5 transition-all">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  disabled={uploadingPdf}
                  className="hidden"
                />
                {uploadingPdf ? (
                  <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-light mb-1 hover:text-primary" />
                    <span className="text-[9px] font-bold text-gray-dark uppercase tracking-wider">Upload Itinerary PDF</span>
                  </>
                )}
              </label>
            )}
          </div>

          {/* Important Trail Notes */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black flex items-center gap-2 uppercase tracking-wide">
              <Info className="w-4.5 h-4.5 text-primary shrink-0" />
              <span>Important Trail Notes</span>
            </h3>
            <textarea
              rows={3}
              placeholder="e.g. Carry valid photo ID, heavy woolens, no plastic trails policy..."
              {...register("notes")}
              className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white resize-none"
            />
          </div>

          {/* Settings / Publish status */}
          <div className="bg-white border border-gray-border rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-sans font-extrabold text-sm text-black flex items-center gap-2 uppercase tracking-wide">
              <Save className="w-4.5 h-4.5 text-primary shrink-0" />
              <span>Publish Settings</span>
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
                Console status
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </div>
          </div>

        </div>

      </div>

    </form>
  );
}
