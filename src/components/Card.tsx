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
      ? "p-5 sm:p-6"
      : "p-4 sm:p-5"
    : isProject
      ? enlarged
        ? "p-5 sm:p-6"
        : "p-4 sm:p-5"
      : enlarged
        ? "aspect-[3/2] p-6 sm:p-8"
        : "aspect-[4/3] p-5 sm:p-6";

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
          <div className="flex flex-col min-h-[100px]">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-1.5 ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
              >
                <span className="text-neutral-400 tracking-[0.15em] uppercase font-medium">
                  Paper Review
                </span>
                {domain && (
                  <>
                    <span className="text-neutral-300">|</span>
                    <span
                      className="tracking-[0.1em] uppercase font-medium truncate"
                      style={{ color: getDomainColor(domain) }}
                    >
                      {domain}
                    </span>
                  </>
                )}
              </div>
              <span
                className={`text-neutral-400 tracking-[0.15em] uppercase font-medium flex-shrink-0 ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
              >
                {[item.publication, item.year].filter(Boolean).join(" ")}
              </span>
            </div>

            <div className="flex-1 flex items-center">
              <div>
                <h3
                  className={`font-medium text-neutral-900 leading-snug ${
                    enlarged ? "text-lg sm:text-xl" : "text-base"
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
            </div>
          </div>
        ) : isProject ? (
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 min-w-0 min-h-[120px]">
              <div
                className={`flex items-center gap-1.5 ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
              >
                <span className="text-neutral-400 tracking-[0.15em] uppercase font-medium">
                  Project
                </span>
                {item.collaborator && (
                  <>
                    <span className="text-neutral-300">|</span>
                    <span className="text-neutral-900 tracking-[0.1em] uppercase font-semibold truncate">
                      {item.collaborator}
                    </span>
                  </>
                )}
              </div>

              <div className="flex-1 flex items-center">
                <h3
                  className={`font-medium text-neutral-900 leading-snug ${
                    enlarged ? "text-lg sm:text-xl" : "text-base"
                  }`}
                >
                  {item.title}
                </h3>
              </div>

              <p
                className={`font-medium text-neutral-400 tracking-wide ${
                  enlarged ? "text-xs" : "text-[11px]"
                }`}
              >
                {formatPeriod(item.period_start, item.period_end)}
              </p>
            </div>

            {item.thumbnail && (
              <div className="flex-shrink-0 flex items-center justify-center w-[30%] -my-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail}
                  alt={item.collaborator || item.title}
                  className="w-full object-contain"
                />
              </div>
            )}
          </div>
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
                  enlarged ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
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
