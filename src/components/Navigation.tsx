"use client";

import { motion, AnimatePresence } from "framer-motion";
import { categories, type Category } from "@/data/items";

interface NavigationProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  enlarged: boolean;
  onToggleSize: () => void;
  paperReviewTags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
}

export default function Navigation({
  activeCategory,
  onCategoryChange,
  enlarged,
  onToggleSize,
  paperReviewTags,
  activeTag,
  onTagChange,
}: NavigationProps) {
  const isPaperReview = activeCategory === "paper_review";

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-[auto_1fr_auto] items-center h-14 gap-4">
        {/* Left */}
        <div className="flex items-center justify-start">
          {isPaperReview ? (
            <button
              onClick={() => onCategoryChange("all")}
              className="text-neutral-400 hover:text-black transition-colors duration-200 text-sm leading-none"
              aria-label="뒤로"
            >
              ←
            </button>
          ) : (
            <button
              onClick={onToggleSize}
              className="text-neutral-400 hover:text-black transition-colors duration-200 text-lg leading-none"
              aria-label={enlarged ? "카드 축소" : "카드 확대"}
            >
              {enlarged ? "−" : "+"}
            </button>
          )}
        </div>

        {/* Center */}
        <div className="flex items-center justify-center overflow-x-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            {isPaperReview ? (
              <motion.div
                key="paper-review-filters"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 sm:gap-4"
              >
                <button
                  onClick={() => onTagChange(null)}
                  className={`relative text-[10px] sm:text-xs tracking-[0.15em] uppercase px-1 py-1 transition-colors duration-200 whitespace-nowrap ${
                    activeTag === null
                      ? "text-black"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  All
                  {activeTag === null && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1 right-1 h-px bg-black"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>

                {paperReviewTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagChange(tag)}
                    className={`relative text-[10px] sm:text-xs tracking-[0.15em] uppercase px-1 py-1 transition-colors duration-200 whitespace-nowrap ${
                      activeTag === tag
                        ? "text-black"
                        : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    {tag}
                    {activeTag === tag && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1 right-1 h-px bg-black"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="main-categories"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 sm:gap-5"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => onCategoryChange(cat.key)}
                    className={`relative text-[10px] sm:text-xs tracking-[0.15em] uppercase px-1 py-1 transition-colors duration-200 whitespace-nowrap ${
                      activeCategory === cat.key
                        ? "text-black"
                        : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    {cat.label}
                    {activeCategory === cat.key && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1 right-1 h-px bg-black"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — Name */}
        <div className="flex items-center justify-end">
          <a
            href="/"
            className="text-xs font-medium tracking-[0.25em] uppercase text-black"
          >
            qwest
          </a>
        </div>
      </div>
    </nav>
  );
}
