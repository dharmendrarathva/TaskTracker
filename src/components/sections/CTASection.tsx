import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative w-full py-28 bg-neutral-900 overflow-hidden">
      
      {/* Subtle radial glow background */}
      <div className="absolute inset-0" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        
        {/* Heading */}
        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Ready to Stay Consistent?
        </h2>

        {/* Subtext */}
        <p className="mt-6 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
          Build powerful habits, track your progress, and unlock your full
          potential — one focused day at a time.
        </p>

        {/* CTA Button */}
        <Link
          href="/dashboard"
          className="group inline-flex items-center justify-center mt-12
                     px-12 py-4 rounded-2xl
                     bg-white text-black font-semibold text-lg
                     transition-all duration-300
                     hover:scale-105 hover:shadow-2xl"
        >
          Start Tracking Now
          <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
