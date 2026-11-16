import Link from "next/link";
import { getDashboard, getRedisInsights } from "@/lib/data";
import Badge from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [{ data, source }, redisData] = await Promise.all([getDashboard(), getRedisInsights()]);
  const { totals, byStatus, byBuilding } = data;
  const max = Math.max(...byBuilding.map((b) => b.n), 1);

  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
        <span className={`cache ${source}`}>stats served from {source === "redis" ? "Redis cache" : "MySQL (cache miss)"}</span>
      </div>
      <section className="stats">
        <div className="stat"><b>{totals.total}</b><span>Total reports</span></div>
        <div className="stat"><b>{totals.active}</b><span>Active faults</span></div>
        <div className="stat warn"><b>{totals.critical}</b><span>Critical open</span></div>
        <div className="stat ok"><b>{totals.resolved}</b><span>Resolved</span></div>
      </section>

      <section className="grid2">
        <div className="card">
          <h2>Faults by building <small>MySQL · GROUP BY</small></h2>
          {byBuilding.map((b) => (
            <div className="bar-row" key={b.building}>
              <span>{b.building}</span>
              <div className="bar"><i style={{ width: `${(b.n / max) * 100}%` }} /></div>
              <b>{b.n}</b>
            </div>
          ))}
          <h2 style={{ marginTop: 20 }}>By status</h2>
          <div className="chips">
            {byStatus.map((s) => <span key={s.status}><Badge value={s.status} /> {s.n}</span>)}
          </div>
        </div>

        <div className="card">
          <h2>Hot devices <small>Redis · ZSET</small></h2>
          {redisData.hotDevices.length === 0 && <p className="muted">No new reports yet.</p>}
          <ol className="hot">
            {redisData.hotDevices.map((d) => <li key={d.device}><span>{d.device}</span><b>{d.score}</b></li>)}
          </ol>
          <h2 style={{ marginTop: 20 }}>Live activity <small>Redis · LIST</small></h2>
          <ul className="feed">
            {redisData.activity.map((a, i) => (
              <li key={i}><Badge value={a.type} /> {a.message}
                <time>{new Date(a.at).toLocaleTimeString("en-IN")}</time></li>
            ))}
          </ul>
        </div>
      </section>
      <p className="muted"><Link href="/reports">View all reports →</Link></p>
    </>
  );
}
