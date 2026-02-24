"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function MyPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [days, setDays] = useState(30);
  const [tasks, setTasks] = useState<string[]>([""]);
  const [creating, setCreating] = useState(false);

  // ✅ Confirm dialog state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const router = useRouter();

  async function safeJson(res: Response) {
    try {
      return await res.json();
    } catch {
      return {};
    }
  }

  async function loadPlans() {
    const res = await fetch("/api/plan", { credentials: "include" });
    const data = await safeJson(res);
    setPlans(res.ok && data.success ? data.data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadPlans();
  }, []);

  function updateTask(index: number, value: string) {
    const copy = [...tasks];
    copy[index] = value;
    setTasks(copy);
  }

  function addTaskField() {
    setTasks([...tasks, ""]);
  }

  async function createPlan() {
    const filtered = tasks.filter((t) => t.trim() !== "");

    if (!title.trim() || filtered.length === 0) {
      alert("Add title and at least one task");
      return;
    }

    if (plans.length >= 5) {
      alert("Maximum 5 plans allowed. Delete one first.");
      return;
    }

    setCreating(true);

    const res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        totalDays: days,
        startDate: new Date(),
        tasks: filtered,
      }),
    });

    const data = await safeJson(res);

    if (!res.ok || !data.success) {
      alert(data.error || "Failed");
    } else {
      setTitle("");
      setTasks([""]);
      loadPlans();
    }

    setCreating(false);
  }

  // 🔥 Actual delete function
  async function confirmDeletePlan() {
    if (!selectedPlanId) return;

    const res = await fetch(`/api/plan/${selectedPlanId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await safeJson(res);

    if (!res.ok || !data.success) {
      alert(data.error || "Delete failed");
    } else {
      loadPlans();
    }

    setIsConfirmOpen(false);
    setSelectedPlanId(null);
  }

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto space-y-10">

        <h1 className="text-3xl font-bold">My Plans</h1>

    {/* CREATE PLAN */}
<div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8 backdrop-blur-md">

  <div>
    <h2 className="text-2xl font-semibold mb-2">Create New Plan</h2>
    <p className="text-sm text-white/50">
      Define your goal duration and daily tasks.
    </p>
  </div>

  {/* Plan Info */}
  <div className="grid md:grid-cols-2 gap-6">

    {/* Title */}
    <div>
      <label className="block text-sm text-white/60 mb-2">
        Plan Title
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Example: 30 Days Fitness Challenge"
        className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 
                   focus:border-neutral-500 focus:outline-none transition"
      />
    </div>

    {/* Duration */}
    <div>
      <label className="block text-sm text-white/60 mb-2">
        Duration (Days)
      </label>
      <input
        type="number"
        min={1}
        max={365}
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
        className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 
                   focus:border-neutral-500 focus:outline-none transition"
      />
    </div>

  </div>

  {/* Tasks */}
  <div>
    <label className="block text-sm text-white/60 mb-4">
      Daily Tasks
    </label>

    <div className="space-y-3">
      {tasks.map((task, i) => (
        <input
          key={i}
          value={task}
          onChange={(e) => updateTask(i, e.target.value)}
          placeholder={`Task ${i + 1}`}
          className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 
                     focus:border-neutral-500 focus:outline-none transition"
        />
      ))}
    </div>

  <button
  onClick={addTaskField}
  className="mt-4 px-5 py-5 bg-neutral-700 hover:bg-neutral-900 
             text-white rounded-lg text-sm font-medium 
             transition-all duration-200"
>
  + Add Another Task
</button>
  </div>

  {/* Action Button */}
  <div className="flex justify-between items-center pt-4 border-t border-white/10">
    <p className="text-xs text-white/40">
      Maximum 5 active plans allowed.
    </p>

    <button
      onClick={createPlan}
      disabled={creating}
      className="bg-emerald-500/50 hover:bg-emerald-700 px-6 py-3 rounded-lg 
                 font-medium transition disabled:opacity-50"
    >
      {creating ? "Creating..." : "Create Plan"}
    </button>
  </div>

</div>

        {/* PLAN LIST */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white/5 p-5 rounded-xl border border-white/10 hover:bg-white/10 transition"
            >
              <div
                onClick={() => router.push(`/plan/${plan._id}`)}
                className="cursor-pointer"
              >
                <h3 className="font-semibold">{plan.title}</h3>
                <p className="text-sm text-white/60">
                  {plan.totalDays} days
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanId(plan._id);
                  setIsConfirmOpen(true);
                }}
                className="mt-3 text-xs text-red-400"
              >
                Delete Plan
              </button>
            </div>
          ))}
        </div>

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Delete Plan"
          message="This plan will be permanently deleted. This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          onCancel={() => {
            setIsConfirmOpen(false);
            setSelectedPlanId(null);
          }}
          onConfirm={confirmDeletePlan}
        />

      </div>
    </div>
  );
}