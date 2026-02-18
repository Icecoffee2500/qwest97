"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Item } from "@/data/items";

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
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-100">
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

        {/* Content */}
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-24">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              {item.year && (
                <span className="text-[10px] text-neutral-300 tracking-[0.2em]">
                  {item.year}
                </span>
              )}
              <span className="text-[10px] text-neutral-300 tracking-[0.15em] uppercase">
                {item.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium text-black leading-tight">
              {item.title}
            </h1>
            {item.subtitle && (
              <p className="mt-3 text-sm text-neutral-400 font-light tracking-wide">
                {item.subtitle}
              </p>
            )}
          </div>

          {/* Divider */}
          <motion.div
            className="mt-10 mb-10 h-px bg-neutral-100"
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
            <p className="text-sm sm:text-base text-neutral-600 leading-[2] whitespace-pre-line">
              {item.description}
            </p>
          </motion.div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] tracking-wider px-3 py-1.5 bg-neutral-50 text-neutral-500 uppercase"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Links */}
          {item.links && item.links.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-5 mt-14 pt-10 border-t border-neutral-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              {item.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] tracking-wider text-black border-b border-black pb-0.5 hover:text-neutral-400 hover:border-neutral-400 transition-colors duration-200 uppercase"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
