-- Campus Network Fault Reporting System : DML (sample data)
USE campus_network_fault_reporting;

INSERT INTO SYSTEM_USER (name,email,phone,role,department,registration_date) VALUES
('Ahan Charan','ahan@campus.edu','9000000001','STUDENT','CSE','2025-08-01'),
('Riya Sharma','riya@campus.edu','9000000002','FACULTY','CSE','2024-07-15'),
('Karan Rao','karan@campus.edu','9000000003','STAFF','ADMIN','2023-06-10'),
('Aman Rao U','aman@campus.edu','9000000004','STUDENT','CSE','2025-08-01'),
('Meera Iyer','meera@campus.edu','9000000005','FACULTY','ECE','2022-01-20'),
('Rohan Das','rohan@campus.edu','9000000006','STUDENT','ME','2026-07-30');

INSERT INTO LOCATION (building,floor_no,room_no,location_name,campus_zone) VALUES
('Main Block',1,'101','CSE Lab 1','North'),
('Main Block',2,'204','CSE Lab 2','North'),
('Library',1,'L01','Digital Library','Central'),
('BE Block',3,'305','ECE Lab','South'),
('Hostel A',0,'G02','Hostel A Lobby','East');

INSERT INTO NETWORK_DEVICE (device_name,device_type,ip_address,mac_address,location_id) VALUES
('CSE-LAB1-SW1','SWITCH','192.168.10.2','00:11:22:33:44:01',1),
('CSE-LAB2-AP1','ACCESS_POINT','192.168.20.10','00:11:22:33:44:02',2),
('LIB-AP1','ACCESS_POINT','192.168.30.10','00:11:22:33:44:03',3),
('ECE-LAB-RTR1','ROUTER','192.168.40.1','00:11:22:33:44:04',4),
('HOSTEL-A-FW1','FIREWALL','192.168.50.1','00:11:22:33:44:05',5),
('LIB-SW1','SWITCH','192.168.30.2','00:11:22:33:44:06',3);

INSERT INTO TECHNICIAN (name,email,phone,expertise,availability_status) VALUES
('Vikram Kumar','vikram@campus.edu','9000000010','Network Support','AVAILABLE'),
('Neha Singh','neha@campus.edu','9000000011','Wireless Networks','BUSY'),
('Arjun Menon','arjun@campus.edu','9000000012','Routing & Firewalls','AVAILABLE');

INSERT INTO FAULT_REPORT
(user_id,device_id,fault_type,description,reported_at,priority,status) VALUES
(1,1,'CONNECTIVITY','No internet access in lab','2026-08-24 09:30:00','HIGH','IN_PROGRESS'),
(2,2,'WIRELESS','Frequent Wi-Fi disconnections','2026-08-24 10:15:00','MEDIUM','ASSIGNED'),
(3,3,'PERFORMANCE','Slow network response','2026-08-24 11:00:00','LOW','RESOLVED'),
(4,4,'HARDWARE','Router power LED blinking amber, no uplink','2026-09-02 14:20:00','CRITICAL','OPEN'),
(5,5,'CONFIGURATION','Firewall blocking LMS portal','2026-09-05 08:45:00','HIGH','OPEN'),
(1,6,'CONNECTIVITY','Library desktops lose LAN intermittently','2026-09-10 16:05:00','MEDIUM','OPEN'),
(4,2,'WIRELESS','AP drops clients during lab sessions','2026-09-14 11:30:00','HIGH','OPEN');

INSERT INTO ASSIGNMENT
(report_id,technician_id,assigned_at,completed_at,assignment_status) VALUES
(1,1,'2026-08-24 09:45:00',NULL,'IN_PROGRESS'),
(2,2,'2026-08-24 10:30:00',NULL,'ASSIGNED'),
(3,1,'2026-08-24 11:20:00','2026-08-24 12:00:00','COMPLETED');

INSERT INTO RESOLUTION
(report_id,resolution_notes,resolved_at,resolution_status) VALUES
(3,'Access point restarted and configuration corrected','2026-08-24 12:00:00','RESOLVED');
