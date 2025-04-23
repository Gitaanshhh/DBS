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
INSERT INTO Users (user_id, email, password_hash, user_type) VALUES
(1, 'admin@uni.edu', 'hashed_password_here', 'admin'),
(2, 'rao@uni.edu', 'hashed_password_here', 'faculty'),
(3, 'sharma@uni.edu', 'hashed_password_here', 'faculty'),
(4, 'john.doe@uni.edu', 'hashed_password_here', 'student'),
(5, 'alice.smith@uni.edu', 'hashed_password_here', 'student'),
(6, 'bob.johnson@uni.edu', 'hashed_password_here', 'student'),
(7, 'emma.wilson@uni.edu', 'hashed_password_here', 'student'),
(8, 'michael.brown@uni.edu', 'hashed_password_here', 'student'),
(9, 'patel@uni.edu', 'hashed_password_here', 'faculty'),
(10, 'gupta@uni.edu', 'hashed_password_here', 'faculty');

-- Insert faculty members
INSERT INTO Faculty (faculty_id, user_id, registration_id, name, department, post, contact_number) VALUES
(1, 2, 5001, 'Dr. Rao', 'Engineering', 'Professor', 9876543210),
(2, 3, 5002, 'Ms. Sharma', 'Science', 'Lecturer', 9876543211),
(3, 9, 5003, 'Dr. Patel', 'Computer Science', 'Associate Professor', 9876543212),
(4, 10, 5004, 'Dr. Gupta', 'Mathematics', 'Professor', 9876543213);

-- Insert faculty roles
INSERT INTO FacultyRoles (role_id, faculty_id, role_name, assigned_date) VALUES
(1, 1, 'SWO', TO_DATE('2024-01-01', 'YYYY-MM-DD')),
(2, 2, 'Security', TO_DATE('2024-01-01', 'YYYY-MM-DD')),
(3, 3, 'FA', TO_DATE('2024-01-01', 'YYYY-MM-DD')),
(4, 4, 'SC_Advisor', TO_DATE('2024-01-01', 'YYYY-MM-DD'));

-- Insert students
INSERT INTO Student (student_id, user_id, registration_id, name, contact_number, is_sc_member) VALUES
(1, 4, 3001, 'John Doe', 9999999999, 'N'),
(2, 5, 3002, 'Alice Smith', 8888888888, 'Y'),
(3, 6, 3003, 'Bob Johnson', 7777777777, 'N'),
(4, 7, 3004, 'Emma Wilson', 6666666666, 'N'),
(5, 8, 3005, 'Michael Brown', 5555555555, 'Y');

-- Insert student bodies
INSERT INTO StudentBody (student_body_id, name, email, description, faculty_advisor_id, primary_rep_id, secondary_rep_id) VALUES
(1, 'Tech Club', 'tech@uni.edu', 'Technology enthusiasts club', 1, 1, 2),
(2, 'Cultural Society', 'cultural@uni.edu', 'Promoting cultural activities', 2, 3, 4),
(3, 'Debate Club', 'debate@uni.edu', 'Platform for debate competitions', 3, 5, NULL);

-- Insert student body memberships
INSERT INTO StudentBodyMembership (membership_id, student_id, student_body_id, role, joined_date) VALUES
(1, 1, 1, 'President', TO_DATE('2024-01-15', 'YYYY-MM-DD')),
(2, 2, 1, 'Vice President', TO_DATE('2024-01-15', 'YYYY-MM-DD')),
(3, 3, 2, 'President', TO_DATE('2024-01-20', 'YYYY-MM-DD')),
(4, 4, 2, 'Secretary', TO_DATE('2024-01-20', 'YYYY-MM-DD')),
(5, 5, 3, 'President', TO_DATE('2024-01-25', 'YYYY-MM-DD')),
(6, 1, 3, 'Member', TO_DATE('2024-02-01', 'YYYY-MM-DD')),
(7, 2, 2, 'Member', TO_DATE('2024-02-05', 'YYYY-MM-DD'));

