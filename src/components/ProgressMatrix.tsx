// "use client";

// import { useEffect, useMemo, useState } from "react";

// interface Plan {
//   _id: string;
//   title: string;
//   totalDays: number;
//   startDate: string;
// }

// interface Task {
//   _id: string;
//   title: string;
// }

// interface Progress {
//   taskId: string;
//   dayNumber: number;
//   completed: boolean;
// }

// export default function ProgressMatrix({ planId }: { planId: string }) {
//   const [plan, setPlan] = useState<Plan | null>(null);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [progress, setProgress] = useState<Progress[]>([]);
//   const [todayIndex, setTodayIndex] = useState<number>(-1);

//   // ===============================
//   // LOAD DATA
//   // ===============================
//   useEffect(() => {
//     loadAll();
//   }, [planId]);

//   const loadAll = async () => {
//     const [planRes, taskRes, progRes] = await Promise.all([
//       fetch(`/api/plan/${planId}`),
//       fetch(`/api/task?planId=${planId}`),
//       fetch(`/api/progress?planId=${planId}`),
//     ]);

//     const planData = await planRes.json();
//     const taskData = await taskRes.json();
//     const progData = await progRes.json();

//     setPlan(planData);
//     setTasks(taskData);
//     setProgress(progData);

//     // 🔥 calculate active day
//     const start = new Date(planData.startDate);
//     const today = new Date();

//     const diff = Math.floor(
//       (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
//     );

//     setTodayIndex(diff + 1); // dayNumber is 1-based
//   };

//   // ===============================
//   // BUILD MATRIX HELPERS
//   // ===============================
//   const isChecked = (taskId: string, day: number) => {
//     return progress.some(
//       (p) =>
//         p.taskId === taskId &&
//         p.dayNumber === day &&
//         p.completed === true
//     );
//   };

//   const isEditable = (day: number) => {
//     return day === todayIndex;
//   };

//   // ===============================
//   // TOGGLE PROGRESS
//   // ===============================
//   const toggle = async (taskId: string, day: number) => {
//     if (!isEditable(day)) return;

//     await fetch("/api/progress", {
//       method: "POST",
//       body: JSON.stringify({
//         planId,
//         taskId,
//         dayNumber: day,
//         date: new Date(),
//         completed: !isChecked(taskId, day),
//       }),
//     });

//     // optimistic reload
//     loadAll();
//   };

//   // ===============================
//   // GENERATE DAYS
//   // ===============================
//   const days = useMemo(() => {
//     if (!plan) return [];
//     return Array.from({ length: plan.totalDays }, (_, i) => i + 1);
//   }, [plan]);

//   if (!plan) return null;

//   return (
//     <div className="overflow-auto border rounded-2xl bg-zinc-900">
//       <table className="min-w-full text-sm">
//         {/* ================= HEADER ================= */}
//         <thead className="sticky top-0 bg-zinc-950">
//           <tr>
//             <th className="p-3 text-left">Days</th>
//             <th className="p-3 text-left">Dates</th>

//             {tasks.map((task) => (
//               <th key={task._id} className="p-3 text-center">
//                 {task.title}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         {/* ================= BODY ================= */}
//         <tbody>
//           {days.map((day) => {
//             const rowDate = new Date(plan.startDate);
//             rowDate.setDate(rowDate.getDate() + (day - 1));

//             const active = day === todayIndex;

//             return (
//               <tr
//                 key={day}
//                 className={`border-t ${
//                   active ? "bg-blue-950/40" : ""
//                 }`}
//               >
//                 {/* DAY */}
//                 <td className="p-3 font-medium">
//                   Day {day}
//                   {active && (
//                     <span className="text-blue-400 ml-2">(Today)</span>
//                   )}
//                 </td>

//                 {/* DATE */}
//                 <td className="p-3 opacity-70">
//                   {rowDate.toLocaleDateString()}
//                 </td>

//                 {/* TASK CELLS */}
//                 {tasks.map((task) => {
//                   const checked = isChecked(task._id, day);
//                   const editable = isEditable(day);

//                   return (
//                     <td key={task._id} className="p-3 text-center">
//                       <input
//                         type="checkbox"
//                         checked={checked}
//                         disabled={!editable}
//                         onChange={() => toggle(task._id, day)}
//                         className="h-5 w-5 accent-blue-500 cursor-pointer disabled:opacity-30"
//                       />
//                     </td>
//                   );
//                 })}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }
