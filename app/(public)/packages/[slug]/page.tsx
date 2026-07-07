import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { publicApi } from "@/lib/api";
import { getOptimizedImageUrl, formatPrice } from "@/lib/utils";
import { Compass, Star, MapPin, Sparkles, AlertCircle, Share2 } from "lucide-react";
import ItineraryAccordion from "@/components/public/packages/ItineraryAccordion";
import InclusionsExclusions from "@/components/public/packages/InclusionsExclusions";
import PackageGallery from "@/components/public/packages/PackageGallery";
import ReviewCard from "@/components/public/packages/ReviewCard";
import BookingPanel from "@/components/public/packages/BookingPanel";
import FloatingBookCTA from "@/components/public/packages/FloatingBookCTA";
import QuickCallForm from "@/components/public/destinations/QuickCallForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── 1. SEO Dynamic Metadata ─────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const pkg = await publicApi.getPackageBySlug(slug);
    return {
      title: `${pkg.title} (${pkg.durationDays}D/${pkg.durationNights}N) — Matka Trails`,
      description: pkg.summary || `Join our group trek to ${pkg.title}. Book your slot, meet your dynamic cohort, and explore with our Captain.`,
      openGraph: {
        title: `${pkg.title} Trek — Matka Trails`,
        description: pkg.summary || `Trek to ${pkg.title}.`,
        images: pkg.coverImage ? [pkg.coverImage] : [],
      },
    };
  } catch {
    return { title: "Package Not Found" };
  }
}

// ─── 2. Fetch Helper ──────────────────────────────────
async function getPackageData(slug: string) {
  try {
    return await publicApi.getPackageBySlug(slug);
  } catch (error) {
    console.error("Failed to fetch package:", error);
    return null;
  }
}

// ─── 3. Detail Page Component ────────────────────────
export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getPackageData(slug);

  if (!pkg) {
    notFound();
  }

  // Calculate price parameters
  const originalPrice = pkg.priceOriginal;
  const discountedPrice = pkg.priceDiscounted;
  const priceToShow = discountedPrice || originalPrice;

  return (
    <div className="w-full bg-gray-bg min-h-screen pb-24">
      {/* ── Section A: Immersive Banner Hero ── */}
      <div className="relative w-full h-[380px] md:h-[460px] bg-black overflow-hidden flex items-end pb-10">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-neutral-900">
          {pkg.coverImage && (
            <Image
              src={getOptimizedImageUrl(pkg.coverImage, 1920)}
              alt={pkg.title}
              fill
              className="object-cover opacity-50"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        {/* Hero details overlay */}
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="space-y-3.5 text-white max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-primary text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-pill shadow-orange">
                {pkg.groupType}
              </span>
              <span className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold border border-white/10">
                <Compass className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{pkg.durationDays}D / {pkg.durationNights}N</span>
              </span>
            </div>

            <h1 className="font-sans font-black italic text-4xl md:text-5xl lg:text-6xl uppercase leading-none tracking-tight">
              {pkg.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/80">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{pkg.destination?.name} Territory</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary shrink-0" />
                <span>4.8 Rating</span>
                <span className="text-white/40">({pkg.reviews?.length || 0} approved reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section B: Main Details Grid (2 Columns) ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Descriptions, Tab Items, Itineraries (Spans 8 columns) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Package Overview */}
          <div className="space-y-4">
            <h3 className="font-sans font-extrabold text-lg text-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              <span>Trail Overview</span>
            </h3>
            <div className="text-xs md:text-sm text-gray-dark leading-relaxed font-semibold space-y-3">
              {pkg.description ? (
                pkg.description.split("\n").map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>No description set for this trail package.</p>
              )}
            </div>
          </div>

          {/* Dynamic Accordion Itinerary */}
          <div className="space-y-4">
            <h3 className="font-sans font-extrabold text-lg text-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              <span>Day-by-day Itinerary Trail</span>
            </h3>
            <ItineraryAccordion days={pkg.itinerary || []} />
          </div>

          {/* Inclusions & Exclusions */}
          <div className="space-y-4">
            <h3 className="font-sans font-extrabold text-lg text-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              <span>Inclusions & Policies</span>
            </h3>
            <InclusionsExclusions
              inclusions={pkg.inclusions || []}
              exclusions={pkg.exclusions || []}
            />
          </div>

          {/* Important Trail Notes */}
          {pkg.notes && (
            <div className="bg-primary-light border border-primary/20 rounded-2xl p-5 space-y-3">
              <h4 className="font-sans font-bold text-sm text-primary flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Important Trail Notes</span>
              </h4>
              <p className="text-xs text-primary/80 leading-relaxed font-semibold">
                {pkg.notes}
              </p>
            </div>
          )}

          {/* Photo Gallery */}
          {pkg.galleryImages && pkg.galleryImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-sans font-extrabold text-lg text-black flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                <span>Camp & Trail Gallery</span>
              </h3>
              <PackageGallery images={pkg.galleryImages} />
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            <h3 className="font-sans font-extrabold text-lg text-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              <span>Group Traveler Reviews</span>
            </h3>
            {pkg.reviews && pkg.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pkg.reviews.map((rev) => (
                  <ReviewCard key={rev.id} review={rev} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-light italic font-semibold">
                No reviews yet. Be the first to travel solo and leave feedback!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Sticky booking pane + Callback form (Desktop, Spans 4 columns) */}
        <div className="lg:col-span-4 space-y-8">
          <BookingPanel pkg={pkg as any} />
          <QuickCallForm
            packageId={pkg.id}
            defaultDestination={pkg.destination?.name || ""}
          />
        </div>
      </div>

      {/* Mobile Sticky bottom CTA bar */}
      <FloatingBookCTA pkg={pkg as any} />
    </div>
  );
}
