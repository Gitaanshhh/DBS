-- Drop all data first to avoid constraint issues (in correct order)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE VenueEquipment;
TRUNCATE TABLE Equipment;
TRUNCATE TABLE BookingHistory;
TRUNCATE TABLE ApprovalProcess;
TRUNCATE TABLE BookingRequest;
TRUNCATE TABLE SC_Assignment;
TRUNCATE TABLE Student;
TRUNCATE TABLE StudentBody;
TRUNCATE TABLE Faculty;
TRUNCATE TABLE Venue;
TRUNCATE TABLE Location;
TRUNCATE TABLE RoleAssignments;
SET FOREIGN_KEY_CHECKS = 1;

-- Test Users for easy login
-- Faculty test user
INSERT INTO Faculty VALUES (999, 100001, 'Teacher', 'teacher@manipal.edu', 'Computer Science', 'Professor');
INSERT INTO RoleAssignments VALUES (999, 'FA');

-- Student Body test users
-- INSERT INTO StudentBody VALUES (999, 'club', 'club@manipal.edu', 999);
INSERT INTO Student VALUES (999, 200001, 'President', 8765432100, 999);
INSERT INTO Student VALUES (998, 200002, 'Student', 8765432101, 999);


-- Location data
INSERT INTO Location VALUES (1, 'Academic Block 3', 'MIT Campus, Manipal');
INSERT INTO Location VALUES (2, 'Academic Block 4', 'MIT Campus, Manipal');
INSERT INTO Location VALUES (3, 'Academic Block 5', 'MIT Campus, Manipal');
INSERT INTO Location VALUES (4, 'KEF', 'MIT Campus, Manipal');

-- Venue data
INSERT INTO Venue VALUES (101, 'Lecture Hall AB1-101', 'Classroom', 0, 120, 9876543201);
INSERT INTO Venue VALUES (102, 'Seminar Room AB1-201', 'Seminar Hall', 0, 60, 9876543202);
INSERT INTO Venue VALUES (103, 'Conference Room AB2-301', 'Conference Room', 0, 30, 9876543203);
INSERT INTO Venue VALUES (104, 'Auditorium', 'Auditorium', 0, 500, 9876543204);
INSERT INTO Venue VALUES (105, 'Computer Lab 1', 'Laboratory', 0, 50, 9876543205);
INSERT INTO Venue VALUES (106, 'Electronics Lab', 'Laboratory', 0, 40, 9876543206);
INSERT INTO Venue VALUES (107, 'Workshop Hall', 'Workshop', 0, 80, 9876543207);
INSERT INTO Venue VALUES (108, 'Library Discussion Room', 'Discussion Room', 0, 20, 9876543208);
INSERT INTO Venue VALUES (109, 'Student Activity Hall', 'Multipurpose Hall', 0, 150, 9876543209);
INSERT INTO Venue VALUES (110, 'Research Seminar Room', 'Seminar Hall', 0, 45, 9876543210);
INSERT INTO Venue VALUES (111, 'Mechanical Lab', 'Laboratory', 0, 35, 9876543211);
INSERT INTO Venue VALUES (112, 'Chemical Lab', 'Laboratory', 0, 30, 9876543212);
INSERT INTO Venue VALUES (113, 'Civil Engineering Lab', 'Laboratory', 0, 40, 9876543213);
INSERT INTO Venue VALUES (114, 'Architecture Studio', 'Studio', 0, 50, 9876543214);
INSERT INTO Venue VALUES (115, 'Media Room', 'Multimedia Room', 0, 25, 9876543215);
INSERT INTO Venue VALUES (116, 'Sports Hall', 'Sports Facility', 0, 200, 9876543216);
INSERT INTO Venue VALUES (117, 'Lecture Hall AB3-101', 'Classroom', 0, 100, 9876543217);
INSERT INTO Venue VALUES (118, 'Biotechnology Lab', 'Laboratory', 0, 30, 9876543218);
INSERT INTO Venue VALUES (119, 'Conference Hall', 'Conference Room', 0, 80, 9876543219);
INSERT INTO Venue VALUES (120, 'Student Council Room', 'Meeting Room', 0, 15, 9876543220);

