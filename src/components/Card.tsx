"use client";

import { motion } from "framer-motion";
import type { Item } from "@/data/items";

interface CardProps {
  item: Item;
  enlarged: boolean;
  onClick: () => void;
}

export default function Card({ item, enlarged, onClick }: CardProps) {
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
        className={`bg-neutral-50 flex flex-col justify-between group-hover:bg-neutral-100 ${
          enlarged ? "aspect-[3/2] p-8 sm:p-10" : "aspect-[4/3] p-6 sm:p-8"
        }`}
        transition={{ type: "spring", stiffness: 200, damping: 28 }}
      >
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
      </motion.div>
    </motion.div>
  );
}
