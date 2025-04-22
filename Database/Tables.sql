-- Table: Venue
CREATE TABLE Venue (
    venue_id INT PRIMARY KEY,
    venue_name VARCHAR(255) NOT NULL,
    venue_type VARCHAR(255) NOT NULL,
    booking_status INT NOT NULL,
    seating_capacity INT NOT NULL,
    manager_contact BIGINT NOT NULL
);

-- Table: IndoorVenue (weak entity)
CREATE TABLE IndoorVenue (
    venue_id INT PRIMARY KEY, -- FK & PK
    floor_number INT NOT NULL,
    building_id INT NOT NULL,
    building_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (venue_id) REFERENCES Venue(venue_id)
);

-- Table: Faculty
CREATE TABLE Faculty (
    faculty_id INT PRIMARY KEY,
    registration_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    post VARCHAR(255) NOT NULL
);

-- Table: StudentBody
CREATE TABLE StudentBody (
    student_body_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    faculty_advisor_id INT,
    primary_rep_id INT,
    secondary_rep_id INT,
    FOREIGN KEY (faculty_advisor_id) REFERENCES Faculty(faculty_id)
);

-- Table: Student
CREATE TABLE Student (
    student_id INT PRIMARY KEY,
    registration_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_details BIGINT NOT NULL,
    student_body_id INT,
    FOREIGN KEY (student_body_id) REFERENCES StudentBody(student_body_id)
);

-- Update StudentBody table after Student exists (for reps)
ALTER TABLE StudentBody
    ADD FOREIGN KEY (primary_rep_id) REFERENCES Student(student_id),
    ADD FOREIGN KEY (secondary_rep_id) REFERENCES Student(student_id);

-- Table: BookingRequest
CREATE TABLE BookingRequest (
    booking_id INT PRIMARY KEY,
    venue_id INT NOT NULL,
    student_body_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (venue_id) REFERENCES Venue(venue_id),
    FOREIGN KEY (student_body_id) REFERENCES StudentBody(student_body_id)
);

-- Table: ApprovalProcess
CREATE TABLE ApprovalProcess (
    approval_id INT PRIMARY KEY,
    booking_id INT NOT NULL,
    FA_approval BOOLEAN NOT NULL,
    SC_approval BOOLEAN NOT NULL,
    SWO_approval BOOLEAN NOT NULL,
    Sec_approval BOOLEAN NOT NULL,
    approver_id INT NOT NULL,
    approval_status VARCHAR(255) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES BookingRequest(booking_id),
    FOREIGN KEY (approver_id) REFERENCES Faculty(faculty_id)
);

-- Table: BookingHistory (weak entity)
CREATE TABLE BookingHistory (
    history_id INT PRIMARY KEY,
    booking_id INT NOT NULL,
    booking_date DATE NOT NULL,
    action_taken VARCHAR(255) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES BookingRequest(booking_id)
);
