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

Run backend: 
uvicorn main:app --reload

"""

# Standard library imports
from datetime import datetime, timedelta
import json
import logging
from datetime import date

# Third-party imports
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import mysql.connector
from typing import Optional, List

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

class UserRegistration(BaseModel):
    """
    User registration model.
    
    Attributes:
        email (str): User's email address
        password (str): User's password
        name (str): User's full name
        user_type (str): Type of user (faculty/student/club)
        department (str): Department (for faculty)
        registration_id (int): Registration ID
        contact_details (int): Contact number
    """
    email: str
    password: str
    name: str
    user_type: str
    department: Optional[str] = None
    registration_id: Optional[int] = None
    contact_details: Optional[int] = None

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

class BookingRequest(BaseModel):
    venue: str
    date: date
    timeSlot: str
    organizerName: str
    organizerEmail: str
    department: str
    attendees: int
    purpose: str
    setupRequirements: str
    additionalNotes: Optional[str] = None

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

@app.post("/api/register/")
async def RegisterUser(user: UserRegistration):
    """
    Registers a new user in the system.
    
    Args:
        user (UserRegistration): User registration details
        
    Returns:
        dict: Confirmation message and user ID
        
    Raises:
        HTTPException: If registration fails or user already exists
    """
    dbConnection = GetDatabaseConnection()
    cursor = dbConnection.cursor()
    try:
        # Check if user already exists
        checkQuery = "SELECT email FROM Faculty WHERE email = %s UNION SELECT email FROM StudentBody WHERE email = %s"
        cursor.execute(checkQuery, (user.email, user.email))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="User already exists")

        if user.user_type == "faculty":
            # Insert into Faculty table
            facultyQuery = """
            INSERT INTO Faculty (registration_id, name, email, department, post) 
            VALUES (%s, %s, %s, %s, 'Professor')
            """
            cursor.execute(facultyQuery, (
                user.registration_id,
                user.name,
                user.email,
                user.department
            ))
            facultyId = cursor.lastrowid
            
            # Add default FA role
            roleQuery = "INSERT INTO RoleAssignments (faculty_id, role) VALUES (%s, 'FA')"
            cursor.execute(roleQuery, (facultyId,))
            
        elif user.user_type == "club":
            # For clubs, we need a faculty advisor
            # For simplicity, we'll use the first available faculty
            advisorQuery = "SELECT faculty_id FROM Faculty LIMIT 1"
            cursor.execute(advisorQuery)
            advisorResult = cursor.fetchone()
            
            if not advisorResult:
                raise HTTPException(status_code=400, detail="No faculty advisor available")
            
            # Insert into StudentBody table
            clubQuery = """
            INSERT INTO StudentBody (name, email, faculty_advisor_id) 
            VALUES (%s, %s, %s)
            """
            cursor.execute(clubQuery, (
                user.name,
                user.email,
                advisorResult[0]
            ))
            
        elif user.user_type == "student":
            # For students, we need a student body
            # For simplicity, we'll use the first available student body
            bodyQuery = "SELECT student_body_id FROM StudentBody LIMIT 1"
            cursor.execute(bodyQuery)
            bodyResult = cursor.fetchone()
            
            if not bodyResult:
                raise HTTPException(status_code=400, detail="No student body available")
            
            # Insert into Student table
            studentQuery = """
            INSERT INTO Student (registration_id, name, contact_details, student_body_id) 
            VALUES (%s, %s, %s, %s)
            """
            cursor.execute(studentQuery, (
                user.registration_id,
                user.name,
                user.contact_details,
                bodyResult[0]
            ))
        
        dbConnection.commit()
        return {"message": "User registered successfully"}
        
    except Exception as e:
        dbConnection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        dbConnection.close()

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
        venueQuery = "SELECT * FROM Venue"
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

@app.get("/api/venues/availability/")
async def CheckVenueAvailability(venue_id: int, date: str, start_time: str, end_time: str):
    """
    Checks if a venue is available for a specific time slot.
    
    Args:
        venue_id (int): ID of the venue to check
        date (str): Date in YYYY-MM-DD format
        start_time (str): Start time in HH:MM format
        end_time (str): End time in HH:MM format
        
    Returns:
        dict: Availability status and conflicting bookings
        
    Raises:
        HTTPException: If database query fails
    """
    dbConnection = GetDatabaseConnection()
    cursor = dbConnection.cursor(dictionary=True)
    try:
        # Check for conflicting bookings
        conflictQuery = """
        SELECT br.*, v.venue_name 
        FROM BookingRequest br
        JOIN Venue v ON br.venue_id = v.venue_id
        WHERE br.venue_id = %s 
        AND br.booking_date = %s
        AND (
            (br.start_time < %s AND br.end_time > %s) OR
            (br.start_time < %s AND br.end_time > %s) OR
            (br.start_time >= %s AND br.end_time <= %s)
        )
        AND br.status != 'rejected'
        """
        
        cursor.execute(conflictQuery, (
            venue_id, date, end_time, start_time, end_time, start_time, start_time, end_time
        ))
        
        conflicts = cursor.fetchall()
        isAvailable = len(conflicts) == 0
        
        return {
            "venue_id": venue_id,
            "date": date,
            "start_time": start_time,
            "end_time": end_time,
            "is_available": isAvailable,
            "conflicting_bookings": conflicts
        }
        
    except Exception as e:
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
        INSERT INTO BookingRequest (venue_id, student_body_id, booking_date, start_time, end_time, purpose, status) 
        VALUES (%s, %s, %s, %s, %s, %s, 'pending')
        """
        logger.info("Creating new booking request")
        
        # Extract date from start_time
        booking_date = booking.start_time.split('T')[0] if 'T' in str(booking.start_time) else str(booking.start_time).split(' ')[0]
        start_time = booking.start_time.split('T')[1] if 'T' in str(booking.start_time) else str(booking.start_time).split(' ')[1]
        end_time = booking.end_time.split('T')[1] if 'T' in str(booking.end_time) else str(booking.end_time).split(' ')[1]
        
        cursor.execute(insert_sql, (
            booking.venue_id,
            booking.user_id,
            booking_date,
            start_time,
            end_time,
            booking.purpose
        ))
        
        request_id = cursor.lastrowid
        
        # Initialize approval process
        approval_sql = """
        INSERT INTO ApprovalProcess (booking_id, approver_id, approval_status) 
        VALUES (%s, %s, 'pending')
        """
        logger.info("Initializing approval process")
        cursor.execute(approval_sql, (request_id, 1))  # Default approver_id to 1
        
        dbConnection.commit()
        logger.info("Booking request created successfully")
        return {"message": "Booking request created successfully", "request_id": request_id}
    except Exception as e:
        dbConnection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        dbConnection.close()

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

