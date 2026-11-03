import { query } from "./db";
import { redis, KEYS, cached } from "./redis";

export async function getDashboard() {
  return cached(KEYS.dashboard, 60, async () => {
    const [totals] = await query(`
      SELECT COUNT(*) AS total,
             SUM(status IN ('OPEN','ASSIGNED','IN_PROGRESS')) AS active,
             SUM(priority = 'CRITICAL' AND status NOT IN ('RESOLVED','CLOSED')) AS critical,
             SUM(status IN ('RESOLVED','CLOSED')) AS resolved
      FROM FAULT_REPORT`);
    const byStatus = await query(
      `SELECT status, COUNT(*) AS n FROM FAULT_REPORT GROUP BY status ORDER BY n DESC`);
    const byBuilding = await query(`
      SELECT l.building, COUNT(*) AS n
      FROM FAULT_REPORT fr
      JOIN NETWORK_DEVICE nd ON fr.device_id = nd.device_id
      JOIN LOCATION l ON nd.location_id = l.location_id
      GROUP BY l.building ORDER BY n DESC`);
    return {
      totals: Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, Number(v ?? 0)])),
      byStatus, byBuilding,
    };
  });
}

export async function getRedisInsights() {
  const [activity, faultTypes, hot] = await Promise.all([
    redis.lrange(KEYS.activity, 0, 7),
    redis.hgetall(KEYS.faultTypes),
    redis.zrevrange(KEYS.hotDevices, 0, 4, "WITHSCORES"),
  ]);
  const hotDevices = [];
  for (let i = 0; i < hot.length; i += 2) hotDevices.push({ device: hot[i], score: Number(hot[i + 1]) });
  return { activity: activity.map((a) => JSON.parse(a)), faultTypes, hotDevices };
}

export const getReports = () =>
  query(`SELECT * FROM fault_report_status_view ORDER BY reported_at DESC`);

export async function getReport(id) {
  const rows = await query(`
    SELECT fr.*, u.name AS reported_by, u.email, nd.device_name, nd.device_type,
           nd.ip_address, l.location_name, l.building, l.room_no,
           a.assignment_status, a.assigned_at, t.name AS technician_name,
           r.resolution_notes, r.resolved_at
    FROM FAULT_REPORT fr
    JOIN SYSTEM_USER u ON fr.user_id = u.user_id
    JOIN NETWORK_DEVICE nd ON fr.device_id = nd.device_id
    JOIN LOCATION l ON nd.location_id = l.location_id
    LEFT JOIN ASSIGNMENT a ON a.report_id = fr.report_id
    LEFT JOIN TECHNICIAN t ON t.technician_id = a.technician_id
    LEFT JOIN RESOLUTION r ON r.report_id = fr.report_id
    WHERE fr.report_id = ?`, [id]);
  return rows[0];
}

export const getDevices = () =>
  query(`SELECT nd.*, l.location_name, l.building,
                fn_open_fault_count(nd.device_id) AS open_faults
         FROM NETWORK_DEVICE nd JOIN LOCATION l ON l.location_id = nd.location_id
         ORDER BY open_faults DESC, nd.device_name`);

export const getTechnicians = () =>
  query(`SELECT t.*, COUNT(a.assignment_id) AS total_jobs,
                SUM(a.assignment_status = 'COMPLETED') AS completed
         FROM TECHNICIAN t LEFT JOIN ASSIGNMENT a ON a.technician_id = t.technician_id
         GROUP BY t.technician_id ORDER BY t.name`);

export const getUsers = () => query(`SELECT user_id, name, role FROM SYSTEM_USER ORDER BY name`);
