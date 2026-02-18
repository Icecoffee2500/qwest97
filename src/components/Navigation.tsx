"use client";

import { motion, AnimatePresence } from "framer-motion";
import { categories, type Category } from "@/data/items";

export type PaperReviewTab = "main" | "publication" | "field";

interface NavigationProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  enlarged: boolean;
  onToggleSize: () => void;
  paperReviewTab: PaperReviewTab;
  onPaperReviewTabChange: (tab: PaperReviewTab) => void;
  paperReviewPublications: string[];
  paperReviewTags: string[];
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

const transition = { duration: 0.2 };
const btnBase =
  "relative text-[10px] sm:text-xs tracking-[0.15em] uppercase px-1 py-1 transition-colors duration-200 whitespace-nowrap";

function Indicator() {
  return (
    <motion.div
      layoutId="nav-indicator"
      className="absolute bottom-0 left-1 right-1 h-px bg-black"
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
    />
  );
}

export default function Navigation({
  activeCategory,
  onCategoryChange,
  enlarged,
  onToggleSize,
  paperReviewTab,
  onPaperReviewTabChange,
  paperReviewPublications,
  paperReviewTags,
  activeFilter,
  onFilterChange,
}: NavigationProps) {
  const isPaperReview = activeCategory === "paper_review";

  function handleBack() {
    if (paperReviewTab !== "main") {
      onPaperReviewTabChange("main");
      onFilterChange(null);
    } else {
      onCategoryChange("all");
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-[auto_1fr_auto] items-center h-14 gap-4">
        {/* Left */}
        <div className="flex items-center justify-start">
          {isPaperReview ? (
            <button
              onClick={handleBack}
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
            {!isPaperReview && (
              <motion.div
                key="main-categories"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={transition}
                className="flex items-center gap-2 sm:gap-5"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => onCategoryChange(cat.key)}
                    className={`${btnBase} ${
                      activeCategory === cat.key
                        ? "text-black"
                        : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    {cat.label}
                    {activeCategory === cat.key && <Indicator />}
                  </button>
                ))}
              </motion.div>
            )}

            {isPaperReview && paperReviewTab === "main" && (
              <motion.div
                key="pr-main"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={transition}
                className="flex items-center gap-2 sm:gap-5"
              >
                <button
                  onClick={() => onFilterChange(null)}
                  className={`${btnBase} ${
                    activeFilter === null
                      ? "text-black"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  All
                  {activeFilter === null && <Indicator />}
                </button>
                <button
                  onClick={() => onPaperReviewTabChange("publication")}
                  className={`${btnBase} text-neutral-400 hover:text-neutral-600`}
                >
                  Publication
                </button>
                <button
                  onClick={() => onPaperReviewTabChange("field")}
                  className={`${btnBase} text-neutral-400 hover:text-neutral-600`}
                >
                  Domain
                </button>
              </motion.div>
            )}

            {isPaperReview && paperReviewTab === "publication" && (
              <motion.div
                key="pr-publication"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={transition}
                className="flex items-center gap-2 sm:gap-4"
              >
                <button
                  onClick={() => onFilterChange(null)}
                  className={`${btnBase} ${
                    activeFilter === null
                      ? "text-black"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  All
                  {activeFilter === null && <Indicator />}
                </button>
                {paperReviewPublications.map((pub) => (
                  <button
                    key={pub}
                    onClick={() => onFilterChange(pub)}
                    className={`${btnBase} ${
                      activeFilter === pub
                        ? "text-black"
                        : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    {pub}
                    {activeFilter === pub && <Indicator />}
                  </button>
                ))}
              </motion.div>
            )}

            {isPaperReview && paperReviewTab === "field" && (
              <motion.div
                key="pr-field"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={transition}
                className="flex items-center gap-2 sm:gap-4"
              >
                <button
                  onClick={() => onFilterChange(null)}
                  className={`${btnBase} ${
                    activeFilter === null
                      ? "text-black"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  All
                  {activeFilter === null && <Indicator />}
                </button>
                {paperReviewTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onFilterChange(tag)}
                    className={`${btnBase} ${
                      activeFilter === tag
                        ? "text-black"
                        : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    {tag}
                    {activeFilter === tag && <Indicator />}
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
