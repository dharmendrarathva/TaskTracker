"use client";

import Image from "next/image";

const reviews = [
  {
    img: "https://res.cloudinary.com/ddpvhxnus/image/upload/v1771937039/Screenshot_2026-02-24_174454_xakpes.png",
    name: "Rahul Sharma",
    role: "Startup Founder",
    review:
      "Task Tracker helped me organize my workflow efficiently. The dashboard clarity and analytics insights improved my productivity by 40%.",
  },
  {
    img: "https://res.cloudinary.com/ddpvhxnus/image/upload/v1771937039/Screenshot_2026-02-24_180943_vnhqfx.png",
    name: "Priya Patel",
    role: "Product Designer",
    review:
      "The UI is clean and distraction-free. I especially love the analytics section — it gives meaningful insights into my daily performance.",
  },
  {
    img: "https://res.cloudinary.com/ddpvhxnus/image/upload/v1771937039/Screenshot_2026-02-24_181156_a7rlkt.png",
    name: "Amit Verma",
    role: "Software Developer",
    review:
      "Secure login and smooth task tracking make this app reliable for daily use. It feels lightweight yet powerful.",
  },
  {
    img: "https://res.cloudinary.com/ddpvhxnus/image/upload/v1771937039/Screenshot_2026-02-24_181245_dneduw.png",
    name: "Neha Desai",
    role: "Freelancer",
    review:
      "This tool simplified my project planning. The dashboard layout makes it very easy to manage multiple goals simultaneously.",
  },
  {
  img: "https://res.cloudinary.com/ddpvhxnus/image/upload/v1771937664/Screenshot_2026-02-24_182216_jemipr.png",
  name: "Karan Mehta",
  role: "Business Analyst",
  review:
    "The structured task visualization and analytics breakdown help me stay focused on high-priority goals. The interface feels premium and responsive.",
},
];

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            User Experience Reviews
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            See how users are benefiting from Task Tracker in their daily workflow.
          </p>
        </section>

        {/* Reviews Grid */}
        <section className="grid md:grid-cols-2 gap-10 mb-20">
          {reviews.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-amber-100/30 transition"
            >
              <div className="relative w-full h-[250px] mb-6">
<Image
  src={item.img}
  alt={item.name}
  fill
  unoptimized
  className="object-contain rounded-xl"
/>
              </div>

              <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
              <p className="text-sm text-amber-400 mb-3">{item.role}</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.review}
              </p>
            </div>
          ))}
        </section>

        {/* Bottom CTA */}
        <section className="text-center pb-16">
          <h2 className="text-2xl font-semibold mb-6">
            Join Thousands of Productive Users
          </h2>
          <a
            href="/"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-lg transition"
          >
            Start Tracking Today
          </a>
        </section>

      </div>
    </div>
  );
}