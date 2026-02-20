// src/app/api/plan/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Plan from "@/models/Plan";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const plans = await Plan.find({ userId: session.user.id }).lean();

    return NextResponse.json({ success: true, data: plans });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

    const body = await req.json();
    const { title, totalDays, startDate } = body;

    if (!title || !totalDays || !startDate) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    /* =========================
       🔒 MAX 5 PLAN LIMIT
    ========================== */

    const planCount = await Plan.countDocuments({
      userId: session.user.id,
    });

    if (planCount >= 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum 5 plans allowed. Delete an old plan first.",
        },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + totalDays - 1);

    const plan = await Plan.create({
      userId: session.user.id,
      title,
      totalDays,
      startDate: start,
      endDate: end,
    });

    return NextResponse.json(
      { success: true, data: plan },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}