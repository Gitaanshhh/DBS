"""
BlockBook - College Venue Booking System Backend

This module implements the FastAPI backend for the BlockBook system.
It handles user authentication, venue management, and booking operations.

Naming Conventions:
- Functions: PascalCase (e.g., ThisIsAFunction)
- Variables: camelCase (e.g., thisIsAVariable)
- Classes: PascalCase
- Objects: camelCase

Database Setup:
1. Start MySQL: net start MySQL80
2. Run schema: source path/to/Tables.sql
3. Load data: source path/to/Data.sql
"""

# Standard library imports
from datetime import datetime, timedelta
import json
import logging

# Third-party imports
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import mysql.connector
from typing import Optional, List

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

def GetDatabaseConnection():
    """
    Creates and returns a new database connection using the DB_CONFIG.
    
    Returns:
        mysql.connector.connection.MySQLConnection: A new database connection
    
    Raises:
        HTTPException: If connection fails
    """
    try:
        logger.info("Attempting database connection...")
        dbConnection = mysql.connector.connect(**DB_CONFIG)
        logger.info("Database connection successful")
        return dbConnection
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

# Data Models
class User(BaseModel):
    """
    User authentication model.
    
    Attributes:
        email (str): User's email address
        password (str): User's password (should be hashed in production)
    """
    email: str
    password: str

class Booking(BaseModel):
    """
    Booking request model.
    
    Attributes:
        venue_id (int): ID of the venue to be booked
        user_id (int): ID of the user making the booking
        start_time (datetime): Booking start time
        end_time (datetime): Booking end time
        purpose (str): Purpose of the booking
    """
    venue_id: int
    user_id: int
    start_time: datetime
    end_time: datetime
    purpose: str

# API Endpoints
@app.post("/api/authenticate/")
async def AuthenticateUser(user: User):
    """
    Authenticates a user by checking their credentials against Faculty, StudentBody, and Student tables.
    
    Args:
        user (User): User credentials containing email and password
    
    Returns:
        dict: User data including type (faculty/club/student), profile data, and roles
    
    Raises:
        HTTPException: If credentials are invalid or database error occurs
    """
    dbConnection = GetDatabaseConnection()
    cursor = dbConnection.cursor(dictionary=True)
    try:
        # Check Faculty credentials
        facultyQuery = "SELECT faculty_id, name, email, department, post FROM Faculty WHERE email = %s"
        cursor.execute(facultyQuery, (user.email,))
        facultyData = cursor.fetchone()
        
        if facultyData and user.password == user.email.split('@')[0]:
            # Get faculty roles
            roleQuery = "SELECT role FROM RoleAssignments WHERE faculty_id = %s"
            cursor.execute(roleQuery, (facultyData['faculty_id'],))
            roles = [row['role'] for row in cursor.fetchall()]
            
            return {
                "user_type": "faculty",
                "user_data": facultyData,
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

@app.get("/api/venues/")
async def GetAllVenues():
    """
    Retrieves all venues from the database.
    
    Returns:
        dict: List of all venues with their details
        
    Raises:
        HTTPException: If database query fails
    """
    dbConnection = GetDatabaseConnection()
    cursor = dbConnection.cursor(dictionary=True)
    try:
        venueQuery = "SELECT * FROM venue"
        logger.info("Executing venue query")
        cursor.execute(venueQuery)
        venues = cursor.fetchall()
        logger.info(f"Found {len(venues)} venues")
        return {"venues": venues}
    except Exception as e:
        logger.error(f"Error fetching venues: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        dbConnection.close()

@app.post("/api/bookings/")
async def CreateBooking(booking: Booking):
    """
    Creates a new booking request for a venue.
    
    Args:
        booking (Booking): Booking details including venue, time, and purpose
        
    Returns:
        dict: Confirmation message and request ID
        
    Raises:
        HTTPException: If booking conflicts exist or creation fails
    """
    dbConnection = GetDatabaseConnection()
    cursor = dbConnection.cursor()
    try:
        # Check for booking conflicts
        conflictQuery = """
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
        cursor.execute(conflictQuery, (
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
        
        cursor.commit()
        logger.info("Booking request created successfully")
        return {"message": "Booking request created successfully", "request_id": request_id}
    except Exception as e:
        cursor.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

@app.get("/api/bookings/{user_id}")
async def GetUserBookings(user_id: int):
    """
    Retrieves all bookings for a specific user.
    
    Args:
        user_id (int): ID of the user whose bookings to retrieve
        
    Returns:
        dict: List of user's bookings with venue and approval details
        
    Raises:
        HTTPException: If database query fails
    """
    logger.info(f"Fetching bookings for user_id: {user_id}")
    dbConnection = GetDatabaseConnection()
    cursor = dbConnection.cursor(dictionary=True)
    try:
        bookingQuery = """
        SELECT br.*, v.venue_name, ap.approval_status
        FROM BookingRequest br
        JOIN Venue v ON br.venue_id = v.venue_id
        LEFT JOIN ApprovalProcess ap ON br.booking_id = ap.booking_id
        WHERE br.student_body_id = %s
        """
        logger.info("Executing booking query")
        cursor.execute(bookingQuery, (user_id,))
        bookings = cursor.fetchall()
        logger.info(f"Found {len(bookings) if bookings else 0} booking requests")
        return {"bookings": bookings}
    except Exception as e:
        logger.error(f"Error fetching bookings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        dbConnection.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)