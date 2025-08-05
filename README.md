# BlockBook - College Venue Booking System

A simple web application for booking college venues and rooms.

## Features

- **User Management**
  - User registration (Student, Faculty, Club)
  - User authentication and login
  - Role-based access control

- **Venue Management**
  - Browse and search venues
  - Check venue availability
  - View venue details and features

- **Booking System**
  - Book available time slots
  - Multi-level approval workflow (FA → SC → SWO → Security)
  - View booking history and status
  - Cancel bookings

- **Approval System**
  - Faculty Advisor approval interface
  - Student Council approval interface
  - Student Welfare Officer approval interface
  - Security Chief approval interface

## Future Scope / TODOs

- Add page to view profile and edit details, also modify prof pic to at least first letter of names
- Implement real-time notifications
- Add email notifications for booking status changes
- Improve search and filtering functionality
- Add venue exchange requests
- Clean and improve database (optimize table structure)

## Tech Stack

### Frontend
- HTML, CSS, JavaScript
- Basic responsive design

### Backend
- FastAPI (Python)
- MySQL Database

## Test Users

For testing purposes, you can use these sample users with simple credentials:

### Faculty Account
- Email: teacher@manipal.edu
- Password: teacher
- Role: Faculty Advisor
- Registration ID: 100001

### Student Club Account
- Email: club@manipal.edu
- Password: club
- Club Name: Test Club
- Faculty Advisor: Teacher

### Club President Account
- Email: president@manipal.edu
- Password: president
- Registration ID: 200001
- Student Body: Test Club

### Student Account
- Email: student@manipal.edu
- Password: student
- Registration ID: 200002
- Student Body: Test Club

Note: All passwords are the same as the part before '@' in the email for simplicity.

## Setup Instructions

1. Install Python 3.8+ and MySQL

2. Install Python dependencies:
```bash
cd backend/app
pip install fastapi uvicorn mysql-connector-python python-multipart
```

3. Set up MySQL database:
```sql
-- Open MySQL command line and run:
CREATE DATABASE blockbook;
USE blockbook;

-- Run the database setup script:
source <absoulte path to Tables.sql and then Data.sql>
```

4. Update database configuration in `backend/app/main.py`:
```python
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "your_password",
    "database": "blockbook"
}
```

## Running the Application

1. Start the backend server:
```bash
cd backend/app
uvicorn main:app --reload
```

2. Start the frontend:
- Open `frontend/basicFrontend/login.html` in your web browser
- Login with test credentials:
  - Email: admin@example.com
  - Password: admin123

## API Documentation

Once the backend is running, visit:
- http://localhost:8000/docs for API documentation

### Key Endpoints

**Authentication:**
- `POST /api/authenticate/` - User login
- `POST /api/register/` - User registration

**Venues:**
- `GET /api/venues/` - Get all venues
- `GET /api/venues/availability/` - Check venue availability

**Bookings:**
- `POST /api/bookings/` - Create booking request
- `GET /api/bookings/{user_id}` - Get user's bookings

**Approvals:**
- `GET /api/approvals/pending/` - Get pending approvals for role
- `POST /api/approvals/{booking_id}/approve/` - Approve booking
- `POST /api/approvals/{booking_id}/reject/` - Reject booking