DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS ConversationParticipant;
DROP TABLE IF EXISTS Conversation;
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS ExchangeRequest;
DROP TABLE IF EXISTS BookingHistory;
DROP TABLE IF EXISTS BookingApproval;
DROP TABLE IF EXISTS ApprovalStep;
DROP TABLE IF EXISTS BookingRequest;
DROP TABLE IF EXISTS VenueAvailability;
DROP TABLE IF EXISTS Venue;
DROP TABLE IF EXISTS VenueType;
DROP TABLE IF EXISTS Building;
DROP TABLE IF EXISTS StudentBodyMembership;
DROP TABLE IF EXISTS StudentBody;
DROP TABLE IF EXISTS Student;
DROP TABLE IF EXISTS FacultyRoles;
DROP TABLE IF EXISTS Faculty;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    user_id NUMBER PRIMARY KEY,
    email VARCHAR2(100) UNIQUE NOT NULL,
    password_hash VARCHAR2(255) NOT NULL,
    user_type VARCHAR2(20) DEFAULT 'student' CHECK (user_type IN ('student', 'faculty', 'admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE Faculty (
    faculty_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    registration_id NUMBER UNIQUE NOT NULL,
    name VARCHAR2(100) NOT NULL,
    department VARCHAR2(100) NOT NULL,
    post VARCHAR2(50) NOT NULL,
    contact_number NUMBER
);

CREATE TABLE FacultyRoles (
    role_id NUMBER PRIMARY KEY,
    faculty_id NUMBER NOT NULL,
    role_name VARCHAR2(20) DEFAULT 'FA' CHECK (role_name IN ('FA', 'SWO', 'Security', 'SC_Advisor')) NOT NULL,
    assigned_date DATE NOT NULL,
    UNIQUE (faculty_id, role_name)
);

CREATE TABLE Student (
    student_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    registration_id NUMBER UNIQUE NOT NULL,
    name VARCHAR2(100) NOT NULL,
    contact_number NUMBER,
    is_sc_member CHAR(1) DEFAULT 'N' CHECK (is_sc_member IN ('Y', 'N'))
);

CREATE TABLE StudentBody (
    student_body_id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    description CLOB,
    faculty_advisor_id NUMBER,
    primary_rep_id NUMBER,
    secondary_rep_id NUMBER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE StudentBodyMembership (
    membership_id NUMBER PRIMARY KEY,
    student_id NUMBER NOT NULL,
    student_body_id NUMBER NOT NULL,
    role VARCHAR2(50) DEFAULT 'Member',
    joined_date DATE NOT NULL,
    UNIQUE (student_id, student_body_id)
);

CREATE TABLE Building (
    building_id NUMBER PRIMARY KEY,
    building_name VARCHAR2(100) NOT NULL,
    location VARCHAR2(100),
    floors NUMBER NOT NULL
);

CREATE TABLE VenueType (
    type_id NUMBER PRIMARY KEY,
    type_name VARCHAR2(50) UNIQUE NOT NULL,
    description CLOB
);

CREATE TABLE Venue (
    venue_id NUMBER PRIMARY KEY,
    venue_name VARCHAR2(100) NOT NULL,
    venue_type_id NUMBER NOT NULL,
    seating_capacity NUMBER NOT NULL,
    is_indoor CHAR(1) CHECK (is_indoor IN ('Y', 'N')) NOT NULL,
    building_id NUMBER,
    floor_number NUMBER,
    manager_contact NUMBER,
    description CLOB,
    features CLOB,
    image_url VARCHAR2(255)
);

CREATE TABLE VenueAvailability (
    availability_id NUMBER PRIMARY KEY,
    venue_id NUMBER NOT NULL,
    day_of_week VARCHAR2(10) CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_available CHAR(1) DEFAULT 'Y' CHECK (is_available IN ('Y', 'N')),
    UNIQUE (venue_id, day_of_week, start_time, end_time)
);

CREATE TABLE BookingRequest (
    booking_id NUMBER PRIMARY KEY,
    venue_id NUMBER NOT NULL,
    student_body_id NUMBER NOT NULL,
    requester_id NUMBER NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose VARCHAR2(500) NOT NULL,
    attendees_count NUMBER,
    setup_requirements CLOB,
    status VARCHAR2(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ApprovalStep (
    step_id NUMBER PRIMARY KEY,
    step_name VARCHAR2(50) UNIQUE NOT NULL,
    description CLOB,
    order_number NUMBER NOT NULL
);

CREATE TABLE BookingApproval (
    approval_id NUMBER PRIMARY KEY,
    booking_id NUMBER NOT NULL,
    step_id NUMBER NOT NULL,
    approver_id NUMBER,
    is_approved CHAR(1) CHECK (is_approved IN ('Y', 'N')),
    comments CLOB,
    approval_date TIMESTAMP,
    UNIQUE (booking_id, step_id)
);

CREATE TABLE BookingHistory (
    history_id NUMBER PRIMARY KEY,
    booking_id NUMBER NOT NULL,
    action_taken VARCHAR2(255) NOT NULL,
    action_by NUMBER NOT NULL,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ExchangeRequest (
    exchange_id NUMBER PRIMARY KEY,
    requester_booking_id NUMBER NOT NULL,
    requested_booking_id NUMBER NOT NULL,
    reason CLOB NOT NULL,
    status VARCHAR2(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Notification (
    notification_id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    title VARCHAR2(255) NOT NULL,
    message CLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read CHAR(1) DEFAULT 'N' CHECK (is_read IN ('Y', 'N'))
);


-- Add foreign key constraints after all tables are created
ALTER TABLE Faculty ADD CONSTRAINT fk_faculty_user FOREIGN KEY (user_id) REFERENCES Users(user_id);
ALTER TABLE FacultyRoles ADD CONSTRAINT fk_facultyroles_faculty FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id);
ALTER TABLE Student ADD CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES Users(user_id);
ALTER TABLE StudentBody ADD CONSTRAINT fk_studentbody_faculty FOREIGN KEY (faculty_advisor_id) REFERENCES Faculty(faculty_id);
ALTER TABLE StudentBody ADD CONSTRAINT fk_studentbody_primaryrep FOREIGN KEY (primary_rep_id) REFERENCES Student(student_id);
ALTER TABLE StudentBody ADD CONSTRAINT fk_studentbody_secondaryrep FOREIGN KEY (secondary_rep_id) REFERENCES Student(student_id);
ALTER TABLE StudentBodyMembership ADD CONSTRAINT fk_sbmembership_student FOREIGN KEY (student_id) REFERENCES Student(student_id);
ALTER TABLE StudentBodyMembership ADD CONSTRAINT fk_sbmembership_body FOREIGN KEY (student_body_id) REFERENCES StudentBody(student_body_id);
ALTER TABLE Venue ADD CONSTRAINT fk_venue_type FOREIGN KEY (venue_type_id) REFERENCES VenueType(type_id);
ALTER TABLE Venue ADD CONSTRAINT fk_venue_building FOREIGN KEY (building_id) REFERENCES Building(building_id);
ALTER TABLE VenueAvailability ADD CONSTRAINT fk_venueavailability_venue FOREIGN KEY (venue_id) REFERENCES Venue(venue_id);
ALTER TABLE BookingRequest ADD CONSTRAINT fk_bookingrequest_venue FOREIGN KEY (venue_id) REFERENCES Venue(venue_id);
ALTER TABLE BookingRequest ADD CONSTRAINT fk_bookingrequest_body FOREIGN KEY (student_body_id) REFERENCES StudentBody(student_body_id);
ALTER TABLE BookingRequest ADD CONSTRAINT fk_bookingrequest_user FOREIGN KEY (requester_id) REFERENCES Users(user_id);
ALTER TABLE BookingApproval ADD CONSTRAINT fk_bookingapproval_booking FOREIGN KEY (booking_id) REFERENCES BookingRequest(booking_id);
ALTER TABLE BookingApproval ADD CONSTRAINT fk_bookingapproval_step FOREIGN KEY (step_id) REFERENCES ApprovalStep(step_id);
ALTER TABLE BookingApproval ADD CONSTRAINT fk_bookingapproval_faculty FOREIGN KEY (approver_id) REFERENCES Faculty(faculty_id);
ALTER TABLE BookingHistory ADD CONSTRAINT fk_bookinghistory_booking FOREIGN KEY (booking_id) REFERENCES BookingRequest(booking_id);
ALTER TABLE BookingHistory ADD CONSTRAINT fk_bookinghistory_user FOREIGN KEY (action_by) REFERENCES Users(user_id);
ALTER TABLE ExchangeRequest ADD CONSTRAINT fk_exchangerequest_requester FOREIGN KEY (requester_booking_id) REFERENCES BookingRequest(booking_id);
ALTER TABLE ExchangeRequest ADD CONSTRAINT fk_exchangerequest_requested FOREIGN KEY (requested_booking_id) REFERENCES BookingRequest(booking_id);
ALTER TABLE Notification ADD CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES Users(user_id);

/*
CAN add the following trigger
-- Create sequence
CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1 NOCACHE;

-- Trigger to auto-assign user_id
CREATE OR REPLACE TRIGGER users_bi_trigger
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
  :NEW.user_id := users_seq.NEXTVAL;
END;
/
*/