


"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart, ComposedChart
} from 'recharts';

export default function PlanWorkspace() {
  const { planId } = useParams();

  const [plan, setPlan] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const [taskTitle, setTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('line');


  async function safeJson(res: Response) {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      console.error("Invalid JSON:", text);
      return {};
    }
  }


  async function loadPlan() {
    try {
      const res = await fetch(`/api/plan/${planId}`, {
        credentials: "include",
      });
      const data = await safeJson(res);
      if (res.ok && data.success) setPlan(data.data);
    } catch (err) {
      console.error("Plan load failed:", err);
    }
  }

  async function loadTasks() {
    try {
      const res = await fetch(`/api/task/${planId}`, {
        credentials: "include",
      });
      const data = await safeJson(res);
      setTasks(res.ok && data.success ? data.data || [] : []);
    } catch (err) {
      console.error("Task load failed:", err);
      setTasks([]);
    }
  }

  async function loadProgress() {
    try {
      const res = await fetch(`/api/progress/${planId}`, {
        credentials: "include",
      });
      const data = await safeJson(res);

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
      console.error("Progress load failed:", err);
      setProgressMap({});
    }
  }




  async function toggle(taskId: string, day: number) {
    const key = `${taskId}-${day}`;
    const newValue = !progressMap[key];

    setProgressMap((prev) => ({ ...prev, [key]: newValue }));

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          taskId,
          dayNumber: day,
          completed: newValue,
        }),
      });

      const data = await safeJson(res);

      if (!res.ok || !data.success) {
        setProgressMap((prev) => ({ ...prev, [key]: !newValue }));
      }
    } catch {
      setProgressMap((prev) => ({ ...prev, [key]: !newValue }));
    }
  }


  useEffect(() => {
    if (!planId) return;
    Promise.all([loadPlan(), loadTasks(), loadProgress()]).finally(() =>
      setLoading(false)
    );
  }, [planId]);




  let activeDay = 0;

  if (plan?.startDate) {
    const today = new Date();
    const start = new Date(plan.startDate);

    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    activeDay =
      Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
  }


  const totalCells = (plan?.totalDays || 0) * tasks.length;
  const completedCount = Object.values(progressMap).filter(Boolean).length;
  const completionPercent =
    totalCells === 0
      ? 0
      : Math.round((completedCount / totalCells) * 100);


  const streak = useMemo(() => {
    if (!activeDay || !plan) return 0;

    let currentStreak = 0;

    for (let d = activeDay; d >= 1; d--) {
      let allDone = true;

      for (const t of tasks) {
        if (!progressMap[`${t._id}-${d}`]) {
          allDone = false;
          break;
        }
      }

      if (allDone) currentStreak++;
      else break;
    }

    return currentStreak;
  }, [progressMap, tasks, activeDay, plan]);


