"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPES = ["CONNECTIVITY", "WIRELESS", "HARDWARE", "CONFIGURATION", "PERFORMANCE"];

export default function ReportForm({ users, devices, user, admin }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body = Object.fromEntries(new FormData(e.target));
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) return setError(json.error);
    router.push(`/reports/${json.report_id}`);
    router.refresh();
  }

  return (
    <form className="card form" onSubmit={submit}>
      <label>Reported by
        {admin
          ? <select name="user_id" required>{users.map((u) => <option key={u.user_id} value={u.user_id}>{u.name} ({u.role})</option>)}</select>
          : <input value={`${user.name} (${user.role})`} disabled />}
      </label>
      <label>Device
        <select name="device_id" required>{devices.map((d) => <option key={d.device_id} value={d.device_id}>{d.device_name} — {d.location_name}</option>)}</select>
      </label>
      <div className="row">
        <label>Fault type
          <select name="fault_type">{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        <label>Priority
          <select name="priority" defaultValue="MEDIUM">{["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => <option key={p}>{p}</option>)}</select>
        </label>
      </div>
      <label>Description
        <textarea name="description" rows={4} required placeholder="What is going wrong?" />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? "Submitting…" : "Submit report"}</button>
    </form>
  );
}
