-- Drop all tables in reverse order of dependencies
DROP TABLE IF EXISTS VenueEquipment;
DROP TABLE IF EXISTS Equipment;
DROP TABLE IF EXISTS SC_Assignment;
DROP TABLE IF EXISTS RoleAssignments;
DROP TABLE IF EXISTS BookingHistory;
DROP TABLE IF EXISTS ApprovalProcess;
DROP TABLE IF EXISTS BookingRequest;
DROP TABLE IF EXISTS Student;
DROP TABLE IF EXISTS StudentBody;
DROP TABLE IF EXISTS Faculty;
DROP TABLE IF EXISTS Venue;
DROP TABLE IF EXISTS Location;

-- Create tables in order of dependencies
CREATE TABLE Venue (
    venue_id INT PRIMARY KEY,
    venue_name VARCHAR(100),
    venue_type VARCHAR(50),
    floor_number INT,
    seating_capacity INT,
    manager_contact BIGINT
);

CREATE TABLE Faculty (
    faculty_id INT PRIMARY KEY,
    registration_id INT,
    name VARCHAR(100),
    email VARCHAR(100),
    department VARCHAR(100),
    post VARCHAR(50)
);

CREATE TABLE StudentBody (
    student_body_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    faculty_advisor_id INT,
    FOREIGN KEY (faculty_advisor_id) REFERENCES Faculty(faculty_id)
);

CREATE TABLE Student (
    student_id INT PRIMARY KEY,
    registration_id INT,
    name VARCHAR(100),
    contact_details BIGINT,
    student_body_id INT,
    FOREIGN KEY (student_body_id) REFERENCES StudentBody(student_body_id)
);

CREATE TABLE BookingRequest (
    booking_id INT PRIMARY KEY,
    venue_id INT,
    student_body_id INT,
    booking_date DATE,
    start_time TIME,
    end_time TIME,
    purpose VARCHAR(500),
    status VARCHAR(50),
    FOREIGN KEY (venue_id) REFERENCES Venue(venue_id),
    FOREIGN KEY (student_body_id) REFERENCES StudentBody(student_body_id)
);

CREATE TABLE ApprovalProcess (
    approval_id INT PRIMARY KEY,
    booking_id INT,
    approver_id INT,
    approval_status VARCHAR(50),
    FOREIGN KEY (booking_id) REFERENCES BookingRequest(booking_id),
    FOREIGN KEY (approver_id) REFERENCES Faculty(faculty_id)
);

CREATE TABLE BookingHistory (
    history_id INT PRIMARY KEY,
    booking_id INT,
    booking_date DATE,
    action_taken VARCHAR(255),
    FOREIGN KEY (booking_id) REFERENCES BookingRequest(booking_id)
);

CREATE TABLE RoleAssignments (
    faculty_id INT,
    role ENUM('FA', 'SWO', 'Security'),
    PRIMARY KEY (faculty_id, role),
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id)
);

CREATE TABLE SC_Assignment (
    student_id INT PRIMARY KEY,
    is_SC BOOLEAN,
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
);

CREATE TABLE Equipment (
    equipment_id INT PRIMARY KEY,
    equipment_name VARCHAR(100),
    quantity INT
);

CREATE TABLE VenueEquipment (
    venue_id INT,
    equipment_id INT,
    quantity_available INT,
    PRIMARY KEY (venue_id, equipment_id),
    FOREIGN KEY (venue_id) REFERENCES Venue(venue_id),
    FOREIGN KEY (equipment_id) REFERENCES Equipment(equipment_id)
);

CREATE TABLE Location (
    building_id INT PRIMARY KEY,
    building_name VARCHAR(100),
    address VARCHAR(255)
);
