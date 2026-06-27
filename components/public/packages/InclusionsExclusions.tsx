"use client";

import { Check, X } from "lucide-react";

interface InclusionsExclusionsProps {
  inclusions: string[];
  exclusions: string[];
}

export default function InclusionsExclusions({ inclusions, exclusions }: InclusionsExclusionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Inclusions Panel */}
      <div className="bg-white border border-gray-border rounded-2xl p-6 space-y-4">
        <h4 className="font-sans font-bold text-sm text-black flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <Check className="w-4 h-4" />
          </span>
          <span>What's Included</span>
        </h4>
        {inclusions.length > 0 ? (
          <ul className="space-y-3">
            {inclusions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm font-semibold text-gray-dark">
                <span className="text-emerald-500 font-extrabold shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-light font-medium italic">No inclusions specified.</p>
        )}
      </div>

      {/* Exclusions Panel */}
      <div className="bg-white border border-gray-border rounded-2xl p-6 space-y-4">
        <h4 className="font-sans font-bold text-sm text-black flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
            <X className="w-3.5 h-3.5" />
          </span>
          <span>What's Excluded</span>
        </h4>
        {exclusions.length > 0 ? (
          <ul className="space-y-3">
            {exclusions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm font-semibold text-gray-dark">
                <span className="text-rose-500 font-extrabold shrink-0 mt-0.5">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-light font-medium italic">No exclusions specified.</p>
        )}
      </div>
    </div>
  );
}
