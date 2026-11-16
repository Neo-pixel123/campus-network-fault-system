import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDashboard } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { data, source } = await getDashboard();
  return NextResponse.json(data, { headers: { "X-Cache-Source": source } });
}
