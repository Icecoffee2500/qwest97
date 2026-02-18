"use client";

import { motion } from "framer-motion";
import { categories, type Category } from "@/data/items";

interface NavigationProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  enlarged: boolean;
  onToggleSize: () => void;
}

export default function Navigation({
  activeCategory,
  onCategoryChange,
  enlarged,
  onToggleSize,
}: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-3 items-center h-14">
        {/* Left — Size toggle */}
        <div className="flex items-center justify-start">
          <button
            onClick={onToggleSize}
            className="text-neutral-400 hover:text-black transition-colors duration-200 text-lg leading-none"
            aria-label={enlarged ? "카드 축소" : "카드 확대"}
          >
            {enlarged ? "−" : "+"}
          </button>
        </div>

        {/* Center — Categories */}
        <div className="flex items-center justify-center gap-2 sm:gap-5">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onCategoryChange(cat.key)}
              className={`relative text-[10px] sm:text-xs tracking-[0.15em] uppercase px-1 py-1 transition-colors duration-200 ${
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
