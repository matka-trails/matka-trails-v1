"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getOptimizedImageUrl } from "@/lib/utils";
import { ZoomIn } from "lucide-react";

interface PackageGalleryProps {
  images: string[];
}

export default function PackageGallery({ images }: PackageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full text-center py-10 bg-white border border-gray-border rounded-2xl">
        <p className="text-xs text-gray-light font-semibold italic">No gallery images uploaded for this trail.</p>
      </div>
    );
  }

  const slides = images.map((img) => ({ src: img }));

  return (
    <div className="space-y-4">
      {/* Grid of gallery images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => {
              setIndex(idx);
              setOpen(true);
            }}
            className="group relative h-[180px] md:h-[220px] rounded-2xl overflow-hidden border border-gray-border bg-gray-bg cursor-pointer shadow-card"
          >
            <Image
              src={getOptimizedImageUrl(img, 600)}
              alt="Trail gallery"
              fill
              className="object-cover group-hover:scale-103 transition-transform duration-500"
            />
            {/* Zoom overlay on hover */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ZoomIn className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
      />
    </div>
  );
}
