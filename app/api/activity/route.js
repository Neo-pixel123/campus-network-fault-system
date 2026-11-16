import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getRedisInsights } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Login required" }, { status: 401 });
  return NextResponse.json(await getRedisInsights());
}
