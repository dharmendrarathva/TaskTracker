"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const { status } = useSession();
  const router = useRouter();

  const handleCreatePlan = () => {
    if (status === "authenticated") {
      router.push("/myplans");
    } else {
      router.push("/api/auth/signin");
    }
  };

  const handleDemo = () => {
    if (status === "authenticated") {
      router.push("/myplans");
    } else {
      router.push("/review");
    }
  };

  return (
    <div>
      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
        Build Consistency.
        <span className="text-blue-400 block">
          Track Your Progress.
        </span>
      </h1>

      <p className="mt-6 text-lg text-gray-300">
        A minimal productivity dashboard designed to help you stay
        consistent, build streaks, and improve daily discipline.
      </p>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleCreatePlan}
          className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
        >
          Create Your Plan
        </button>

        <button
          onClick={handleDemo}
          className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition"
        >
          View Demo
        </button>
      </div>
    </div>
  );
}