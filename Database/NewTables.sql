-- Users table (base user information)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'faculty', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Faculty table
CREATE TABLE Faculty (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    registration_id INT UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    post VARCHAR(50) NOT NULL,
    contact_number BIGINT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Faculty roles table (separated for normalization)
CREATE TABLE FacultyRoles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_id INT NOT NULL,
    role_name ENUM('FA', 'SWO', 'Security', 'SC_Advisor') NOT NULL,
    assigned_date DATE NOT NULL,
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id) ON DELETE CASCADE,
    UNIQUE (faculty_id, role_name)
);

-- Student table
CREATE TABLE Student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    registration_id INT UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_number BIGINT,
    is_sc_member BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- StudentBody table
CREATE TABLE StudentBody (
    student_body_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    faculty_advisor_id INT,
    primary_rep_id INT,
    secondary_rep_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_advisor_id) REFERENCES Faculty(faculty_id) ON DELETE SET NULL,
    FOREIGN KEY (primary_rep_id) REFERENCES Student(student_id) ON DELETE SET NULL,
    FOREIGN KEY (secondary_rep_id) REFERENCES Student(student_id) ON DELETE SET NULL
);

-- StudentBodyMembership (many-to-many relationship)
CREATE TABLE StudentBodyMembership (
    membership_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    student_body_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'Member',
    joined_date DATE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (student_body_id) REFERENCES StudentBody(student_body_id) ON DELETE CASCADE,
    UNIQUE (student_id, student_body_id)
);

-- Building table (normalized from IndoorVenue)
CREATE TABLE Building (
    building_id INT AUTO_INCREMENT PRIMARY KEY,
    building_name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    floors INT NOT NULL
);

-- VenueType table (normalized from Venue)
CREATE TABLE VenueType (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Venue table
CREATE TABLE Venue (
    venue_id INT AUTO_INCREMENT PRIMARY KEY,
    venue_name VARCHAR(100) NOT NULL,
    venue_type_id INT NOT NULL,
    seating_capacity INT NOT NULL,
    is_indoor BOOLEAN NOT NULL,
    building_id INT,
    floor_number INT,
    manager_contact BIGINT,
    description TEXT,
    features TEXT,
    image_url VARCHAR(255),
    FOREIGN KEY (venue_type_id) REFERENCES VenueType(type_id),
    FOREIGN KEY (building_id) REFERENCES Building(building_id) ON DELETE SET NULL
);

-- VenueAvailability table (for tracking when venues are available)
CREATE TABLE VenueAvailability (
    availability_id INT AUTO_INCREMENT PRIMARY KEY,
    venue_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (venue_id) REFERENCES Venue(venue_id) ON DELETE CASCADE,
    UNIQUE (venue_id, day_of_week, start_time, end_time)
);

-- BookingRequest table
CREATE TABLE BookingRequest (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    venue_id INT NOT NULL,
    student_body_id INT NOT NULL,
    requester_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    purpose VARCHAR(500) NOT NULL,
    attendees_count INT,
    setup_requirements TEXT,
    status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (venue_id) REFERENCES Venue(venue_id) ON DELETE CASCADE,
    FOREIGN KEY (student_body_id) REFERENCES StudentBody(student_body_id) ON DELETE CASCADE,
    FOREIGN KEY (requester_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ApprovalStep table (normalized from ApprovalProcess)
CREATE TABLE ApprovalStep (
    step_id INT AUTO_INCREMENT PRIMARY KEY,
    step_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    order_number INT NOT NULL
);

-- BookingApproval table
CREATE TABLE BookingApproval (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    step_id INT NOT NULL,
    approver_id INT,
    is_approved BOOLEAN DEFAULT NULL,
    comments TEXT,
    approval_date TIMESTAMP NULL,
    FOREIGN KEY (booking_id) REFERENCES BookingRequest(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (step_id) REFERENCES ApprovalStep(step_id),
    FOREIGN KEY (approver_id) REFERENCES Faculty(faculty_id) ON DELETE SET NULL,
    UNIQUE (booking_id, step_id)
);

-- BookingHistory table
CREATE TABLE BookingHistory (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    action_taken VARCHAR(255) NOT NULL,
    action_by INT NOT NULL,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES BookingRequest(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (action_by) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ExchangeRequest table (for venue exchange functionality)
CREATE TABLE ExchangeRequest (
    exchange_id INT AUTO_INCREMENT PRIMARY KEY,
    requester_booking_id INT NOT NULL,
    requested_booking_id INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('Pending', 'Accepted', 'Rejected', 'Cancelled') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_booking_id) REFERENCES BookingRequest(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (requested_booking_id) REFERENCES BookingRequest(booking_id) ON DELETE CASCADE
);

-- Notification table
CREATE TABLE Notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('booking-status', 'admin-alert', 'reminder', 'exchange-request') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Conversation table (for chat functionality)
CREATE TABLE Conversation (
    conversation_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    type ENUM('exchange', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ConversationParticipant table
CREATE TABLE ConversationParticipant (
    participant_id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES Conversation(conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE (conversation_id, user_id)
);

-- Message table
CREATE TABLE Message (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES Conversation(conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