-- Faculty data
INSERT INTO Faculty VALUES (1, 101001, 'Dr. Anil Kumar', 'anil.kumar@manipal.edu', 'Computer Science', 'Professor');
INSERT INTO Faculty VALUES (2, 101002, 'Dr. Priya Sharma', 'priya.sharma@manipal.edu', 'Electronics', 'Associate Professor');
INSERT INTO Faculty VALUES (3, 101003, 'Dr. Rajesh Patel', 'rajesh.patel@manipal.edu', 'Mechanical', 'Professor');
INSERT INTO Faculty VALUES (4, 101004, 'Dr. Sunita Rao', 'sunita.rao@manipal.edu', 'Chemical', 'Assistant Professor');
INSERT INTO Faculty VALUES (5, 101005, 'Dr. Venkat Iyer', 'venkat.iyer@manipal.edu', 'Civil', 'Professor');
INSERT INTO Faculty VALUES (6, 101006, 'Dr. Meena Nair', 'meena.nair@manipal.edu', 'Biotechnology', 'Associate Professor');
INSERT INTO Faculty VALUES (7, 101007, 'Dr. Karthik Menon', 'karthik.menon@manipal.edu', 'Architecture', 'Professor');
INSERT INTO Faculty VALUES (8, 101008, 'Dr. Lakshmi Krishnan', 'lakshmi.krishnan@manipal.edu', 'Media Studies', 'Assistant Professor');
INSERT INTO Faculty VALUES (9, 101009, 'Dr. Sameer Joshi', 'sameer.joshi@manipal.edu', 'Computer Science', 'Associate Professor');
INSERT INTO Faculty VALUES (10, 101010, 'Dr. Ananya Desai', 'ananya.desai@manipal.edu', 'Electronics', 'Professor');
INSERT INTO Faculty VALUES (11, 101011, 'Dr. Vikram Singh', 'vikram.singh@manipal.edu', 'Mechanical', 'Assistant Professor');
INSERT INTO Faculty VALUES (12, 101012, 'Dr. Neha Gupta', 'neha.gupta@manipal.edu', 'Chemical', 'Associate Professor');
INSERT INTO Faculty VALUES (13, 101013, 'Dr. Ramesh Nair', 'ramesh.nair@manipal.edu', 'Civil', 'Professor');
INSERT INTO Faculty VALUES (14, 101014, 'Dr. Shalini Verma', 'shalini.verma@manipal.edu', 'Biotechnology', 'Assistant Professor');
INSERT INTO Faculty VALUES (15, 101015, 'Dr. Prakash Rao', 'prakash.rao@manipal.edu', 'Architecture', 'Associate Professor');
INSERT INTO Faculty VALUES (16, 101016, 'Dr. Deepa Menon', 'deepa.menon@manipal.edu', 'Media Studies', 'Professor');
INSERT INTO Faculty VALUES (17, 101017, 'Dr. Arjun Reddy', 'arjun.reddy@manipal.edu', 'Computer Science', 'Assistant Professor');
INSERT INTO Faculty VALUES (18, 101018, 'Dr. Kavita Patel', 'kavita.patel@manipal.edu', 'Electronics', 'Professor');
INSERT INTO Faculty VALUES (19, 101019, 'Dr. Mohan Kumar', 'mohan.kumar@manipal.edu', 'Mechanical', 'Associate Professor');
INSERT INTO Faculty VALUES (20, 101020, 'Dr. Ritu Sharma', 'ritu.sharma@manipal.edu', 'Chemical', 'Assistant Professor');

