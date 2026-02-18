"use client";

import { motion } from "framer-motion";
import type { Item } from "@/data/items";

const DOMAIN_COLORS = [
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#00C7BE",
  "#30B0C7",
  "#32ADE6",
  "#007AFF",
  "#5856D6",
  "#AF52DE",
  "#A2845E",
];

function getDomainColor(domain: string): string {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  return DOMAIN_COLORS[Math.abs(hash) % DOMAIN_COLORS.length];
}

interface CardProps {
  item: Item;
  enlarged: boolean;
  onClick: () => void;
}

function formatPeriod(start?: string | null, end?: string | null): string {
  if (!start && !end) return "—";
  const fmt = (v: string) => v.replace("-", ".");
  if (start && end) return `${fmt(start)} — ${fmt(end)}`;
  if (start) return `${fmt(start)} —`;
  return `— ${fmt(end!)}`;
}

export default function Card({ item, enlarged, onClick }: CardProps) {
  const isPaperReview = item.category === "paper_review";
  const isProject = item.category === "project";
  const domain = item.tags?.[0] || null;

  const sizeClass = isPaperReview
    ? enlarged
      ? "p-7 sm:p-8"
      : "p-5 sm:p-6"
    : isProject
      ? enlarged
        ? "p-7 sm:p-8"
        : "p-5 sm:p-6"
      : enlarged
        ? "aspect-[3/2] p-8 sm:p-10"
        : "aspect-[4/3] p-6 sm:p-8";

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
        className={`flex flex-col justify-between rounded-xl border border-neutral-200 bg-white transition-colors duration-200 group-hover:border-neutral-400 ${sizeClass}`}
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
                  className={`tracking-[0.1em] uppercase font-medium truncate mx-3 ${
                    enlarged ? "text-[11px]" : "text-[9px]"
                  }`}
                  style={{ color: getDomainColor(domain) }}
                >
                  {domain}
                </span>
              )}
              <span
                className={`text-neutral-400 tracking-[0.2em] font-medium ${
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
        ) : isProject ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-neutral-400 tracking-[0.15em] uppercase font-medium ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
              >
                {item.collaborator || "—"}
              </span>
              <span
                className={`text-neutral-400 tracking-[0.15em] uppercase font-medium ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
              >
                Project
              </span>
              <span
                className={`text-neutral-400 tracking-[0.1em] font-medium ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
              >
                {formatPeriod(item.period_start, item.period_end)}
              </span>
            </div>

            {item.thumbnail && (
              <div
                className={`flex items-center justify-center my-3 ${
                  enlarged ? "h-20" : "h-14"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail}
                  alt={item.collaborator || item.title}
                  className="max-h-full max-w-[60%] object-contain"
                />
              </div>
            )}

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
