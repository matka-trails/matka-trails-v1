"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

export default function DestinationFaqAccordion({
  faqs,
  destinationName,
}: {
  faqs: FaqItem[];
  destinationName: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="pt-16 pb-8 px-6 lg:px-12 relative overflow-hidden bg-white border-t border-gray-border/50">
      {/* BG blob */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{destinationName.toUpperCase()} TERRITORY</span>
          </span>
          <h2 className="font-reminder text-4xl md:text-5xl text-black leading-none capitalize">
            Territory <span className="text-primary italic">FAQs</span>
          </h2>
          <p className="text-xs text-gray-mid leading-relaxed font-semibold max-w-md mx-auto">
            Everything you need to know before heading to {destinationName}.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-gray-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <h3 className="font-reminder text-lg md:text-xl text-gray-dark leading-snug tracking-wide flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                  <div
                    className={`w-7 h-7 rounded-lg bg-gray-bg flex items-center justify-center text-gray-mid transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 bg-primary/10 text-primary" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0 text-gray-mid text-xs md:text-sm font-semibold leading-relaxed border-t border-gray-100 bg-gray-bg/10">
                        <p className="whitespace-pre-line">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
