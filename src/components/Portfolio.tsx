"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Category, Item } from "@/data/items";
import Navigation from "@/components/Navigation";
import Card from "@/components/Card";
import CardDetail from "@/components/CardDetail";
import Footer from "@/components/Footer";

interface PortfolioProps {
  items: Item[];
}

export default function Portfolio({ items }: PortfolioProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [enlarged, setEnlarged] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const paperReviewTags = useMemo(() => {
    const tagSet = new Set<string>();
    items
      .filter((item) => item.category === "paper_review")
      .forEach((item) => {
        item.tags?.forEach((tag) => tagSet.add(tag));
      });
    return Array.from(tagSet).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "paper_review") {
      const prItems = items.filter((i) => i.category === "paper_review");
      if (!activeTag) return prItems;
      return prItems.filter((i) => i.tags?.includes(activeTag));
    }
    if (activeCategory === "all") return items;
    return items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory, activeTag]);

  function handleCategoryChange(cat: Category) {
    setActiveCategory(cat);
    setSelectedItem(null);
    if (cat !== "paper_review") setActiveTag(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        enlarged={enlarged}
        onToggleSize={() => setEnlarged((prev) => !prev)}
        paperReviewTags={paperReviewTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 pt-24 pb-20">
        <motion.div
          layout
          className={`grid gap-4 ${
            enlarged
              ? "grid-cols-1 sm:grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                item={item}
                enlarged={enlarged}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      <AnimatePresence>
        {selectedItem && (
          <CardDetail
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
