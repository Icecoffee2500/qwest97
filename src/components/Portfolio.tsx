"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Category, Item } from "@/data/items";
import Navigation, { type PaperReviewTab } from "@/components/Navigation";
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

  const [paperReviewTab, setPaperReviewTab] = useState<PaperReviewTab>("main");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const paperReviewItems = useMemo(
    () => items.filter((i) => i.category === "paper_review"),
    [items]
  );

  const paperReviewPublications = useMemo(() => {
    const set = new Set<string>();
    paperReviewItems.forEach((i) => {
      if (i.publication) set.add(i.publication);
    });
    return Array.from(set).sort();
  }, [paperReviewItems]);

  const paperReviewDomains = useMemo(() => {
    const set = new Set<string>();
    paperReviewItems.forEach((i) => {
      if (i.domain) set.add(i.domain);
    });
    return Array.from(set).sort();
  }, [paperReviewItems]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "paper_review") {
      if (!activeFilter) return paperReviewItems;
      if (paperReviewTab === "publication") {
        return paperReviewItems.filter((i) => i.publication === activeFilter);
      }
      if (paperReviewTab === "field") {
        return paperReviewItems.filter((i) => i.domain === activeFilter);
      }
      return paperReviewItems;
    }
    if (activeCategory === "all") return items;
    return items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory, activeFilter, paperReviewTab, paperReviewItems]);

  function handleCategoryChange(cat: Category) {
    setActiveCategory(cat);
    setSelectedItem(null);
    setPaperReviewTab("main");
    setActiveFilter(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        enlarged={enlarged}
        onToggleSize={() => setEnlarged((prev) => !prev)}
        paperReviewTab={paperReviewTab}
        onPaperReviewTabChange={setPaperReviewTab}
        paperReviewPublications={paperReviewPublications}
        paperReviewTags={paperReviewDomains}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
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
                showCategoryBorder={activeCategory === "all"}
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