-- StudentBody data first (since Students reference it)
INSERT INTO StudentBody VALUES (1, 'club', 'club@manipal.edu', 1);
INSERT INTO StudentBody VALUES (2, 'ACM Student Chapter', 'acm@manipal.edu', 9);
INSERT INTO StudentBody VALUES (3, 'Mechanical Engineering Association', 'mea@manipal.edu', 3);
INSERT INTO StudentBody VALUES (4, 'Chemical Society', 'chemsoc@manipal.edu', 4);
INSERT INTO StudentBody VALUES (5, 'Civil Engineering Students Association', 'cesa@manipal.edu', 5);
INSERT INTO StudentBody VALUES (6, 'Biotech Club', 'biotech@manipal.edu', 6);
INSERT INTO StudentBody VALUES (7, 'Architecture Students Association', 'asa@manipal.edu', 7);
INSERT INTO StudentBody VALUES (8, 'Media Club', 'media@manipal.edu', 8);
INSERT INTO StudentBody VALUES (9, 'Electronics Club', 'electronics@manipal.edu', 2);
INSERT INTO StudentBody VALUES (10, 'Coding Club', 'coding@manipal.edu', 17);
INSERT INTO StudentBody VALUES (11, 'Robotics Club', 'robotics@manipal.edu', 10);
INSERT INTO StudentBody VALUES (12, 'Environmental Club', 'environment@manipal.edu', 12);
INSERT INTO StudentBody VALUES (13, 'Cultural Club', 'cultural@manipal.edu', 16);
INSERT INTO StudentBody VALUES (14, 'Sports Club', 'sports@manipal.edu', 19);
INSERT INTO StudentBody VALUES (15, 'Debate Society', 'debate@manipal.edu', 8);
INSERT INTO StudentBody VALUES (16, 'Photography Club', 'photography@manipal.edu', 8);
INSERT INTO StudentBody VALUES (17, 'Dance Club', 'dance@manipal.edu', 16);
INSERT INTO StudentBody VALUES (18, 'Music Club', 'music@manipal.edu', 16);
INSERT INTO StudentBody VALUES (19, 'Student Council', 'studentcouncil@manipal.edu', 1);
INSERT INTO StudentBody VALUES (20, 'Innovation Club', 'innovation@manipal.edu', 9);

-- Student data with direct StudentBody assignments
INSERT INTO Student VALUES (1001, 201001, 'Rahul Sharma', 8765432101, 1);
INSERT INTO Student VALUES (1002, 201002, 'Priya Patel', 8765432102, 2);
INSERT INTO Student VALUES (1003, 201003, 'Amit Kumar', 8765432103, 3);
INSERT INTO Student VALUES (1004, 201004, 'Sneha Gupta', 8765432104, 4);
INSERT INTO Student VALUES (1005, 201005, 'Vikram Singh', 8765432105, 5);
INSERT INTO Student VALUES (1006, 201006, 'Neha Reddy', 8765432106, 6);
INSERT INTO Student VALUES (1007, 201007, 'Karan Malhotra', 8765432107, 7);
INSERT INTO Student VALUES (1008, 201008, 'Anjali Desai', 8765432108, 8);
INSERT INTO Student VALUES (1009, 201009, 'Rajesh Verma', 8765432109, 9);
INSERT INTO Student VALUES (1010, 201010, 'Pooja Nair', 8765432110, 10);
INSERT INTO Student VALUES (1011, 201011, 'Sanjay Joshi', 8765432111, 11);
INSERT INTO Student VALUES (1012, 201012, 'Divya Menon', 8765432112, 12);
INSERT INTO Student VALUES (1013, 201013, 'Arjun Rao', 8765432113, 13);
INSERT INTO Student VALUES (1014, 201014, 'Meera Iyer', 8765432114, 14);
INSERT INTO Student VALUES (1015, 201015, 'Suresh Kumar', 8765432115, 15);
INSERT INTO Student VALUES (1016, 201016, 'Anita Sharma', 8765432116, 16);
INSERT INTO Student VALUES (1017, 201017, 'Deepak Patel', 8765432117, 17);
INSERT INTO Student VALUES (1018, 201018, 'Kavita Singh', 8765432118, 18);
INSERT INTO Student VALUES (1019, 201019, 'Rohit Nair', 8765432119, 19);
INSERT INTO Student VALUES (1020, 201020, 'Sunita Rao', 8765432120, 20);

-- Now we can proceed with booking data

