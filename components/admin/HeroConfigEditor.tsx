"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  Save,
  GripVertical,
  X,
  Tag,
  Monitor,
  Smartphone,
  Check,
  AlertCircle,
  LayoutGrid,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { adminApi, HeroConfig, HeroCarouselSlide, HeroDesktopCard } from "@/lib/api";
import { cn, getOptimizedImageUrl } from "@/lib/utils";

// ─── Cloudinary upload helper ─────────────────────────────────────────────────
async function uploadToCloudinary(
  file: File,
  folder: string,
  onProgress?: (p: number) => void
): Promise<string> {
  const sig = await adminApi.getUploadSignature(folder);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.api_key);
  formData.append("timestamp", sig.timestamp);
  formData.append("signature", sig.signature);
  formData.append("folder", sig.folder);
  formData.append("upload_preset", "");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => {
      const res = JSON.parse(xhr.responseText);
      if (xhr.status === 200) resolve(res.secure_url);
      else reject(new Error(res.error?.message || "Upload failed"));
    });
    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`);
    xhr.send(formData);
  });
}

// ─── Image Upload Button ──────────────────────────────────────────────────────
function ImageUploadButton({
  value,
  onChange,
  folder,
  label,
  aspectRatio = "16/9",
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label: string;
  aspectRatio?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadToCloudinary(file, folder, setProgress);
      onChange(url);
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-dark uppercase tracking-wider block">{label}</label>
      <div
        className="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-border bg-gray-bg hover:border-primary/50 transition-colors"
        style={{ aspectRatio }}
      >
        {value ? (
          <>
            <Image
              src={getOptimizedImageUrl(value, 800) || value}
              alt={label}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="cursor-pointer bg-white text-black text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                Replace
                <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
              </label>
              <button
                onClick={() => onChange("")}
                className="bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <label className="flex flex-col items-center justify-center h-full cursor-pointer gap-2">
            {uploading ? (
              <div className="text-center">
                <div className="w-32 h-2 bg-gray-border rounded-full overflow-hidden mx-auto">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-mid mt-2 font-medium">Uploading {progress}%...</p>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-light" />
                <p className="text-xs text-gray-mid font-medium text-center px-4">
                  Click to upload
                  <br />
                  <span className="text-[10px] text-gray-light">WebP recommended for best performance</span>
                </p>
              </>
            )}
            <input type="file" accept="image/*" className="sr-only" onChange={handleFile} disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HeroConfigEditor() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile">("desktop");

  // ── Desktop state ──
  const [desktopBg, setDesktopBg] = useState("");
  const [dynamicWords, setDynamicWords] = useState<string[]>(["Ladakh", "Spiti Valley", "Kedarnath"]);
  const [newWord, setNewWord] = useState("");
  const [desktopCards, setDesktopCards] = useState<
    { imageUrl: string; destinationName: string; sortOrder: number }[]
  >([]);

  // ── Mobile slide state ──
  const [showAddSlide, setShowAddSlide] = useState(false);
  const [newSlideImage, setNewSlideImage] = useState("");
  const [newSlideDestId, setNewSlideDestId] = useState("");
  const [addingSlide, setAddingSlide] = useState(false);

  // ── Saving state ──
  const [savingDesktop, setSavingDesktop] = useState(false);

  // ── Fetch hero config ──
  const { data: config, isLoading } = useQuery<HeroConfig>({
    queryKey: ["admin-hero-config"],
    queryFn: () => adminApi.getHeroConfig(),
  });

  // ── Fetch destinations for dropdown ──
  const { data: destinations = [] } = useQuery({
    queryKey: ["admin-destinations-simple"],
    queryFn: () => adminApi.getDestinations(),
  });

  // Sync form state when config loads
  useEffect(() => {
    if (!config) return;
    setDesktopBg(config.desktopBgImage || "");
    setDynamicWords(config.desktopDynamicWords?.length ? config.desktopDynamicWords : ["Ladakh"]);
    setDesktopCards(
      config.desktopCards?.map((c, i) => ({
        imageUrl: c.imageUrl,
        destinationName: c.destinationName || "",
        sortOrder: c.sortOrder ?? i,
      })) || []
    );
  }, [config]);

  // ── Delete slide mutation ──
  const deleteSlide = useMutation({
    mutationFn: (slideId: string) => adminApi.deleteHeroSlide(slideId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hero-config"] });
      toast.success("Slide removed.");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete slide."),
  });

  // ── Update slide isActive mutation ──
  const toggleSlide = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.updateHeroSlide(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hero-config"] });
      toast.success("Slide updated.");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update slide."),
  });

  // ── Save desktop settings ──
  const saveDesktop = async () => {
    setSavingDesktop(true);
    try {
      await adminApi.updateHeroConfig({
        desktopBgImage: desktopBg || null,
        desktopDynamicWords: dynamicWords.filter(Boolean),
        desktopCards: desktopCards.map((c, i) => ({
          imageUrl: c.imageUrl,
          destinationName: c.destinationName || null,
          sortOrder: i,
        })),
      });
      queryClient.invalidateQueries({ queryKey: ["admin-hero-config"] });
      toast.success("Desktop hero settings saved!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save.");
    } finally {
      setSavingDesktop(false);
    }
  };

  // ── Add slide ──
  const handleAddSlide = async () => {
    if (!newSlideImage) {
      toast.error("Please upload a slide image first.");
      return;
    }
    setAddingSlide(true);
    try {
      await adminApi.addHeroSlide({
        imageUrl: newSlideImage,
        destinationId: newSlideDestId || null,
        isActive: true,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-hero-config"] });
      toast.success("Slide added!");
      setNewSlideImage("");
      setNewSlideDestId("");
      setShowAddSlide(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to add slide.");
    } finally {
      setAddingSlide(false);
    }
  };

  // ── Dynamic words helpers ──
  const addWord = () => {
    const trimmed = newWord.trim();
    if (!trimmed || dynamicWords.includes(trimmed)) { setNewWord(""); return; }
    setDynamicWords([...dynamicWords, trimmed]);
    setNewWord("");
  };

  const removeWord = (w: string) => setDynamicWords(dynamicWords.filter((x) => x !== w));

  // ── Desktop cards helpers ──
  const addCard = () => {
    setDesktopCards([...desktopCards, { imageUrl: "", destinationName: "", sortOrder: desktopCards.length }]);
  };

  const removeCard = (i: number) => {
    setDesktopCards(desktopCards.filter((_, idx) => idx !== i));
  };

  const updateCard = (i: number, field: "imageUrl" | "destinationName", val: string) => {
    setDesktopCards(desktopCards.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const slides: HeroCarouselSlide[] = config?.mobileCarouselSlides || [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-black uppercase tracking-wide flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            Hero Section Settings
          </h1>
          <p className="text-xs text-gray-mid font-medium mt-1">
            Control what users see first when they visit Matka Trails.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-gray-bg border border-gray-border rounded-xl p-1 w-fit gap-1">
        {(["desktop", "mobile"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
              activeTab === tab
                ? "bg-white shadow-sm text-primary border border-gray-border"
                : "text-gray-mid hover:text-gray-dark"
            )}
          >
            {tab === "desktop" ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            {tab === "desktop" ? "Desktop View" : "Mobile View"}
          </button>
        ))}
      </div>

      {/* ── DESKTOP TAB ── */}
      {activeTab === "desktop" && (
        <div className="space-y-6">
          
          {/* Background Image */}
          <div className="bg-white border border-gray-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black text-black uppercase tracking-wide">Background Image</h2>
            </div>
            <ImageUploadButton
              value={desktopBg}
              onChange={setDesktopBg}
              folder="matka-trails/hero"
              label="Full-width desktop hero image"
              aspectRatio="16/6"
            />
          </div>

          {/* Dynamic Rotating Words */}
          <div className="bg-white border border-gray-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black text-black uppercase tracking-wide">
                Rotating Destination Words
              </h2>
            </div>
            <p className="text-xs text-gray-mid font-medium">
              These words rotate one by one in the headline: &quot;Book a trip to <strong>Ladakh</strong>&quot;
            </p>

            {/* Current words */}
            <div className="flex flex-wrap gap-2">
              {dynamicWords.map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 bg-primary-light text-primary px-3 py-1.5 rounded-full text-xs font-bold"
                >
                  {word}
                  <button
                    onClick={() => removeWord(word)}
                    className="w-3.5 h-3.5 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add new word */}
            <div className="flex gap-2">
              <input
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addWord(); } }}
                placeholder="e.g. Spiti Valley"
                className="flex-1 border border-gray-border rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
              <button
                onClick={addWord}
                className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-primary-dark transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Desktop Glass Cards */}
          <div className="bg-white border border-gray-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-black text-black uppercase tracking-wide">
                  Glassmorphic Trip Cards (Right Side)
                </h2>
              </div>
              <button
                onClick={addCard}
                className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-light hover:bg-primary/10 px-3 py-2 rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Card
              </button>
            </div>

            <p className="text-xs text-gray-mid font-medium">
              These cards are shown on the right side on desktop, rotating from bottom to top. Not clickable.
              <br />
              <span className="text-amber-600 font-bold">💡 WebP format recommended for best performance.</span>
            </p>

            {desktopCards.length === 0 ? (
              <div className="py-6 text-center border-2 border-dashed border-gray-border rounded-xl">
                <p className="text-xs text-gray-light font-medium">No cards added yet.</p>
                <p className="text-xs text-gray-light">An adventure doodle will show instead.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {desktopCards.map((card, i) => (
                  <div
                    key={i}
                    className="border border-gray-border rounded-xl p-4 space-y-3 bg-gray-bg/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-mid uppercase tracking-wider">
                        Card #{i + 1}
                      </span>
                      <button
                        onClick={() => removeCard(i)}
                        className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <ImageUploadButton
                      value={card.imageUrl}
                      onChange={(url) => updateCard(i, "imageUrl", url)}
                      folder="matka-trails/hero"
                      label="Card Image"
                      aspectRatio="4/5"
                    />

                    <div>
                      <label className="text-xs font-bold text-gray-dark uppercase tracking-wider block mb-1.5">
                        Label (shown on glass overlay)
                      </label>
                      <input
                        value={card.destinationName}
                        onChange={(e) => updateCard(i, "destinationName", e.target.value)}
                        placeholder="e.g. Ladakh Trek"
                        className="w-full border border-gray-border rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save button */}
          <button
            onClick={saveDesktop}
            disabled={savingDesktop}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold text-sm uppercase tracking-wider py-4 rounded-2xl shadow-orange transition-all"
          >
            {savingDesktop ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Desktop Settings
              </>
            )}
          </button>
        </div>
      )}

      {/* ── MOBILE TAB ── */}
      {activeTab === "mobile" && (
        <div className="space-y-6">
          
          <div className="bg-white border border-gray-border rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-black text-black uppercase tracking-wide">
                  Carousel Posters
                </h2>
              </div>
              <button
                onClick={() => { setShowAddSlide(true); setNewSlideImage(""); setNewSlideDestId(""); }}
                className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-light hover:bg-primary/10 px-3 py-2 rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Slide
              </button>
            </div>

            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 font-medium leading-relaxed">
                <strong>WebP format strongly recommended</strong> for carousel images — much smaller file size,
                faster load. Optimal size: 800×450px (16:9 ratio).
              </p>
            </div>

            {/* Active slides */}
            {slides.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-gray-border rounded-xl">
                <Smartphone className="w-8 h-8 text-gray-light mx-auto mb-2" />
                <p className="text-sm text-gray-mid font-medium">No carousel slides configured.</p>
                <p className="text-xs text-gray-light mt-1">
                  Default images will be used until you add slides.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {slides
                  .slice()
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((slide) => (
                    <div
                      key={slide._id}
                      className={cn(
                        "flex items-center gap-3 border rounded-xl p-3 transition-all",
                        slide.isActive
                          ? "border-gray-border bg-white"
                          : "border-gray-border/50 bg-gray-bg/50 opacity-60"
                      )}
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-bg border border-gray-border">
                        {slide.imageUrl && (
                          <Image
                            src={getOptimizedImageUrl(slide.imageUrl, 200) || slide.imageUrl}
                            alt="Slide"
                            width={80}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-black truncate">
                          {slide.destination?.name || (
                            <span className="text-gray-light font-medium">No destination linked</span>
                          )}
                        </p>
                        <p className="text-[10px] text-gray-light font-medium truncate mt-0.5">
                          {slide.imageUrl.split("/").pop()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Toggle active */}
                        <button
                          onClick={() => toggleSlide.mutate({ id: slide._id, isActive: !slide.isActive })}
                          title={slide.isActive ? "Deactivate" : "Activate"}
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                            slide.isActive
                              ? "bg-green-100 text-green-600 hover:bg-green-200"
                              : "bg-gray-bg text-gray-light hover:bg-gray-border"
                          )}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (window.confirm("Delete this slide?")) {
                              deleteSlide.mutate(slide._id);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Add slide panel */}
          {showAddSlide && (
            <div className="bg-white border border-gray-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-black uppercase tracking-wide">New Carousel Slide</h3>
                <button
                  onClick={() => setShowAddSlide(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-bg text-gray-mid transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ImageUploadButton
                value={newSlideImage}
                onChange={setNewSlideImage}
                folder="matka-trails/hero"
                label="Poster Image (WebP recommended)"
                aspectRatio="16/9"
              />

              <div>
                <label className="text-xs font-bold text-gray-dark uppercase tracking-wider block mb-1.5">
                  Link to Destination (optional)
                </label>
                <select
                  value={newSlideDestId}
                  onChange={(e) => setNewSlideDestId(e.target.value)}
                  className="w-full border border-gray-border rounded-xl px-4 py-2.5 text-sm font-medium bg-white outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                >
                  <option value="">— No destination —</option>
                  {destinations.map((d: any) => (
                    <option key={d.id || d._id} value={d.id || d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-light font-medium mt-1">
                  On click, carousel will navigate to this destination page.
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowAddSlide(false)}
                  className="flex-1 border border-gray-border text-gray-dark text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-gray-bg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSlide}
                  disabled={addingSlide || !newSlideImage}
                  className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl shadow-orange transition flex items-center justify-center gap-2"
                >
                  {addingSlide ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Add Slide
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
