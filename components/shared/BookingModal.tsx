"use client";

import { useUiStore } from "@/stores/uiStore";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import BookingForm from "./BookingForm";

export default function BookingModal() {
  const { bookingModalOpen, bookingModalPackageId, closeBookingModal } = useUiStore();

  return (
    <AnimatePresence>
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBookingModal}
            className="absolute inset-0 bg-[#111111]/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-white rounded-2xl w-full max-w-lg shadow-float overflow-hidden z-10 border border-gray-border"
          >
            {/* Header */}
            <div className="bg-[#111111] text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="font-sans font-extrabold text-xl tracking-tight">
                  Reserve Your Trail Slot
                </h3>
                <p className="text-[11px] text-white/50 uppercase tracking-widest mt-1 font-semibold">
                  Solo In. Group Out.
                </p>
              </div>
              <button
                onClick={closeBookingModal}
                className="p-1 rounded-lg border border-white/10 hover:bg-white/10 transition-colors text-white/75 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              <BookingForm
                packageId={bookingModalPackageId}
                onSuccess={() => {
                  // Keep success visible for a few seconds, then close automatically
                  setTimeout(closeBookingModal, 2500);
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
