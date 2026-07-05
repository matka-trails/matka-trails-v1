"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Clock, MapPin, Star, Sparkles, Frown } from "lucide-react";
import { publicApi, PublicDestination, PublicPackage } from "@/lib/api";
import { getOptimizedImageUrl, formatPrice } from "@/lib/utils";

// ─── "New Launches" virtual id ────────────────────────────────────────────────
const NEW_LAUNCHES_ID = "__new_launches__";

interface DestinationCircle {
  id: string;
  name: string;
  slug?: string;
  coverImage?: string | null;
  isNewLaunches?: boolean;
}

// ─── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({ pkg }: { pkg: PublicPackage }) {
  const discount =
    pkg.priceDiscounted && pkg.priceOriginal > pkg.priceDiscounted
      ? Math.round(((pkg.priceOriginal - pkg.priceDiscounted) / pkg.priceOriginal) * 100)
      : null;

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {pkg.coverImage ? (
          <Image
            src={getOptimizedImageUrl(pkg.coverImage, 600) || pkg.coverImage}
            alt={pkg.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 300px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-light to-cream-bg flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* Discount */}
        {discount && (
          <div className="absolute top-2.5 right-2.5 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow">
            {discount}% OFF
          </div>
        )}

        {/* Duration */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          <Clock className="w-3 h-3" />
          {pkg.durationNights}N/{pkg.durationDays}D
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 flex-1 flex flex-col gap-1.5">
        <h3 className="font-bold text-sm text-black leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {pkg.title}
        </h3>

        <div className="mt-auto flex items-end justify-between">
          <div>
            {pkg.priceDiscounted ? (
              <>
                <div className="text-[11px] text-gray-light line-through">
                  {formatPrice(pkg.priceOriginal)}
                </div>
                <div className="text-base font-black text-primary">
                  {formatPrice(pkg.priceDiscounted)}
                </div>
              </>
            ) : (
              <div className="text-base font-black text-primary">
                {formatPrice(pkg.priceOriginal)}
              </div>
            )}
            <div className="text-[10px] text-gray-light font-medium">per person</div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
            <Star className="w-3 h-3 fill-amber-500" />
            <span>4.8</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-card">
      <div className="w-full shimmer-bg" style={{ aspectRatio: "4/3" }} />
      <div className="p-3.5 space-y-2">
        <div className="h-4 shimmer-bg rounded w-3/4" />
        <div className="h-4 shimmer-bg rounded w-1/2" />
        <div className="h-5 shimmer-bg rounded w-1/3 mt-2" />
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
        <PackageCard key={pkg.id} pkg={pkg} />
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

  // 7 days ago
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  useEffect(() => {
    publicApi
      .getDestinations()
      .then(setDestinations)
      .catch(() => {});
  }, []);

  // Default: select "New Launches"
  useEffect(() => {
    setSelected({ id: NEW_LAUNCHES_ID, name: "New Launches", isNewLaunches: true });
  }, []);

  // Fetch packages on selection change
  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setPackages([]);

    const go = async () => {
      try {
        if (selected.id === NEW_LAUNCHES_ID) {
          const res = await publicApi.getPackages({
            status: "PUBLISHED",
            sort: "newest",
            limit: 20,
          });
          const recent = res.packages.filter(
            (p) => new Date(p.createdAt).toISOString() >= sevenDaysAgo
          );
          setPackages(recent.slice(0, 4));
        } else if (selected.slug) {
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

  const allCircles: DestinationCircle[] = [
    { id: NEW_LAUNCHES_ID, name: "New Launches", isNewLaunches: true },
    ...destinations.map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      coverImage: d.coverImage,
    })),
  ];

  const viewAllHref =
    selected?.id === NEW_LAUNCHES_ID
      ? "/packages?sort=newest"
      : selected?.slug
      ? `/packages?destination=${selected.slug}`
      : "/packages";

  const isNewLaunches = selected?.id === NEW_LAUNCHES_ID;

  return (
    <section className="w-full bg-white py-5 lg:py-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Circles Row — wrapped in a stylized, centered capsule container ── */}
        <div className="px-5 lg:px-8 max-w-5xl mx-auto mb-6">
          <div className="bg-white border border-gray-100 shadow-md rounded-[3rem] px-5 py-4 flex items-center justify-center">
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
                          ? circle.isNewLaunches
                            ? "linear-gradient(135deg, #22c55e, #16a34a)"
                            : "linear-gradient(135deg, #ff6600, #ff9500)"
                          : "linear-gradient(135deg, #e5e7eb, #d1d5db)",
                      }}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        {circle.isNewLaunches ? (
                          <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-green-500" />
                          </div>
                        ) : circle.coverImage ? (
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
                          ? circle.isNewLaunches
                            ? "text-green-600"
                            : "text-primary"
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
              {/* Section header — Only shows View All button on top right, no destination name */}
              <div className="flex justify-end mb-4">
                <Link
                  href={viewAllHref}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                >
                  View All
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Empty state */}
              {!loading && packages.length === 0 && (
                <div className="py-10 flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center">
                    <Frown className="w-7 h-7 text-primary/60" />
                  </div>
                  <p className="text-gray-500 text-sm font-semibold max-w-xs">
                    {isNewLaunches
                      ? "No new packages launched in the last 7 days — check back soon!"
                      : `No trips available for ${selected.name} yet — launching soon! 🚀`}
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
