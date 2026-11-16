import Link from "next/link";
import { getReports } from "@/lib/data";
import Badge from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function Reports() {
  const reports = await getReports();
  return (
    <>
      <div className="page-head">
        <h1>Fault Reports</h1>
        <Link className="btn" href="/reports/new">+ Report a fault</Link>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>#</th><th>Device</th><th>Location</th><th>Type</th><th>Priority</th><th>Status</th><th>Reported by</th><th>Technician</th><th>Reported at</th></tr></thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.report_id}>
                <td><Link href={`/reports/${r.report_id}`}>#{r.report_id}</Link></td>
                <td>{r.device_name}</td>
                <td>{r.building} {r.room_no}</td>
                <td>{r.fault_type}</td>
                <td><Badge value={r.priority} /></td>
                <td><Badge value={r.status} /></td>
                <td>{r.reported_by}</td>
                <td>{r.technician_name ?? <span className="muted">—</span>}</td>
                <td>{r.reported_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
