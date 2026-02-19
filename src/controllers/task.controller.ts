// src/controllers/task.controller.ts

import Task from "@/models/Task";
import Plan from "@/models/Plan";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createTask(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const body = await req.json();
  const { planId, title, estimatedMinutes } = body;

  if (!planId || !title) {
    throw new Error("Missing required fields");
  }

  const plan = await Plan.findById(planId);
  if (!plan) throw new Error("Plan not found");

  if (plan.userId.toString() !== session.user.id) {
    throw new Error("Forbidden");
  }

  const task = await Task.create({
    planId,
    title,
    estimatedMinutes,
  });

  return task;
}

export async function getTasksByPlan(planId: string) {
  if (!planId) throw new Error("planId required");

  const tasks = await Task.find({ planId }).lean();
  return tasks;
}