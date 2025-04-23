# Database Schema & Setup

This directory contains the SQL schema and ER diagrams for the DBS project.

---

## Tables

We follow these steps:
1. **Extract tables and attributes.**
2. **Identify primary keys and foreign keys.**
3. **Ensure each table is in BCNF**:
   - A table is in **BCNF** if every determinant is a candidate key.

#### **1. Venue**
| Attribute         | Type     | Constraints          |
|------------------|----------|----------------------|
| venue_id         | INT      | PK                   |
| venue_name       | STRING   |                      |
| venue_type       | STRING   |                      |
| booking_status   | INT      |                      |
| seating_capacity | INT      |                      |
| manager_contact  | INT      |                      |

---

#### **2. IndoorVenue**
| Attribute     | Type   | Constraints     |
|--------------|--------|-----------------|
| venue_id     | INT    | PK, FK → Venue  |
| floor_number | INT    |                 |
| building_id  | INT    |                 |
| building_name| STRING |                 |

---

#### **3. StudentBody**
| Attribute           | Type   | Constraints               |
|--------------------|--------|---------------------------|
| student_body_id    | INT    | PK                        |
| name               | STRING |                           |
| email              | STRING |                           |
| faculty_advisor_id | INT    | FK → Faculty              |
| primary_rep_id     | INT    | FK → Student              |
| secondary_rep_id   | INT    | FK → Student              |

---

#### **4. Student**
| Attribute         | Type   | Constraints           |
|------------------|--------|-----------------------|
| student_id       | INT    | PK                    |
| registration_id  | INT    |                       |
| name             | STRING |                       |
| contact_details  | INT    |                       |
| student_body_id  | INT    | FK → StudentBody      |

---

#### **5. Faculty**
| Attribute       | Type   | Constraints     |
|----------------|--------|-----------------|
| faculty_id     | INT    | PK              |
| registration_id| INT    |                 |
| name           | STRING |                 |
| email          | STRING |                 |
| department     | STRING |                 |
| post           | STRING |                 |

---

#### **6. BookingRequest**
| Attribute        | Type   | Constraints              |
|------------------|--------|--------------------------|
| booking_id       | INT    | PK                       |
| venue_id         | INT    | FK → Venue               |
| student_body_id  | INT    | FK → StudentBody         |
| booking_date     | DATE   |                          |
| start_time       | TIME   |                          |
| end_time         | TIME   |                          |
| purpose          | STRING |                          |
| status           | STRING |                          |

---

#### **7. ApprovalProcess**
| Attribute        | Type     | Constraints               |
|-----------------|----------|---------------------------|
| approval_id     | INT      | PK                        |
| booking_id      | INT      | FK → BookingRequest       |
| FA_approval     | BOOLEAN  |                           |
| SC_approval     | BOOLEAN  |                           |
| SWO_approval    | BOOLEAN  |                           |
| Sec_approval    | BOOLEAN  |                           |
| approver_id     | INT      | FK → Faculty              |
| approval_status | STRING   |                           |

---

#### **8. BookingHistory**
| Attribute      | Type   | Constraints              |
|---------------|--------|--------------------------|
| history_id    | INT    | PK (added for uniqueness)|
| booking_id    | INT    | FK → BookingRequest      |
| booking_date  | DATE   |                          |
| action_taken  | STRING |                          |

---

### Special Role Relationships (SWO, Security Chief, SC)

To track **who is SC, SWO, Security**, use **role specialization** tables or enums:

#### **9. RoleAssignments**
| Attribute     | Type   | Constraints         |
|--------------|--------|---------------------|
| faculty_id   | INT    | FK → Faculty        |
| role         | ENUM   | PK (faculty_id, role) – e.g., 'SWO', 'Security' |

#### **10. SC_Assignment**
| Attribute     | Type   | Constraints         |
|--------------|--------|---------------------|
| student_id   | INT    | FK → Student        |
| is_SC        | BOOLEAN| True if SC rep      |

