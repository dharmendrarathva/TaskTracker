"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export default function WhySection() {
  const features = [
    {
      title: "🔥 Streak System",
      desc: "Build daily consistency and maintain unstoppable momentum.",
      color: "text-amber-400",
    },
    {
      title: "📊 Smart Analytics",
      desc: "Track completed tasks with clarity.",
      color: "text-blue-400",
    },
    {
      title: "⚡ Minimal UI",
      desc: "Zero distractions. Maximum focus.",
      color: "text-purple-400",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
         <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
  Why Choose Our Us?
</h2>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
            Designed for focus, performance, and consistency — 
            everything you need to stay productive without distractions.
          </p>
        </div>

        {/* Moving Cards */}
        <InfiniteMovingCards
          items={features}
          direction="right"
          speed="fast"
        />
      </div>
    </section>
  );
}
