"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import ProgressCard from "./ProgressCard";

interface Item {
  totalLectures: number;
  target: number;
}

const items: Item[] = [
  { totalLectures: 72, target: 100 },
  { totalLectures: 18, target: 30 },
  { totalLectures: 45, target: 60 },
  { totalLectures: 90, target: 120 },
  { totalLectures: 45, target: 60 },
  { totalLectures: 72, target: 200 },
  { totalLectures: 72, target: 150 },
];

export default function AutoProgressCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const controls = useAnimation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const CARD_WIDTH = 320;

  // Measure container width
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        setContainerWidth(wrapperRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto slide
useEffect(() => {
  const interval = setInterval(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, 3500);

  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    const centerOffset = containerWidth / 2 - CARD_WIDTH / 2;

    controls.start({
      x: -(activeIndex * CARD_WIDTH) + centerOffset,
      transition: { duration: 0.8, ease: "easeInOut" },
    });
  }, [activeIndex, containerWidth, controls]);

  return (
    <div
      ref={wrapperRef}
className="relative w-full overflow-x-hidden overflow-y-visible py-10"
    >
      <motion.div
        animate={controls}
        className="flex"
        style={{ width: items.length * CARD_WIDTH }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="w-[320px] flex-shrink-0 px-4"
          >
            <ProgressCard
              totalLectures={item.totalLectures}
              target={item.target}
              isActive={index === activeIndex}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