---

### BCNF Justification

Each relation:
- Has a clearly defined **primary key**.
- All **non-prime attributes** depend **only on** the **whole key**.
- No partial or transitive dependencies.
- All **determinants** are **candidate keys** or **superkeys**.


## Setup

1. Connect to Oracle as your user:
   ```bash
   sqlplus git/rootpw@localhost:1521/FREE
   ```
2. Run the schema:
   ```sql
   @Tables.sql
   ```
3. (Optional) Populate with sample data:
   ```sql
   @Data.sql
   ```

---

## ER Diagram

See `ERD/ERModel.md` for the full ER model and relationships.

---

## Notes

- Make sure all referenced tables exist before running foreign key constraints.
- Adjust tablespace/quotas as needed for your Oracle installation.

---

## Functionalities

1. **Search Venues**:
   - Filters: Date, Time, Type, Capacity, Location, Equipment.
   - API Endpoint: `/api/venues/search/` (GET).

2. **Show All Venues**:
   - API Endpoint: `/api/venues/` (GET).

3. **Book Venue**:
   - Inserts booking data into `BookingRequest` and triggers the approval process.
   - API Endpoint: `/api/bookings/` (POST).

4. **Community Page**:
   - Shows all confirmed bookings for all users.
   - API Endpoint: `/api/bookings/confirmed/` (GET).

5. **MyBookings Page**:
   - Shows past, pending, rejected, and confirmed bookings for the logged-in user.
   - API Endpoint: `/api/bookings/user/` (GET).

6. **Approval Process**:
   - Sequential approval by Faculty Advisor, SC, SWO, and Security.
   - API Endpoints:
     - `/api/bookings/<id>/approve/` (POST).
     - `/api/bookings/<id>/reject/` (POST).

---

Authentication Endpoints
/api/auth/login/                # POST: User login
/api/auth/logout/               # POST: User logout
/api/auth/register/             # POST: User registration
/api/auth/user/                 # GET: Current user info
/api/auth/refresh-token/        # POST: Refresh JWT token
---
Venue Endpoints
/api/venues/                    # GET: List venues with filtering
/api/venues/<id>/               # GET: Venue details
/api/venues/types/              # GET: List venue types
/api/venues/availability/       # GET: Check venue availability
/api/venues/<id>/availability/  # GET: Specific venue availability
---
Booking Endpoints
/api/bookings/                  # GET: List user's bookings, POST: Create booking
/api/bookings/<id>/             # GET: Booking details, PUT: Update, DELETE: Cancel
/api/bookings/upcoming/         # GET: Upcoming bookings
/api/bookings/pending/          # GET: Pending booking requests
/api/bookings/rejected/         # GET: Rejected bookings
/api/bookings/history/          # GET: Past bookings
/api/bookings/<id>/approve/     # POST: Approve booking step
/api/bookings/<id>/reject/      # POST: Reject booking
---
Community Endpoints
/api/student-bodies/            # GET: List student bodies
/api/student-bodies/<id>/       # GET: Student body details
/api/student-bodies/<id>/members/ # GET: Student body members
/api/community/booking-board/   # GET: Community booking board
/api/exchange-requests/         # GET: List, POST: Create exchange request
/api/exchange-requests/<id>/    # GET: Details, PUT: Update, DELETE: Cancel
/api/exchange-history/          # GET: Exchange history
---
Notification Endpoints
/api/notifications/             # GET: List notifications
/api/notifications/<id>/read/   # POST: Mark notification as read
/api/notifications/read-all/    # POST: Mark all as read
/api/notifications/<id>/        # DELETE: Delete notification
---
Chat Endpoints
/api/conversations/             # GET: List conversations
/api/conversations/<id>/        # GET: Conversation details
/api/conversations/<id>/messages/ # GET: List messages, POST: Send message
/api/conversations/create/      # POST: Create new conversation