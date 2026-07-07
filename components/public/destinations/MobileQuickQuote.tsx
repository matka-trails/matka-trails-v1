"use client";

import { useState, useEffect, useRef } from "react";
import { Compass, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QuickCallForm from "./QuickCallForm";

interface Props {
  defaultDestination?: string;
}

export default function MobileQuickQuote({ defaultDestination = "" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the footer is visible on screen, hide the sticky bar
        setShowStickyBar(!entry.isIntersecting);
      },
      {
        root: null, // viewport
        threshold: 0.05, // trigger when even 5% of footer is visible
      }
    );

    const footer = document.querySelector("footer");
    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, []);

  return (
    <>
      {/* Sticky Bottom Bar for Mobile only */}
      <AnimatePresence>
        {showStickyBar && !isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-neutral-950/95 backdrop-blur-md border-t border-white/10 px-5 py-4 pb-6 flex items-center justify-between shadow-2xl"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>SOLO IN, GROUP OUT</span>
              </span>
              <p className="text-xs font-reminder text-white font-bold tracking-wide">
                Plan Your Next Adventure Today
              </p>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-orange flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Get Callback</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs lg:hidden"
            />

            {/* Slide up Drawer container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212] border-t border-white/10 rounded-t-[32px] overflow-hidden max-h-[85vh] flex flex-col lg:hidden shadow-2xl"
            >
              {/* Drawer Header Drag Handle / Close bar */}
              <div className="flex items-center justify-between px-6 pt-5 pb-2 shrink-0">
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  Quick Booking
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content container */}
              <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2">
                <QuickCallForm defaultDestination={defaultDestination} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tailwind rotate animation utility helper */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
      `}} />
    </>
  );
}
