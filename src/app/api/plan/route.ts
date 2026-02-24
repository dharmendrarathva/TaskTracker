
import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Plan from "@/models/Plan";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Task from "@/models/Task";


export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ success: false }, { status: 401 });

    const body = await req.json();
    const { title, totalDays, startDate, tasks } = body;

    if (!title || !totalDays || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    const planCount = await Plan.countDocuments({
      userId: session.user.id,
    });

    if (planCount >= 5) {
      return NextResponse.json(
        { success: false, error: "Max 5 plans allowed" },
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

    const taskDocs = tasks.map((t: string) => ({
      planId: plan._id,
      title: t,
    }));

    await Task.insertMany(taskDocs);

    return NextResponse.json({ success: true, data: plan });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

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

