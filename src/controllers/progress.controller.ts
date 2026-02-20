// // src/controllers/progress.controller.ts

// import Progress from "@/models/Progress";
// import Plan from "@/models/Plan";
// import { calculateActiveDay } from "@/lib/date";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function toggleProgress(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     throw new Error("Unauthorized");
//   }

//   const body = await req.json();
//   const { planId, taskId, dayNumber, completed } = body;

//   if (!planId || !taskId || !dayNumber) {
//     throw new Error("Invalid request data");
//   }

//   const plan = await Plan.findById(planId);

//   if (!plan) {
//     throw new Error("Plan not found");
//   }

//   if (plan.userId.toString() !== session.user.id) {
//     throw new Error("Forbidden");
//   }

//   const activeDay = calculateActiveDay(
//     plan.startDate,
//     plan.totalDays
//   );

//   if (activeDay <= 0 || activeDay > plan.totalDays) {
//     throw new Error("Plan not active");
//   }

//   if (dayNumber !== activeDay) {
//     throw new Error("Day locked");
//   }

//   const progress = await Progress.findOneAndUpdate(
//     {
//       planId,
//       taskId,
//       dayNumber,
//     },
//     {
//       $set: {
//         completed: !!completed,
//         date: new Date(),
//       },
//     },
//     {
//       upsert: true,
//       new: true,
//     }
//   );

//   return progress;
// }

import Progress from "@/models/Progress";
import Plan from "@/models/Plan";
import { calculateActiveDay } from "@/lib/date";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function toggleProgress(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const body = await req.json();
  const { planId, taskId, dayNumber, completed } = body;

  if (!planId || !taskId || !dayNumber) {
    throw new Error("Invalid request data");
  }

  const plan = await Plan.findById(planId);

  if (!plan) {
    throw new Error("Plan not found");
  }

  if (plan.userId.toString() !== session.user.id) {
    throw new Error("Forbidden");
  }

  /* =============================
     SERVER-SIDE DAY VALIDATION
  ============================== */

  const activeDay = calculateActiveDay(
    plan.startDate,
    plan.totalDays
  );

  // Bounds check
  if (dayNumber < 1 || dayNumber > plan.totalDays) {
    throw new Error("Invalid day number");
  }

  // Plan must be active
  if (activeDay <= 0 || activeDay > plan.totalDays) {
    throw new Error("Plan not active");
  }

  // Lock future / past days
  if (dayNumber !== activeDay) {
    throw new Error("Day locked");
  }

  /* =============================
     SAFE UPSERT
  ============================== */

  const progress = await Progress.findOneAndUpdate(
    {
      planId,
      taskId,
      dayNumber,
    },
    {
      $set: {
        completed: !!completed,
        date: new Date(), // server authoritative date
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return progress;
}