import { getTechnicians } from "@/lib/data";
import Badge from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function Technicians() {
  const techs = await getTechnicians();
  return (
    <>
      <div className="page-head"><h1>Technicians</h1></div>
      <section className="tech-grid">
        {techs.map((t) => (
          <div className="card tech" key={t.technician_id}>
            <div className="avatar">{t.name.split(" ").map((p) => p[0]).join("")}</div>
            <h2>{t.name}</h2>
            <p className="muted">{t.expertise}</p>
            <Badge value={t.availability_status} />
            <p className="small">{t.email} · {t.phone}</p>
            <p><b>{t.total_jobs}</b> jobs · <b>{Number(t.completed ?? 0)}</b> completed</p>
          </div>
        ))}
      </section>
    </>
  );
}
