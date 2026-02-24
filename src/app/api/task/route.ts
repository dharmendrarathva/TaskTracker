// src/app/api/task/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Task from "@/models/Task";
import Plan from "@/models/Plan";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateActiveDay } from "@/lib/date";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { planId, title } = body;

    if (!planId || !title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    const plan = await Plan.findById(planId);

    if (!plan || plan.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }



    const activeDay = calculateActiveDay(
      plan.startDate,
      plan.totalDays
    );

    if (activeDay <= 0) {
      return NextResponse.json(
        { success: false, error: "Plan not started yet" },
        { status: 400 }
      );
    }

    if (activeDay !== 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Plan locked. Tasks can only be added on Day 1.",
        },
        { status: 403 }
      );
    }

    /* =============================
       CREATE TASK
    ============================== */

    const task = await Task.create({
      planId,
      title: title.trim(),
    });

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