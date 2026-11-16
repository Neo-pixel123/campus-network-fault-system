"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { email, password } = Object.fromEntries(new FormData(e.target));
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) return setError(json.error);
    router.push("/");
    router.refresh();
  }

  return (
    <form className="card login-card" onSubmit={submit}>
      <label>Email
        <input name="email" type="email" required placeholder="you@campus.edu" />
      </label>
      <label>Password
        <input name="password" type="password" required />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      <p className="switch">New user? <Link href="/register">Create an account</Link></p>
    </form>
  );
}
