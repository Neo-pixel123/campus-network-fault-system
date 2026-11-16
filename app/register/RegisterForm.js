"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    const data = Object.fromEntries(new FormData(e.target));
    if (data.password !== data.confirm) return setError("Passwords do not match");
    setBusy(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) return setError(json.error);
    router.push("/");
    router.refresh();
  }

  return (
    <form className="card login-card" onSubmit={submit}>
      <label>Full name<input name="name" required /></label>
      <label>Email<input name="email" type="email" required placeholder="you@campus.edu" /></label>
      <div className="row">
        <label>Role
          <select name="role" defaultValue="STUDENT">
            <option>STUDENT</option><option>FACULTY</option><option>STAFF</option>
          </select>
        </label>
        <label>Department<input name="department" placeholder="CSE" /></label>
      </div>
      <label>Phone<input name="phone" maxLength={15} /></label>
      <div className="row">
        <label>Password<input name="password" type="password" minLength={6} required /></label>
        <label>Confirm<input name="confirm" type="password" minLength={6} required /></label>
      </div>
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? "Creating account…" : "Register"}</button>
      <p className="switch">Already have an account? <Link href="/login">Log in</Link></p>
    </form>
  );
}
