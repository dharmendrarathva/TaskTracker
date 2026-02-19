import { LayoutGrid } from "@/components/ui/layout-grid";

export default function FeaturesSection() {
  const cards = [
    {
      id: 1,
      thumbnail:
        "https://res.cloudinary.com/ddpvhxnus/image/upload/v1771397916/Screenshot_2026-02-18_122757_gnnfeh.png",
      content: (
        <div>
          <h3 className="text-3xl font-bold">🔥 Streak Analytics</h3>
          <p className="mt-4 text-neutral-300">
            Track your daily streaks and maintain long-term discipline.
          </p>
        </div>
      ),
      className: "md:col-span-2",
    },
    {
      id: 2,
      thumbnail:
        "https://res.cloudinary.com/ddpvhxnus/image/upload/v1771397712/Screenshot_2026-02-18_122117_dyvudf.png",
      content: (
        <div>
          <h3 className="text-3xl font-bold">📊 Smart Insights</h3>
          <p className="mt-4 text-neutral-300">
            Analyze productivity patterns and improve efficiency.
          </p>
        </div>
      ),
      className: "col-span-1",
    },
    {
      id: 3,
      thumbnail:
        "https://res.cloudinary.com/ddpvhxnus/image/upload/v1771397712/Screenshot_2026-02-18_122231_dpy9xq.png",
      content: (
        <div>
          <h3 className="text-3xl font-bold">⚡ Focus Mode</h3>
          <p className="mt-4 text-neutral-300">
            Stay distraction-free with a minimal interface.
          </p>
        </div>
      ),
      className: "col-span-1",
    },
    {
      id: 4,
      thumbnail:
        "https://res.cloudinary.com/ddpvhxnus/image/upload/v1771397916/Screenshot_2026-02-18_122814_mfvw4r.png",
      content: (
        <div>
          <h3 className="text-3xl font-bold">🎯 Goal Tracking</h3>
          <p className="mt-4 text-neutral-300">
            Set long-term goals and measure real progress.
          </p>
        </div>
      ),
      className: "md:col-span-2",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-24">
      <div className="max-w-6xl mx-auto px-6 text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">
          Explore the Experience
        </h2>
        <p className="mt-4 text-gray-400">
          Click on the cards to preview insights.
        </p>
      </div>

      <LayoutGrid cards={cards} />
    </section>
  );
}
