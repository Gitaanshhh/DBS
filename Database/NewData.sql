-- Delete all data from tables (in correct order for FK constraints)
DELETE FROM Message;
DELETE FROM ConversationParticipant;
DELETE FROM Conversation;
DELETE FROM Notification;
DELETE FROM ExchangeRequest;
DELETE FROM BookingHistory;
DELETE FROM BookingApproval;
DELETE FROM ApprovalStep;
DELETE FROM BookingRequest;
DELETE FROM VenueAvailability;
DELETE FROM Venue;
DELETE FROM VenueType;
DELETE FROM Building;
DELETE FROM StudentBodyMembership;
DELETE FROM StudentBody;
DELETE FROM Student;
DELETE FROM FacultyRoles;
DELETE FROM Faculty;
DELETE FROM Users;

-- Insert sample users
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (1, 'admin@manipal.edu', 'admin', 'admin');
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (2, 'faculty@manipal.edu', 'faculty', 'faculty');
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (3, 'sharma@manipal.edu', 'hashed_password_here', 'faculty');
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (4, 'student@manipal.edu', 'student', 'student');
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (5, 'alice.smith@manipal.edu', 'hashed_password_here', 'student');
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (6, 'bob.johnson@manipal.edu', 'hashed_password_here', 'student');
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (7, 'emma.wilson@manipal.edu', 'hashed_password_here', 'student');
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (8, 'michael.brown@manipal.edu', 'hashed_password_here', 'student');
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (9, 'patel@manipal.edu', 'hashed_password_here', 'faculty');
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (10, 'gupta@manipal.edu', 'hashed_password_here', 'faculty');
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (11, 'kumar@manipal.edu', 'hashed_password_here', 'faculty');
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (12, 'singh@manipal.edu', 'hashed_password_here', 'faculty');
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (13, 'verma@manipal.edu', 'hashed_password_here', 'faculty');


-- Insert faculty members
INSERT INTO Faculty (faculty_id, user_id, registration_id, name, department, post, contact_number) VALUES (1, 2, 5001, 'Dr. Rao', 'Engineering', 'Professor', 9876543210);
INSERT INTO Faculty (faculty_id, user_id, registration_id, name, department, post, contact_number) VALUES (2, 3, 5002, 'Ms. Sharma', 'Science', 'Lecturer', 9876543211);
INSERT INTO Faculty (faculty_id, user_id, registration_id, name, department, post, contact_number) VALUES (3, 9, 5003, 'Dr. Patel', 'Computer Science', 'Associate Professor', 9876543212);
INSERT INTO Faculty (faculty_id, user_id, registration_id, name, department, post, contact_number) VALUES (4, 10, 5004, 'Dr. Gupta', 'Mathematics', 'Professor', 9876543213);
INSERT INTO Faculty (faculty_id, user_id, registration_id, name, department, post, contact_number) VALUES (5, 11, 5005, 'Dr. Kumar', 'Physics', 'Assistant Professor', 9876543214);
INSERT INTO Faculty (faculty_id, user_id, registration_id, name, department, post, contact_number) VALUES (6, 12, 5006, 'Dr. Singh', 'Chemistry', 'Assistant Professor', 9876543215);
INSERT INTO Faculty (faculty_id, user_id, registration_id, name, department, post, contact_number) VALUES (7, 13, 5007, 'Dr. Verma', 'Biology', 'Assistant Professor', 9876543216);

-- Insert faculty roles
INSERT INTO FacultyRoles (role_id, faculty_id, role_name, assigned_date) VALUES (1, 1, 'SWO', TO_DATE('2024-01-01', 'YYYY-MM-DD'));
INSERT INTO FacultyRoles (role_id, faculty_id, role_name, assigned_date) VALUES (2, 2, 'Security', TO_DATE('2024-01-01', 'YYYY-MM-DD'));
INSERT INTO FacultyRoles (role_id, faculty_id, role_name, assigned_date) VALUES (3, 3, 'FA', TO_DATE('2024-01-01', 'YYYY-MM-DD'));
INSERT INTO FacultyRoles (role_id, faculty_id, role_name, assigned_date) VALUES (4, 4, 'SC_Advisor', TO_DATE('2024-01-01', 'YYYY-MM-DD'));


