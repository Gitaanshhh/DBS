from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
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
        with connection.cursor() as cursor:
            # Join Venue with Building to get building_name and floor_number, and select all required fields
            cursor.execute("""
                SELECT 
                    v.venue_id, v.venue_name, v.seating_capacity, 
                    TO_CHAR(v.features) as features, 
                    v.image_url,
                    v.floor_number, b.building_name
                FROM Venue v
                LEFT JOIN Building b ON v.building_id = b.building_id
            """)
            columns = [col[0] for col in cursor.description]
            data = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
        return Response({'Venues': data})
    except Exception as e:
        print(f"Error in getVenues: {str(e)}", file=sys.stderr)
        return Response({'error': f'Failed to fetch venues: {str(e)}'}, status=500)

"""
Details of a particular venue
Need to implement logic to get the venue id from the request and then get the details of that venue
"""
@api_view(['GET'])
def getVenueDetails(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM Venue where venue_id = 1")  # Replace 1 with the actual venue_id you want to fetch
        columns = [col[0] for col in cursor.description]
        data = [
            dict(zip(columns, row))
            for row in cursor.fetchall()
        ]
    return Response({'Venue': data})

