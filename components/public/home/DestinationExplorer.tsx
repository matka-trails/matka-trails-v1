"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Clock, MapPin, Star, Sparkles, Frown } from "lucide-react";
import { publicApi, PublicDestination, PublicPackage } from "@/lib/api";
import { getOptimizedImageUrl, formatPrice } from "@/lib/utils";
import PackageCard from "@/components/public/packages/PackageCard";

// ─── "New Launches" virtual id ────────────────────────────────────────────────
const NEW_LAUNCHES_ID = "__new_launches__";

interface DestinationCircle {
  id: string;
  name: string;
  slug?: string;
  coverImage?: string | null;
  isNewLaunches?: boolean;
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="w-full bg-neutral-900 rounded-3xl overflow-hidden border border-white/5 flex flex-col h-[240px] sm:h-[320px] md:h-[420px] shadow-lg animate-pulse relative p-4 justify-between"
    >
      {/* Top badges shimmer */}
      <div className="flex justify-between items-start">
        <div className="shimmer-bg h-5 w-12 rounded-full bg-neutral-800" />
        <div className="shimmer-bg h-5 w-20 rounded-full bg-neutral-800" />
      </div>
      
      {/* Bottom text shimmer */}
      <div className="space-y-2 w-full">
        {/* Inclusion bar */}
        <div className="shimmer-bg h-5 w-full rounded-lg bg-neutral-800" />
        {/* Title */}
        <div className="shimmer-bg h-6 w-5/6 rounded-md bg-neutral-800" />
        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-neutral-800">
          <div className="shimmer-bg h-3.5 w-3/4 rounded bg-neutral-800" />
          <div className="shimmer-bg h-3.5 w-3/4 rounded bg-neutral-800" />
          <div className="shimmer-bg h-3.5 w-full rounded bg-neutral-800 col-span-2" />
        </div>
      </div>
    </div>
  );
}

// ─── Smart package grid (centered, 1→1col/centered, 2→2col, 3→3col, 4→4col) ──
function PackageGrid({ packages, loading }: { packages: PublicPackage[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 justify-center">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const count = packages.length;

  // Mobile always 2-column grid; desktop adapts to count
  const desktopColClass =
    count === 1
      ? "lg:grid-cols-1 lg:max-w-xs"
      : count === 2
      ? "lg:grid-cols-2 lg:max-w-xl"
      : count === 3
      ? "lg:grid-cols-3 lg:max-w-3xl"
      : "lg:grid-cols-4";

  return (
    <div className={`grid grid-cols-2 ${desktopColClass} gap-3 lg:gap-4 mx-auto w-full`}>
      {packages.map((pkg) => (
        <Link key={pkg.id} href={`/packages/${pkg.slug}`} className="block">
          <PackageCard pkg={pkg} />
        </Link>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DestinationExplorer() {
  const [destinations, setDestinations] = useState<PublicDestination[]>([]);
  const [selected, setSelected] = useState<DestinationCircle | null>(null);
  const [packages, setPackages] = useState<PublicPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    publicApi
      .getDestinations()
      .then((res) => {
        const withPackages = res.filter((d) => (d.packageCount || 0) > 0);
        setDestinations(withPackages);
        if (withPackages.length > 0) {
          const first = withPackages[0];
          setSelected({
            id: first.id,
            name: first.name,
            slug: first.slug,
            coverImage: first.coverImage,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Fetch packages on selection change
  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setPackages([]);

    const go = async () => {
      try {
        if (selected.slug) {
          const res = await publicApi.getPackages({
            destination: selected.slug,
            status: "PUBLISHED",
            limit: 4,
          });
          setPackages(res.packages);
        }
      } catch {
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    go();
  }, [selected?.id]);

  const allCircles: DestinationCircle[] = destinations.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    coverImage: d.coverImage,
  }));

  const viewAllHref = selected?.slug
    ? `/packages?destination=${selected.slug}`
    : "/packages";

  return (
    <section className="w-full bg-white py-5 lg:py-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Circles Row — wrapped in a stylized, centered capsule container ── */}
        <div className="px-5 lg:px-8 max-w-5xl mx-auto mb-6">
          <div className="w-fit max-w-full mx-auto bg-gradient-to-r from-orange-50/30 via-white to-orange-50/30 border border-orange-100/80 shadow-[0_4px_25px_rgba(255,102,0,0.04)] rounded-[3rem] px-8 py-4 flex items-center justify-center">
            <div
              ref={scrollRef}
              className="flex justify-start lg:justify-center gap-5 lg:gap-7 overflow-x-auto w-full scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {allCircles.map((circle) => {
                const isActive = selected?.id === circle.id;

                return (
                  <button
                    key={circle.id}
                    onClick={() => setSelected(circle)}
                    className="flex flex-col items-center gap-2 shrink-0 group"
                  >
                    {/* Ring + Circle */}
                    <div
                      className="relative rounded-full p-[3px] transition-all duration-300"
                      style={{
                        width: "68px",
                        height: "68px",
                        background: isActive
                          ? "linear-gradient(135deg, #ff6600, #ff9500)"
                          : "linear-gradient(135deg, #e5e7eb, #d1d5db)",
                      }}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        {circle.coverImage ? (
                          <Image
                            src={getOptimizedImageUrl(circle.coverImage, 150) || circle.coverImage}
                            alt={circle.name}
                            width={68}
                            height={68}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-light to-cream-bg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary/60" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <span
                      className={`text-[11px] font-bold text-center leading-tight max-w-[72px] truncate transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-gray-500 group-hover:text-gray-800"
                      }`}
                    >
                      {circle.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Packages section ── */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="mt-5 px-5 lg:px-8"
            >
              {/* Empty state */}
              {!loading && packages.length === 0 && (
                <div className="py-10 flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center">
                    <Frown className="w-7 h-7 text-primary/60" />
                  </div>
                  <p className="text-gray-500 text-sm font-semibold max-w-xs">
                    {`No trips available for ${selected.name} yet — launching soon! 🚀`}
                  </p>
                  <Link
                    href="/destinations"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors mt-1"
                  >
                    Explore More Destinations
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Package grid */}
              {(loading || packages.length > 0) && (
                <>
                  <PackageGrid packages={packages} loading={loading} />

                  {/* View All button — only when packages exist */}
                  {!loading && packages.length > 0 && (
                    <div className="flex justify-center mt-6">
                      <Link
                        href={viewAllHref}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-full shadow-orange transition-all duration-200 hover:-translate-y-0.5"
                      >
                        View All →
                      </Link>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
