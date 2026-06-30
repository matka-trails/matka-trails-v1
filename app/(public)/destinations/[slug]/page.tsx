import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { publicApi } from "@/lib/api";
import { getOptimizedImageUrl } from "@/lib/utils";
import { Compass, Sparkles, MapPin } from "lucide-react";
import PackageCard from "@/components/public/packages/PackageCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const destination = await publicApi.getDestinationBySlug(slug);
    return {
      title: `${destination.name} Trips & Weekend Treks — Matka Trails`,
      description: destination.description || `Browse group trekking packages for ${destination.name}. Lock your slots and join a verified dynamic travel group.`,
    };
  } catch {
    return { title: "Destination Not Found" };
  }
}

async function getDestinationData(slug: string) {
  try {
    return await publicApi.getDestinationBySlug(slug);
  } catch (error) {
    console.error("Failed to fetch destination:", error);
    return null;
  }
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = await getDestinationData(slug);

  if (!destination) {
    notFound();
  }

  // Convert schema packages to publicAPI format compatibility
  const mappedPackages = (destination.packages || []).map((pkg) => ({
    ...pkg,
    destination: destination,
    itinerary: [],
    reviews: [],
    testimonials: [],
    faqs: [],
  }));

  return (
    <div className="w-full bg-gray-bg min-h-screen pb-24">
      {/* Header Banner */}
      <div className="relative w-full h-[320px] bg-black overflow-hidden flex items-end pb-8">
        {/* Background Image */}
        {destination.coverImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={getOptimizedImageUrl(destination.coverImage, 1920)}
              alt={destination.name}
              fill
              className="object-cover opacity-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        )}

        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="space-y-2 text-white">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>TERRITORY VIEW</span>
            </span>
            <h1 className="font-sans font-black italic text-4xl lg:text-5xl uppercase leading-none tracking-tight">
              {destination.name}
            </h1>
            <div className="flex items-center gap-1 text-xs font-semibold text-white/70">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>{mappedPackages.length} Published Trails</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left main: summary and packages */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Description */}
          <div className="space-y-4">
            <h3 className="font-sans font-extrabold text-lg text-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              <span>About the region</span>
            </h3>
            <p className="text-xs md:text-sm text-gray-dark leading-relaxed font-semibold">
              {destination.description || "Explore this stunning destination and book curated weekend itineraries with our captains."}
            </p>
          </div>

          {/* List of packages */}
          <div className="space-y-6">
            <h3 className="font-sans font-extrabold text-lg text-black flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              <span>Available Trails in this Region</span>
            </h3>

            {mappedPackages.length === 0 ? (
              <div className="text-center py-12 bg-white border border-gray-border rounded-2xl">
                <p className="text-xs text-gray-light font-semibold italic">No package trips published for this destination yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mappedPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg as any} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right main: Region gallery */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-border rounded-2xl p-6 space-y-4">
            <h4 className="font-sans font-bold text-sm text-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span>Territory Gallery</span>
            </h4>
            
            {!destination.gallery || destination.gallery.length === 0 ? (
              <p className="text-xs text-gray-light font-medium italic">No gallery photos added yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {destination.gallery.map((item: any) => (
                  <div
                    key={item.id}
                    className="relative h-[80px] rounded-lg overflow-hidden border border-gray-border bg-gray-bg"
                  >
                    <Image
                      src={getOptimizedImageUrl(item.imageUrl, 200)}
                      alt={item.caption || "Gallery"}
                      fill
                      className="object-cover hover:scale-102 transition-transform"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