@app.get("/api/approvals/pending/")
async def GetPendingApprovals(role: str):
    """
    Gets pending approval requests for a specific role.
    
    Args:
        role (str): Role of the approver (FA, SC, SWO, Security)
        
    Returns:
        dict: List of pending approval requests
        
    Raises:
        HTTPException: If database query fails
    """
    dbConnection = GetDatabaseConnection()
    cursor = dbConnection.cursor(dictionary=True)
    try:
        if role == "FA":
            # Get bookings pending faculty advisor approval
            query = """
            SELECT br.*, v.venue_name, sb.name as student_body_name, f.name as faculty_name
            FROM BookingRequest br
            JOIN Venue v ON br.venue_id = v.venue_id
            JOIN StudentBody sb ON br.student_body_id = sb.student_body_id
            JOIN Faculty f ON sb.faculty_advisor_id = f.faculty_id
            WHERE br.status = 'pending'
            AND NOT EXISTS (
                SELECT 1 FROM ApprovalProcess ap 
                WHERE ap.booking_id = br.booking_id
            )
            """
        elif role == "SC":
            # Get bookings pending student council approval
            query = """
            SELECT br.*, v.venue_name, sb.name as student_body_name
            FROM BookingRequest br
            JOIN Venue v ON br.venue_id = v.venue_id
            JOIN StudentBody sb ON br.student_body_id = sb.student_body_id
            WHERE br.status = 'pending'
            AND EXISTS (
                SELECT 1 FROM ApprovalProcess ap 
                WHERE ap.booking_id = br.booking_id
                AND ap.approval_status = 'FA_approved'
            )
            """
        else:
            # For SWO and Security, get bookings that have passed previous stages
            query = """
            SELECT br.*, v.venue_name, sb.name as student_body_name
            FROM BookingRequest br
            JOIN Venue v ON br.venue_id = v.venue_id
            JOIN StudentBody sb ON br.student_body_id = sb.student_body_id
            WHERE br.status = 'pending'
            AND EXISTS (
                SELECT 1 FROM ApprovalProcess ap 
                WHERE ap.booking_id = br.booking_id
                AND ap.approval_status = 'SC_approved'
            )
            """
        
        cursor.execute(query)
        pendingRequests = cursor.fetchall()
        
        return {"pending_requests": pendingRequests}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        dbConnection.close()

