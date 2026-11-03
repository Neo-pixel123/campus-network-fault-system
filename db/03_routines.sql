-- Campus Network Fault Reporting System : Function, Procedures, Triggers
USE campus_network_fault_reporting;
DELIMITER $$

-- Function: number of unresolved faults on a device
CREATE FUNCTION fn_open_fault_count(p_device_id INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_count INT;
    SELECT COUNT(*) INTO v_count
    FROM FAULT_REPORT
    WHERE device_id = p_device_id
      AND status NOT IN ('RESOLVED', 'CLOSED');
    RETURN v_count;
END$$

-- Procedure: assign a technician to a fault report
CREATE PROCEDURE sp_assign_technician(IN p_report_id INT, IN p_technician_id INT)
BEGIN
    IF EXISTS (SELECT 1 FROM ASSIGNMENT WHERE report_id = p_report_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Report already assigned';
    END IF;
    INSERT INTO ASSIGNMENT (report_id, technician_id, assigned_at, assignment_status)
    VALUES (p_report_id, p_technician_id, NOW(), 'ASSIGNED');
END$$

-- Procedure: resolve a fault report
CREATE PROCEDURE sp_resolve_report(IN p_report_id INT, IN p_notes TEXT)
BEGIN
    INSERT INTO RESOLUTION (report_id, resolution_notes, resolved_at, resolution_status)
    VALUES (p_report_id, p_notes, NOW(), 'RESOLVED');
END$$

-- Trigger: new assignment -> report ASSIGNED, technician BUSY
CREATE TRIGGER trg_after_assignment_insert
AFTER INSERT ON ASSIGNMENT
FOR EACH ROW
BEGIN
    UPDATE FAULT_REPORT SET status = 'ASSIGNED'
    WHERE report_id = NEW.report_id;
    UPDATE TECHNICIAN SET availability_status = 'BUSY'
    WHERE technician_id = NEW.technician_id;
END$$

-- Trigger: new resolution -> report RESOLVED, assignment COMPLETED,
-- technician AVAILABLE again
CREATE TRIGGER trg_after_resolution_insert
AFTER INSERT ON RESOLUTION
FOR EACH ROW
BEGIN
    UPDATE FAULT_REPORT SET status = 'RESOLVED'
    WHERE report_id = NEW.report_id;
    UPDATE ASSIGNMENT
       SET assignment_status = 'COMPLETED', completed_at = NEW.resolved_at
    WHERE report_id = NEW.report_id;
    UPDATE TECHNICIAN t
    JOIN ASSIGNMENT a ON a.technician_id = t.technician_id
       SET t.availability_status = 'AVAILABLE'
    WHERE a.report_id = NEW.report_id;
END$$

-- Trigger: reject a fault report dated in the future
CREATE TRIGGER trg_before_report_insert
BEFORE INSERT ON FAULT_REPORT
FOR EACH ROW
BEGIN
    IF NEW.reported_at > NOW() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'reported_at cannot be in the future';
    END IF;
END$$

DELIMITER ;
