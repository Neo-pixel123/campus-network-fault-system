import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { redis, KEYS, logActivity } from "@/lib/redis";

export async function POST(req, { params }) {
  const { id } = await params;
  const { notes } = await req.json();
  try {
    // Stored procedure; trigger trg_after_resolution_insert closes the loop
    await query(`CALL sp_resolve_report(?, ?)`, [id, notes]);
    await redis.del(KEYS.dashboard);
    await logActivity("RESOLVED", `#${id} resolved: ${notes}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.sqlMessage ?? e.message }, { status: 400 });
  }
}
