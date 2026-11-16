"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState("user");
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
      body: JSON.stringify({ email, password, mode }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) return setError(json.error);
    router.push("/");
    router.refresh();
  }

  return (
    <form className="card login-card" onSubmit={submit}>
      <div className="tabs">
        <button type="button" className={mode === "user" ? "on" : ""} onClick={() => { setMode("user"); setError(""); }}>User login</button>
        <button type="button" className={mode === "admin" ? "on" : ""} onClick={() => { setMode("admin"); setError(""); }}>Admin login</button>
      </div>
      <label>Email
        <input name="email" type="email" required placeholder={mode === "admin" ? "admin@campus.edu" : "you@campus.edu"} />
      </label>
      <label>Password
        <input name="password" type="password" required />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? "Signing in…" : mode === "admin" ? "Sign in as admin" : "Sign in"}</button>
    </form>
  );
}
