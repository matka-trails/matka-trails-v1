"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/lib/utils";

interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string | null;
  images: string[];
}

interface ItineraryAccordionProps {
  days: ItineraryDay[];
}

export default function ItineraryAccordion({ days }: ItineraryAccordionProps) {
  // All days expanded by default on first load
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>(
    days.reduce((acc, day) => ({ ...acc, [day.id]: true }), {})
  );

  const toggleDay = (id: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sortedDays = [...days].sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <div className="space-y-4">
      {sortedDays.map((day) => {
        const isExpanded = expandedDays[day.id];
        return (
          <div
            key={day.id}
            className="bg-white border border-gray-border rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-200"
          >
            {/* Header: Clickable Bar */}
            <button
              onClick={() => toggleDay(day.id)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer hover:bg-gray-bg/35 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-sans font-black italic text-sm text-primary bg-primary-light border border-primary/20 px-3 py-1.5 rounded-lg">
                  Day {day.dayNumber}
                </span>
                <h4 className="font-sans font-extrabold text-sm md:text-base text-black pr-4">
                  {day.title}
                </h4>
              </div>

              <div className="p-1 rounded-lg border border-gray-border text-gray-dark shrink-0">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Collapsible Content */}
            {isExpanded && (
              <div className="px-5 pb-5 pt-1 border-t border-gray-border space-y-4 animate-fadeIn">
                {/* Description */}
                {day.description && (
                  <p className="text-xs md:text-sm text-gray-mid leading-relaxed font-semibold">
                    {day.description}
                  </p>
                )}

                {/* Day Images (if any) */}
                {day.images && day.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {day.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-[120px] rounded-xl overflow-hidden border border-gray-border bg-gray-bg"
                      >
                        <Image
                          src={getOptimizedImageUrl(img, 400)}
                          alt={`Day ${day.dayNumber} - ${day.title}`}
                          fill
                          className="object-cover hover:scale-103 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
