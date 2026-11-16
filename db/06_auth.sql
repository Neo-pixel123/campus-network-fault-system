-- Campus Network Fault Reporting System : Login support
USE campus_network_fault_reporting;

-- Passwords are stored as SHA-256 hashes, never as plain text
ALTER TABLE SYSTEM_USER ADD COLUMN password_hash CHAR(64) NULL;

-- DEMO ONLY: default password for the sample users. Change it for any real deployment.
UPDATE SYSTEM_USER SET password_hash = SHA2('user123', 256);

-- DEMO ONLY: administrator account with a default password. Change it for any real deployment.
INSERT INTO SYSTEM_USER (name, email, phone, role, department, registration_date, password_hash)
VALUES ('System Admin', 'admin@campus.edu', '9000000099', 'ADMIN', 'IT Services', CURDATE(), SHA2('admin123', 256));
