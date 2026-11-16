import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { createSession, SESSION_COOKIE, SESSION_TTL } from "@/lib/auth";

const ROLES = ["STUDENT", "FACULTY", "STAFF"]; // ADMIN cannot self-register

export async function POST(req) {
  const { name, email, phone, role, department, password } = await req.json();
  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Name, email, role and password are required" }, { status: 400 });
  }
  if (!ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }
  try {
    const result = await query(
      `INSERT INTO SYSTEM_USER (name, email, phone, role, department, registration_date, password_hash)
       VALUES (?, ?, ?, ?, ?, CURDATE(), SHA2(?, 256))`,
      [name, email, phone || null, role, department || null, password]
    );
    // Log the new user straight in
    const user = { user_id: result.insertId, name, email, role };
    const token = await createSession(user);
    const res = NextResponse.json({ ok: true }, { status: 201 });
    res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: SESSION_TTL });
    return res;
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "This email is already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: e.sqlMessage ?? e.message }, { status: 400 });
  }
}
