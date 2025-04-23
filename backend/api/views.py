from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

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
    # Get email and password from POST data
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=400)

    with connection.cursor() as cursor:
        # Use parameterized queries to prevent SQL injection
        cursor.execute("SELECT * FROM Users WHERE email = %s AND password = %s", [email, password])
        columns = [col[0] for col in cursor.description]
        data = [
            dict(zip(columns, row))
            for row in cursor.fetchall()
        ]

    if not data:
        return Response({'error': 'Invalid email or password'}, status=401)

    return Response({'User Details': data})

"""
Vanues 
"""
@api_view(['GET'])
def getVenues(request):
    with connection.cursor() as cursor:
        # Join Venue with Building to get building_name and floor_number, and select all required fields
        cursor.execute("""
            SELECT 
                v.venue_id, v.venue_name, v.seating_capacity, v.features, v.image_url,
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

