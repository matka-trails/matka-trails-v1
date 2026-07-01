"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { publicApi } from "@/lib/api";
import { MapPin, Compass, ArrowRight } from "lucide-react";

function DestinationShowcaseCard({
  dest,
  width = 180,
  height = 230,
}: {
  dest: any;
  width?: number;
  height?: number;
}) {
  return (
    <Link
      href={`/destinations/${dest.slug}`}
      className="group flex flex-col items-center space-y-3 cursor-pointer text-center"
    >
      {/* Card Image */}
      <div
        className="relative overflow-hidden bg-gray-bg border border-gray-border/60 rounded-3xl shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300"
        style={{ width, height }}
      >
        {dest.coverImage ? (
          <Image
            src={dest.coverImage}
            alt={dest.name}
            fill
            sizes="240px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Compass className="w-8 h-8 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

        {/* Count badge */}
        {dest.packageCount > 0 && (
          <div className="absolute top-3 right-3 bg-primary text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full">
            {dest.packageCount} trip{dest.packageCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Label underneath card */}
      <span className="font-sans font-extrabold text-sm text-gray-dark group-hover:text-primary transition-colors tracking-wide block">
        {dest.name}
      </span>
    </Link>
  );
}

export default function DestinationsShowcase() {
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    publicApi
      .getDestinations()
      .then((data) => setDestinations(data.slice(0, 6)))
      .catch((err) => console.error("Destinations fetch error", err));
  }, []);

  if (destinations.length === 0) return null;

  return (
    <section className="w-full py-10 md:py-20 overflow-hidden relative">
      {/* Background container with 0.6 opacity */}
      <div 
        className="absolute inset-0 bg-no-repeat bg-center pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: `url("https://res.cloudinary.com/afol8skx/image/upload/f_auto,q_auto/v1782819697/destinationbg_i7kvsl.png")`,
          backgroundSize: "100% 100%",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Responsive Staggered Layout */}
        {/* Desktop Staggered View */}
        <div className="hidden lg:flex items-start justify-center gap-6 xl:gap-8 px-4 py-8">
          
          {/* Left Side Group */}
          <div className="flex items-start gap-6 xl:gap-8">
            {/* Column 1 (Far Left): Card 1 (High) */}
            <div className="pt-8">
              {destinations[0] && (
                <DestinationShowcaseCard
                  dest={destinations[0]}
                  width={180}
                  height={230}
                />
              )}
            </div>

            {/* Column 2 (Inner Left): Card 2 (Lower) */}
            <div className="pt-28">
              {destinations[1] && (
                <DestinationShowcaseCard
                  dest={destinations[1]}
                  width={180}
                  height={230}
                />
              )}
            </div>
          </div>

          {/* Center Column: Header + 2 side-by-side cards below it */}
          <div className="flex flex-col items-center space-y-12 max-w-lg px-2 shrink-0">
            {/* Header */}
            <div className="text-center pb-2">
              <h2 className="font-reminder text-4xl lg:text-5xl text-black leading-none tracking-wide capitalize">
                Tour <span className="marker-zigzag text-primary">Categories</span>
              </h2>
            </div>
            
            {/* Center Cards (Side-by-Side) */}
            <div className="flex items-start gap-5">
              {destinations[2] && (
                <DestinationShowcaseCard
                  dest={destinations[2]}
                  width={180}
                  height={230}
                />
              )}
              {destinations[3] && (
                <DestinationShowcaseCard
                  dest={destinations[3]}
                  width={180}
                  height={230}
                />
              )}
            </div>
          </div>

          {/* Right Side Group */}
          <div className="flex items-start gap-6 xl:gap-8">
            {/* Column 4 (Inner Right): Card 5 (Lower) */}
            <div className="pt-28">
              {destinations[4] && (
                <DestinationShowcaseCard
                  dest={destinations[4]}
                  width={180}
                  height={230}
                />
              )}
            </div>

            {/* Column 5 (Far Right): Card 6 (High) */}
            <div className="pt-8">
              {destinations[5] && (
                <DestinationShowcaseCard
                  dest={destinations[5]}
                  width={180}
                  height={230}
                />
              )}
            </div>
          </div>

        </div>

        {/* Mobile/Tablet Fallback View */}
        <div className="lg:hidden space-y-12">
          {/* Mobile Header */}
          <div className="text-center pb-2">
            <h2 className="font-reminder text-4xl text-black leading-none tracking-wide capitalize">
              Tour <span className="marker-zigzag text-primary">Categories</span>
            </h2>
          </div>

          {/* Mobile Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {destinations.map((dest) => (
              <DestinationShowcaseCard
                key={dest.id || dest._id}
                dest={dest}
                width={170}
                height={210}
              />
            ))}
          </div>
        </div>

        {/* Explore more CTA */}
        <div className="flex justify-center mt-16 md:mt-24">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2.5 bg-black hover:bg-primary text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-orange group"
          >
            <MapPin className="w-4 h-4" />
            <span>Explore All Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
