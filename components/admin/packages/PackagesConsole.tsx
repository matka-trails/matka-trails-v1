"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  Check,
  X,
  Eye,
  Star,
  Play,
  Video,
  ChevronLeft,
  Save,
  Upload,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Image from "next/image";

type SubDrawer = "reviews" | "videos" | null;

export default function PackagesConsole() {
  const queryClient = useQueryClient();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Sub-drawer state
  const [subDrawer, setSubDrawer] = useState<SubDrawer>(null);
  const [activePackageId, setActivePackageId] = useState<string | null>(null);
  const [activePackageTitle, setActivePackageTitle] = useState("");

  // Sub-drawer: reviews state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [savingReview, setSavingReview] = useState(false);

  // Sub-drawer: videos state
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [uploadingVideoThumb, setUploadingVideoThumb] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);

  // Fetch all packages
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["admin-packages"],
    queryFn: () => adminApi.getPackages(),
  });

  // Sub-drawer queries
  const { data: packageReviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ["package-reviews", activePackageId],
    queryFn: () => adminApi.getPackageReviews(activePackageId!),
    enabled: !!activePackageId && subDrawer === "reviews",
  });

  const { data: packageVideos = [], refetch: refetchVideos } = useQuery({
    queryKey: ["package-videos", activePackageId],
    queryFn: () => adminApi.getPackageVideos(activePackageId!),
    enabled: !!activePackageId && subDrawer === "videos",
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

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => adminApi.deletePackageReview(activePackageId!, reviewId),
    onSuccess: () => {
      refetchReviews();
      toast.success("Review deleted successfully!");
    },
    onError: () => toast.error("Failed to delete review."),
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (videoId: string) => adminApi.deletePackageVideo(activePackageId!, videoId),
    onSuccess: () => {
      refetchVideos();
      toast.success("Video deleted successfully!");
    },
    onError: () => toast.error("Failed to delete video."),
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const openSubDrawer = (drawer: SubDrawer, pkg: any) => {
    setActivePackageId(pkg.id);
    setActivePackageTitle(pkg.title);
    setSubDrawer(drawer);
  };

  const closeSubDrawer = () => {
    setSubDrawer(null);
    setReviewName("");
    setReviewRating(5);
    setReviewText("");
    setVideoTitle("");
    setVideoUrl("");
    setVideoThumbnail("");
  };

  // Video Thumbnail Upload
  const handleVideoThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideoThumb(true);
    try {
      const sig = await adminApi.getUploadSignature("testimonials");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sig.api_key);
      fd.append("timestamp", String(sig.timestamp));
      fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (json.secure_url) {
        setVideoThumbnail(json.secure_url);
        toast.success("Thumbnail uploaded successfully!");
      } else {
        toast.error("Upload failed.");
      }
    } catch {
      toast.error("Upload error.");
    } finally {
      setUploadingVideoThumb(false);
    }
  };

  // Save Handlers
  const handleAddReview = async () => {
    if (!reviewName.trim() || !reviewText.trim()) {
      toast.error("Name and review details are required.");
      return;
    }
    setSavingReview(true);
    try {
      await adminApi.createPackageReview(activePackageId!, {
        customerName: reviewName.trim(),
        rating: reviewRating,
        reviewText: reviewText.trim(),
        isApproved: true,
      });
      setReviewName("");
      setReviewRating(5);
      setReviewText("");
      refetchReviews();
      toast.success("Review added successfully!");
    } catch {
      toast.error("Failed to add review.");
    } finally {
      setSavingReview(false);
    }
  };

  const handleAddVideo = async () => {
    if (!videoTitle.trim() || !videoUrl.trim()) {
      toast.error("Video Title and URL are required.");
      return;
    }
    setSavingVideo(true);
    try {
      await adminApi.createPackageVideo(activePackageId!, {
        customerName: videoTitle.trim(),
        videoUrl: videoUrl.trim(),
        thumbnail: videoThumbnail || undefined,
        sortOrder: 0,
      });
      setVideoTitle("");
      setVideoUrl("");
      setVideoThumbnail("");
      refetchVideos();
      toast.success("Video testimonial added!");
    } catch {
      toast.error("Failed to add video.");
    } finally {
      setSavingVideo(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-6 relative">
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
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Manage Reviews */}
                          <button
                            onClick={() => openSubDrawer("reviews", pkg)}
                            className="p-2 border border-gray-border hover:border-amber-400 text-gray-dark hover:text-amber-500 rounded-lg transition-colors cursor-pointer"
                            title="Manage Reviews"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>

                          {/* Manage Videos */}
                          <button
                            onClick={() => openSubDrawer("videos", pkg)}
                            className="p-2 border border-gray-border hover:border-purple-400 text-gray-dark hover:text-purple-500 rounded-lg transition-colors cursor-pointer"
                            title="Manage Videos"
                          >
                            <Video className="w-3.5 h-3.5" />
                          </button>

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

      {/* ═══════════════════════════════════════════════════════════════════
          SUB-DRAWER: REVIEWS
      ═══════════════════════════════════════════════════════════════════ */}
      {subDrawer === "reviews" && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeSubDrawer} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-float flex flex-col z-10 animate-slideOver">
            <div className="p-5 border-b border-gray-border flex items-center gap-3 bg-white sticky top-0 z-20">
              <button onClick={closeSubDrawer} className="p-1.5 border border-gray-border rounded-lg text-gray-dark hover:text-black cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <div>
                <h3 className="font-black italic text-sm text-black uppercase tracking-tight">Package Reviews</h3>
                <p className="text-[10px] text-gray-light font-semibold">{activePackageTitle}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Add Review Form */}
              <div className="border border-gray-border rounded-2xl p-4 space-y-3 bg-gray-bg/30">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-dark">Add Traveller Review</h4>
                <input
                  type="text"
                  placeholder="Traveller Name *"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className={inputCls}
                />
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-1.5">Rating (1 to 5 Stars)</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        type="button"
                        key={stars}
                        onClick={() => setReviewRating(stars)}
                        className="cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={cn(
                            "w-6 h-6 transition-all",
                            stars <= reviewRating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Review Details..."
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className={inputCls}
                />

                <button
                  onClick={handleAddReview}
                  disabled={savingReview}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wide py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingReview ? "Saving..." : "Add Review"}</span>
                </button>
              </div>

              {/* Review list */}
              <div className="space-y-3">
                {packageReviews.map((rev: any) => (
                  <div key={rev.id || rev._id} className="bg-white border border-gray-border rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-black">{rev.customerName}</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3 h-3",
                                  i < rev.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-mid leading-relaxed">{rev.reviewText}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm("Delete this review?")) deleteReviewMutation.mutate(rev.id || rev._id);
                        }}
                        className="p-1.5 border border-gray-border hover:border-red-500 text-gray-light hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {packageReviews.length === 0 && (
                  <p className="text-center text-xs text-gray-light italic py-8">No reviews added yet for this trail.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SUB-DRAWER: VIDEOS
      ═══════════════════════════════════════════════════════════════════ */}
      {subDrawer === "videos" && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={closeSubDrawer} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-float flex flex-col z-10 animate-slideOver">
            <div className="p-5 border-b border-gray-border flex items-center gap-3 bg-white sticky top-0 z-20">
              <button onClick={closeSubDrawer} className="p-1.5 border border-gray-border rounded-lg text-gray-dark hover:text-black cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <Video className="w-5 h-5 text-purple-500" />
              <div>
                <h3 className="font-black italic text-sm text-black uppercase tracking-tight">Video Testimonials</h3>
                <p className="text-[10px] text-gray-light font-semibold">{activePackageTitle}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Add Video Form */}
              <div className="border border-gray-border rounded-2xl p-4 space-y-3 bg-gray-bg/30">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-dark">Add Video Testimonial</h4>
                <input
                  type="text"
                  placeholder="Video Title / Traveller Name *"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className={inputCls}
                />
                <input
                  type="text"
                  placeholder="Cloudinary / YouTube Video URL *"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className={inputCls}
                />
                
                <div className="flex items-center gap-3">
                  {videoThumbnail ? (
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-gray-border shrink-0">
                      <Image src={videoThumbnail} alt="thumb" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setVideoThumbnail("")}
                        className="absolute top-0.5 right-0.5 bg-black/60 p-0.5 rounded-full text-white cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-20 h-14 rounded-lg border-2 border-dashed border-gray-border bg-gray-bg flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all shrink-0">
                      <Upload className="w-3.5 h-3.5 text-gray-light" />
                      <span className="text-[9px] text-gray-light mt-0.5">{uploadingVideoThumb ? "..." : "Thumbnail"}</span>
                      <input type="file" accept="image/*" onChange={handleVideoThumbUpload} disabled={uploadingVideoThumb} className="hidden" />
                    </label>
                  )}
                  <span className="text-[10px] text-gray-light font-semibold">Upload an optional cover thumbnail for player card</span>
                </div>

                <button
                  onClick={handleAddVideo}
                  disabled={savingVideo}
                  className="w-full bg-purple-50 hover:bg-purple-600 text-white font-bold text-xs uppercase tracking-wide py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{savingVideo ? "Saving..." : "Add Video"}</span>
                </button>
              </div>

              {/* Video list */}
              <div className="space-y-3">
                {packageVideos.map((v: any) => (
                  <div key={v.id || v._id} className="bg-white border border-gray-border rounded-xl p-3 flex items-center gap-3 group">
                    {v.thumbnail ? (
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-gray-border shrink-0 bg-gray-bg">
                        <Image src={v.thumbnail} alt={v.customerName} fill className="object-cover" />
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
                      <p className="text-xs font-bold text-black truncate">{v.customerName}</p>
                      <p className="text-[10px] text-gray-light truncate">{v.videoUrl}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm("Delete this video testimonial?")) deleteVideoMutation.mutate(v.id || v._id);
                      }}
                      className="p-1.5 border border-gray-border hover:border-red-500 text-gray-light hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {packageVideos.length === 0 && (
                  <p className="text-center text-xs text-gray-light italic py-8">No videos added yet for this trail.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
