"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  async function safeJson(res: Response) {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      console.error("Invalid JSON:", text);
      return {};
    }
  }


  async function loadPlans() {
    try {
      const res = await fetch("/api/plan", {
        credentials: "include",
      });

      const data = await safeJson(res);

      if (res.ok && data.success) {
        setPlans(data.data || []);
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error("Failed to load plans:", err);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
        <div className="animate-pulse text-white/70 text-lg">
          Loading your plans...
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-6 text-white">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
          My Study Plans
          </h1>

          <div className="text-sm text-white/60">
            {plans.length} plan{plans.length !== 1 ? "s" : ""}
          </div>
        </div>

        {plans.length === 0 && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">🚀</div>
            <p className="text-white/70 mb-2 font-medium">
              No study plans yet
            </p>
            <p className="text-white/40 text-sm">
              Create your first plan to start tracking progress.
            </p>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const startDate = new Date(plan.startDate);

            let previewPercent = 0;
            if (plan.startDate) {
              const today = new Date();
              const diff =
                Math.floor(
                  (today.getTime() - startDate.getTime()) / 86400000
                ) + 1;

              previewPercent = Math.min(
                100,
                Math.round((diff / plan.totalDays) * 100)
              );
            }

            return (
             <div
  key={plan._id}
onClick={() => router.push(`/plan/${plan._id}`)}
  className="
    group cursor-pointer
    backdrop-blur-xl bg-white/5
    border border-white/10
    rounded-2xl p-5
    hover:bg-white/10
    hover:scale-[1.02]
    transition-all duration-300
    shadow-lg hover:shadow-2xl
  "
>

                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold leading-tight">
                    {plan.title}
                  </h2>

                  <div className="relative w-10 h-10">
                    <svg viewBox="0 0 36 36" className="w-10 h-10">
                      <path
                        d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"
                        fill="none"
                        stroke="rgb(16 185 129)"
                        strokeWidth="3"
                        strokeDasharray={`${previewPercent}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-white/70">
                    ⏳ {plan.totalDays} days
                  </p>
                  <p className="text-white/40 text-xs">
                    📅 {startDate.toDateString()}
                  </p>
                </div>

                <div className="mt-4 opacity-0 group-hover:opacity-100 transition text-xs text-emerald-400">
                  Open dashboard →
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
