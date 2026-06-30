import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { publicApi } from "@/lib/api";
import { getOptimizedImageUrl } from "@/lib/utils";
import { Compass, MoveRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Explore Treks by Territories — Matka Trails",
  description: "Browse destinations including Kedarnath, Rishikesh, and Manali. Select your territory to find structured weekend packages.",
};

async function getDestinations() {
  try {
    return await publicApi.getDestinations();
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    return [];
  }
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="w-full bg-gray-bg min-h-screen pb-24">
      {/* Header Banner */}
      <div className="relative w-full h-[240px] bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 overflow-hidden flex items-center border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="space-y-2 text-white">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>TERRITORY DIRECTORY</span>
            </span>
            <h1 className="font-sans font-black italic text-4xl lg:text-5xl uppercase leading-none tracking-tight">
              Explore <span className="text-primary italic">Territories.</span>
            </h1>
            <p className="text-xs lg:text-sm text-white/60 leading-relaxed font-semibold max-w-md">
              Find trails grouped by regions. From spiritual high altitude treks to river camping and rafting weekenders.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 space-y-8">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <h2 className="text-xs font-bold text-gray-dark uppercase tracking-widest leading-none">
            All Available Regions ({destinations.length})
          </h2>
        </div>

        {destinations.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-border rounded-2xl">
            <Compass className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-xs text-gray-light font-semibold italic">No destinations seeded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {destinations.map((d) => {
              const packageCount = d._count?.packages ?? d.packageCount ?? 0;
              return (
                <Link
                  key={d.id}
                  href={`/destinations/${d.slug}`}
                  className="group relative rounded-2xl overflow-hidden border border-gray-border shadow-card bg-gray-bg h-[240px] md:h-[280px]"
                >
                  {/* Background image */}
                  {d.coverImage && (
                    <Image
                      src={getOptimizedImageUrl(d.coverImage, 800)}
                      alt={d.name}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  )}

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-primary/60 transition-colors duration-300" />

                  {/* Info Text overlays */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between z-10 text-white">
                    <div>
                      <h3 className="font-sans font-extrabold text-xl uppercase leading-none truncate max-w-[200px]">
                        {d.name}
                      </h3>
                      <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block mt-1">
                        {packageCount} {packageCount === 1 ? "trail" : "trails"} available
                      </span>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-white flex items-center justify-center text-white group-hover:text-primary transition-all">
                      <MoveRight className="w-4.5 h-4.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
