"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Actions({ id, status, assigned, technicians }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function post(path, body) {
    setError("");
    const res = await fetch(`/api/reports/${id}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return setError((await res.json()).error);
    router.refresh();
  }

  if (status === "RESOLVED" || status === "CLOSED") return null;
  return (
    <div className="actions">
      {!assigned && (
        <form onSubmit={(e) => { e.preventDefault(); post("assign", { technician_id: e.target.tech.value }); }}>
          <select name="tech">{technicians.map((t) => <option key={t.technician_id} value={t.technician_id}>{t.name} — {t.expertise}</option>)}</select>
          <button className="btn">Assign technician</button>
        </form>
      )}
      {assigned && (
        <form onSubmit={(e) => { e.preventDefault(); post("resolve", { notes: e.target.notes.value }); }}>
          <input name="notes" placeholder="Resolution notes" required />
          <button className="btn ok">Mark resolved</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
