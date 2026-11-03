import { notFound } from "next/navigation";
import { getReport, getTechnicians } from "@/lib/data";
import Badge from "@/components/Badge";
import Actions from "./Actions";

export const dynamic = "force-dynamic";

export default async function ReportDetail({ params }) {
  const { id } = await params;
  const [r, techs] = await Promise.all([getReport(id), getTechnicians()]);
  if (!r) notFound();
  return (
    <>
      <div className="page-head">
        <h1>Fault #{r.report_id} <Badge value={r.status} /></h1>
        <Badge value={r.priority} />
      </div>
      <section className="grid2">
        <div className="card">
          <h2>Details</h2>
          <dl>
            <dt>Fault type</dt><dd>{r.fault_type}</dd>
            <dt>Description</dt><dd>{r.description}</dd>
            <dt>Device</dt><dd>{r.device_name} ({r.device_type}) · {r.ip_address}</dd>
            <dt>Location</dt><dd>{r.location_name}, {r.building} room {r.room_no}</dd>
            <dt>Reported by</dt><dd>{r.reported_by} · {r.email}</dd>
            <dt>Reported at</dt><dd>{r.reported_at}</dd>
          </dl>
        </div>
        <div className="card">
          <h2>Assignment &amp; resolution</h2>
          <dl>
            <dt>Technician</dt><dd>{r.technician_name ?? "Not assigned"}</dd>
            <dt>Assignment</dt><dd>{r.assignment_status ? <Badge value={r.assignment_status} /> : "—"}</dd>
            <dt>Resolution</dt><dd>{r.resolution_notes ?? "—"}</dd>
            <dt>Resolved at</dt><dd>{r.resolved_at ?? "—"}</dd>
          </dl>
          <Actions id={r.report_id} status={r.status} assigned={!!r.technician_name}
                   technicians={techs.filter((t) => t.availability_status === "AVAILABLE")} />
        </div>
      </section>
    </>
  );
}
