import { NextResponse } from "next/server";
import Progress from "@/models/Progress";
import { requireAuth } from "@/lib/rbac";
import { connectDB } from "@/config/db";


export async function GET() {
  const session = await requireAuth();
  await connectDB();

  const completed = await Progress.countDocuments({
    completed: true,
  });

  return NextResponse.json({
    completedTasks: completed,
  });
}