-- Insert students
INSERT INTO Student (student_id, user_id, registration_id, name, contact_number, is_sc_member) VALUES (1, 4, 3001, 'John Doe', 9999999999, 'N');
INSERT INTO Student (student_id, user_id, registration_id, name, contact_number, is_sc_member) VALUES (2, 5, 3002, 'Alice Smith', 8888888888, 'Y');
INSERT INTO Student (student_id, user_id, registration_id, name, contact_number, is_sc_member) VALUES (3, 6, 3003, 'Bob Johnson', 7777777777, 'N');
INSERT INTO Student (student_id, user_id, registration_id, name, contact_number, is_sc_member) VALUES (4, 7, 3004, 'Emma Wilson', 6666666666, 'N');
INSERT INTO Student (student_id, user_id, registration_id, name, contact_number, is_sc_member) VALUES (5, 8, 3005, 'Michael Brown', 5555555555, 'Y');


-- Insert student bodies
INSERT INTO StudentBody (student_body_id, name, email, description, faculty_advisor_id, primary_rep_id, secondary_rep_id) VALUES (1, 'Tech Club', 'tech@manipal.edu', 'Technology enthusiasts club', 1, 1, 2);
INSERT INTO StudentBody (student_body_id, name, email, description, faculty_advisor_id, primary_rep_id, secondary_rep_id) VALUES (2, 'Cultural Society', 'cultural@manipal.edu', 'Promoting cultural activities', 2, 3, 4);
INSERT INTO StudentBody (student_body_id, name, email, description, faculty_advisor_id, primary_rep_id, secondary_rep_id) VALUES (3, 'Debate Club', 'debate@manipal.edu', 'Platform for debate competitions', 3, 5, NULL);


-- Insert student body memberships
INSERT INTO StudentBodyMembership (membership_id, student_id, student_body_id, role, joined_date) VALUES (1, 1, 1, 'President', TO_DATE('2024-01-15', 'YYYY-MM-DD'));
INSERT INTO StudentBodyMembership (membership_id, student_id, student_body_id, role, joined_date) VALUES (2, 2, 1, 'Vice President', TO_DATE('2024-01-15', 'YYYY-MM-DD'));
INSERT INTO StudentBodyMembership (membership_id, student_id, student_body_id, role, joined_date) VALUES (3, 3, 2, 'President', TO_DATE('2024-01-20', 'YYYY-MM-DD'));
INSERT INTO StudentBodyMembership (membership_id, student_id, student_body_id, role, joined_date) VALUES (4, 4, 2, 'Secretary', TO_DATE('2024-01-20', 'YYYY-MM-DD'));
INSERT INTO StudentBodyMembership (membership_id, student_id, student_body_id, role, joined_date) VALUES (5, 5, 3, 'President', TO_DATE('2024-01-25', 'YYYY-MM-DD'));
INSERT INTO StudentBodyMembership (membership_id, student_id, student_body_id, role, joined_date) VALUES (6, 1, 3, 'Member', TO_DATE('2024-02-01', 'YYYY-MM-DD'));
INSERT INTO StudentBodyMembership (membership_id, student_id, student_body_id, role, joined_date) VALUES (7, 2, 2, 'Member', TO_DATE('2024-02-05', 'YYYY-MM-DD'));


-- Insert buildings
INSERT INTO Building (building_id, building_name, location, floors) VALUES (1, 'Alpha Building', 'North Campus', 4);
INSERT INTO Building (building_id, building_name, location, floors) VALUES (2, 'Beta Building', 'South Campus', 3);
INSERT INTO Building (building_id, building_name, location, floors) VALUES (3, 'Gamma Building', 'East Campus', 5);
INSERT INTO Building (building_id, building_name, location, floors) VALUES (4, 'Delta Building', 'West Campus', 2);


