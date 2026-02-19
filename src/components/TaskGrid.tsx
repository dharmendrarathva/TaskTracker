

"use client";

import { AiFillFire } from "react-icons/ai";



interface Props {
  completedDays: number;
  totalDays: number;
  streak: number;
}

export default function TaskGrid({ completedDays, totalDays, streak }: Props) {
  const progress = Math.round((completedDays / totalDays) * 100);

  return (
    <div className="relative bg-gradient-to-br from-[#141414] to-[#1a1a1a] 
      p-8 rounded-3xl border border-gray-800 shadow-xl overflow-hidden">

      {/* Glow Effect */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />

      <h2 className="text-2xl font-bold mb-6 text-white tracking-wide">
        🚀 Performance Overview
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-[#181818] p-5 rounded-xl border border-gray-800 hover:border-indigo-500 transition">
          <p className="text-gray-400 text-sm">Completed</p>
          <h3 className="text-2xl font-bold text-white/90 mt-1">
            {completedDays} / {totalDays}
          </h3>
        </div>

        <div className="bg-[#181818] p-5 rounded-xl border border-gray-800 hover:border-green-500 transition">
          <p className="text-gray-400 text-sm">Current Streak</p>
          <h3 className="text-2xl font-bold text-white/90 mt-1">
            <AiFillFire className="inline mr-2 text-amber-500" /> {streak} days
          </h3>
        </div>

        <div className="bg-[#181818] p-5 rounded-xl border border-gray-800 hover:border-yellow-500 transition">
          <p className="text-gray-400 text-sm">Remaining</p>
          <h3 className="text-2xl font-bold text-white/90 mt-1">
            {totalDays - completedDays}
          </h3>
        </div>

      </div>

    </div>
  );
}
