"use client";

import { useEffect, useRef, useState } from "react";

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting); // toggle on every scroll
      },
      {
        threshold: 1,
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-28 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2
          className={`text-4xl md:text-5xl font-bold text-white transition-all duration-1000
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          How It Works
        </h2>

        <div className="mt-20 grid md:grid-cols-3 gap-12 text-left">
          <Step
            title="1. Add Tasks"
            desc="Create daily tasks and set clear goals."
            visible={visible}
            delay="0s"
          />
          <Step
            title="2. Complete Daily"
            desc="Mark tasks complete and stay consistent."
            visible={visible}
            delay="0.15s"
          />
          <Step
            title="3. Track Growth"
            desc="Watch your streak grow over time."
            visible={visible}
            delay="0.3s"
          />
        </div>
      </div>
    </section>
  );
}

function Step({
  title,
  desc,
  visible,
  delay,
}: {
  title: string;
  desc: string;
  visible: boolean;
  delay: string;
}) {
  return (
    <div
      style={{ transitionDelay: delay }}
      className={`rounded-2xl border border-white/10 p-8
        transition-all duration-1000
        ease-[cubic-bezier(0.22,1,0.36,1)]
        transform
        ${
          visible
            ? "translate-y-0 opacity-100 blur-0"
            : "translate-y-10 opacity-0 blur-sm"
        }
        hover:-translate-y-2 hover:border-amber-400/40 hover:shadow-2xl`}
    >
      <h3 className="text-xl font-semibold text-amber-400">
        {title}
      </h3>
      <p className="mt-4 text-neutral-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
