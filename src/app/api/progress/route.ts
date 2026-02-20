// src/app/api/progress/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { toggleProgress } from "@/controllers/progress.controller";

export async function POST(req: Request) {
  try {
    await connectDB();

    const result = await toggleProgress(req);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}