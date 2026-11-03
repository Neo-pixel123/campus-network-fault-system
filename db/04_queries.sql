-- Campus Network Fault Reporting System : Queries
USE campus_network_fault_reporting;

-- 1. GROUP BY + aggregate: fault count per building and priority
SELECT l.building, fr.priority, COUNT(*) AS total_faults
FROM FAULT_REPORT fr
JOIN NETWORK_DEVICE nd ON fr.device_id = nd.device_id
JOIN LOCATION l ON nd.location_id = l.location_id
GROUP BY l.building, fr.priority
ORDER BY total_faults DESC;

-- 2. Average resolution time (minutes) per technician
SELECT t.name, COUNT(r.resolution_id) AS resolved,
       ROUND(AVG(TIMESTAMPDIFF(MINUTE, fr.reported_at, r.resolved_at)),1) AS avg_minutes
FROM TECHNICIAN t
JOIN ASSIGNMENT a ON a.technician_id = t.technician_id
JOIN FAULT_REPORT fr ON fr.report_id = a.report_id
JOIN RESOLUTION r ON r.report_id = fr.report_id
GROUP BY t.name;

-- 3. UPDATE: escalate old open LOW/MEDIUM faults to HIGH
UPDATE FAULT_REPORT
SET priority = 'HIGH'
WHERE status = 'OPEN' AND priority IN ('LOW','MEDIUM')
  AND reported_at < NOW() - INTERVAL 7 DAY;

-- 4. DELETE: remove users who never filed a report and are not ADMIN
DELETE FROM SYSTEM_USER
WHERE role <> 'ADMIN'
  AND user_id NOT IN (SELECT user_id FROM (SELECT DISTINCT user_id FROM FAULT_REPORT) x);

-- 5. Correlated query: devices with more faults than the average for their type
SELECT nd.device_name, nd.device_type,
       (SELECT COUNT(*) FROM FAULT_REPORT f WHERE f.device_id = nd.device_id) AS faults
FROM NETWORK_DEVICE nd
WHERE (SELECT COUNT(*) FROM FAULT_REPORT f WHERE f.device_id = nd.device_id) >=
      (SELECT AVG(cnt) FROM (
          SELECT d2.device_id, COUNT(f2.report_id) AS cnt
          FROM NETWORK_DEVICE d2 LEFT JOIN FAULT_REPORT f2 ON f2.device_id = d2.device_id
          WHERE d2.device_type = nd.device_type
          GROUP BY d2.device_id) t);

-- 6. Nested query: open reports whose device sits in the 'North' zone
SELECT report_id, fault_type, priority, status
FROM FAULT_REPORT
WHERE status <> 'RESOLVED'
  AND device_id IN (SELECT device_id FROM NETWORK_DEVICE
                    WHERE location_id IN (SELECT location_id FROM LOCATION
                                          WHERE campus_zone = 'North'));

-- 7. Function / procedure / trigger demo
SELECT device_name, fn_open_fault_count(device_id) AS open_faults FROM NETWORK_DEVICE;
CALL sp_assign_technician(4, 3);
SELECT report_id, status FROM FAULT_REPORT WHERE report_id = 4;
SELECT name, availability_status FROM TECHNICIAN WHERE technician_id = 3;