-- SC_Assignment data (after Student data since it references students)
INSERT INTO SC_Assignment VALUES (1019, TRUE);
INSERT INTO SC_Assignment VALUES (1001, FALSE);
INSERT INTO SC_Assignment VALUES (1002, TRUE);
INSERT INTO SC_Assignment VALUES (1003, FALSE);
INSERT INTO SC_Assignment VALUES (1004, FALSE);
INSERT INTO SC_Assignment VALUES (1005, TRUE);
INSERT INTO SC_Assignment VALUES (1006, FALSE);
INSERT INTO SC_Assignment VALUES (1007, FALSE);
INSERT INTO SC_Assignment VALUES (1008, TRUE);
INSERT INTO SC_Assignment VALUES (1009, FALSE);
INSERT INTO SC_Assignment VALUES (1010, FALSE);
INSERT INTO SC_Assignment VALUES (1011, TRUE);
INSERT INTO SC_Assignment VALUES (1012, FALSE);
INSERT INTO SC_Assignment VALUES (1013, FALSE);
INSERT INTO SC_Assignment VALUES (1014, TRUE);
INSERT INTO SC_Assignment VALUES (1015, FALSE);
INSERT INTO SC_Assignment VALUES (1016, FALSE);
INSERT INTO SC_Assignment VALUES (1017, TRUE);
INSERT INTO SC_Assignment VALUES (1018, FALSE);
INSERT INTO SC_Assignment VALUES (1020, FALSE);

-- BookingRequest data
INSERT INTO BookingRequest VALUES (501, 101, 1, '2025-04-25', '10:00:00', '12:00:00', 'IEEE Technical Workshop', 'Approved');
INSERT INTO BookingRequest VALUES (502, 102, 2, '2025-04-26', '14:00:00', '16:00:00', 'ACM Coding Competition', 'Pending');
INSERT INTO BookingRequest VALUES (503, 103, 3, '2025-04-27', '09:00:00', '11:00:00', 'Mechanical Engineering Seminar', 'Approved');
INSERT INTO BookingRequest VALUES (504, 104, 13, '2025-04-28', '18:00:00', '21:00:00', 'Cultural Night', 'Approved');
INSERT INTO BookingRequest VALUES (505, 105, 10, '2025-04-29', '13:00:00', '15:00:00', 'Programming Workshop', 'Pending');
INSERT INTO BookingRequest VALUES (506, 106, 9, '2025-04-30', '11:00:00', '13:00:00', 'Electronics Project Demo', 'Rejected');
INSERT INTO BookingRequest VALUES (507, 107, 3, '2025-05-01', '15:00:00', '17:00:00', 'Machine Workshop', 'Approved');
INSERT INTO BookingRequest VALUES (508, 108, 15, '2025-05-02', '16:00:00', '18:00:00', 'Debate Competition', 'Pending');
INSERT INTO BookingRequest VALUES (509, 109, 13, '2025-05-03', '17:00:00', '19:00:00', 'Dance Practice', 'Approved');
INSERT INTO BookingRequest VALUES (510, 110, 6, '2025-05-04', '10:00:00', '12:00:00', 'Biotech Research Presentation', 'Pending');
INSERT INTO BookingRequest VALUES (511, 111, 3, '2025-05-05', '14:00:00', '16:00:00', 'Mechanical Project Exhibition', 'Approved');
INSERT INTO BookingRequest VALUES (512, 112, 4, '2025-05-06', '09:00:00', '11:00:00', 'Chemical Experiment Demo', 'Rejected');
INSERT INTO BookingRequest VALUES (513, 113, 5, '2025-05-07', '13:00:00', '15:00:00', 'Civil Engineering Model Display', 'Approved');
INSERT INTO BookingRequest VALUES (514, 114, 7, '2025-05-08', '11:00:00', '13:00:00', 'Architecture Design Showcase', 'Pending');
INSERT INTO BookingRequest VALUES (515, 115, 8, '2025-05-09', '15:00:00', '17:00:00', 'Media Production Workshop', 'Approved');
INSERT INTO BookingRequest VALUES (516, 116, 14, '2025-05-10', '16:00:00', '18:00:00', 'Indoor Sports Tournament', 'Approved');
INSERT INTO BookingRequest VALUES (517, 117, 19, '2025-05-11', '10:00:00', '12:00:00', 'Student Council Meeting', 'Approved');
INSERT INTO BookingRequest VALUES (518, 118, 6, '2025-05-12', '14:00:00', '16:00:00', 'Biotech Lab Session', 'Pending');
INSERT INTO BookingRequest VALUES (519, 119, 20, '2025-05-13', '09:00:00', '11:00:00', 'Innovation Brainstorming Session', 'Approved');
INSERT INTO BookingRequest VALUES (520, 120, 19, '2025-05-14', '13:00:00', '15:00:00', 'Student Representatives Meeting', 'Pending');