-- Insert venue types
INSERT INTO VenueType (type_id, type_name, description) VALUES (1, 'Lecture Hall', 'Large hall for lectures and presentations');
INSERT INTO VenueType (type_id, type_name, description) VALUES (2, 'Seminar Room', 'Medium-sized room for seminars and discussions');
INSERT INTO VenueType (type_id, type_name, description) VALUES (3, 'Laboratory', 'Equipped with specialized equipment for experiments');
INSERT INTO VenueType (type_id, type_name, description) VALUES (4, 'Auditorium', 'Large venue for performances and events');
INSERT INTO VenueType (type_id, type_name, description) VALUES (5, 'Conference Room', 'Professional setting for meetings');
INSERT INTO VenueType (type_id, type_name, description) VALUES (6, 'Outdoor Space', 'Open-air venues for various activities');

-- Insert venues
INSERT INTO Venue (venue_id, venue_name, venue_type_id, seating_capacity, is_indoor, building_id, floor_number, manager_contact, description, features, image_url) VALUES (1, 'Main Hall A101', 1, 200, 'Y', 1, 1, 9876543210, 'Spacious lecture hall with modern facilities', 'Projector, Audio System, Air Conditioning', '/assets/venues/lecture-hall-a101.jpg');
INSERT INTO Venue (venue_id, venue_name, venue_type_id, seating_capacity, is_indoor, building_id, floor_number, manager_contact, description, features, image_url) VALUES (2, 'Seminar Room B204', 2, 60, 'Y', 2, 2, 9876543211, 'Well-equipped seminar room', 'Smart Board, Video Conferencing', '/assets/venues/seminar-room-b204.jpg');
INSERT INTO Venue (venue_id, venue_name, venue_type_id, seating_capacity, is_indoor, building_id, floor_number, manager_contact, description, features, image_url) VALUES (3, 'Computer Lab C103', 3, 40, 'Y', 3, 1, 9876543212, 'Modern computer lab with high-end PCs', 'High-end PCs, Projector, Internet', '/assets/venues/computer-lab-c103.jpg');
INSERT INTO Venue (venue_id, venue_name, venue_type_id, seating_capacity, is_indoor, building_id, floor_number, manager_contact, description, features, image_url) VALUES (4, 'Main Auditorium', 4, 500, 'Y', 1, 0, 9876543213, 'Large auditorium for major events', 'Stage, Professional Audio, Lighting System', '/assets/venues/main-auditorium.jpg');
INSERT INTO Venue (venue_id, venue_name, venue_type_id, seating_capacity, is_indoor, building_id, floor_number, manager_contact, description, features, image_url) VALUES (5, 'Conference Room D105', 5, 25, 'Y', 4, 1, 9876543214, 'Professional conference room', 'Video Conferencing, Whiteboard, Coffee Service', '/assets/venues/conference-room-d105.jpg');
INSERT INTO Venue (venue_id, venue_name, venue_type_id, seating_capacity, is_indoor, building_id, floor_number, manager_contact, description, features, image_url) VALUES (6, 'Student Plaza', 6, 300, 'N', NULL, NULL, 9876543215, 'Central outdoor gathering space', 'Open Air, Power Outlets, Seating Available', '/assets/venues/student-plaza.jpg');

