import { query } from "@/lib/db";
import { getUsers } from "@/lib/data";
import ReportForm from "./ReportForm";

export const dynamic = "force-dynamic";

export default async function NewReport() {
  const [users, devices] = await Promise.all([
    getUsers(),
    query(`SELECT nd.device_id, nd.device_name, l.location_name
           FROM NETWORK_DEVICE nd JOIN LOCATION l ON l.location_id = nd.location_id`),
  ]);
  return (
    <>
      <div className="page-head"><h1>Report a Fault</h1></div>
      <ReportForm users={users} devices={devices} />
    </>
  );
}