-- ApprovalProcess data
INSERT INTO ApprovalProcess VALUES (601, 501, 1, 'Approved');
INSERT INTO ApprovalProcess VALUES (602, 502, 9, 'Pending');
INSERT INTO ApprovalProcess VALUES (603, 503, 3, 'Approved');
INSERT INTO ApprovalProcess VALUES (604, 504, 16, 'Approved');
INSERT INTO ApprovalProcess VALUES (605, 505, 17, 'Pending');
INSERT INTO ApprovalProcess VALUES (606, 506, 2, 'Rejected');
INSERT INTO ApprovalProcess VALUES (607, 507, 3, 'Approved');
INSERT INTO ApprovalProcess VALUES (608, 508, 8, 'Pending');
INSERT INTO ApprovalProcess VALUES (609, 509, 16, 'Approved');
INSERT INTO ApprovalProcess VALUES (610, 510, 6, 'Pending');
INSERT INTO ApprovalProcess VALUES (611, 511, 3, 'Approved');
INSERT INTO ApprovalProcess VALUES (612, 512, 4, 'Rejected');
INSERT INTO ApprovalProcess VALUES (613, 513, 5, 'Approved');
INSERT INTO ApprovalProcess VALUES (614, 514, 7, 'Pending');
INSERT INTO ApprovalProcess VALUES (615, 515, 8, 'Approved');
INSERT INTO ApprovalProcess VALUES (616, 516, 19, 'Approved');
INSERT INTO ApprovalProcess VALUES (617, 517, 1, 'Approved');
INSERT INTO ApprovalProcess VALUES (618, 518, 6, 'Pending');
INSERT INTO ApprovalProcess VALUES (619, 519, 9, 'Approved');
INSERT INTO ApprovalProcess VALUES (620, 520, 1, 'Pending');

-- BookingHistory data
INSERT INTO BookingHistory VALUES (701, 501, '2025-04-20', 'Booking request submitted');
INSERT INTO BookingHistory VALUES (702, 501, '2025-04-21', 'Booking approved by faculty advisor');
INSERT INTO BookingHistory VALUES (703, 501, '2025-04-22', 'Booking confirmed');
INSERT INTO BookingHistory VALUES (704, 502, '2025-04-21', 'Booking request submitted');
INSERT INTO BookingHistory VALUES (705, 502, '2025-04-22', 'Under review by faculty advisor');
INSERT INTO BookingHistory VALUES (706, 503, '2025-04-22', 'Booking request submitted');
INSERT INTO BookingHistory VALUES (707, 503, '2025-04-23', 'Booking approved by faculty advisor');
INSERT INTO BookingHistory VALUES (708, 504, '2025-04-23', 'Booking request submitted');
INSERT INTO BookingHistory VALUES (709, 504, '2025-04-23', 'Booking approved by faculty advisor');
INSERT INTO BookingHistory VALUES (710, 505, '2025-04-23', 'Booking request submitted');
INSERT INTO BookingHistory VALUES (711, 506, '2025-04-22', 'Booking request submitted');
INSERT INTO BookingHistory VALUES (712, 506, '2025-04-23', 'Booking rejected due to scheduling conflict');
INSERT INTO BookingHistory VALUES (713, 507, '2025-04-21', 'Booking request submitted');
INSERT INTO BookingHistory VALUES (714, 507, '2025-04-22', 'Booking approved by faculty advisor');
INSERT INTO BookingHistory VALUES (715, 508, '2025-04-22', 'Booking request submitted');
INSERT INTO BookingHistory VALUES (716, 509, '2025-04-23', 'Booking request submitted');
INSERT INTO BookingHistory VALUES (717, 509, '2025-04-23', 'Booking approved by faculty advisor');
INSERT INTO BookingHistory VALUES (718, 510, '2025-04-22', 'Booking request submitted');
INSERT INTO BookingHistory VALUES (719, 511, '2025-04-21', 'Booking request submitted');
INSERT INTO BookingHistory VALUES (720, 511, '2025-04-22', 'Booking approved by faculty advisor');