-- Insert venue availability
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (1, 1, 'Monday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (2, 1, 'Monday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (3, 1, 'Monday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (4, 1, 'Tuesday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (5, 1, 'Tuesday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'N');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (6, 1, 'Tuesday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (7, 2, 'Monday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (8, 2, 'Monday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (9, 2, 'Monday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (10, 3, 'Wednesday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'N');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (11, 3, 'Wednesday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (12, 3, 'Wednesday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (13, 4, 'Friday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (14, 4, 'Friday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (15, 4, 'Friday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (16, 5, 'Thursday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (17, 5, 'Thursday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (18, 5, 'Thursday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'N');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (19, 6, 'Saturday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (20, 6, 'Saturday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Y');
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES (21, 6, 'Saturday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'Y');


-- Insert approval steps
INSERT INTO ApprovalStep (step_id, step_name, description, order_number) VALUES (1, 'Faculty Advisor', 'Approval from the faculty advisor of the student body', 1);
INSERT INTO ApprovalStep (step_id, step_name, description, order_number) VALUES (2, 'Student Council', 'Approval from the student council representative', 2);
INSERT INTO ApprovalStep (step_id, step_name, description, order_number) VALUES (3, 'Student Welfare Officer', 'Approval from the student welfare officer', 3);
INSERT INTO ApprovalStep (step_id, step_name, description, order_number) VALUES (4, 'Security', 'Final security clearance', 4);


-- Insert booking requests
INSERT INTO BookingRequest (booking_id, venue_id, student_body_id, requester_id, booking_date, start_time, end_time, purpose, attendees_count, setup_requirements, status, created_at) VALUES (1, 1, 1, 4, TO_DATE('2025-04-25', 'YYYY-MM-DD'), TO_TIMESTAMP('10:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('13:00:00', 'HH24:MI:SS'), 'Technical Club 1st General body meeting', 150, 'Projector, Microphone, Chairs arrangement', 'Pending', TO_TIMESTAMP('2025-04-10 09:30:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingRequest (booking_id, venue_id, student_body_id, requester_id, booking_date, start_time, end_time, purpose, attendees_count, setup_requirements, status, created_at) VALUES (2, 3, 2, 6, TO_DATE('2025-04-26', 'YYYY-MM-DD'), TO_TIMESTAMP('14:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('17:00:00', 'HH24:MI:SS'), 'Cultural Society Practice Session', 40, 'Audio system, Open space for dance', 'Approved', TO_TIMESTAMP('2025-04-11 10:15:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingRequest (booking_id, venue_id, student_body_id, requester_id, booking_date, start_time, end_time, purpose, attendees_count, setup_requirements, status, created_at) VALUES (3, 4, 3, 8, TO_DATE('2025-04-27', 'YYYY-MM-DD'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('19:00:00', 'HH24:MI:SS'), 'Inter-College Debate Competition', 300, 'Stage setup, Microphones, Seating arrangement', 'Rejected', TO_TIMESTAMP('2025-04-12 11:45:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingRequest (booking_id, venue_id, student_body_id, requester_id, booking_date, start_time, end_time, purpose, attendees_count, setup_requirements, status, created_at) VALUES (4, 6, 1, 4, TO_DATE('2025-04-28', 'YYYY-MM-DD'), TO_TIMESTAMP('09:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Tech Fair Exhibition', 200, 'Tables for displays, Power outlets, Canopy', 'Approved', TO_TIMESTAMP('2025-04-13 14:20:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingRequest (booking_id, venue_id, student_body_id, requester_id, booking_date, start_time, end_time, purpose, attendees_count, setup_requirements, status, created_at) VALUES (5, 2, 2, 6, TO_DATE('2025-04-29', 'YYYY-MM-DD'), TO_TIMESTAMP('13:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Cultural Workshop', 50, 'Chairs in circular arrangement, Projector', 'Pending', TO_TIMESTAMP('2025-04-14 16:10:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingRequest (booking_id, venue_id, student_body_id, requester_id, booking_date, start_time, end_time, purpose, attendees_count, setup_requirements, status, created_at) VALUES (6, 5, 3, 8, TO_DATE('2025-04-30', 'YYYY-MM-DD'), TO_TIMESTAMP('11:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('14:00:00', 'HH24:MI:SS'), 'Debate Club Meeting', 20, 'Conference table setup, Whiteboard', 'Completed', TO_TIMESTAMP('2025-04-01 09:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- Insert booking approvals
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES (1, 1, 1, 1, 'Y', 'Approved by faculty advisor', TO_TIMESTAMP('2025-04-11 10:30:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES (2, 1, 2, NULL, 'Y', 'Approved by student council', TO_TIMESTAMP('2025-04-12 11:15:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES (3, 1, 3, NULL, NULL, NULL, NULL);
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES (4, 1, 4, NULL, NULL, NULL, NULL);
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES (5, 2, 1, 2, 'Y', 'Approved by faculty advisor', TO_TIMESTAMP('2025-04-12 09:45:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES (6, 2, 2, NULL, 'Y', 'Approved by student council', TO_TIMESTAMP('2025-04-13 10:30:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES (7, 2, 3, 1, 'Y', 'Approved by SWO', TO_TIMESTAMP('2025-04-14 14:20:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES (8, 2, 4, 2, 'Y', 'Approved by security', TO_TIMESTAMP('2025-04-15 11:10:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES (9, 3, 1, 3, 'Y', 'Approved by faculty advisor', TO_TIMESTAMP('2025-04-13 15:30:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES (10, 3, 2, NULL, 'Y', 'Approved by student council', TO_TIMESTAMP('2025-04-14 16:45:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES (11, 3, 3, 1, 'N', 'Rejected due to scheduling conflict with university event', TO_TIMESTAMP('2025-04-15 10:20:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES (12, 3, 4, NULL, NULL, NULL, NULL);


-- Insert booking history
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (1, 1, 'Booking request submitted', 4, TO_TIMESTAMP('2025-04-10 09:30:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (2, 1, 'Faculty advisor approval', 1, TO_TIMESTAMP('2025-04-11 10:30:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (3, 1, 'Student council approval', 5, TO_TIMESTAMP('2025-04-12 11:15:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (4, 2, 'Booking request submitted', 6, TO_TIMESTAMP('2025-04-11 10:15:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (5, 2, 'Faculty advisor approval', 2, TO_TIMESTAMP('2025-04-12 09:45:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (6, 2, 'Student council approval', 5, TO_TIMESTAMP('2025-04-13 10:30:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (7, 2, 'SWO approval', 1, TO_TIMESTAMP('2025-04-14 14:20:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (8, 2, 'Security approval', 2, TO_TIMESTAMP('2025-04-15 11:10:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (9, 2, 'Booking confirmed', 1, TO_TIMESTAMP('2025-04-15 11:15:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (10, 3, 'Booking request submitted', 8, TO_TIMESTAMP('2025-04-12 11:45:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (11, 3, 'Faculty advisor approval', 3, TO_TIMESTAMP('2025-04-13 15:30:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (12, 3, 'Student council approval', 5, TO_TIMESTAMP('2025-04-14 16:45:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (13, 3, 'SWO rejection', 1, TO_TIMESTAMP('2025-04-15 10:20:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES (14, 3, 'Booking rejected', 1, TO_TIMESTAMP('2025-04-15 10:25:00', 'YYYY-MM-DD HH24:MI:SS'));

-- Insert notifications
INSERT INTO Notification (notification_id, user_id, title, message, created_at, is_read) VALUES (1, 4, 'Booking Approved', 'Your booking request for Computer Lab B204 on April 25, 2025 has been approved.', TO_TIMESTAMP('2025-04-15 11:20:00', 'YYYY-MM-DD HH24:MI:SS'), 'N');
INSERT INTO Notification (notification_id, user_id, title, message, created_at, is_read) VALUES (2, 6, 'Booking Confirmed', 'Your booking for Cultural Society Practice Session has been confirmed.', TO_TIMESTAMP('2025-04-15 11:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Y');
INSERT INTO Notification (notification_id, user_id, title, message, created_at, is_read) VALUES (3, 8, 'Booking Rejected', 'Your booking request for Main Auditorium has been rejected due to scheduling conflict.', TO_TIMESTAMP('2025-04-15 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'N');
INSERT INTO Notification (notification_id, user_id, title, message, created_at, is_read) VALUES (4, 4, 'Exchange Request', 'Tech Society has requested to exchange their booking of Seminar Hall 1 with your booking of Computer Lab B204.', TO_TIMESTAMP('2025-04-16 09:35:00', 'YYYY-MM-DD HH24:MI:SS'), 'N');
INSERT INTO Notification (notification_id, user_id, title, message, created_at, is_read) VALUES (5, 6, 'Important Announcement', 'All bookings for May 1, 2025 have been cancelled due to scheduled maintenance.', TO_TIMESTAMP('2025-04-18 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Y');
INSERT INTO Notification (notification_id, user_id, title, message, created_at, is_read) VALUES (6, 4, 'Upcoming Booking Reminder', 'Your booking for Computer Lab B204 is scheduled for tomorrow at 10:00 AM.', TO_TIMESTAMP('2025-04-24 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'N');

commit;