import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/rbac";

export async function GET() {
  const session = await requireAuth();
  return NextResponse.json(session.user);
}