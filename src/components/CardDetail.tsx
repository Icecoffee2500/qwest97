"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { Item } from "@/data/items";

const MarkdownRenderer = dynamic(() => import("./MarkdownRenderer"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-20 bg-neutral-50" />,
});

interface CardDetailProps {
  item: Item;
  onClose: () => void;
}

export default function CardDetail({ item, onClose }: CardDetailProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      layoutId={`card-${item.id}`}
      className="fixed inset-0 z-40 bg-white overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
    >
      {/* Scrollable inner — fades in after expansion */}
      <motion.div
        className="w-full h-full overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {/* Top bar — desktop only */}
        <div className="hidden sm:block sticky top-0 z-10 bg-white">
          <div className="mx-auto max-w-7xl px-6 h-14 flex items-center">
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-black transition-colors duration-200 text-lg leading-none"
              aria-label="닫기"
            >
              ←
            </button>
          </div>
        </div>

        {/* Bottom bar — mobile only */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-10 bg-white pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto max-w-7xl px-4 h-12 flex items-center">
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-black transition-colors duration-200 text-lg leading-none"
              aria-label="닫기"
            >
              ←
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-6 sm:pt-16 pb-20 sm:pb-24">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {item.year && (
                <span className="text-[9px] sm:text-[10px] text-neutral-500 tracking-[0.15em] sm:tracking-[0.2em]">
                  {item.year}
                </span>
              )}
              <span className="text-[9px] sm:text-[10px] text-neutral-500 tracking-[0.1em] sm:tracking-[0.15em] uppercase">
                {item.category === "paper_review" ? "paper review" : item.category}
              </span>
              {item.publication && (
                <span className="text-[9px] sm:text-[10px] text-neutral-500 tracking-[0.1em] sm:tracking-[0.15em] uppercase">
                  · {item.publication}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-black leading-tight break-keep">
              {item.title}
            </h1>
            {item.subtitle && (
              <p className="mt-3 text-sm text-neutral-400 font-light tracking-wide">
                {item.subtitle}
              </p>
            )}

            {/* Tags — top for paper_review */}
            {item.category === "paper_review" && item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 sm:mt-5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] sm:text-[10px] tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 bg-neutral-50 text-neutral-500 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Links — under tags (paper_review) or title (others) */}
            {item.links && item.links.length > 0 && (
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-5">
                {item.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] sm:text-[11px] tracking-wider text-black border-b border-black pb-0.5 hover:text-neutral-400 hover:border-neutral-400 transition-colors duration-200 uppercase"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <motion.div
            className="mt-8 mb-8 sm:mt-10 sm:mb-10 h-px bg-neutral-100"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ transformOrigin: "left" }}
          />

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <MarkdownRenderer content={item.description} />
          </motion.div>

          {/* Tags — bottom for non-paper_review */}
          {item.category !== "paper_review" && item.tags && item.tags.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] sm:text-[10px] tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 bg-neutral-50 text-neutral-500 uppercase"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