-- Insert buildings
INSERT INTO Building (building_id, building_name, location, floors) VALUES
(1, 'Alpha Building', 'North Campus', 4),
(2, 'Beta Building', 'South Campus', 3),
(3, 'Gamma Building', 'East Campus', 5),
(4, 'Delta Building', 'West Campus', 2);

-- Insert venue types
INSERT INTO VenueType (type_id, type_name, description) VALUES
(1, 'Lecture Hall', 'Large hall for lectures and presentations'),
(2, 'Seminar Room', 'Medium-sized room for seminars and discussions'),
(3, 'Laboratory', 'Equipped with specialized equipment for experiments'),
(4, 'Auditorium', 'Large venue for performances and events'),
(5, 'Conference Room', 'Professional setting for meetings'),
(6, 'Outdoor Space', 'Open-air venues for various activities');

-- Insert venues
INSERT INTO Venue (venue_id, venue_name, venue_type_id, seating_capacity, is_indoor, building_id, floor_number, manager_contact, description, features, image_url) VALUES
(1, 'Main Hall A101', 1, 200, 'Y', 1, 1, 9876543210, 'Spacious lecture hall with modern facilities', 'Projector, Audio System, Air Conditioning', '/assets/venues/lecture-hall-a101.jpg'),
(2, 'Seminar Room B204', 2, 60, 'Y', 2, 2, 9876543211, 'Well-equipped seminar room', 'Smart Board, Video Conferencing', '/assets/venues/seminar-room-b204.jpg'),
(3, 'Computer Lab C103', 3, 40, 'Y', 3, 1, 9876543212, 'Modern computer lab with high-end PCs', 'High-end PCs, Projector, Internet', '/assets/venues/computer-lab-c103.jpg'),
(4, 'Main Auditorium', 4, 500, 'Y', 1, 0, 9876543213, 'Large auditorium for major events', 'Stage, Professional Audio, Lighting System', '/assets/venues/main-auditorium.jpg'),
(5, 'Conference Room D105', 5, 25, 'Y', 4, 1, 9876543214, 'Professional conference room', 'Video Conferencing, Whiteboard, Coffee Service', '/assets/venues/conference-room-d105.jpg'),
(6, 'Student Plaza', 6, 300, 'N', NULL, NULL, 9876543215, 'Central outdoor gathering space', 'Open Air, Power Outlets, Seating Available', '/assets/venues/student-plaza.jpg');

