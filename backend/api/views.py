from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status

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

