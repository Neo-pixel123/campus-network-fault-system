import crypto from "crypto";
import { cookies } from "next/headers";
import { redis } from "./redis";

export const SESSION_COOKIE = "session";
export const SESSION_TTL = 8 * 60 * 60; // 8 hours, in seconds

// Session data lives in Redis: key session:<random token>, value = user JSON, expires after 8 h
export async function createSession(user) {
  const token = crypto.randomBytes(32).toString("hex");
  await redis.set(`session:${token}`, JSON.stringify(user), "EX", SESSION_TTL);
  return token;
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const data = await redis.get(`session:${token}`);
  return data ? JSON.parse(data) : null;
}

export async function destroySession(token) {
  if (token) await redis.del(`session:${token}`);
}

export const isAdmin = (user) => user?.role === "ADMIN";
