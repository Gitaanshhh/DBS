# BlockBook Backend API Documentation

This document provides detailed information about the BlockBook backend API endpoints and their usage.

## API Overview

The BlockBook API is built using Django REST Framework and provides endpoints for:
- User authentication and authorization
- Venue management
- Booking requests and approvals
- User management
- System notifications

## Base URL

```
http://localhost:8000/api/
```

## Authentication

All endpoints except `/authenticate/` require authentication using JWT tokens.

### Login
```http
POST /authenticate/
Content-Type: application/json

{
    "email": "user@manipal.edu",
    "password": "password123"
}
```

Response:
```json
{
    "User Details": [{
        "user_id": 1,
        "email": "user@manipal.edu",
        "user_type": "student",
        "role": "student"
    }]
}
```

## Endpoints

### Venues

#### Get All Venues
```http
GET /venues/
Authorization: Bearer <token>
```

Response:
```json
{
    "Venues": [{
        "venue_id": 1,
        "venue_name": "Main Hall A101",
        "seating_capacity": 200,
        "features": "Projector, Audio System, Air Conditioning",
        "image_url": "/assets/venues/lecture-hall-a101.jpg",
        "floor_number": 1,
        "building_name": "Alpha Building"
    }]
}
```

#### Get Venue Details
```http
GET /venue-details/?venue_id=1
Authorization: Bearer <token>
```

### Bookings

#### Create Booking Request
```http
POST /bookings/
Authorization: Bearer <token>
Content-Type: application/json

{
    "venue_id": 1,
    "student_body_id": 1,
    "booking_date": "2024-04-25",
    "start_time": "10:00:00",
    "end_time": "13:00:00",
    "purpose": "Technical Club Meeting",
    "attendees_count": 150,
    "setup_requirements": "Projector, Microphone"
}
```

#### Get Booking Requests
```http
GET /bookings/
Authorization: Bearer <token>
```

#### Approve/Reject Booking
```http
POST /bookings/{booking_id}/approve/
Authorization: Bearer <token>
Content-Type: application/json

{
    "is_approved": true,
    "comments": "Approved by faculty advisor"
}
```

### Users

#### Get User Profile
```http
GET /users/profile/
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /users/profile/
Authorization: Bearer <token>
Content-Type: application/json

{
    "full_name": "John Doe",
    "contact_number": "9876543210"
}
```

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include a message:
```json
{
    "error": "Invalid email or password"
}
```

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Development

### Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure database settings in `settings.py`

3. Run migrations:
```bash
python manage.py migrate
```

4. Start development server:
```bash
python manage.py runserver
```

### Testing

Run tests:
```bash
python manage.py test api
```

### Adding New Endpoints

1. Create view in `views.py`
2. Add URL pattern in `urls.py`
3. Add tests in `tests.py`
4. Update documentation

## Security

- All endpoints use HTTPS in production
- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- CORS is configured to allow specific origins
- SQL injection prevention using parameterized queries
- XSS protection enabled

## Deployment

1. Set environment variables:
```bash
export DJANGO_SETTINGS_MODULE=DBS.settings.production
export SECRET_KEY=your-secret-key
export DATABASE_URL=your-database-url
```

2. Collect static files:
```bash
python manage.py collectstatic
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start production server:
```bash
gunicorn DBS.wsgi:application
```
