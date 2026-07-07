"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  sortOrder?: number;
}

const FALLBACK_FAQS: FaqItem[] = [
  {
    question: "What does 'Solo in, Group out' mean?",
    answer: "It means you can book our trips completely solo! You'll join a group of like-minded adventurers, and by the end of the trail, you'll walk away with a family of new friends.",
  },
  {
    question: "Are the treks beginner-friendly?",
    answer: "Most of our weekend trails are curated for beginners and working professionals. We provide detailed difficulty ratings for each trek to help you choose the best lead.",
  },
  {
    question: "What is typically included in the package price?",
    answer: "Our standard packages include shared accommodation (tents or cozy homestays), certified trek leaders, delicious local meals, high-quality gear, and all necessary forest/local permits.",
  },
  {
    question: "Can I customize a trip for my corporate team or friends group?",
    answer: "Absolutely! We organize custom group trips for corporate outings, colleges, and friends. Simply submit the Quick Quote form, and our travel curators will tailor the itinerary for you.",
  },
  {
    question: "Is round-trip transportation provided?",
    answer: "Yes, we arrange comfortable round-trip transfers in comfortable shared cabs/volvos from major hub locations (like Delhi NCR or Dehradun) to the trail bases. Check specific package details for logistics.",
  },
];

export default function Faqs() {
  const { data: serverFaqs = [], isLoading } = useQuery<FaqItem[]>({
    queryKey: ["public-global-faqs"],
    queryFn: () => publicApi.getFaqs({ isGlobal: true }),
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = serverFaqs.length > 0 ? serverFaqs : FALLBACK_FAQS;

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="pt-16 pb-8 px-6 lg:px-12 relative overflow-hidden select-none bg-white border-t border-gray-border/50">
      {/* Background radial accent */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HAVE QUESTIONS?</span>
          </span>
          <h2 className="font-reminder text-4xl md:text-5xl text-black leading-none capitalize">
            Frequently Asked <span className="text-primary italic">Questions</span>
          </h2>
          <p className="text-xs text-gray-mid leading-relaxed font-semibold max-w-md mx-auto">
            Everything you need to know about starting your next adventure with Matka Trails.
          </p>
        </div>

        {/* Accordions */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <h3 className="font-reminder text-lg md:text-xl text-gray-dark leading-snug tracking-wide group-hover:text-primary transition-colors flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                      <span>{faq.question}</span>
                    </h3>
                    <div
                      className={`w-7 h-7 rounded-lg bg-gray-bg flex items-center justify-center text-gray-mid transition-transform duration-300 ${
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
        )}
      </div>
    </section>
  );
}
