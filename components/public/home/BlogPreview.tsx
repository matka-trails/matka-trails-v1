"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUiStore } from "@/stores/uiStore";
import { Sparkles, Calendar, BookOpen, MoveRight } from "lucide-react";
import { publicApi, PublicBlog } from "@/lib/api";
import { cn, formatDate, getOptimizedImageUrl } from "@/lib/utils";

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const { openBookingModal } = useUiStore();

  useEffect(() => {
    publicApi
      .getBlogs({ limit: 9 })
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((b) => ({
            id: b.id,
            title: b.title,
            slug: b.slug,
            coverImage: b.coverImage || "",
            createdAt: b.createdAt,
            tags: b.tags || ["Stories"],
          }));
          setBlogs(mapped);
        }
      })
      .catch((err) => console.log("Failed to fetch preview blogs", err));
  }, []);

  if (blogs.length === 0) {
    return (
      /* ── SECTION B: FINAL CTA BANNER (rendered even when no blogs) ── */
      <section className="bg-[#111111] text-white py-24 px-6 lg:px-12 relative overflow-hidden z-10 border-t border-white/5">
        <div className="absolute inset-0 opacity-4 pointer-events-none flex items-center justify-center">
          <svg className="w-full h-full max-w-4xl" viewBox="0 0 1000 400" fill="none">
            <path
              d="M 0 100 Q 250 200 500 100 T 1000 100"
              stroke="#ff6600"
              strokeWidth="4"
              fill="none"
              strokeDasharray="20 20"
            />
            <path
              d="M 0 250 Q 250 350 500 250 T 1000 250"
              stroke="#ff6600"
              strokeWidth="4"
              fill="none"
              strokeDasharray="20 20"
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JOIN THE DEPARTURE LIST</span>
          </span>
          <h2 className="font-reminder text-4xl md:text-6xl text-white leading-tight tracking-wide capitalize pb-2">
            Your Next Weekend <br />
            Trail Starts <span className="marker-zigzag text-primary">Here</span>
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-lg mx-auto leading-relaxed font-semibold">
            Reserve slots early. Groups are finalized on a rolling basis depending on age metrics, adventure quotients, and preferences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => openBookingModal()}
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-wide uppercase px-8 py-4 rounded-xl shadow-orange transition-all cursor-pointer"
            >
              Find Your Group
            </button>
            <Link
              href="/packages"
              className="w-full sm:w-auto border border-white/20 hover:border-white text-white font-bold text-sm tracking-wide uppercase px-8 py-4 rounded-xl transition-all"
            >
              Browse All Trails
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="w-full">
      {/* ── SECTION A: BLOG PREVIEWS ── */}
      <section className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FROM THE TRAILS</span>
              </span>
              <h2 className="font-reminder text-4xl md:text-5xl text-black leading-none tracking-wide capitalize pb-2">
                Stories and <span className="marker-zigzag text-primary">Travel Hacks</span>
              </h2>
            </div>
            <div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-dark group"
              >
                <span>Read All Stories</span>
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Blogs Grid - 3×3 up to 9 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {blogs.slice(0, 9).map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group flex flex-col bg-white border border-gray-border hover:border-primary/20 hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Image */}
                <div className="h-[180px] relative overflow-hidden bg-gray-bg shrink-0">
                  {blog.coverImage && (
                    <Image
                      src={getOptimizedImageUrl(blog.coverImage, 600)}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#111111]/80 backdrop-blur-sm text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded">
                      {blog.tags[0]}
                    </span>
                  </div>
                </div>

                {/* Body info */}
                <div className="p-5 flex flex-col justify-between gap-3 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-[10px] text-gray-light font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{formatDate(blog.createdAt)}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        <span>6 Min Read</span>
                      </span>
                    </div>

                    <h3 className="font-sans font-extrabold text-sm lg:text-base text-black group-hover:text-primary transition-colors leading-snug line-clamp-3">
                      {blog.title}
                    </h3>
                  </div>

                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 mt-auto pt-2">
                    <span>Read Article</span>
                    <MoveRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Articles Button */}
          <div className="flex justify-center pt-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-primary hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>View All Articles</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION B: FINAL CTA BANNER ── */}
      <section className="bg-[#111111] text-white py-24 px-6 lg:px-12 relative overflow-hidden z-10 border-t border-white/5">
        <div className="absolute inset-0 opacity-4 pointer-events-none flex items-center justify-center">
          <svg className="w-full h-full max-w-4xl" viewBox="0 0 1000 400" fill="none">
            <path
              d="M 0 100 Q 250 200 500 100 T 1000 100"
              stroke="#ff6600"
              strokeWidth="4"
              fill="none"
              strokeDasharray="20 20"
            />
            <path
              d="M 0 250 Q 250 350 500 250 T 1000 250"
              stroke="#ff6600"
              strokeWidth="4"
              fill="none"
              strokeDasharray="20 20"
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JOIN THE DEPARTURE LIST</span>
          </span>
          <h2 className="font-sans font-black italic text-4xl md:text-6xl text-white uppercase leading-none tracking-tight">
            Your next weekend <br />
            trail starts <span className="text-primary italic">here.</span>
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-lg mx-auto leading-relaxed font-semibold">
            Reserve slots early. Groups are finalized on a rolling basis depending on age metrics, adventure quotients, and preferences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => openBookingModal()}
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-wide uppercase px-8 py-4 rounded-xl shadow-orange transition-all cursor-pointer"
            >
              Find Your Group
            </button>
            <Link
              href="/packages"
              className="w-full sm:w-auto border border-white/20 hover:border-white text-white font-bold text-sm tracking-wide uppercase px-8 py-4 rounded-xl transition-all"
            >
              Browse All Trails
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
