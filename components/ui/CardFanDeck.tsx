"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardFanDeckProps<T> {
  items: T[];
  renderCard: (item: T, isTop: boolean) => React.ReactNode;
  onTapTop?: (item: T, index: number) => void;
}

/**
 * Reusable Fan Card Deck — cards spread like a hand of playing cards.
 * All cards anchored at the bottom, tops fanned to the right.
 * Swipe left / tap Next → top card peels away to the left, next card comes forward.
 * Swipe right / tap Prev → reverse.
 */
export default function CardFanDeck<T extends { id?: string | number }>({
  items,
  renderCard,
  onTapTop,
}: CardFanDeckProps<T>) {
  const [topIndex, setTopIndex] = useState(0);
  const [exitDir, setExitDir] = useState<"left" | "right" | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const next = () => {
    if (items.length <= 1) return;
    setExitDir("left");
    setTimeout(() => {
      setTopIndex((prev) => (prev + 1) % items.length);
      setExitDir(null);
    }, 250);
  };

  const prev = () => {
    if (items.length <= 1) return;
    setExitDir("right");
    setTimeout(() => {
      setTopIndex((prev) => (prev - 1 + items.length) % items.length);
      setExitDir(null);
    }, 250);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 50) next();
    else if (delta < -50) prev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Number of cards to show in the fan (max 4 for visual clarity)
  const VISIBLE = Math.min(items.length, 4);

  // Fan angles: cards spread to the right, anchored at bottom
  // Card 0 (top) = 0deg, card 1 = +8deg, card 2 = +16deg, card 3 = +22deg
  const FAN_ANGLES = [0, 8, 16, 22];
  // translateX offset so right cards spread visible
  const FAN_TRANSLATE_X = [0, 18, 34, 46];
  // translateY so bottom stays anchored (compensate for rotation pivot)
  const FAN_TRANSLATE_Y = [0, -6, -10, -14];
  const FAN_Z = [30, 20, 10, 5];
  const FAN_OPACITY = [1, 0.85, 0.7, 0.55];

  return (
    <div
      className="relative flex flex-col items-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Card Stack with fan spread */}
      <div
        className="relative w-full max-w-[290px] h-[460px]"
        style={{ transformOrigin: "bottom center" }}
      >
        {Array.from({ length: VISIBLE }).map((_, slot) => {
          // slot 0 = top card, slot 1 = one behind, etc
          const itemIdx = (topIndex + (VISIBLE - 1 - slot)) % items.length;
          const item = items[itemIdx];
          // For the top card, we apply exitDir animation
          const isTopSlot = slot === VISIBLE - 1;

          const rotateZ = FAN_ANGLES[VISIBLE - 1 - slot];
          const tx = FAN_TRANSLATE_X[VISIBLE - 1 - slot];
          const ty = FAN_TRANSLATE_Y[VISIBLE - 1 - slot];
          const zIndex = FAN_Z[VISIBLE - 1 - slot];
          const opacity = FAN_OPACITY[VISIBLE - 1 - slot];

          // Top card exit animation
          let exitTransform = "";
          if (isTopSlot && exitDir === "left") {
            exitTransform = "translateX(-280px) rotate(-25deg)";
          } else if (isTopSlot && exitDir === "right") {
            exitTransform = "translateX(280px) rotate(25deg)";
          }

          return (
            <div
              key={`${String(item?.id ?? slot)}-${slot}`}
              onClick={() => {
                if (isTopSlot && onTapTop) onTapTop(item, itemIdx);
              }}
              className="absolute bottom-0 left-1/2 w-full"
              style={{
                transformOrigin: "bottom center",
                transform: exitTransform
                  ? exitTransform
                  : `translateX(calc(-50% + ${tx}px)) translateY(${ty}px) rotate(${rotateZ}deg)`,
                zIndex,
                opacity,
                transition: exitDir
                  ? "transform 0.25s ease-in, opacity 0.25s ease-in"
                  : "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease",
                cursor: isTopSlot ? "pointer" : "default",
              }}
            >
              {renderCard(item, isTopSlot)}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-5 mt-6">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
        </button>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          {((topIndex % items.length) + 1)} / {items.length}
        </span>
        <button
          onClick={next}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
        </button>
      </div>
    </div>
  );
}
