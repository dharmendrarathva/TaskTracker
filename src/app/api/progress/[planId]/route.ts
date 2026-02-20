

import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Progress from "@/models/Progress";
import Plan from "@/models/Plan";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ planId: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { planId } = await context.params;
const plan = await Plan.findById(planId).lean();

if (!plan || plan.userId.toString() !== session.user.id) {
  return NextResponse.json(
    { success: false, error: "Forbidden" },
    { status: 403 }
  );
}

const progress = await Progress.find({ planId }).lean();

    return NextResponse.json({
      success: true,
      data: progress,
      meta: {
        totalDays: plan.totalDays,
        startDate: plan.startDate,
        endDate: plan.endDate,
        title: plan.title,
      },
    });
  } catch (error: any) {
    console.error("Progress GET error:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
