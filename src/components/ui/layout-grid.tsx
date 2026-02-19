

"use client";

import React, { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Card = {
  id: number;
  content: React.ReactNode;
  className?: string;
  thumbnail: string;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.35, 
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 80,
      scale: 0.9,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1, 
        ease: [0.16, 1, 0.3, 1], 
      },
    },
  };

  return (
    <motion.div
      className="w-full relative py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-6 px-6">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            onClick={() => setSelected(card)}
            className={cn(
              "relative overflow-hidden rounded-2xl cursor-pointer",
              "h-72 md:h-80 border-2 border-neutral-800 bg-neutral-900",
              "shadow-xl",
              card.className
            )}
          >
            <img
              src={card.thumbnail}
              alt="thumbnail"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div className="bg-neutral-900 rounded-3xl p-10 max-w-2xl w-full text-white shadow-2xl border border-neutral-800">
                {selected.content}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
