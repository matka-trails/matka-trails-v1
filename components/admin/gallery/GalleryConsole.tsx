"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import {
  Camera,
  Video,
  Plus,
  Trash2,
  Upload,
  X,
  Compass,
  Check,
  MapPin,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function GalleryConsole() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"GALLERY" | "VIDEOS">("GALLERY");
  
  // Drawer states
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  // Photo form fields
  const [photoPlaceName, setPhotoPlaceName] = useState("");
  const [photoImage, setPhotoImage] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoSortOrder, setPhotoSortOrder] = useState(0);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);

  // Video form fields
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [videoSortOrder, setVideoSortOrder] = useState(0);
  const [uploadingVideoThumb, setUploadingVideoThumb] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);

  // Queries
  const { data: galleryItems = [], isLoading: loadingGallery } = useQuery({
    queryKey: ["admin-gallery-items"],
    queryFn: () => adminApi.getGalleryItems(),
  });

  const { data: videoTestimonials = [], isLoading: loadingVideos } = useQuery({
    queryKey: ["admin-video-testimonials"],
    queryFn: () => adminApi.getVideoTestimonials(),
  });

  // Mutations
  const createPhotoMutation = useMutation({
    mutationFn: (payload: any) => adminApi.createGalleryItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-items"] });
      toast.success("Photo added to gallery!");
      closePhotoDrawer();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add photo.");
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteGalleryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-items"] });
      toast.success("Photo deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete photo.");
    },
  });

  const createVideoMutation = useMutation({
    mutationFn: (payload: any) => adminApi.createVideoTestimonial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-video-testimonials"] });
      toast.success("Video testimonial added!");
      closeVideoDrawer();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add video.");
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteVideoTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-video-testimonials"] });
      toast.success("Video testimonial deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete video.");
    },
  });

  // Image Upload handlers
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const sigData = await adminApi.getUploadSignature("matka-trails/gallery");
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
        setPhotoImage(json.secure_url);
        toast.success("Photo uploaded successfully!");
      } else {
        toast.error("Failed to upload photo.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Photo upload connection failed.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleVideoThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideoThumb(true);
    try {
      const sigData = await adminApi.getUploadSignature("matka-trails/testimonials");
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
        setVideoThumbnail(json.secure_url);
        toast.success("Video thumbnail uploaded successfully!");
      } else {
        toast.error("Failed to upload thumbnail.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Thumbnail upload connection failed.");
    } finally {
      setUploadingVideoThumb(false);
    }
  };

  // Close Drawers
  const closePhotoDrawer = () => {
    setIsPhotoOpen(false);
    setPhotoPlaceName("");
    setPhotoImage("");
    setPhotoCaption("");
    setPhotoSortOrder(0);
  };

  const closeVideoDrawer = () => {
    setIsVideoOpen(false);
    setVideoTitle("");
    setVideoUrl("");
    setVideoThumbnail("");
    setVideoSortOrder(0);
  };

  // Form Submissions
  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoPlaceName.trim()) {
      toast.error("Place name is required");
      return;
    }
    if (!photoImage) {
      toast.error("Please upload a photo first");
      return;
    }

    setSavingPhoto(true);
    try {
      await createPhotoMutation.mutateAsync({
        placeName: photoPlaceName,
        imageUrl: photoImage,
        caption: photoCaption || null,
        sortOrder: Number(photoSortOrder),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      toast.error("Video title is required");
      return;
    }
    if (!videoUrl.trim()) {
      toast.error("Youtube URL is required");
      return;
    }

    setSavingVideo(true);
    try {
      await createVideoMutation.mutateAsync({
        title: videoTitle,
        videoUrl: videoUrl,
        thumbnail: videoThumbnail || null,
        sortOrder: Number(videoSortOrder),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingVideo(false);
    }
  };

  const handleDeletePhoto = (id: string, placeName: string) => {
    if (confirm(`Remove this photo of "${placeName}" from gallery?`)) {
      deletePhotoMutation.mutate(id);
    }
  };

  const handleDeleteVideo = (id: string, title: string) => {
    if (confirm(`Remove video testimonial "${title}"?`)) {
      deleteVideoMutation.mutate(id);
    }
  };

  // Extract YouTube video ID for preview thumbnail fallback
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="space-y-6 relative">
      {/* Tab bar & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("GALLERY")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap",
              activeTab === "GALLERY"
                ? "bg-[#111111] border-[#111111] text-white"
                : "bg-white border-gray-border text-gray-dark hover:bg-gray-bg/50"
            )}
          >
            <Camera className="w-4 h-4" />
            <span>Journey in Frames</span>
          </button>
          <button
            onClick={() => setActiveTab("VIDEOS")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap",
              activeTab === "VIDEOS"
                ? "bg-[#111111] border-[#111111] text-white"
                : "bg-white border-gray-border text-gray-dark hover:bg-gray-bg/50"
            )}
          >
            <Video className="w-4 h-4" />
            <span>Video Testimonials</span>
          </button>
        </div>

        {/* Dynamic add button */}
        {activeTab === "GALLERY" ? (
          <button
            onClick={() => setIsPhotoOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-5 py-3.5 rounded-xl shadow-orange transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add Photo</span>
          </button>
        ) : (
          <button
            onClick={() => setIsVideoOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wide px-5 py-3.5 rounded-xl shadow-orange transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add Video Testimonial</span>
          </button>
        )}
      </div>

      {/* GALLERY PANEL VIEW */}
      {activeTab === "GALLERY" && (
        <div className="bg-white border border-gray-border rounded-2xl shadow-card p-6">
          {loadingGallery ? (
            <div className="text-center py-16 text-xs text-gray-light italic font-semibold">
              Loading gallery items...
            </div>
          ) : galleryItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {galleryItems.map((item: any) => (
                <div
                  key={item.id}
                  className="group relative bg-gray-bg border border-gray-border rounded-2xl overflow-hidden aspect-[3/4] shadow-card hover:border-primary/25 transition-all flex flex-col justify-end p-4 text-white"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.caption || item.placeName}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-300 z-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                  {/* Badge */}
                  <div className="relative z-20 space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider bg-primary text-white px-2.5 py-1 rounded-md shadow-orange">
                      <MapPin className="w-3 h-3 text-white" />
                      {item.placeName}
                    </span>
                    {item.caption && (
                      <p className="text-[10px] text-white/80 line-clamp-1 font-semibold pl-1.5">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  {/* Delete Button overlay */}
                  <button
                    onClick={() => handleDeletePhoto(item.id, item.placeName)}
                    className="absolute top-3 right-3 z-25 bg-black/60 hover:bg-red-600 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer inline-flex items-center justify-center border border-white/10"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-xs text-gray-light italic font-semibold">
              No gallery images found. Add a photo to display in "Journey in Frames".
            </div>
          )}
        </div>
      )}

      {/* VIDEOS PANEL VIEW */}
      {activeTab === "VIDEOS" && (
        <div className="bg-white border border-gray-border rounded-2xl shadow-card p-6">
          {loadingVideos ? (
            <div className="text-center py-16 text-xs text-gray-light italic font-semibold">
              Loading testimonials...
            </div>
          ) : videoTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videoTestimonials.map((video: any) => {
                const ytId = getYoutubeId(video.videoUrl);
                const thumb = video.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "");
                
                return (
                  <div
                    key={video.id}
                    className="group relative bg-gray-bg border border-gray-border rounded-2xl overflow-hidden shadow-card hover:border-primary/25 transition-all flex flex-col h-[280px]"
                  >
                    {/* Media thumbnail preview */}
                    <div className="relative h-[180px] w-full bg-black shrink-0 flex items-center justify-center">
                      {thumb ? (
                        <Image src={thumb} alt={video.title} fill className="object-cover opacity-80" />
                      ) : (
                        <Video className="w-12 h-12 text-white/30" />
                      )}
                      
                      {/* Play overlay button */}
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-orange hover:scale-105 transition-transform">
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                      </div>

                      {/* Delete Button overlay */}
                      <button
                        onClick={() => handleDeleteVideo(video.id, video.title)}
                        className="absolute top-3 right-3 z-25 bg-black/60 hover:bg-red-600 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer inline-flex items-center justify-center border border-white/10"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Meta Title */}
                    <div className="p-4 flex-1 flex flex-col justify-between bg-white border-t border-gray-border">
                      <h4 className="font-sans font-extrabold text-xs text-black line-clamp-2 leading-snug">
                        {video.title}
                      </h4>
                      <span className="text-[9px] font-bold text-gray-light uppercase tracking-wider block truncate mt-1">
                        URL: {video.videoUrl}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-xs text-gray-light italic font-semibold">
              No video testimonials found. Add a video to display on the home page.
            </div>
          )}
        </div>
      )}

      {/* DRAWERS PANEL RENDERING */}

      {/* ── Photo Drawer ── */}
      {isPhotoOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={closePhotoDrawer}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-float flex flex-col z-10 animate-slideOver">
            <div className="p-6 border-b border-gray-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                <h3 className="font-sans font-black italic text-lg text-black uppercase tracking-tight">
                  Add Journey Photo
                </h3>
              </div>
              <button
                onClick={closePhotoDrawer}
                className="p-1.5 border border-gray-border hover:border-black rounded-lg text-gray-dark hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Place Name */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Place Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhutan, Meghalaya, Spiti"
                  value={photoPlaceName}
                  onChange={(e) => setPhotoPlaceName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Photo File *
                </label>
                <div className="flex items-center gap-4">
                  {photoImage ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-border shrink-0 bg-gray-bg">
                      <Image src={photoImage} alt="Preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotoImage("")}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black p-1 rounded-full text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gray-bg border-2 border-dashed border-gray-border flex items-center justify-center shrink-0">
                      <Camera className="w-6 h-6 text-gray-light" />
                    </div>
                  )}

                  <label className="flex-1 flex flex-col items-center justify-center border border-gray-border hover:border-black rounded-xl p-6 cursor-pointer hover:bg-gray-bg/15 transition-all text-center">
                    <Upload className="w-5 h-5 text-gray-dark mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-dark">
                      {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paro Taktsang Hiking, Team bonding"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  min={0}
                  value={photoSortOrder}
                  onChange={(e) => setPhotoSortOrder(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white"
                />
              </div>
            </form>

            <div className="p-6 border-t border-gray-border bg-gray-bg flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closePhotoDrawer}
                className="bg-white border border-gray-border text-gray-dark font-semibold text-xs tracking-wide uppercase px-6 py-3 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                disabled={savingPhoto || uploadingPhoto}
                className="bg-primary hover:bg-primary-dark text-white font-bold text-xs tracking-wide uppercase px-8 py-3 rounded-xl shadow-orange cursor-pointer disabled:opacity-50"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Video Drawer ── */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={closeVideoDrawer}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-float flex flex-col z-10 animate-slideOver">
            <div className="p-6 border-b border-gray-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                <h3 className="font-sans font-black italic text-lg text-black uppercase tracking-tight">
                  Add Video Testimonial
                </h3>
              </div>
              <button
                onClick={closeVideoDrawer}
                className="p-1.5 border border-gray-border hover:border-black rounded-lg text-gray-dark hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Video Title */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Lanka Trip | WanderOn Reviews"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Youtube Video URL / Embed URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Video Thumbnail Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Custom Thumbnail (Optional, defaults to Youtube cover)
                </label>
                <div className="flex items-center gap-4">
                  {videoThumbnail ? (
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-gray-border shrink-0 bg-gray-bg">
                      <Image src={videoThumbnail} alt="Preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setVideoThumbnail("")}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black p-1 rounded-full text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-xl bg-gray-bg border-2 border-dashed border-gray-border flex items-center justify-center shrink-0">
                      <Video className="w-6 h-6 text-gray-light" />
                    </div>
                  )}

                  <label className="flex-1 flex flex-col items-center justify-center border border-gray-border hover:border-black rounded-xl p-4 cursor-pointer hover:bg-gray-bg/15 transition-all text-center">
                    <Upload className="w-5 h-5 text-gray-dark mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-dark">
                      {uploadingVideoThumb ? "Uploading..." : "Upload Thumbnail"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleVideoThumbUpload}
                      disabled={uploadingVideoThumb}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-bold text-gray-dark uppercase tracking-wider mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  min={0}
                  value={videoSortOrder}
                  onChange={(e) => setVideoSortOrder(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-bg border border-gray-border text-sm font-semibold transition-all focus:outline-none focus:bg-white"
                />
              </div>
            </form>

            <div className="p-6 border-t border-gray-border bg-gray-bg flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeVideoDrawer}
                className="bg-white border border-gray-border text-gray-dark font-semibold text-xs tracking-wide uppercase px-6 py-3 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveVideo}
                disabled={savingVideo || uploadingVideoThumb}
                className="bg-primary hover:bg-primary-dark text-white font-bold text-xs tracking-wide uppercase px-8 py-3 rounded-xl shadow-orange cursor-pointer disabled:opacity-50"
              >
                Save Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