const taskProgress = useMemo(() => {
  if (!plan) return [];

  return tasks.map((t) => {
    let done = 0;

    for (let d = 1; d <= plan.totalDays; d++) {
      if (progressMap[`${t._id}-${d}`]) done++;
    }

    const percent =
      plan.totalDays === 0
        ? 0
        : Math.round((done / plan.totalDays) * 100);

    return {
      _id: t._id,            
      name: t.title,
      value: percent,
      completed: done,
      total: plan.totalDays,
    };
  });
}, [tasks, progressMap, plan]);


  const dailyProgressData = useMemo(() => {
    if (!plan) return [];

    const data = [];
    for (let d = 1; d <= (activeDay || plan.totalDays); d++) {
      let completedToday = 0;
      for (const t of tasks) {
        if (progressMap[`${t._id}-${d}`]) completedToday++;
      }
      const percent = tasks.length > 0 ? Math.round((completedToday / tasks.length) * 100) : 0;
      
      data.push({
        day: d,
        completed: completedToday,
        total: tasks.length,
        percent,
        isActive: d === activeDay,
        isFuture: d > (activeDay || 0)
      });
    }
    return data;
  }, [progressMap, tasks, activeDay, plan]);


  function getHeatColor(checked: boolean, locked: boolean) {
    if (locked) return "bg-gray-700";
    if (!checked) return "bg-gray-800 hover:bg-gray-700";
    return "bg-emerald-600 hover:bg-emerald-500";
  }


  const CHART_COLORS = {
    primary: '#10b981',
    secondary: '#3b82f6',
    accent: '#8b5cf6',
    warning: '#f59e0b',
    danger: '#ef4444',
    background: '#1f2937',
    grid: '#374151',
    text: '#9ca3af'
  };

  const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-300">
        Loading...
      </div>
    );
  }

  if (!plan) {
    return <div className="min-h-screen bg-neutral-900 p-6 text-gray-300">Plan not found</div>;
  }


  return (
    <div className="min-h-screen bg-white/5 p-6  border-white/10 text-gray-100">
      <div className="bg-white/5 p-6 rounded-xl shadow-xl border border-white/10 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">{plan.title}</h1>
          <div className="flex gap-3">
            <div className="text-sm bg-white/5 text-emerald-400 px-3 py-1 rounded-full border border-gray-600">
              Overall: {completionPercent}%
            </div>
            <div className="text-sm bg-white/5 text-amber-400 px-3 py-1 rounded-full border border-gray-600">
              Streak: {streak} 🔥
            </div>
          </div>
        </div>

   

        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-max border-collapse w-full text-sm">
            <thead>
              <tr className="bg-white/3">
                <th className="sticky left-0 bg-white/10 border-gray-600 p-3 z-10 text-left text-gray-300 font-semibold">
                  Day
                </th>
                {tasks.map((t) => (
                  <th key={t._id} className="border-gray-600 p-3 text-gray-300 font-semibold">
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
                    className={`${isActive ? 'bg-white/4' : ''} hover:bg-gray-700/30 transition-colors`}
                  >
                    <td className="sticky left-0 bg-white/5 border-gray-700 p-3 font-medium text-gray-400">
                      Day {day}
                      {isActive && <span className="ml-2 text-emerald-400">●</span>}
                    </td>

                    {tasks.map((t) => {
                      const key = `${t._id}-${day}`;
                      const checked = progressMap[key] || false;

                      return (
                        <td key={t._id} className="border-gray-700 text-center p-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={locked}
                            onChange={() => toggle(t._id, day)}
                            className={`w-4 h-4 rounded ${
                              locked
                                ? "opacity-40 cursor-not-allowed"
                                : "cursor-pointer accent-emerald-500"
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


        <div className="mt-10 space-y-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-white">Progress Analytics</h2>
            
            <div className="flex gap-2 bg-gray-700 p-1 rounded-lg">
              {['line', 'bar', 'area', 'composed'].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveChart(type)}
                  className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                    activeChart === type 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-700">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'line' ? (
                  <LineChart data={dailyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="day" stroke={CHART_COLORS.text} />
                    <YAxis stroke={CHART_COLORS.text} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="percent" 
                      name="Completion %" 
                      stroke={CHART_COLORS.primary} 
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS.primary }}
                    />
                  </LineChart>
                ) : activeChart === 'bar' ? (
                  <BarChart data={dailyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="day" stroke={CHART_COLORS.text} />
                    <YAxis stroke={CHART_COLORS.text} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="completed" name="Completed Tasks" fill={CHART_COLORS.primary} />
                    <Bar dataKey="total" name="Total Tasks" fill={CHART_COLORS.secondary} />
                  </BarChart>
                ) : activeChart === 'area' ? (
                  <AreaChart data={dailyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="day" stroke={CHART_COLORS.text} />
                    <YAxis stroke={CHART_COLORS.text} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="percent" 
                      name="Completion %" 
                      stroke={CHART_COLORS.primary}
                      fill={CHART_COLORS.primary}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                ) : (
                  <ComposedChart data={dailyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="day" stroke={CHART_COLORS.text} />
                    <YAxis stroke={CHART_COLORS.text} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="completed" name="Completed" fill={CHART_COLORS.secondary} />
                    <Line type="monotone" dataKey="percent" name="%" stroke={CHART_COLORS.primary} strokeWidth={2} />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-2">Completion Rate</h3>
              <div className="text-2xl font-bold text-white">{completionPercent}%</div>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {completedCount} / {totalCells} tasks
              </div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-2">Current Streak</h3>
              <div className="text-2xl font-bold text-amber-400">{streak} days 🔥</div>
              <div className="mt-2 text-xs text-gray-400">
                {streak > 0 ? 'Keep it up!' : 'Start your streak today!'}
              </div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-xl border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-2">Today's Progress</h3>
              {activeDay > 0 && activeDay <= plan.totalDays ? (
                <>
                  <div className="text-2xl font-bold text-white">
                    {dailyProgressData[activeDay - 1]?.completed || 0} / {tasks.length}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {tasks.length - (dailyProgressData[activeDay - 1]?.completed || 0)} tasks remaining
                  </div>
                </>
              ) : (
                <div className="text-gray-400">No active day</div>
              )}
            </div>
          </div>

          <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Task Breakdown</h3>
            <div className="space-y-4">
              {taskProgress.map((t) => (
<div key={t._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{t.name}</span>
                    <span className="text-emerald-400 font-medium">{t.value}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all rounded-full"
                      style={{ width: `${t.value}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t.completed} / {t.total} days completed
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Overview</h3>
            <div className="grid grid-cols-7 gap-2">
              {dailyProgressData.slice(-7).map((day) => (
                <div key={day.day} className="text-center">
                  <div className="text-xs text-gray-400 mb-1">D{day.day}</div>
                  <div 
                    className={`h-12 rounded-lg flex items-center justify-center text-xs font-medium
                      ${day.isFuture ? 'bg-gray-700 text-gray-500' :
                        day.percent === 100 ? 'bg-emerald-600 text-white' :
                        day.percent > 66 ? 'bg-emerald-600/70 text-white' :
                        day.percent > 33 ? 'bg-emerald-600/40 text-white' :
                        day.percent > 0 ? 'bg-emerald-600/20 text-gray-300' :
                        'bg-gray-700 text-gray-500'
                      }`}
                  >
                    {day.percent}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


