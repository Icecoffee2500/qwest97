"use client";

import { motion } from "framer-motion";
import type { Item } from "@/data/items";

interface CardProps {
  item: Item;
  enlarged: boolean;
  onClick: () => void;
}

export default function Card({ item, enlarged, onClick }: CardProps) {
  const isPaperReview = item.category === "paper_review";
  const domain = item.tags?.[0] || null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <motion.div
        layoutId={`card-${item.id}`}
        className={`flex flex-col justify-between rounded-xl border border-neutral-200 bg-white transition-colors duration-200 group-hover:border-neutral-400 ${
          isPaperReview
            ? enlarged
              ? "p-7 sm:p-8"
              : "p-5 sm:p-6"
            : enlarged
              ? "aspect-[3/2] p-8 sm:p-10"
              : "aspect-[4/3] p-6 sm:p-8"
        }`}
        transition={{ type: "spring", stiffness: 200, damping: 28 }}
      >
        {isPaperReview ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-neutral-400 tracking-[0.15em] uppercase font-medium ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
              >
                {item.publication || "—"}
              </span>
              {domain && (
                <span
                  className={`text-neutral-300 tracking-[0.1em] uppercase font-light truncate mx-3 ${
                    enlarged ? "text-[11px]" : "text-[9px]"
                  }`}
                >
                  {domain}
                </span>
              )}
              <span
                className={`text-neutral-300 tracking-[0.2em] font-light ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
              >
                {item.year || "—"}
              </span>
            </div>

            <div>
              <h3
                className={`font-medium text-neutral-900 leading-snug ${
                  enlarged ? "text-base sm:text-lg" : "text-sm"
                }`}
              >
                {item.title}
              </h3>
              {item.subtitle && (
                <p
                  className={`mt-1.5 text-neutral-400 font-light tracking-wide ${
                    enlarged ? "text-xs" : "text-[11px]"
                  }`}
                >
                  {item.subtitle}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-start">
              {item.year ? (
                <span
                  className={`text-neutral-300 tracking-[0.2em] font-light ${
                    enlarged ? "text-xs" : "text-[10px]"
                  }`}
                >
                  {item.year}
                </span>
              ) : (
                <span />
              )}
              <span
                className={`text-neutral-300 tracking-[0.15em] uppercase font-light ${
                  enlarged ? "text-xs" : "text-[10px]"
                }`}
              >
                {item.category}
              </span>
            </div>

            <div>
              <h3
                className={`font-medium text-neutral-900 leading-snug ${
                  enlarged ? "text-lg sm:text-xl" : "text-sm sm:text-base"
                }`}
              >
                {item.title}
              </h3>
              {item.subtitle && (
                <p
                  className={`mt-1 text-neutral-400 font-light tracking-wide ${
                    enlarged ? "text-xs sm:text-sm" : "text-[11px]"
                  }`}
                >
                  {item.subtitle}
                </p>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
