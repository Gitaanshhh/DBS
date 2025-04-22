# Database

### Basic Data to populate the Database and work on the project

## Tables

Table IndoorVenue {
    - floor_number: int
    - building_id: int
    - building_name: string
}
Table Venue {
    - venue_name: string 
    - venue_id: int
    - venue_type: string
    - booking_status: int
    - seating_capacity: int
    - manager_contact: int
}
Table StudentBody {
    - student_body_id: int
    - name: string
    - email: string
    - faculty_advisor_id: int
    - primary_rep_id: int
    - secondary_rep_id: int
}
Table Student {
    - student_id: int
    - registration_id: int
    - name: string
    - contact_details: int
    - student_body_id: int
}
Table Faculty {
    - faculty_id: int
    - registration_id: int
    - name: string
    - email: string
    - department: string
    - post: string
}
Table BookingRequest {
    - booking_id: int
    - venue_id: int
    - student_body_id: int
    - booking_date: date
    - start_time: time
    - end_time: time
    - status: string
}
Table ApprovalProcess {
    - approval_id: int
    - booking_id: int
    - FA_approval: boolean
    - SC_approval: boolean
    - SWO_approval: boolean
    - Sec_approval: boolean
    - approver_id: int
    - approval_status: string
}
Table BookingHistory {
    - booking_id: int
    - booking_id: int
    - booking_date: date
    - action_taken: string
}


## ER Diagram

Building {
    string building_id PK
    string building_name
    int total_floors
    string college_id FK
}

Venue {
    string venue_id PK
    string venue_type
    int floor_number
    int room_number
    boolean booking_status
    int seating_capacity
    string floor_manager_contact_number
    string building_id FK
}

StudentBody {
    string student_body_id PK
    string name
    string faculty_advisor_id FK
    string primary_representative_id FK
    string secondary_representative_id FK
}

Student {
    string student_id PK
    string registration_id
    string name
    string contact_details
    string student_body_id FK
}

Faculty {
    string faculty_id PK
    string registration_id
    string name
    string department
    string post
}

BookingRequest {
    string booking_request_id PK
    string venue_id FK
    string student_body_id FK
    date booking_date
    time start_time
    time end_time
    enum status {pending, approved, rejected}
}

ApprovalProcess {
    string approval_id PK
    string booking_request_id FK
    enum approver_type {faculty_advisor, student_council_member, head_of_student_welfare, security_head}
    string approver_id FK 
    enum approval_status {approved, rejected}
}

BookingHistory {
    string history_id PK
    string booking_request_id FK 
    date booking_date 
    enum action_taken {booked, canceled}
}


## Idea
ER Model and schema for me My project is a room booking and management system customizable for colleges, it mainly functions on students booking a classroom/auditorium/seminar hall/labs etc for meetings like fest organizing meeting/ GBMs for student clubs/ rooms for a student project, etc at multiple slots on various days. The faculty has the authority to approve or reject the request to book said venue.

At first the Admin maps all the venues in the college so when I, the Admin, is building this model for college A, I will input that it has say 5 buildings, building 1 has m rooms, n seminar halls, o auditoriums, p open spaces across q floors, with particular atrributes like floor_number, room_number, booking_status, seating_capacity, floor_manager_contact_number, etc.

Every student body has a { unique_id, faculty_advisor id, name, name_of_student_body; name, id, contact details of primary_club_represent and secondary_represent} Each student has their personal registration id. The students booking these places are board members of their respective student bodies

Every faculty member also has their unique registration id, post, name, department. Some faculty members are the faculty_advisor of student clubs so we are only storing them in our database. We are also keeping the faculty members on the higher administrative posts in the college.

Every booking will be done by certain student bodies, for a particular venue, in a building, on certain days, for certain time periods that can not overlap with other bookings for the same venue, date. 

The process to confirm a booking goes through in a pipelined manner. When a student requests for a booking, first the respective faculty advisor of the student body has to approve it, then a student from the student council has to approve it, then the Head of the Student Welfare Office has to approve it (the Head of Student Welfare Office is a faculty member). Then at last the Security Section Head has to approve it. 

There should also exist a main record that keeps a log of all the past bookings done in the college.

ER diagram, a schema diagram, all the respective entity-relation tables, tell us what logic goes in the frontend, backend  and what must be stored in the database. Also give us a timeline for this project, features and insights on how to approach building this project using python in backend, javascript frameworks in frontend and a suitable relational database
