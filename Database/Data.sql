-- Faculty
INSERT INTO Faculty VALUES (1, 5001, 'Dr. Rao', 'rao@uni.edu', 'Engineering', 'Professor');
INSERT INTO Faculty VALUES (2, 5002, 'Ms. Sharma', 'sharma@uni.edu', 'Science', 'Lecturer');

-- Venue and IndoorVenue
INSERT INTO Venue VALUES (101, 'Main Hall', 'Indoor', 0, 200, 9876543210);
INSERT INTO IndoorVenue VALUES (101, 2, 12, 'Alpha Building');

-- Students
INSERT INTO StudentBody VALUES (10, 'Tech Club', 'tech@uni.edu', 1, NULL, NULL);
INSERT INTO Student VALUES (1001, 3001, 'John Doe', 9999999999, 10);
INSERT INTO Student VALUES (1002, 3002, 'Alice Smith', 8888888888, 10);

-- Add primary/secondary reps now
UPDATE StudentBody SET primary_rep_id = 1001, secondary_rep_id = 1002 WHERE student_body_id = 10;

-- Booking
INSERT INTO BookingRequest VALUES (201, 101, 10, '2025-04-25', '10:00:00', '13:00:00', 'Pending');

-- Approvals
INSERT INTO ApprovalProcess VALUES (301, 201, TRUE, TRUE, FALSE, FALSE, 1, 'Partially Approved');

-- Booking History
INSERT INTO BookingHistory VALUES (401, 201, '2025-04-25', 'Initial submission');

-- Role Assignments
INSERT INTO RoleAssignments VALUES (1, 'SWO');
INSERT INTO RoleAssignments VALUES (2, 'Security');

-- SC Assignment
INSERT INTO SC_Assignment VALUES (1002, TRUE);
