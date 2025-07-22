"""
Functions -> Pascal case -> Eg - ThisIsAFunction
Variables -> Camel case -> Eg - thisIsAVariable
Classes - Pascal
Objects - Camel case

My ref : 
net start MySQL80
source C:/Users/gitaa/OneDrive/Desktop/Coding/DBS/Database/Tables.sql;
source C:/Users/gitaa/OneDrive\Desktop/Coding/DBS/Database/Data.sql;
"""

"""
Imports
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional, List
import mysql.connector
from pydantic import BaseModel
from datetime import datetime, timedelta
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

"""
CORS is a security mechanism in browsers that controls whether web pages 
from one domain can make requests to your server (API) on another domain.
allow_origins=["https://yourfrontend.com"]
"""
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

"""
Pooling 
- refers to creating a "pool" of reusable database connections — 
instead of opening a new connection every time your app needs to talk to the database.
- Opening/closing DB connections is slow and expensive.


from mysql.connector import pooling

add in DB_CONFIG
"pool_name": "mypool",
"pool_size": 5,

This creates a pool of 5 pre-initialized MySQL connections.

then create connection pool
try:
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(**DB_CONFIG)
except Exception as e:
    print(f"Error creating pool: {e}")
    raise

Also 
use conn = connection_pool.get_connection()
instead of conn = mysql.connector.connect(**DB_CONFIG)

"""


DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "Gitaansh1234",  # Add your database password here
    "database": "blockbook",
    "raise_on_warnings": True
}

def get_db():
    try:
        logger.info("Attempting database connection...")
        conn = mysql.connector.connect(**DB_CONFIG)
        logger.info("Database connection successful")
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

# Models
class User(BaseModel):
    email: str
    password: str

class Booking(BaseModel):
    venue_id: int
    user_id: int
    start_time: datetime
    end_time: datetime
    purpose: str

# Authentication endpoint
@app.post("/api/authenticate/")
async def authenticate(user: User):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        # First check Faculty table
        faculty_sql = "SELECT faculty_id, name, email, department, post FROM Faculty WHERE email = %s"
        cursor.execute(faculty_sql, (user.email,))
        faculty_data = cursor.fetchone()
        
        if faculty_data and user.password == user.email.split('@')[0]:  # Check password matches email prefix
            # Get faculty roles
            role_sql = "SELECT role FROM RoleAssignments WHERE faculty_id = %s"
            cursor.execute(role_sql, (faculty_data['faculty_id'],))
            roles = [row['role'] for row in cursor.fetchall()]
            
            return {
                "user_type": "faculty",
                "user_data": faculty_data,
                "roles": roles
            }

        # Then check StudentBody table
        club_sql = "SELECT student_body_id, name, email, faculty_advisor_id FROM StudentBody WHERE email = %s"
        cursor.execute(club_sql, (user.email,))
        club_data = cursor.fetchone()
        
        if club_data and user.password == user.email.split('@')[0]:
            return {
                "user_type": "club",
                "user_data": club_data
            }

        # Finally check Student table (through StudentBody)
        student_sql = """
            SELECT s.student_id, s.name, s.registration_id, s.contact_details, 
                   sb.name as club_name, sb.email as club_email
            FROM Student s
            JOIN StudentBody sb ON s.student_body_id = sb.student_body_id
            WHERE sb.email = %s
        """
        cursor.execute(student_sql, (user.email,))
        student_data = cursor.fetchone()
        
        if student_data and user.password == user.email.split('@')[0]:
            # Check if student is SC
            sc_sql = "SELECT is_SC FROM SC_Assignment WHERE student_id = %s"
            cursor.execute(sc_sql, (student_data['student_id'],))
            sc_data = cursor.fetchone()
            
            return {
                "user_type": "student",
                "user_data": student_data,
                "is_sc": bool(sc_data and sc_data['is_SC']) if sc_data else False
            }

        raise HTTPException(status_code=401, detail="Invalid credentials")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# Get all venues
@app.get("/api/venues/")
async def get_venues():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM venue"
        logger.info("Executing venue query")
        cursor.execute(sql)
        venues = cursor.fetchall()
        logger.info(f"Found {len(venues)} venues")
        return {"venues": venues}
    except Exception as e:
        logger.error(f"Error fetching venues: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# Create booking
@app.post("/api/bookings/")
async def create_booking(booking: Booking):
    conn = get_db()
    cursor = conn.cursor()
    try:
        # Check for booking conflicts
        check_sql = """
        SELECT * FROM BookingRequest 
        WHERE venue_id = %s 
        AND ((start_time BETWEEN %s AND %s) 
        OR (end_time BETWEEN %s AND %s))
        AND booking_id IN (
            SELECT booking_id 
            FROM ApprovalProcess 
            WHERE approval_status = 'approved'
        )
        """
        logger.info("Checking for booking conflicts")
        cursor.execute(check_sql, (
            booking.venue_id,
            booking.start_time,
            booking.end_time,
            booking.start_time,
            booking.end_time
        ))
        
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Booking conflict exists")

        # Create new booking request
        insert_sql = """
        INSERT INTO BookingRequest (venue_id, student_body_id, start_time, end_time, purpose, status) 
        VALUES (%s, %s, %s, %s, %s, 'pending')
        """
        logger.info("Creating new booking request")
        cursor.execute(insert_sql, (
            booking.venue_id,
            booking.user_id,
            booking.start_time,
            booking.end_time,
            booking.purpose
        ))
        
        request_id = cursor.lastrowid
        
        # Initialize approval process
        approval_sql = """
        INSERT INTO approvalprocess (request_id, status) 
        VALUES (%s, 'pending')
        """
        logger.info("Initializing approval process")
        cursor.execute(approval_sql, (request_id,))
        
        conn.commit()
        logger.info("Booking request created successfully")
        return {"message": "Booking request created successfully", "request_id": request_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

# Get user bookings
@app.get("/api/bookings/{user_id}")
async def get_user_bookings(user_id: int):
    logger.info(f"Fetching bookings for user_id: {user_id}")
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        sql = """
        SELECT br.*, v.venue_name, ap.approval_status
        FROM BookingRequest br
        JOIN Venue v ON br.venue_id = v.venue_id
        LEFT JOIN ApprovalProcess ap ON br.booking_id = ap.booking_id
        """
        # WHERE br.user_id = %s
        logger.info(f"Executing booking query")
        cursor.execute(sql)  # (user_id,) - commented out user filter for now
        bookings = cursor.fetchall()
        logger.info(f"Found {len(bookings) if bookings else 0} booking requests")
        return {"bookings": bookings}
    except Exception as e:
        logger.error(f"Error fetching bookings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)