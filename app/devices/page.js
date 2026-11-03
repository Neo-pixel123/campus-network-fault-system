import { getDevices } from "@/lib/data";
import Badge from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function Devices() {
  const devices = await getDevices();
  return (
    <>
      <div className="page-head"><h1>Network Devices</h1><span className="muted">open faults via fn_open_fault_count()</span></div>
      <div className="card">
        <table>
          <thead><tr><th>Device</th><th>Type</th><th>IP address</th><th>MAC address</th><th>Location</th><th>Open faults</th></tr></thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.device_id}>
                <td><b>{d.device_name}</b></td><td><Badge value={d.device_type} /></td>
                <td className="mono">{d.ip_address}</td><td className="mono">{d.mac_address}</td>
                <td>{d.location_name}, {d.building}</td>
                <td><span className={d.open_faults > 0 ? "count warn" : "count"}>{d.open_faults}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
