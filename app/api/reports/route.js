import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { allowReport, logActivity, recordNewFault } from "@/lib/redis";
import { getReports } from "@/lib/data";
import { getSession, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Login required" }, { status: 401 });
  return NextResponse.json(await getReports());
}

export async function POST(req) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!(await allowReport(ip))) {
    return NextResponse.json({ error: "Too many reports, try again in a minute" }, { status: 429 });
  }
  const body = await req.json();
  const { device_id, fault_type, description, priority } = body;
  // Users always report as themselves; only an admin may report on behalf of someone else
  const user_id = isAdmin(user) && body.user_id ? body.user_id : user.user_id;
  if (!user_id || !device_id || !fault_type || !description) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  try {
    const result = await query(
      `INSERT INTO FAULT_REPORT (user_id, device_id, fault_type, description, reported_at, priority, status)
       VALUES (?, ?, ?, ?, NOW(), ?, 'OPEN')`,
      [user_id, device_id, fault_type, description, priority || "MEDIUM"]
    );
    const [device] = await query(`SELECT device_name FROM NETWORK_DEVICE WHERE device_id = ?`, [device_id]);
    await recordNewFault({ fault_type, priority, device_name: device.device_name });
    await logActivity("REPORTED", `#${result.insertId} ${fault_type} on ${device.device_name} (${priority})`);
    return NextResponse.json({ report_id: result.insertId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.sqlMessage ?? e.message }, { status: 400 });
  }
}
