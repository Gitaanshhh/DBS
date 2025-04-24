from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status

import sys

@api_view(['GET'])
def test_api(request):
    return Response({'message': 'Hello from Django API!'})

"""
Example Query to get data from a table 
1. Add your own query here to get data from the table you want in the below format
2. Add path('new-table/', views.get_new_table), to the urls.py file in the api folder
3. use .fetch("http://localhost:8000/api/new-table/") to fetch the data from the table in the frontend js script
// Example: Fetch data from Django backend when button is clicked
      document
        .getElementById("fetch-backend-btn")
        .addEventListener("click", function () {
          fetch("http://localhost:8000/api/new-table/")
            .then((response) => response.json())
            .then((data) => {
              // Display the raw JSON in backend-message
              document.getElementById("backend-message").textContent =
                JSON.stringify(data);

              // Display only the student names if data exists
              const tableDiv = document.getElementById("new-table-data");
              tableDiv.innerHTML = "";
              if (data.data && data.data.length > 0) {
                let html = "<ul>";
                data.data.forEach((row) => {
                  html += `<li>${row.name}</li>`;
                });
                html += "</ul>";
                tableDiv.innerHTML = html;
              } else {
                tableDiv.textContent = "No student names found.";
              }
            })
            .catch((error) => {
              document.getElementById("backend-message").textContent =
                "Error fetching data from backend.";
            });
        });
"""
@api_view(['GET'])
def get_new_table(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT name FROM student")
        columns = [col[0] for col in cursor.description]
        data = [
            dict(zip(columns, row))
            for row in cursor.fetchall()
        ]
    return Response({'data': data})

"""
User login details

Can add verification of user login details here
"""
@api_view(['POST'])
@csrf_exempt
def getUsers(request):
    print("LOGIN API CALLED", file=sys.stderr)
    # Get email and password from POST data
    email = request.data.get('email')
    password = request.data.get('password')
    print("LOGIN DEBUG: email =", email, "password =", password, file=sys.stderr)

    if not email or not password:
        print("LOGIN ERROR: Missing email or password", file=sys.stderr)
        return Response({'error': 'Email and password are required'}, status=400)

    try:
        with connection.cursor() as cursor:
            # First check if user exists in Users table
            sql = "SELECT * FROM USERS WHERE email = %s AND password_hash = %s"
            params = [email, password]
            cursor.execute(sql, params)
            columns = [col[0] for col in cursor.description]
            user_data = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
            print("LOGIN RESULT (USERS):", user_data, file=sys.stderr)

            if not user_data:
                return Response({'error': 'Invalid email or password'}, status=401)

            user = user_data[0]
            
            # Check if user is a faculty member
            if user.get('USER_TYPE') == 'faculty':
                # Get additional faculty details
                cursor.execute("""
                    SELECT f.*, fr.role_name 
                    FROM Faculty f 
                    LEFT JOIN FacultyRoles fr ON f.faculty_id = fr.faculty_id 
                    WHERE f.user_id = %s
                """, [user['USER_ID']])
                faculty_columns = [col[0] for col in cursor.description]
                faculty_data = [
                    dict(zip(faculty_columns, row))
                    for row in cursor.fetchall()
                ]
                if faculty_data:
                    user['faculty_details'] = faculty_data[0]
                    # Set role based on faculty role if available
                    if faculty_data[0].get('ROLE_NAME'):
                        user['role'] = faculty_data[0]['ROLE_NAME'].lower()
                    else:
                        user['role'] = 'faculty'

            # Ensure user_type is properly set and not empty
            if not user.get('USER_TYPE'):
                # Check if user exists in Faculty table
                cursor.execute("SELECT 1 FROM Faculty WHERE user_id = %s", [user['USER_ID']])
                if cursor.fetchone():
                    user['USER_TYPE'] = 'faculty'
                    user['role'] = 'faculty'
                else:
                    user['USER_TYPE'] = 'student'
                    user['role'] = 'student'
            
            # Set role for backward compatibility if not already set
            if 'role' not in user:
                user['role'] = user['USER_TYPE']
            
            # Convert response to lowercase keys for frontend compatibility
            response_user = {
                'user_id': user['USER_ID'],
                'email': user['EMAIL'],
                'user_type': user['USER_TYPE'],
                'role': user['role']
            }
            if 'faculty_details' in user:
                response_user['faculty_details'] = user['faculty_details']
            
            print("LOGIN SUCCESS: User authenticated", file=sys.stderr)
            return Response({'User Details': [response_user]})

    except Exception as e:
        print("LOGIN EXCEPTION:", str(e), file=sys.stderr)
        return Response({'error': f'Internal server error: {str(e)}'}, status=500)

"""
Vanues 
"""
@api_view(['GET'])
def getVenues(request):
    try:
        # Get filter parameters from request
        date = request.GET.get('date')
        time = request.GET.get('time')
        capacity = request.GET.get('capacity')
        building = request.GET.get('building')
        venue_type = request.GET.get('venue_type')
        features = request.GET.get('features')
        available_only = request.GET.get('available_only', 'false').lower() == 'true'

        # Base query
        query = """
            SELECT v.venue_id, v.venue_name, v.seating_capacity, 
                   TO_CHAR(v.features) as features, 
                   v.image_url, v.floor_number, 
                   b.building_name, vt.type_name as venue_type
            FROM Venue v
            JOIN Building b ON v.building_id = b.building_id
            JOIN VenueType vt ON v.venue_type_id = vt.type_id
            WHERE 1=1
        """

        # Add filters
        params = []
        if building:
            query += " AND b.building_name = :building"
            params.append(building)
        if venue_type:
            query += " AND vt.type_name = :venue_type"
            params.append(venue_type)
        if capacity:
            if capacity == 'small':
                query += " AND v.seating_capacity <= 50"
            elif capacity == 'medium':
                query += " AND v.seating_capacity > 50 AND v.seating_capacity <= 150"
            elif capacity == 'large':
                query += " AND v.seating_capacity > 150 AND v.seating_capacity <= 300"
            elif capacity == 'xlarge':
                query += " AND v.seating_capacity > 300"
        if features:
            query += " AND v.features LIKE :features"
            params.append(f'%{features}%')

        # Add availability check if needed
        if available_only and date and time:
            query += """
                AND NOT EXISTS (
                    SELECT 1 FROM BookingRequest br
                    WHERE br.venue_id = v.venue_id
                    AND br.booking_date = TO_DATE(:date, 'YYYY-MM-DD')
                    AND br.start_time <= TO_TIMESTAMP(:time, 'HH24:MI:SS')
                    AND br.end_time > TO_TIMESTAMP(:time, 'HH24:MI:SS')
                    AND br.status = 'Approved'
                )
            """
            params.extend([date, time])

        # Execute query
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            columns = [col[0] for col in cursor.description]
            venues = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return JsonResponse({'Venues': venues})
    except Exception as e:
        print(f"Error in getVenues: {str(e)}")  # Add logging
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def getFilterOptions(request):
    try:
        with connection.cursor() as cursor:
            # Get unique building names
            cursor.execute("SELECT DISTINCT building_name FROM Building ORDER BY building_name")
            buildings = [row[0] for row in cursor.fetchall()]

            # Get unique venue types
            cursor.execute("SELECT DISTINCT type_name FROM VenueType ORDER BY type_name")
            venue_types = [row[0] for row in cursor.fetchall()]

            # Get unique features - using a simpler approach for Oracle
            cursor.execute("""
                SELECT DISTINCT TRIM(REGEXP_SUBSTR(features, '[^,]+', 1, LEVEL)) as feature
                FROM Venue
                WHERE features IS NOT NULL
                CONNECT BY LEVEL <= LENGTH(REGEXP_REPLACE(features, '[^,]+', '')) + 1
                ORDER BY feature
            """)
            features = [row[0] for row in cursor.fetchall() if row[0]]  # Filter out None values

        return JsonResponse({
            'buildings': buildings,
            'venue_types': venue_types,
            'features': features
        })
    except Exception as e:
        print(f"Error in getFilterOptions: {str(e)}")  # Add logging
        return JsonResponse({'error': str(e)}, status=500)

"""
Details of a particular venue
"""
@api_view(['GET'])
def getVenueDetails(request):
    venue_id = request.GET.get('venue_id')
    if not venue_id:
        return Response({'error': 'Venue ID is required'}, status=400)
        
    try:
        with connection.cursor() as cursor:
            # Join with Building and VenueType to get all relevant information
            cursor.execute("""
                SELECT 
                    v.venue_id, 
                    v.venue_name, 
                    v.seating_capacity,
                    TO_CHAR(v.features) as features,
                    v.image_url,
                    v.floor_number,
                    v.is_indoor,
                    v.manager_contact,
                    TO_CHAR(v.description) as description,
                    b.building_name,
                    b.location as building_location,
                    vt.type_name as venue_type,
                    TO_CHAR(vt.description) as type_description
                FROM Venue v
                LEFT JOIN Building b ON v.building_id = b.building_id
                LEFT JOIN VenueType vt ON v.venue_type_id = vt.type_id
                WHERE v.venue_id = %s
            """, [venue_id])
            
            columns = [col[0] for col in cursor.description]
            venue_data = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            if not venue_data:
                return Response({'error': 'Venue not found'}, status=404)
                
            venue = venue_data[0]
            
            # Get venue availability
            cursor.execute("""
                SELECT 
                    availability_id,
                    day_of_week,
                    TO_CHAR(start_time, 'HH24:MI') as start_time,
                    TO_CHAR(end_time, 'HH24:MI') as end_time,
                    is_available
                FROM VenueAvailability
                WHERE venue_id = %s
                ORDER BY 
                    CASE day_of_week 
                        WHEN 'Monday' THEN 1
                        WHEN 'Tuesday' THEN 2
                        WHEN 'Wednesday' THEN 3
                        WHEN 'Thursday' THEN 4
                        WHEN 'Friday' THEN 5
                        WHEN 'Saturday' THEN 6
                        WHEN 'Sunday' THEN 7
                    END,
                    start_time
            """, [venue_id])
            
            columns = [col[0] for col in cursor.description]
            availability_data = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            # Add availability to venue data
            venue['availability'] = availability_data
            
            return Response({'venue': venue})
            
    except Exception as e:
        print(f"Error in getVenueDetails: {str(e)}", file=sys.stderr)
        return Response({'error': f'Failed to fetch venue details: {str(e)}'}, status=500)

@api_view(['POST'])
@csrf_exempt
def createBooking(request):
    """
    Create a new booking request from frontend form.
    """
    try:
        data = request.data
        # Required fields from frontend
        venue_id = data.get('venue_id')
        booking_date = data.get('booking_date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        organizer_name = data.get('organizer_name')
        organizer_email = data.get('organizer_email')
        department = data.get('department')
        attendees = data.get('attendees')
        purpose = data.get('purpose')
        setup_requirements = data.get('setup_requirements')
        additional_notes = data.get('additional_notes')

        # Validate required fields
        if not (venue_id and booking_date and start_time and end_time and organizer_name and organizer_email and purpose):
            return Response({'error': 'Missing required fields.'}, status=400)

        with connection.cursor() as cursor:
            # Find or create the user (requester) by email
            cursor.execute("SELECT user_id FROM Users WHERE email = %s", [organizer_email])
            user_row = cursor.fetchone()
            if user_row:
                requester_id = user_row[0]
            else:
                # Insert new user as student by default (no RETURNING INTO)
                cursor.execute(
                    "INSERT INTO Users (user_id, email, password_hash, user_type) VALUES (users_seq.NEXTVAL, %s, %s, %s)",
                    [organizer_email, 'default', 'student']
                )
                cursor.execute("SELECT MAX(user_id) FROM Users")
                requester_id = cursor.fetchone()[0]

            # Find a student_body_id for the user (for demo, use 1 if not found)
            cursor.execute("SELECT student_body_id FROM StudentBodyMembership WHERE student_id = (SELECT student_id FROM Student WHERE user_id = %s)", [requester_id])
            sb_row = cursor.fetchone()
            student_body_id = sb_row[0] if sb_row else 1

            # Insert booking request
            cursor.execute(
                """
                INSERT INTO BookingRequest (
                    booking_id, venue_id, student_body_id, requester_id, booking_date, start_time, end_time,
                    purpose, attendees_count, setup_requirements, status, created_at
                ) VALUES (
                    bookingrequest_seq.NEXTVAL, %s, %s, %s, TO_DATE(%s, 'YYYY-MM-DD'), TO_TIMESTAMP(%s, 'HH24:MI:SS'), TO_TIMESTAMP(%s, 'HH24:MI:SS'),
                    %s, %s, %s, %s, CURRENT_TIMESTAMP
                )
                """,
                [
                    venue_id, student_body_id, requester_id, booking_date, start_time, end_time,
                    purpose, attendees, setup_requirements, 'Pending'
                ]
            )

        return Response({'message': 'Booking request submitted successfully.'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("BOOKING SUBMIT ERROR:", str(e))
        return Response({'error': f'Failed to submit booking: {str(e)}'}, status=500)

@api_view(['GET'])
def getMyBookings(request):
    """
    Get all bookings made by a user (requester_id).
    Expects ?user_id=... as a query param.
    """
    user_id = request.GET.get('user_id')
    user_email = request.GET.get('email')
    print("MY BOOKINGS DEBUG: user_id =", user_id, "email =", user_email)
    
    if not user_id and not user_email:
        return JsonResponse({'error': 'user_id or email is required'}, status=400)
    
    try:
        with connection.cursor() as cursor:
            if user_id:
                cursor.execute("""
                    SELECT 
                        br.booking_id,
                        br.venue_id,
                        v.venue_name,
                        v.image_url,
                        v.seating_capacity,
                        b.building_name,
                        v.floor_number,
                        br.booking_date,
                        TO_CHAR(br.start_time, 'HH24:MI') as start_time,
                        TO_CHAR(br.end_time, 'HH24:MI') as end_time,
                        br.purpose,
                        br.attendees_count,
                        br.setup_requirements,
                        br.status,
                        br.created_at
                    FROM BookingRequest br
                    JOIN Venue v ON br.venue_id = v.venue_id
                    LEFT JOIN Building b ON v.building_id = b.building_id
                    WHERE br.requester_id = %s
                    ORDER BY br.created_at DESC
                """, [user_id])
            else:
                # fallback: get user_id by email
                cursor.execute("SELECT user_id FROM Users WHERE email = %s", [user_email])
                row = cursor.fetchone()
                if not row:
                    return JsonResponse({'bookings': []})
                user_id = row[0]
                cursor.execute("""
                    SELECT 
                        br.booking_id,
                        br.venue_id,
                        v.venue_name,
                        v.image_url,
                        v.seating_capacity,
                        b.building_name,
                        v.floor_number,
                        br.booking_date,
                        TO_CHAR(br.start_time, 'HH24:MI') as start_time,
                        TO_CHAR(br.end_time, 'HH24:MI') as end_time,
                        br.purpose,
                        br.attendees_count,
                        br.setup_requirements,
                        br.status,
                        br.created_at
                    FROM BookingRequest br
                    JOIN Venue v ON br.venue_id = v.venue_id
                    LEFT JOIN Building b ON v.building_id = b.building_id
                    WHERE br.requester_id = %s
                    ORDER BY br.created_at DESC
                """, [user_id])
            
            columns = [col[0] for col in cursor.description]
            bookings = []
            for row in cursor.fetchall():
                booking = dict(zip(columns, row))
                # Convert any LOB/CLOB fields to string
                for k, v in booking.items():
                    # Oracle CLOBs are returned as cx_Oracle.LOB or oracledb.LOB objects
                    if hasattr(v, 'read'):
                        booking[k] = v.read()
                bookings.append(booking)
            print("MY BOOKINGS DEBUG: bookings found =", len(bookings))
            
            return JsonResponse({'bookings': bookings})
            
    except Exception as e:
        print("MY BOOKINGS ERROR:", str(e))
        return JsonResponse({'error': f'Failed to fetch bookings: {str(e)}'}, status=500)

@api_view(['DELETE'])
@csrf_exempt
def deleteBooking(request, booking_id):
    """
    Delete a booking from BookingRequest.
    The trigger will log this action in BookingHistory.
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM BookingRequest WHERE booking_id = %s", [booking_id])
        return Response({'message': 'Booking deleted successfully.'})
    except Exception as e:
        return Response({'error': f'Failed to delete booking: {str(e)}'}, status=500)

@api_view(['GET'])
def getBookingLogs(request):
    """
    Fetch booking logs from BookingHistory for the Community page.
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    bh.history_id,
                    bh.booking_id,
                    bh.action_taken,
                    bh.action_by,
                    TO_CHAR(bh.action_date, 'YYYY-MM-DD HH24:MI:SS') as action_date,
                    u.email as user_email
                FROM BookingHistory bh
                LEFT JOIN Users u ON bh.action_by = u.user_id
                ORDER BY bh.action_date DESC
            """)
            columns = [col[0] for col in cursor.description]
            logs = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response({'logs': logs})
    except Exception as e:
        return Response({'error': f'Failed to fetch booking logs: {str(e)}'}, status=500)

@api_view(['GET'])
def getPendingApprovals(request):
    """
    Fetch all bookings that require approval for the current user (faculty, swo, security, student-council).
    Query param: user_id (required), role (required)
    """
    user_id = request.GET.get('user_id')
    role = request.GET.get('role', '').lower()
    if not user_id or not role:
        return Response({'error': 'user_id and role are required'}, status=400)
    try:
        with connection.cursor() as cursor:
            # Determine which step(s) this role can approve
            step_map = {
                'faculty': 'Faculty Advisor',
                'swo': 'Student Welfare Officer',
                'security': 'Security',
                'student-council': 'Student Council'
            }
            step_name = step_map.get(role)
            if not step_name:
                return Response({'approvals': []})

            cursor.execute("""
                SELECT
                    ba.approval_id,
                    ba.booking_id,
                    ba.step_id,
                    ba.is_approved,
                    ba.comments,
                    ba.approval_date,
                    br.purpose,
                    br.booking_date,
                    br.start_time,
                    br.end_time,
                    br.status as booking_status,
                    v.venue_name,
                    v.image_url,
                    v.seating_capacity,
                    b.building_name,
                    v.floor_number,
                    u.email as requester_email
                FROM BookingApproval ba
                JOIN ApprovalStep astep ON ba.step_id = astep.step_id
                JOIN BookingRequest br ON ba.booking_id = br.booking_id
                JOIN Venue v ON br.venue_id = v.venue_id
                LEFT JOIN Building b ON v.building_id = b.building_id
                LEFT JOIN Users u ON br.requester_id = u.user_id
                WHERE astep.step_name = %s
                  AND (ba.is_approved IS NULL OR ba.is_approved = 'N')
                  AND br.status = 'Pending'
                ORDER BY br.created_at DESC
            """, [step_name])
            columns = [col[0] for col in cursor.description]
            approvals = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response({'approvals': approvals})
    except Exception as e:
        return Response({'error': f'Failed to fetch approvals: {str(e)}'}, status=500)

@api_view(['POST'])
@csrf_exempt
def approveBooking(request):
    """
    Approve or reject a booking step.
    Expects: approval_id, approve (Y/N), comments, approver_id
    """
    data = request.data
    approval_id = data.get('approval_id')
    approve = data.get('approve')  # 'Y' or 'N'
    comments = data.get('comments', '')
    approver_id = data.get('approver_id')
    if not approval_id or approve not in ['Y', 'N'] or not approver_id:
        return Response({'error': 'Missing required fields.'}, status=400)
    try:
        with connection.cursor() as cursor:
            # Update BookingApproval
            cursor.execute("""
                UPDATE BookingApproval
                SET is_approved = %s, comments = %s, approval_date = CURRENT_TIMESTAMP, approver_id = %s
                WHERE approval_id = %s
            """, [approve, comments, approver_id, approval_id])

            # Get booking_id and step_id
            cursor.execute("SELECT booking_id, step_id FROM BookingApproval WHERE approval_id = %s", [approval_id])
            row = cursor.fetchone()
            if not row:
                return Response({'error': 'Approval not found.'}, status=404)
            booking_id, step_id = row

            # If rejected, update BookingRequest status to 'Rejected'
            if approve == 'N':
                cursor.execute("UPDATE BookingRequest SET status = 'Rejected' WHERE booking_id = %s", [booking_id])
            else:
                # If this is the last step, mark booking as Approved
                cursor.execute("""
                    SELECT MAX(order_number) FROM ApprovalStep
                """)
                max_order = cursor.fetchone()[0]
                cursor.execute("""
                    SELECT order_number FROM ApprovalStep WHERE step_id = %s
                """, [step_id])
                this_order = cursor.fetchone()[0]
                if this_order == max_order:
                    cursor.execute("UPDATE BookingRequest SET status = 'Approved' WHERE booking_id = %s", [booking_id])
                else:
                    # Otherwise, set next step's BookingApproval to pending (is_approved=NULL)
                    cursor.execute("""
                        SELECT step_id FROM ApprovalStep WHERE order_number = %s
                    """, [this_order + 1])
                    next_step = cursor.fetchone()
                    if next_step:
                        next_step_id = next_step[0]
                        cursor.execute("""
                            UPDATE BookingApproval
                            SET is_approved = NULL, comments = NULL, approval_date = NULL
                            WHERE booking_id = %s AND step_id = %s
                        """, [booking_id, next_step_id])
        return Response({'message': 'Approval updated successfully.'})
    except Exception as e:
        return Response({'error': f'Failed to update approval: {str(e)}'}, status=500)

