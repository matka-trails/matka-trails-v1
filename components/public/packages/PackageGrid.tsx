"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUiStore } from "@/stores/uiStore";
import { publicApi } from "@/lib/api";
import PackageCard from "./PackageCard";
import { Frown, Compass } from "lucide-react";

export default function PackageGrid() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-packages"],
    queryFn: () => publicApi.getPackages(),
  });

  const packages = data?.packages || [];

  if (isLoading) {
    return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[460px] bg-white border border-gray-border rounded-2xl p-5 space-y-4 animate-pulse">
            <div className="h-[240px] bg-gray-bg rounded-xl animate-shimmer" />
            <div className="h-5 bg-gray-bg rounded w-3/4 animate-shimmer" />
            <div className="h-4 bg-gray-bg rounded w-1/2 animate-shimmer" />
            <div className="h-10 bg-gray-bg rounded w-full animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-16 bg-white border border-gray-border rounded-2xl">
        <Frown className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-sans font-extrabold text-lg text-black mb-1">
          Something went wrong
        </h3>
        <p className="text-xs text-gray-light font-semibold">
          Failed to load package details. Please check your internet connection and try again.
        </p>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="w-full text-center py-20 bg-white border border-gray-border rounded-2xl max-w-md mx-auto space-y-4 shadow-card">
        <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary mx-auto">
          <Compass className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-sans font-extrabold text-base text-black">
            No Trails Match Your Search
          </h3>
          <p className="text-xs text-gray-mid font-semibold max-w-[280px] mx-auto leading-relaxed">
            Try adjusting your price filters, category terms or destination dropdown options to see other hikes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="cursor-pointer"
          onClick={() => router.push(`/packages/${pkg.slug}`)}
        >
          <PackageCard pkg={pkg} />
        </div>
      ))}
    </div>
  );
}
