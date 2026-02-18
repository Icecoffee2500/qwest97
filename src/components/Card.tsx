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
  showCategoryBorder?: boolean;
  onClick: () => void;
}

function formatPeriod(start?: string | null, end?: string | null): string {
  if (!start && !end) return "—";
  const fmt = (v: string) => v.replace("-", ".");
  if (start && end) return `${fmt(start)} — ${fmt(end)}`;
  if (start) return `${fmt(start)} —`;
  return `— ${fmt(end!)}`;
}

export default function Card({ item, enlarged, showCategoryBorder = true, onClick }: CardProps) {
  const isPaperReview = item.category === "paper_review";
  const isProject = item.category === "project";
  const domain = item.domain || null;

  const isResearch = item.category === "research";

  const sizeClass = enlarged ? "p-5 sm:p-6" : "p-4 sm:p-5";

  const borderStyle = showCategoryBorder
    ? isResearch
      ? { color: "rgba(0, 122, 255, 0.25)", hover: "rgba(0, 122, 255, 0.7)" }
      : isPaperReview
      ? { color: "rgba(255, 149, 0, 0.25)", hover: "rgba(255, 149, 0, 0.7)" }
      : isProject
      ? { color: "rgba(175, 82, 222, 0.25)", hover: "rgba(175, 82, 222, 0.7)" }
      : null
    : null;

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
        className={`flex flex-col justify-between rounded-xl border bg-white transition-colors duration-200 ${
          borderStyle ? "" : "border-neutral-200 group-hover:border-neutral-400"
        } ${sizeClass}`}
        style={borderStyle ? { borderColor: borderStyle.color } : undefined}
        whileHover={borderStyle ? { borderColor: borderStyle.hover } : undefined}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 28,
          borderColor: { duration: 0.05, ease: "easeOut" },
        }}
      >
        {isPaperReview ? (
          <div className="flex flex-col min-h-[100px]">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-1.5 ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
              >
                <span className="tracking-[0.15em] uppercase font-medium" style={{ color: "#FF9500" }}>
                  Paper Review
                </span>
                {domain && (
                  <>
                    <span className="text-neutral-300">|</span>
                    <span
                      className="tracking-[0.1em] uppercase font-medium truncate text-neutral-900"
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
                  className={`font-medium text-neutral-900 leading-snug break-keep ${
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

            {item.tags && item.tags.length > 0 && (
              <div className="flex justify-start">
                <span
                  className={`text-neutral-400 tracking-[0.1em] font-medium ${
                    enlarged ? "text-xs" : "text-[10px]"
                  }`}
                >
                  {item.tags.join(" · ")}
                </span>
              </div>
            )}
          </div>
        ) : isProject ? (
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 min-w-0 min-h-[120px]">
              <div
                className={`flex items-center gap-1.5 ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
              >
                <span className="tracking-[0.15em] uppercase font-medium" style={{ color: "#5856D6" }}>
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
                  className={`font-medium text-neutral-900 leading-snug break-keep ${
                    enlarged ? "text-lg sm:text-xl" : "text-base"
                  }`}
                >
                  {item.title}
                </h3>
              </div>

              <p
                className={`font-medium text-neutral-400 tracking-wide ${
                  enlarged ? "text-xs" : "text-[10px]"
                }`}
              >
                {formatPeriod(item.period_start, item.period_end)}
              </p>
            </div>

            {item.thumbnail && (
              <div className="flex-shrink-0 flex items-center justify-center w-[40%] -my-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail}
                  alt={item.collaborator || item.title}
                  className="w-full object-contain"
                />
              </div>
            )}
          </div>
        ) : isResearch ? (
          <div className="flex flex-col min-h-[100px]">
            <div className="flex items-center justify-between">
              <span
                className={`tracking-[0.15em] uppercase font-medium ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
                style={{ color: "#32ADE6" }}
              >
                Research
              </span>
              <span
                className={`text-neutral-400 tracking-[0.15em] uppercase font-medium flex-shrink-0 ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
              >
                {[item.publication, item.year].filter(Boolean).join(" ")}
              </span>
            </div>

            <div className="flex-1 flex items-center">
              <h3
                className={`font-medium text-neutral-900 leading-snug break-keep ${
                  enlarged ? "text-lg sm:text-xl" : "text-base"
                }`}
              >
                {item.title}
              </h3>
            </div>

            {item.tags && item.tags.length > 0 && (
              <p
                className={`text-neutral-400 tracking-[0.1em] font-medium ${
                  enlarged ? "text-xs" : "text-[10px]"
                }`}
              >
                {item.tags.join(" · ")}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col min-h-[100px]">
            <div className="flex justify-between items-start">
              {item.year ? (
                <span
                  className={`text-neutral-400 tracking-[0.2em] font-medium ${
                    enlarged ? "text-[11px]" : "text-[9px]"
                  }`}
                >
                  {item.year}
                </span>
              ) : (
                <span />
              )}
              <span
                className={`text-neutral-400 tracking-[0.15em] uppercase font-medium ${
                  enlarged ? "text-[11px]" : "text-[9px]"
                }`}
              >
                {item.category}
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <div>
                <h3
                  className={`font-medium text-neutral-900 leading-snug break-keep ${
                    enlarged ? "text-lg sm:text-xl" : "text-base"
                  }`}
                >
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p
                    className={`mt-1 text-neutral-400 font-light tracking-wide ${
                      enlarged ? "text-xs" : "text-[10px]"
                    }`}
                  >
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
