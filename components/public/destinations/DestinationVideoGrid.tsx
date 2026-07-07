"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoItem {
  title: string;
  videoUrl: string;
  thumbnail?: string | null;
}

function getEmbedUrl(url: string) {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;
  let videoId = "";
  if (url.includes("youtube.com/watch")) {
    const params = new URLSearchParams(new URL(url).search);
    videoId = params.get("v") || "";
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
}

export default function DestinationVideoGrid({
  testimonials,
}: {
  testimonials: VideoItem[];
}) {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <>
      {/* Video list card */}
      <div className="bg-white border border-gray-border rounded-2xl overflow-hidden shadow-card">
        {/* Header */}
        <div className="p-4 border-b border-gray-border flex items-center gap-2">
          <Play className="w-4 h-4 text-primary fill-primary" />
          <span className="text-xs font-black text-black uppercase tracking-wider">
            Traveller Stories
          </span>
        </div>

        {/* Video rows */}
        <div className="divide-y divide-gray-border">
          {testimonials.slice(0, 4).map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveUrl(t.videoUrl)}
              className="w-full flex items-center gap-3 p-3.5 hover:bg-gray-bg/50 transition-colors text-left group"
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-11 rounded-xl overflow-hidden bg-neutral-900 border border-gray-border shrink-0">
                {t.thumbnail ? (
                  <Image
                    src={t.thumbnail}
                    alt={t.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/15 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-primary/90 flex items-center justify-center shadow-sm">
                    <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <p className="text-xs font-bold text-black leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {t.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen modal player */}
      <AnimatePresence>
        {activeUrl && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveUrl(null)}
          >
            <motion.div
              className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={getEmbedUrl(activeUrl)}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              />
              <button
                onClick={() => setActiveUrl(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/90 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