-- RoleAssignments data
INSERT INTO RoleAssignments VALUES (1, 'FA');
INSERT INTO RoleAssignments VALUES (2, 'FA');
INSERT INTO RoleAssignments VALUES (3, 'FA');
INSERT INTO RoleAssignments VALUES (4, 'FA');
INSERT INTO RoleAssignments VALUES (5, 'FA');
INSERT INTO RoleAssignments VALUES (6, 'FA');
INSERT INTO RoleAssignments VALUES (7, 'FA');
INSERT INTO RoleAssignments VALUES (8, 'FA');
INSERT INTO RoleAssignments VALUES (9, 'FA');
INSERT INTO RoleAssignments VALUES (10, 'SWO');
INSERT INTO RoleAssignments VALUES (11, 'Security');
INSERT INTO RoleAssignments VALUES (12, 'FA');
INSERT INTO RoleAssignments VALUES (13, 'Security');
INSERT INTO RoleAssignments VALUES (14, 'FA');
INSERT INTO RoleAssignments VALUES (15, 'FA');
INSERT INTO RoleAssignments VALUES (16, 'FA');
INSERT INTO RoleAssignments VALUES (17, 'FA');
INSERT INTO RoleAssignments VALUES (18, 'SWO');
INSERT INTO RoleAssignments VALUES (19, 'Security');
INSERT INTO RoleAssignments VALUES (20, 'FA');

-- End of data inserts

-- Equipment data
INSERT INTO Equipment VALUES (201, 'Projector', 30);
INSERT INTO Equipment VALUES (202, 'Microphone', 50);
INSERT INTO Equipment VALUES (203, 'Laptop', 40);
INSERT INTO Equipment VALUES (204, 'Speaker System', 15);
INSERT INTO Equipment VALUES (205, 'Whiteboard', 25);
INSERT INTO Equipment VALUES (206, 'Lab Equipment Set', 20);
INSERT INTO Equipment VALUES (207, 'Camera', 10);
INSERT INTO Equipment VALUES (208, 'Tripod', 8);
INSERT INTO Equipment VALUES (209, 'Lighting Equipment', 12);
INSERT INTO Equipment VALUES (210, 'Extension Cords', 40);
INSERT INTO Equipment VALUES (211, 'Chairs', 500);
INSERT INTO Equipment VALUES (212, 'Tables', 100);
INSERT INTO Equipment VALUES (213, 'Podium', 5);
INSERT INTO Equipment VALUES (214, 'Backdrop Stand', 3);
INSERT INTO Equipment VALUES (215, 'Projector Screen', 15);
INSERT INTO Equipment VALUES (216, 'Video Conferencing System', 5);
INSERT INTO Equipment VALUES (217, 'Sound Mixer', 3);
INSERT INTO Equipment VALUES (218, 'Wireless Presenter', 10);
INSERT INTO Equipment VALUES (219, 'Flip Chart', 15);
INSERT INTO Equipment VALUES (220, 'Virtual Reality Headset', 5);

-- VenueEquipment data
INSERT INTO VenueEquipment VALUES (101, 201, 1);
INSERT INTO VenueEquipment VALUES (101, 202, 2);
INSERT INTO VenueEquipment VALUES (101, 205, 1);
INSERT INTO VenueEquipment VALUES (102, 201, 1);
INSERT INTO VenueEquipment VALUES (102, 202, 1);
INSERT INTO VenueEquipment VALUES (102, 215, 1);
INSERT INTO VenueEquipment VALUES (103, 201, 1);
INSERT INTO VenueEquipment VALUES (103, 216, 1);
INSERT INTO VenueEquipment VALUES (104, 201, 2);
INSERT INTO VenueEquipment VALUES (104, 202, 5);
INSERT INTO VenueEquipment VALUES (104, 204, 2);
INSERT INTO VenueEquipment VALUES (105, 203, 30);
INSERT INTO VenueEquipment VALUES (105, 201, 1);
INSERT INTO VenueEquipment VALUES (106, 206, 20);
INSERT INTO VenueEquipment VALUES (107, 206, 15);
INSERT INTO VenueEquipment VALUES (108, 205, 2);
INSERT INTO VenueEquipment VALUES (109, 201, 1);
INSERT INTO VenueEquipment VALUES (109, 202, 3);
INSERT INTO VenueEquipment VALUES (110, 201, 1);
INSERT INTO VenueEquipment VALUES (110, 202, 2);

-- commit;