# Room Booking and Management System ER Model

This README provides the Entity-Relationship (ER) model for a room booking and management system tailored for colleges. The system allows students to book venues for meetings and events, with multi-level approval workflows.

---

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

College ||--o{ Building : "has"
Building ||--o{ Venue : "contains"
StudentBody ||--o{ Student : "includes"
Faculty ||--o{ StudentBody : "advises"
Venue ||--o{ BookingRequest : "requested for"
StudentBody ||--o{ BookingRequest : "makes"
BookingRequest ||--o{ ApprovalProcess : "goes through"
BookingRequest ||--o{ BookingHistory : "logs"


---

## Explanation of Entities and Relationships

### **Entities**
1. **College**: Represents the college, with attributes like `college_name` and `admin_contact`.
2. **Building**: Represents buildings within the college, linked to `College`.
3. **Venue**: Represents rooms or spaces available for booking, linked to `Building`.
4. **StudentBody**: Represents student organizations responsible for bookings.
5. **Student**: Represents individual students who belong to a `StudentBody`.
6. **Faculty**: Represents faculty members who may advise student bodies or hold administrative positions.
7. **BookingRequest**: Represents a request to book a venue.
8. **ApprovalProcess**: Tracks approvals required for each booking request.
9. **BookingHistory**: Logs past bookings for record-keeping.

### **Relationships**
- A `College` can have multiple `Buildings`.
- A `Building` can contain multiple `Venues`.
- A `StudentBody` can include multiple `Students`.
- A `Faculty` member can advise multiple `StudentBodies`.
- A `Venue` can be requested for booking via a `BookingRequest`.
- Each `BookingRequest` goes through an `ApprovalProcess` involving multiple approvers.
- All completed bookings are recorded in the `BookingHistory`.

---

## Features

1. **Venue Management**:
   - Admin maps venues with attributes like type, capacity, and status.

2. **Booking Workflow**:
   - Students submit requests through their respective student bodies.
   - Multi-level approval process:
     - Faculty Advisor → Student Council Member → Head of Student Welfare → Security Head.

3. **Conflict Resolution**:
   - Prevent overlapping bookings for the same venue and time.

4. **Historical Records**:
   - Maintain logs of all past bookings.

---

## Project Timeline

### Week 1-2:
- Requirement gathering and ER model design.

### Week 3:
- Database schema creation and setup.

### Week 4:
- Backend development using Python (Flask/Django).

### Week 5:
- Frontend development using React/Angular/Vue.js.

### Week 6:
- Integration of frontend and backend APIs.

### Week 7:
- Testing and feedback incorporation.

### Week 8:
- Deployment and final review.

---

## Technology Stack

### Backend:
- Python (Flask or Django) for handling API requests, authentication, and database interactions.

### Frontend:
- React/Angular/Vue.js for creating a dynamic user interface.

### Database:
- PostgreSQL or MySQL as the relational database management system.

---

This ER model forms the foundation of the room booking system, ensuring efficient venue management and smooth workflows tailored to college environments.
