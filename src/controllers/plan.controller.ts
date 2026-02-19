import Plan from "@/models/Plan";
import { calculateActiveDay } from "@/lib/date";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createPlan(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const body = await req.json();
  const { title, totalDays, startDate } = body;

  if (!title || !totalDays || totalDays < 1 || totalDays > 365) {
    throw new Error("Invalid input");
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

  return plan;
}

export async function getPlans(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const plans = await Plan.find({ userId: session.user.id }).lean();
  return plans;
}