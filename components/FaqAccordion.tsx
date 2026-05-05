"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqEntry {
  question: string;
  answer: string;
}

export default function FaqAccordion({ entries }: { entries: FaqEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-8 grid gap-3">
      {entries.map((entry, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={entry.question}
            className={`group rounded-xl border transition-all duration-300 ${
              isOpen
                ? "border-violet-500/25 bg-violet-500/[0.06] shadow-lg shadow-violet-500/5"
                : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03]"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left outline-none sm:p-6"
            >
              <h3
                className={`font-sans text-lg font-bold tracking-wide transition-colors duration-300 ${
                  isOpen ? "text-white" : "text-white/70 group-hover:text-white/90"
                }`}
              >
                {entry.question}
              </h3>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                  isOpen
                    ? "bg-violet-500/20 text-violet-400"
                    : "bg-white/[0.04] text-white/30 group-hover:bg-white/[0.06] group-hover:text-white/50"
                }`}
              >
                <motion.svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <path d="m6 9 6 6 6-6" />
                </motion.svg>
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 pt-1 sm:px-6">
                    <p className="text-sm leading-7 text-white/40">
                      {entry.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