-- Insert venue availability
INSERT INTO VenueAvailability (availability_id, venue_id, day_of_week, start_time, end_time, is_available) VALUES
(1, 1, 'Monday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Y'),
(2, 1, 'Monday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Y'),
(3, 1, 'Monday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'Y'),
(4, 1, 'Tuesday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Y'),
(5, 1, 'Tuesday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'N'),
(6, 1, 'Tuesday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'Y'),
(7, 2, 'Monday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Y'),
(8, 2, 'Monday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Y'),
(9, 2, 'Monday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'Y'),
(10, 3, 'Wednesday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'N'),
(11, 3, 'Wednesday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Y'),
(12, 3, 'Wednesday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'Y'),
(13, 4, 'Friday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Y'),
(14, 4, 'Friday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Y'),
(15, 4, 'Friday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'Y'),
(16, 5, 'Thursday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Y'),
(17, 5, 'Thursday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Y'),
(18, 5, 'Thursday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'N'),
(19, 6, 'Saturday', TO_TIMESTAMP('08:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Y'),
(20, 6, 'Saturday', TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Y'),
(21, 6, 'Saturday', TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('20:00:00', 'HH24:MI:SS'), 'Y');

-- Insert approval steps
INSERT INTO ApprovalStep (step_id, step_name, description, order_number) VALUES
(1, 'Faculty Advisor', 'Approval from the faculty advisor of the student body', 1),
(2, 'Student Council', 'Approval from the student council representative', 2),
(3, 'Student Welfare Officer', 'Approval from the student welfare officer', 3),
(4, 'Security', 'Final security clearance', 4);

-- Insert booking requests
INSERT INTO BookingRequest (booking_id, venue_id, student_body_id, requester_id, booking_date, start_time, end_time, purpose, attendees_count, setup_requirements, status, created_at) VALUES
(1, 1, 1, 4, TO_DATE('2025-04-25', 'YYYY-MM-DD'), TO_TIMESTAMP('10:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('13:00:00', 'HH24:MI:SS'), 'Technical Club 1st General body meeting', 150, 'Projector, Microphone, Chairs arrangement', 'Pending', TO_TIMESTAMP('2025-04-10 09:30:00', 'YYYY-MM-DD HH24:MI:SS')),
(2, 3, 2, 6, TO_DATE('2025-04-26', 'YYYY-MM-DD'), TO_TIMESTAMP('14:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('17:00:00', 'HH24:MI:SS'), 'Cultural Society Practice Session', 40, 'Audio system, Open space for dance', 'Approved', TO_TIMESTAMP('2025-04-11 10:15:00', 'YYYY-MM-DD HH24:MI:SS')),
(3, 4, 3, 8, TO_DATE('2025-04-27', 'YYYY-MM-DD'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('19:00:00', 'HH24:MI:SS'), 'Inter-College Debate Competition', 300, 'Stage setup, Microphones, Seating arrangement', 'Rejected', TO_TIMESTAMP('2025-04-12 11:45:00', 'YYYY-MM-DD HH24:MI:SS')),
(4, 6, 1, 4, TO_DATE('2025-04-28', 'YYYY-MM-DD'), TO_TIMESTAMP('09:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('12:00:00', 'HH24:MI:SS'), 'Tech Fair Exhibition', 200, 'Tables for displays, Power outlets, Canopy', 'Approved', TO_TIMESTAMP('2025-04-13 14:20:00', 'YYYY-MM-DD HH24:MI:SS')),
(5, 2, 2, 6, TO_DATE('2025-04-29', 'YYYY-MM-DD'), TO_TIMESTAMP('13:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('16:00:00', 'HH24:MI:SS'), 'Cultural Workshop', 50, 'Chairs in circular arrangement, Projector', 'Pending', TO_TIMESTAMP('2025-04-14 16:10:00', 'YYYY-MM-DD HH24:MI:SS')),
(6, 5, 3, 8, TO_DATE('2025-04-30', 'YYYY-MM-DD'), TO_TIMESTAMP('11:00:00', 'HH24:MI:SS'), TO_TIMESTAMP('14:00:00', 'HH24:MI:SS'), 'Debate Club Meeting', 20, 'Conference table setup, Whiteboard', 'Completed', TO_TIMESTAMP('2025-04-01 09:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- Insert booking approvals
INSERT INTO BookingApproval (approval_id, booking_id, step_id, approver_id, is_approved, comments, approval_date) VALUES
(1, 1, 1, 1, 'Y', 'Approved by faculty advisor', TO_TIMESTAMP('2025-04-11 10:30:00', 'YYYY-MM-DD HH24:MI:SS')),
(2, 1, 2, NULL, 'Y', 'Approved by student council', TO_TIMESTAMP('2025-04-12 11:15:00', 'YYYY-MM-DD HH24:MI:SS')),
(3, 1, 3, NULL, NULL, NULL, NULL),
(4, 1, 4, NULL, NULL, NULL, NULL),
(5, 2, 1, 2, 'Y', 'Approved by faculty advisor', TO_TIMESTAMP('2025-04-12 09:45:00', 'YYYY-MM-DD HH24:MI:SS')),
(6, 2, 2, NULL, 'Y', 'Approved by student council', TO_TIMESTAMP('2025-04-13 10:30:00', 'YYYY-MM-DD HH24:MI:SS')),
(7, 2, 3, 1, 'Y', 'Approved by SWO', TO_TIMESTAMP('2025-04-14 14:20:00', 'YYYY-MM-DD HH24:MI:SS')),
(8, 2, 4, 2, 'Y', 'Approved by security', TO_TIMESTAMP('2025-04-15 11:10:00', 'YYYY-MM-DD HH24:MI:SS')),
(9, 3, 1, 3, 'Y', 'Approved by faculty advisor', TO_TIMESTAMP('2025-04-13 15:30:00', 'YYYY-MM-DD HH24:MI:SS')),
(10, 3, 2, NULL, 'Y', 'Approved by student council', TO_TIMESTAMP('2025-04-14 16:45:00', 'YYYY-MM-DD HH24:MI:SS')),
(11, 3, 3, 1, 'N', 'Rejected due to scheduling conflict with university event', TO_TIMESTAMP('2025-04-15 10:20:00', 'YYYY-MM-DD HH24:MI:SS')),
(12, 3, 4, NULL, NULL, NULL, NULL);

-- Insert booking history
INSERT INTO BookingHistory (history_id, booking_id, action_taken, action_by, action_date) VALUES
(1, 1, 'Booking request submitted', 4, TO_TIMESTAMP('2025-04-10 09:30:00', 'YYYY-MM-DD HH24:MI:SS')),
(2, 1, 'Faculty advisor approval', 1, TO_TIMESTAMP('2025-04-11 10:30:00', 'YYYY-MM-DD HH24:MI:SS')),
(3, 1, 'Student council approval', 5, TO_TIMESTAMP('2025-04-12 11:15:00', 'YYYY-MM-DD HH24:MI:SS')),
(4, 2, 'Booking request submitted', 6, TO_TIMESTAMP('2025-04-11 10:15:00', 'YYYY-MM-DD HH24:MI:SS')),
(5, 2, 'Faculty advisor approval', 2, TO_TIMESTAMP('2025-04-12 09:45:00', 'YYYY-MM-DD HH24:MI:SS')),
(6, 2, 'Student council approval', 5, TO_TIMESTAMP('2025-04-13 10:30:00', 'YYYY-MM-DD HH24:MI:SS')),
(7, 2, 'SWO approval', 1, TO_TIMESTAMP('2025-04-14 14:20:00', 'YYYY-MM-DD HH24:MI:SS')),
(8, 2, 'Security approval', 2, TO_TIMESTAMP('2025-04-15 11:10:00', 'YYYY-MM-DD HH24:MI:SS')),
(9, 2, 'Booking confirmed', 1, TO_TIMESTAMP('2025-04-15 11:15:00', 'YYYY-MM-DD HH24:MI:SS')),
(10, 3, 'Booking request submitted', 8, TO_TIMESTAMP('2025-04-12 11:45:00', 'YYYY-MM-DD HH24:MI:SS')),
(11, 3, 'Faculty advisor approval', 3, TO_TIMESTAMP('2025-04-13 15:30:00', 'YYYY-MM-DD HH24:MI:SS')),
(12, 3, 'Student council approval', 5, TO_TIMESTAMP('2025-04-14 16:45:00', 'YYYY-MM-DD HH24:MI:SS')),
(13, 3, 'SWO rejection', 1, TO_TIMESTAMP('2025-04-15 10:20:00', 'YYYY-MM-DD HH24:MI:SS')),
(14, 3, 'Booking rejected', 1, TO_TIMESTAMP('2025-04-15 10:25:00', 'YYYY-MM-DD HH24:MI:SS'));

-- Insert exchange requests
INSERT INTO ExchangeRequest (exchange_id, requester_booking_id, requested_booking_id, reason, status, created_at) VALUES
(1, 1, 2, 'Need a computer lab for technical demonstration', 'Pending', TO_TIMESTAMP('2025-04-16 09:30:00', 'YYYY-MM-DD HH24:MI:SS')),
(2, 3, 4, 'Auditorium would be better for our debate competition', 'Rejected', TO_TIMESTAMP('2025-04-17 14:15:00', 'YYYY-MM-DD HH24:MI:SS'));

-- Insert notifications
INSERT INTO Notification (notification_id, user_id, title, message, created_at, is_read) VALUES
(1, 4, 'Booking Approved', 'Your booking request for Computer Lab B204 on April 25, 2025 has been approved.', TO_TIMESTAMP('2025-04-15 11:20:00', 'YYYY-MM-DD HH24:MI:SS'), 'N'),
(2, 6, 'Booking Confirmed', 'Your booking for Cultural Society Practice Session has been confirmed.', TO_TIMESTAMP('2025-04-15 11:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Y'),
(3, 8, 'Booking Rejected', 'Your booking request for Main Auditorium has been rejected due to scheduling conflict.', TO_TIMESTAMP('2025-04-15 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'N'),
(4, 4, 'Exchange Request', 'Tech Society has requested to exchange their booking of Seminar Hall 1 with your booking of Computer Lab B204.', TO_TIMESTAMP('2025-04-16 09:35:00', 'YYYY-MM-DD HH24:MI:SS'), 'N'),
(5, 6, 'Important Announcement', 'All bookings for May 1, 2025 have been cancelled due to scheduled maintenance.', TO_TIMESTAMP('2025-04-18 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Y'),
(6, 4, 'Upcoming Booking Reminder', 'Your booking for Computer Lab B204 is scheduled for tomorrow at 10:00 AM.', TO_TIMESTAMP('2025-04-24 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'N');

-- Insert conversations
INSERT INTO Conversation (conversation_id, topic, created_at) VALUES
(1, 'Tech Club and Cultural Society Exchange', TO_TIMESTAMP('2025-04-16 09:40:00', 'YYYY-MM-DD HH24:MI:SS')),
(2, 'Admin Support for Tech Club', TO_TIMESTAMP('2025-04-17 11:20:00', 'YYYY-MM-DD HH24:MI:SS'));

-- Insert conversation participants
INSERT INTO ConversationParticipant (conversation_id, user_id, joined_at) VALUES
(1, 4, TO_TIMESTAMP('2025-04-16 09:40:00', 'YYYY-MM-DD HH24:MI:SS')),
(1, 6, TO_TIMESTAMP('2025-04-16 09:40:00', 'YYYY-MM-DD HH24:MI:SS')),
(2, 4, TO_TIMESTAMP('2025-04-17 11:20:00', 'YYYY-MM-DD HH24:MI:SS')),
(2, 1, TO_TIMESTAMP('2025-04-17 11:20:00', 'YYYY-MM-DD HH24:MI:SS'));

-- Insert messages
INSERT INTO Message (message_id, conversation_id, sender_id, message_text, sent_at) VALUES
(1, 1, 4, 'Hi there! I noticed you''ve booked Computer Lab B204 for April 25th morning. We were planning to use it for our coding workshop.', TO_TIMESTAMP('2025-04-16 09:45:00', 'YYYY-MM-DD HH24:MI:SS')),
(2, 1, 6, 'Hello! Yes, I''ve booked it for a practice session. What did you have in mind?', TO_TIMESTAMP('2025-04-16 09:50:00', 'YYYY-MM-DD HH24:MI:SS')),
(3, 1, 4, 'I was wondering if you''d be open to exchanging for Seminar Hall 1 at the same time? It has a projector and we can bring laptops.', TO_TIMESTAMP('2025-04-16 09:55:00', 'YYYY-MM-DD HH24:MI:SS')),
(4, 1, 6, 'That''s an interesting offer. Would the Seminar Hall have enough power outlets for all participants?', TO_TIMESTAMP('2025-04-16 10:00:00', 'YYYY-MM-DD HH24:MI:SS')),
(5, 1, 4, 'Yes, it does! There are power strips along the walls and we can arrange for additional ones if needed. How many participants are you expecting?', TO_TIMESTAMP('2025-04-16 10:05:00', 'YYYY-MM-DD HH24:MI:SS')),
(6, 2, 4, 'Hello Admin, I have a question about our upcoming booking.', TO_TIMESTAMP('2025-04-17 11:25:00', 'YYYY-MM-DD HH24:MI:SS')),
(7, 2, 1, 'Hi there! How can I help you with your booking?', TO_TIMESTAMP('2025-04-17 11:30:00', 'YYYY-MM-DD HH24:MI:SS'));
