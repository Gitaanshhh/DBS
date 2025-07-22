# BlockBook - College Venue Booking System

A simple web application for booking college venues and rooms.

## Features

- Browse and search venues
- Book available time slots
- View booking history
- Basic user authentication

## Future Scope / TODOs

- Add the option to register -> make sure
- Add page to view profile and edit details, also modify prof pic to at least first letter of names
- the key features
- understand and fix login for president etc
- clean and improve database (too many tables)

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