// src/app/api/task/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { createTask } from "@/controllers/task.controller";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Plan from "@/models/Plan";
import Task from "@/models/Task";

export async function POST(req: Request) {
  try {
    await connectDB();

    const task = await createTask(req);

    return NextResponse.json(
      { success: true, data: task },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("planId");

    if (!planId) {
      return NextResponse.json(
        { success: false, error: "planId required" },
        { status: 400 }
      );
    }

    // 🔐 Verify ownership
    const plan = await Plan.findById(planId);
    if (!plan || plan.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const tasks = await Task.find({ planId }).lean();

    return NextResponse.json(
      { success: true, data: tasks },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}