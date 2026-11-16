import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { createSession, SESSION_COOKIE, SESSION_TTL } from "@/lib/auth";

export async function POST(req) {
  const { email, password, mode } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }
  // Password is hashed in MySQL and compared with the stored hash
  const [user] = await query(
    `SELECT user_id, name, email, role FROM SYSTEM_USER
     WHERE email = ? AND password_hash = SHA2(?, 256)`,
    [email, password]
  );
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  if (mode === "admin" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "This is not an admin account" }, { status: 403 });
  }
  if (mode !== "admin" && user.role === "ADMIN") {
    return NextResponse.json({ error: "Admins must use the Admin login" }, { status: 403 });
  }
  const token = await createSession(user);
  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: SESSION_TTL,
  });
  return res;
}
