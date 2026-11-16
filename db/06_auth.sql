-- Campus Network Fault Reporting System : Login support
USE campus_network_fault_reporting;

-- Passwords are stored as SHA-256 hashes, never as plain text
ALTER TABLE SYSTEM_USER ADD COLUMN password_hash CHAR(64) NULL;

-- Default password for every existing (non-admin) user: user123
UPDATE SYSTEM_USER SET password_hash = SHA2('user123', 256);

-- Separate administrator account: admin@campus.edu / admin123
INSERT INTO SYSTEM_USER (name, email, phone, role, department, registration_date, password_hash)
VALUES ('System Admin', 'admin@campus.edu', '9000000099', 'ADMIN', 'IT Services', CURDATE(), SHA2('admin123', 256));
