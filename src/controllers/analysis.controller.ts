import mongoose from "mongoose";
import Progress from "@/models/Progress";
import Task from "@/models/Task";

export async function getPlanAnalytics(planId: string) {
  const totalTasks = await Task.countDocuments({ planId });

  const agg = await Progress.aggregate([
    {
      $match: {
        planId: new mongoose.Types.ObjectId(planId),
        completed: true,
      },
    },
    {
      $group: {
        _id: "$dayNumber",
        completedCount: { $sum: 1 },
      },
    },
  ]);

  return {
    totalTasks,
    dailyStats: agg,
  };
}
