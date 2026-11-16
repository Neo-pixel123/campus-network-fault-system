import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { redis, KEYS, logActivity } from "@/lib/redis";
import { getSession, isAdmin } from "@/lib/auth";

export async function POST(req, { params }) {
  if (!isAdmin(await getSession())) {
    return NextResponse.json({ error: "Only admins can assign faults" }, { status: 403 });
  }
  const { id } = await params;
  const { technician_id } = await req.json();
  try {
    // Stored procedure; trigger trg_after_assignment_insert updates statuses
    await query(`CALL sp_assign_technician(?, ?)`, [id, technician_id]);
    const [t] = await query(`SELECT name FROM TECHNICIAN WHERE technician_id = ?`, [technician_id]);
    await redis.del(KEYS.dashboard);
    await logActivity("ASSIGNED", `#${id} assigned to ${t.name}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.sqlMessage ?? e.message }, { status: 400 });
  }
}
