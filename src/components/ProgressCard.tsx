"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface Props {
  totalLectures: number;
  target: number;
  isActive?: boolean;
}

export default function ProgressCard({
  totalLectures,
  target,
  isActive = false,
}: Props) {
  const safeTarget = target > 0 ? target : 1;
  const completed = Math.min(totalLectures, safeTarget);
  const percentage = (completed / safeTarget) * 100;

  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (isActive) {
      let start = 0;
      const duration = 1200;
      const stepTime = 16;
      const increment = percentage / (duration / stepTime);

      const timer = setInterval(() => {
        start += increment;
        if (start >= percentage) {
          start = percentage;
          clearInterval(timer);
        }
        setAnimatedValue(start);
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setAnimatedValue(0);
    }
  }, [isActive, percentage]);

  const data = [
    { name: "Progress", value: animatedValue },
    { name: "Remaining", value: 100 - animatedValue },
  ];

  return (
    <motion.div
      animate={{
        scale: isActive ? 1.05 : 0.9,
        opacity: isActive ? 1 : 0.5,
      }}
      transition={{ duration: 0.6 }}
      className={`relative bg-gradient-to-br from-[#0f0f0f] to-[#151515]
      p-8 rounded-3xl border border-white/10 shadow-2xl
      ${isActive ? "shadow-white/20" : ""}`}
    >
      <h2 className="text-lg font-semibold text-white text-center mb-6">
        Overall Progress
      </h2>

    <div className="relative w-[220px] h-[220px] mx-auto">
  <PieChart width={220} height={220}>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      innerRadius={70}
      outerRadius={100}
      startAngle={90}
      endAngle={-270}
      paddingAngle={0}
      dataKey="value"
      stroke="none"
      isAnimationActive={false}
    >
      <Cell fill="#3b82f6" />
      <Cell fill="#1f2937" />
    </Pie>
  </PieChart>

  <div className="absolute inset-0 flex items-center justify-center">
    <span className="text-3xl font-bold text-white">
      {animatedValue.toFixed(0)}%
    </span>
  </div>
</div>


      <div className="text-center mt-6">
        <p className="text-gray-400 text-sm">
          {completed} / {safeTarget} Lectures Completed
        </p>
      </div>
    </motion.div>
  );
}
