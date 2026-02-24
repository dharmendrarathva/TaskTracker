import Plan from "@/models/Plan";
import { calculateActiveDay } from "@/lib/date";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



export async function getPlans(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const plans = await Plan.find({ userId: session.user.id }).lean();
  return plans;
}