-- Campus Network Fault Reporting System : DDL
CREATE DATABASE IF NOT EXISTS campus_network_fault_reporting;
USE campus_network_fault_reporting;

CREATE TABLE SYSTEM_USER (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(15),
    role VARCHAR(30) NOT NULL,
    department VARCHAR(100),
    registration_date DATE,
    CHECK (role IN ('STUDENT', 'FACULTY', 'STAFF', 'ADMIN'))
);

CREATE TABLE LOCATION (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    building VARCHAR(100) NOT NULL,
    floor_no INT NOT NULL,
    room_no VARCHAR(20),
    location_name VARCHAR(100) NOT NULL,
    campus_zone VARCHAR(50)
);

CREATE TABLE NETWORK_DEVICE (
    device_id INT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(40) NOT NULL,
    ip_address VARCHAR(45) NOT NULL UNIQUE,
    mac_address VARCHAR(17) NOT NULL UNIQUE,
    location_id INT NOT NULL,
    CONSTRAINT fk_device_location
        FOREIGN KEY (location_id) REFERENCES LOCATION(location_id),
    CHECK (device_type IN ('ROUTER', 'SWITCH', 'ACCESS_POINT', 'FIREWALL', 'OTHER')),
    CHECK (ip_address <> '')
);

CREATE TABLE FAULT_REPORT (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_id INT NOT NULL,
    fault_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    reported_at DATETIME NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    CONSTRAINT fk_report_user
        FOREIGN KEY (user_id) REFERENCES SYSTEM_USER(user_id),
    CONSTRAINT fk_report_device
        FOREIGN KEY (device_id) REFERENCES NETWORK_DEVICE(device_id),
    CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CHECK (status IN ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'))
);

CREATE TABLE TECHNICIAN (
    technician_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(15),
    expertise VARCHAR(80),
    availability_status VARCHAR(20),
    CHECK (availability_status IN ('AVAILABLE', 'BUSY', 'OFFLINE'))
);

CREATE TABLE ASSIGNMENT (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL UNIQUE,
    technician_id INT NOT NULL,
    assigned_at DATETIME NOT NULL,
    completed_at DATETIME,
    assignment_status VARCHAR(30) NOT NULL DEFAULT 'ASSIGNED',
    CONSTRAINT fk_assignment_report
        FOREIGN KEY (report_id) REFERENCES FAULT_REPORT(report_id),
    CONSTRAINT fk_assignment_technician
        FOREIGN KEY (technician_id) REFERENCES TECHNICIAN(technician_id),
    CHECK (assignment_status IN ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
);

CREATE TABLE RESOLUTION (
    resolution_id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL UNIQUE,
    resolution_notes TEXT NOT NULL,
    resolved_at DATETIME NOT NULL,
    resolution_status VARCHAR(30) NOT NULL,
    CONSTRAINT fk_resolution_report
        FOREIGN KEY (report_id) REFERENCES FAULT_REPORT(report_id),
    CHECK (resolution_status IN ('RESOLVED', 'PARTIALLY_RESOLVED', 'UNRESOLVED'))
);

CREATE INDEX idx_system_user_name ON SYSTEM_USER(name);
CREATE INDEX idx_report_status ON FAULT_REPORT(status);
CREATE INDEX idx_report_date ON FAULT_REPORT(reported_at);
CREATE INDEX idx_report_priority ON FAULT_REPORT(priority);
CREATE INDEX idx_device_type ON NETWORK_DEVICE(device_type);
CREATE INDEX idx_resolution_status ON RESOLUTION(resolution_status);

CREATE VIEW fault_report_status_view AS
SELECT
    fr.report_id, u.name AS reported_by, nd.device_name,
    l.building, l.room_no, fr.fault_type, fr.priority,
    fr.status, fr.reported_at, t.name AS technician_name
FROM FAULT_REPORT fr
JOIN SYSTEM_USER u ON fr.user_id = u.user_id
JOIN NETWORK_DEVICE nd ON fr.device_id = nd.device_id
JOIN LOCATION l ON nd.location_id = l.location_id
LEFT JOIN ASSIGNMENT a ON fr.report_id = a.report_id
LEFT JOIN TECHNICIAN t ON a.technician_id = t.technician_id;
