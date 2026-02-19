// src/app/api/plan/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import {
  createPlan,
  getPlans,
} from "@/controllers/plan.controller";

export async function POST(req: Request) {
  try {
    await connectDB();

    const plan = await createPlan(req);
    return NextResponse.json(plan, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create plan" },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const plans = await getPlans(req);
    return NextResponse.json(plans);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch plans" },
      { status: 400 }
    );
  }
}