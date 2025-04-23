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
| Attribute         | Type   | Constraints              |
|------------------|--------|--------------------------|
| booking_id       | INT    | PK                       |
| venue_id         | INT    | FK → Venue               |
| student_body_id  | INT    | FK → StudentBody         |
| booking_date     | DATE   |                          |
| start_time       | TIME   |                          |
| end_time         | TIME   |                          |
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