@app.post("/api/approvals/{booking_id}/approve/")
async def ApproveBooking(booking_id: int, role: str, approver_id: int):
    """
    Approves a booking request at a specific stage.
    
    Args:
        booking_id (int): ID of the booking to approve
        role (str): Role of the approver
        approver_id (int): ID of the approver
        
    Returns:
        dict: Confirmation message
        
    Raises:
        HTTPException: If approval fails
    """
    dbConnection = GetDatabaseConnection()
    cursor = dbConnection.cursor()
    try:
        # Check if approval process exists
        checkQuery = "SELECT * FROM ApprovalProcess WHERE booking_id = %s"
        cursor.execute(checkQuery, (booking_id,))
        approvalProcess = cursor.fetchone()
        
        if not approvalProcess:
            # Create new approval process
            insertQuery = """
            INSERT INTO ApprovalProcess (booking_id, approver_id, approval_status) 
            VALUES (%s, %s, 'FA_approved')
            """
            cursor.execute(insertQuery, (booking_id, approver_id))
        else:
            # Update existing approval process
            if role == "SC":
                updateQuery = "UPDATE ApprovalProcess SET approval_status = 'SC_approved' WHERE booking_id = %s"
            elif role == "SWO":
                updateQuery = "UPDATE ApprovalProcess SET approval_status = 'SWO_approved' WHERE booking_id = %s"
            elif role == "Security":
                updateQuery = "UPDATE ApprovalProcess SET approval_status = 'approved' WHERE booking_id = %s"
                # Also update booking status to approved
                bookingUpdateQuery = "UPDATE BookingRequest SET status = 'approved' WHERE booking_id = %s"
                cursor.execute(bookingUpdateQuery, (booking_id,))
            else:
                raise HTTPException(status_code=400, detail="Invalid role")
            
            cursor.execute(updateQuery, (booking_id,))
        
        dbConnection.commit()
        return {"message": f"Booking {booking_id} approved by {role}"}
        
    except Exception as e:
        dbConnection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        dbConnection.close()

@app.post("/api/approvals/{booking_id}/reject/")
async def RejectBooking(booking_id: int, role: str, approver_id: int, reason: str = ""):
    """
    Rejects a booking request.
    
    Args:
        booking_id (int): ID of the booking to reject
        role (str): Role of the rejector
        approver_id (int): ID of the rejector
        reason (str): Reason for rejection
        
    Returns:
        dict: Confirmation message
        
    Raises:
        HTTPException: If rejection fails
    """
    dbConnection = GetDatabaseConnection()
    cursor = dbConnection.cursor()
    try:
        # Update booking status to rejected
        updateQuery = "UPDATE BookingRequest SET status = 'rejected' WHERE booking_id = %s"
        cursor.execute(updateQuery, (booking_id,))
        
        # Add to approval process
        approvalQuery = """
        INSERT INTO ApprovalProcess (booking_id, approver_id, approval_status) 
        VALUES (%s, %s, 'rejected')
        """
        cursor.execute(approvalQuery, (booking_id, approver_id))
        
        dbConnection.commit()
        return {"message": f"Booking {booking_id} rejected by {role}"}
        
    except Exception as e:
        dbConnection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        dbConnection.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)