CREATE TABLE Venue (
    venue_id INT PRIMARY KEY,
    venue_name VARCHAR(100),
    venue_type VARCHAR(50),
    booking_status INT,
    seating_capacity INT,
    manager_contact BIGINT
);

CREATE TABLE IndoorVenue (
    venue_id INT PRIMARY KEY,
    floor_number INT,
    building_id INT,
    building_name VARCHAR(100),
    FOREIGN KEY (venue_id) REFERENCES Venue(venue_id)
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
    primary_rep_id INT,
    secondary_rep_id INT,
    FOREIGN KEY (faculty_advisor_id) REFERENCES Faculty(faculty_id)
    -- You can enforce primary/secondary rep FK after Student is created
);

CREATE TABLE Student (
    student_id INT PRIMARY KEY,
    registration_id INT,
    name VARCHAR(100),
    contact_details BIGINT,
    student_body_id INT,
    FOREIGN KEY (student_body_id) REFERENCES StudentBody(student_body_id)
);

-- Now we add the missing FKs in StudentBody for primary and secondary reps
ALTER TABLE StudentBody
ADD CONSTRAINT fk_primary_rep FOREIGN KEY (primary_rep_id) REFERENCES Student(student_id),
ADD CONSTRAINT fk_secondary_rep FOREIGN KEY (secondary_rep_id) REFERENCES Student(student_id);

CREATE TABLE BookingRequest (
    booking_id INT PRIMARY KEY,
    venue_id INT,
    student_body_id INT,
    booking_date DATE,
    start_time TIME,
    end_time TIME,
    status VARCHAR(50),
    FOREIGN KEY (venue_id) REFERENCES Venue(venue_id),
    FOREIGN KEY (student_body_id) REFERENCES StudentBody(student_body_id)
);

CREATE TABLE ApprovalProcess (
    approval_id INT PRIMARY KEY,
    booking_id INT,
    FA_approval BOOLEAN,
    SC_approval BOOLEAN,
    SWO_approval BOOLEAN,
    Sec_approval BOOLEAN,
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
    role ENUM('SWO', 'Security'),
    PRIMARY KEY (faculty_id, role),
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id)
);

CREATE TABLE SC_Assignment (
    student_id INT PRIMARY KEY,
    is_SC BOOLEAN,
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
);
