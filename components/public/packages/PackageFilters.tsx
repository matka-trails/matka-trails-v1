"use client";

import { useEffect, useState } from "react";
import { useUiStore } from "@/stores/uiStore";
import { publicApi, PublicDestination } from "@/lib/api";
import { Search, SlidersHorizontal, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PackageFilters() {
  const { filters, setFilter, resetFilters } = useUiStore();
  const [destinations, setDestinations] = useState<PublicDestination[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    publicApi
      .getDestinations()
      .then((data) => setDestinations(data))
      .catch((err) => console.error("Filter destinations loading error", err));
  }, []);

  const hasActiveFilters =
    filters.destinationId ||
    filters.durationDays ||
    filters.groupType ||
    filters.search ||
    filters.maxPrice < 50000;

  return (
    <div className="w-full bg-white border border-gray-border rounded-2xl p-5 shadow-card space-y-4">
      {/* Search & Main Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-gray-light" />
          <input
            type="text"
            placeholder="Search by trail name, locations, keywords..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilter("search", "")}
              className="absolute right-4 top-3.5 text-gray-light hover:text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "flex items-center justify-center gap-2 px-5 py-3 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full md:w-auto",
              showAdvanced
                ? "border-primary bg-primary-light text-primary"
                : "border-gray-border bg-white text-gray-dark hover:bg-gray-bg"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-1.5 px-4 py-3 bg-gray-bg border border-gray-border hover:bg-gray-border text-foreground hover:text-primary rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Expand Panel */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-border animate-fadeIn">
          {/* Destination Selector */}
          <div>
            <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
              Territory Destination
            </label>
            <select
              value={filters.destinationId}
              onChange={(e) => setFilter("destinationId", e.target.value)}
              className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
            >
              <option value="">All Destinations</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Group Type */}
          <div>
            <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
              Group Travel Format
            </label>
            <select
              value={filters.groupType}
              onChange={(e) => setFilter("groupType", e.target.value)}
              className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
            >
              <option value="">All Formats</option>
              <option value="SOLO_GROUP">Solo Group (matched cohorts)</option>
              <option value="CORPORATE">Corporate Outing</option>
              <option value="CUSTOM">Custom Group</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div>
            <label className="block text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
              Sort Sequence
            </label>
            <select
              value={filters.sort}
              onChange={(e) => setFilter("sort", e.target.value)}
              className="w-full px-4 py-3 bg-gray-bg border border-gray-border rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
            >
              <option value="newest">Newest departures</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration length</option>
            </select>
          </div>

          {/* Max budget selection slider */}
          <div>
            <div className="flex justify-between text-[10px] font-bold text-gray-dark uppercase tracking-wider mb-2">
              <span>Max Budget</span>
              <span className="text-primary font-extrabold font-sans">
                ₹{filters.maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={3000}
              max={50000}
              step={1000}
              value={filters.maxPrice}
              onChange={(e) => setFilter("maxPrice", Number(e.target.value))}
              className="w-full accent-primary h-2 bg-gray-bg rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Filter chips overview */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 items-center">
          <span className="text-[10px] text-gray-light font-bold uppercase tracking-wider">
            Active Filter chips:
          </span>
          {filters.destinationId && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-dark bg-gray-bg border border-gray-border px-2.5 py-1 rounded-md">
              <span>
                {destinations.find((d) => d.id === filters.destinationId)?.name || "Destination"}
              </span>
              <button onClick={() => setFilter("destinationId", "")}>
                <X className="w-3 h-3 hover:text-primary" />
              </button>
            </span>
          )}
          {filters.groupType && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-dark bg-gray-bg border border-gray-border px-2.5 py-1 rounded-md">
              <span>{filters.groupType}</span>
              <button onClick={() => setFilter("groupType", "")}>
                <X className="w-3 h-3 hover:text-primary" />
              </button>
            </span>
          )}
          {filters.maxPrice < 50000 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-dark bg-gray-bg border border-gray-border px-2.5 py-1 rounded-md">
              <span>&lt; ₹{filters.maxPrice.toLocaleString()}</span>
              <button onClick={() => setFilter("maxPrice", 50000)}>
                <X className="w-3 h-3 hover:text-primary" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
