"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [plan, setPlan] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [days, setDays] = useState(30);
  const [startDate, setStartDate] = useState("");
  const [taskTitle, setTaskTitle] = useState("");

  /* ================= LOAD PLAN ================= */

  async function loadPlan() {
    try {
      const res = await fetch("/api/plan", { credentials: "include" });

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setPlan(data[0]);
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error("Plan load failed:", err);
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }

  /* ================= LOAD TASKS ================= */
async function loadTasks(planId: string) {
  try {
    const res = await fetch(`/api/task?planId=${planId}`, {
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error("Task API error:", data.error);
      setTasks([]);
      return;
    }

    setTasks(data.data || []);
  } catch (err) {
    console.error("Task load failed:", err);
    setTasks([]);
  }
}

  /* ================= LOAD PROGRESS ================= */

async function loadProgress(planId: string) {
  try {
    const res = await fetch(`/api/progress/${planId}`, {
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setProgressMap({});
      return;
    }

    const map: Record<string, boolean> = {};

    data.data.forEach((p: any) => {
      map[`${p.taskId}-${p.dayNumber}`] = p.completed;
    });

    setProgressMap(map);
  } catch (err) {
    setProgressMap({});
  }
}
  /* ================= EFFECTS ================= */

  useEffect(() => {
    loadPlan();
  }, []);

  useEffect(() => {
    if (plan?._id) {
      loadTasks(plan._id);
      loadProgress(plan._id);
    }
  }, [plan]);

  /* ================= CREATE PLAN ================= */

  async function createPlan() {
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          totalDays: days,
          startDate,
        }),
      });

      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.error("Create plan failed:", err);
    }
  }

  /* ================= ADD TASK ================= */

  async function addTask() {
    if (!plan?._id) return;

    try {
      await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan._id,
          title: taskTitle,
        }),
      });

      setTaskTitle("");
      loadTasks(plan._id);
    } catch (err) {
      console.error("Add task failed:", err);
    }
  }

  /* ================= TOGGLE PROGRESS ================= */

async function toggle(taskId: string, day: number) {
  if (!plan?._id) return;

  const key = `${taskId}-${day}`;
  const newValue = !progressMap[key];

  try {
    const res = await fetch("/api/progress", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planId: plan._id,
        taskId,
        dayNumber: day,
        completed: newValue,
      }),
    });

    // 🔥 SAFETY CHECK
    const text = await res.text();

    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      console.error("Invalid JSON response:", text);
      alert("Server error. Check backend.");
      return;
    }

    if (!res.ok || !data.success) {
      console.error("Save failed:", data.error);
      alert(data.error || "Save failed");
      return;
    }

    setProgressMap((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  } catch (err) {
    console.error("Toggle error:", err);
  }
}
  /* ================= ACTIVE DAY CALC ================= */

  let activeDay = 0;

  if (plan?.startDate) {
    const today = new Date();
    const start = new Date(plan.startDate);

    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diff =
      Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;

    activeDay = diff;
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* ================= NO PLAN ================= */

  if (!plan) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-[420px] space-y-4">
          <h1 className="text-xl font-bold text-center">
            Create Study Plan
          </h1>

          <input
            placeholder="Plan Title"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Total Days"
            className="w-full border p-2 rounded"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <button
            onClick={createPlan}
            className="w-full bg-black text-white py-2 rounded"
          >
            Create Plan
          </button>
        </div>
      </div>
    );
  }

  /* ================= PROGRESS METRICS ================= */

  const totalCells = plan.totalDays * tasks.length;
  const completedCount = Object.values(progressMap).filter(Boolean).length;
  const completionPercent =
    totalCells === 0
      ? 0
      : Math.round((completedCount / totalCells) * 100);

  /* ================= MATRIX UI ================= */

  return (
    <div className="min-h-screen bg-zinc-100 p-6 text-black">
      <div className="bg-white p-6 rounded-xl shadow space-y-6">

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{plan.title}</h1>
          <div className="text-sm bg-green-100 px-3 py-1 rounded">
            Overall Progress: {completionPercent}%
          </div>
        </div>

        {/* ADD TASK */}
        <div className="flex gap-2">
          <input
            placeholder="New Task"
            className="border p-2 rounded w-full"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-black text-black px-4 rounded"
          >
            Add
          </button>
        </div>

        {/* MATRIX */}
        <div className="overflow-x-auto">
          <table className="min-w-max border-collapse w-full text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white border p-2 z-10">
                  Day
                </th>

                {Array.isArray(tasks) &&
                  tasks.map((t) => (
                    <th key={t._id} className="border p-2">
                      {t.title}
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: plan.totalDays }).map((_, i) => {
                const day = i + 1;
                const isActive = day === activeDay;
                const locked = day !== activeDay;

                return (
                  <tr
                    key={day}
                    className={isActive ? "bg-green-50" : ""}
                  >
                    <td className="sticky left-0 bg-white border p-2 font-medium">
                      Day {day}
                    </td>

                    {Array.isArray(tasks) &&
                      tasks.map((t) => {
                        const key = `${t._id}-${day}`;
                        const checked = progressMap[key] || false;

                        return (
                          <td
                            key={t._id}
                            className="border text-center p-2"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={locked}
                              onChange={() => toggle(t._id, day)}
                              className={`w-4 h-4 ${
                                locked
                                  ? "opacity-40 cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                            />
                          </td>
                        );
                      })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}