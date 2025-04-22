# Database Schema & Setup

This directory contains the SQL schema and ER diagrams for the DBS project.

---

## Tables

- **Venue**: venue_id, venue_name, venue_type, booking_status, seating_capacity, manager_contact
- **IndoorVenue**: venue_id (FK), floor_number, building_id, building_name
- **Faculty**: faculty_id, registration_id, name, email, department, post
- **StudentBody**: student_body_id, name, email, faculty_advisor_id, primary_rep_id, secondary_rep_id
- **Student**: student_id, registration_id, name, contact_details, student_body_id
- **BookingRequest**: booking_id, venue_id, student_body_id, booking_date, start_time, end_time, status
- **ApprovalProcess**: approval_id, booking_id, FA_approval, SC_approval, SWO_approval, Sec_approval, approver_id, approval_status
- **BookingHistory**: history_id, booking_id, booking_date, action_taken

See `Tables.sql` for full DDL.

---

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
